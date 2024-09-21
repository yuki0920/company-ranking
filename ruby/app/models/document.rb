# frozen_string_literal: true

class Document < ApplicationRecord
  # NOTE: 書類一覧APIのresultsの1要素
  # {
  #   :seqNumber=>50,
  #   :docID=>"S100L175",
  #   :edinetCode=>"E02302",
  #   :secCode=>"77180",
  #   :JCN=>"9080001002327",
  #   :filerName=>"スター精密株式会社",
  #   :fundCode=>nil,
  #   :ordinanceCode=>"010",
  #   :formCode=>"030000",
  #   :docTypeCode=>"120",
  #   :periodStart=>"2020-01-01",
  #   :periodEnd=>"2020-12-31",
  #   :submitDateTime=>"2021-03-26 09:16",
  #   :docDescription=>"有価証券報告書－第96期(令和2年1月1日－令和2年12月31日)",
  #   :issuerEdinetCode=>nil,
  #   :subjectEdinetCode=>nil,
  #   :subsidiaryEdinetCode=>nil,
  #   :currentReportReason=>nil,
  #   :parentDocID=>nil,
  #   :opeDateTime=>nil,
  #   :withdrawalStatus=>"0",
  #   :docInfoEditStatus=>"0",
  #   :disclosureStatus=>"0",
  #   :xbrlFlag=>"1",
  #   :pdfFlag=>"1",
  #   :attachDocFlag=>"1",
  #   :englishDocFlag=>"0"
  # }

  require 'open-uri'
  require 'zip'

  EDINET_API_KEY = ENV['EDINET_API_KEY']
  DOC_LIST_URL = 'https://api.edinet-fsa.go.jp/api/v2/documents.json'
  DOC_URL = 'https://api.edinet-fsa.go.jp/api/v2/documents'
  PAGE_NUMBER = { header: '0000000', corporate_information: '0101010' }.freeze

  belongs_to :security, foreign_key: 'security_code', primary_key: 'code'

  validates :document_id, uniqueness: true, presence: true
  validates :filer_name, presence: true
  validates :security_code, presence: true
  validates :period_started_at, presence: true
  validates :period_ended_at, presence: true

  class << self
    def save_summary(date)
      # NOTE: type=1がメタデータのみ、2がメタデータ+書類一覧
      params = { date: date, type: 2, "Subscription-Key": EDINET_API_KEY }
      response = Faraday.get(DOC_LIST_URL, params)

      Rails.logger.info("Response status: #{response.status}")
      Rails.logger.info("Response body: #{response.body}")
      puts "Response status: #{response.status}"
      puts "Response body: #{response.body}"

      raise "StatusCode: #{response.status}, #{date}の書類一覧取得に失敗しました, #{response.body}" if response.status != 200 && response.status != 403

      if response.status == 403
        Rails.logger.error("#{date}の書類一覧取得は403でした, #{response.body}#")
        puts "#{date}の書類一覧取得は403でした, #{response.body}"
        return
      end

      body = JSON.parse(response.body, symbolize_names: true)

      # ordinanceCode: 府令コード
      # formCode: 様式コード
      transaction do
        documents = body[:results].select { |document| document[:ordinanceCode] == '010' && document[:formCode] == '030000' && !document[:secCode].nil? }

        documents.each do |document|
          edinet_code = document[:edinetCode]
          next unless edinet_code

          security_code = document[:secCode][..-2] # NOTE: 最後の0を削除
          next unless Security.find_by(code: security_code)

          # NOTE: バッチ処理日より1年古いレコードを削除する HerokuのPostgresのレコード数10,000を超過させないため
          Document.where(security_code: security_code).where(submitted_at: ...Time.zone.today.ago(1.year)).destroy_all

          document_id = document[:docID]
          next if Document.find_by(document_id: document_id)

          submitted_at = document[:submitDateTime].present? ? Date.parse(document[:submitDateTime]) : nil

          create!(
            document_id: document_id,
            edinet_code: edinet_code,
            filer_name: document[:filerName],
            security_code: security_code,
            period_started_at: document[:periodStart],
            period_ended_at: document[:periodEnd],
            submitted_at: submitted_at
          )
        rescue ActiveRecord::RecordInvalid => e
          # NOTE: security.codeが存在しない場合に発生
          raise "docID: #{document_id} #{e}"
        end
      end
    end
  end

  def download
    Rails.logger.info("document_id: #{document_id} ダウンロード開始")
    return if File.exist?(document_zip_path)

    # NOTE: type=1はXBRLファイルと監査報告書を取得する
    params = { type: 1, "Subscription-Key": EDINET_API_KEY }
    response = Faraday.get("#{DOC_URL}/#{document_id}", params)

    unless response.status == 200
      Rails.logger.error("status: #{response.status}, body: #{response.body}")
      raise "#{document_id}の書類取得に失敗しました"
    end

    FileUtils.mkdir_p(document_dir_path)

    File.binwrite(document_zip_path, response.body)
  end

  def unzip
    return unless File.exist?(document_zip_path)

    Zip::File.open(document_zip_path) do |zip|
      zip.each do |file|
        file_name = file.name

        next if PAGE_NUMBER.values.none? { |target_num| file_name.include?(target_num) }

        dir = document_file_path(File.dirname(file_name))
        FileUtils.mkdir_p(dir)

        # { true } は展開先に同名ファイルが存在する場合に上書きする指定
        zip.extract(file, document_file_path(file_name)) { true }
      end
    end
  end

  def save_detail!
    assign_attributes(DocumentParser::Header.new(header_path).parse.attributes) if header_path
    assign_attributes(DocumentParser::CorporateInformation.new(corporate_information_path).parse.attributes) if corporate_information_path
    self.details_searched_at = Time.zone.now

    save!
  end

  def remove_dir
    FileUtils.rm_rf(document_dir_path)
  end

  def document_file_path(file_path)
    Rails.root.join('lib/documents', document_id, file_path).to_s
  end

  private

  def document_dir_path
    Rails.root.join('lib/documents', document_id).to_s
  end

  def document_zip_path
    Rails.root.join('lib/documents', document_id, 'download.zip').to_s
  end

  def public_doc_path
    document_file_path('XBRL/PublicDoc')
  end

  def header_path
    @header_path ||= search_path('0000000')
  end

  def corporate_information_path
    @corporate_information_path ||= search_path('0101010')
  end

  def search_path(file_type)
    file_name = Dir.open(public_doc_path, &:to_a).find { |path| path.include?(file_type) }

    return unless file_name

    Rails.root.join(public_doc_path, file_name).to_s
  end
end
