# frozen_string_literal: true

namespace :save_document_detail do
  desc '書類取得APIから書類ダウンロードし解析してレコードに保存'

  task batch: :environment do
    # NOTE: submitted_atの制約をつけて提出日1年以内を対象に毎日 or 毎週定期実行する
    Document.where(details_searched_at: nil).find_each do |document|
      execute(document)
    rescue StandardError => e
      Rails.logger.error("document_id: #{document.document_id}, #{e.class}: #{e.message}")
    end
  end

  # NOTE: rake save_document_detail:target\['S100LMNS'\] カッコをエスケープする
  task :target, ['document_id'] => :environment do |_, args|
    document_id = args.document_id

    document = Document.find_by(document_id: document_id)

    unless document
      Rails.logger.error("#{document_id}の書類はありません")
      exit
    end

    execute(document)
  end

  # NOTE: for updating net_sales
  task net_sales: :environment do
    Document.where(net_sales: nil).find_each do |document|
      execute(document)
    rescue StandardError => e
      Rails.logger.error("document_id: #{document.document_id}, #{e.class}: #{e.message}")
    end
  end

  def execute(document)
    meta = "[Info] code: #{document.security_code}, id: #{document.id}, document_id: #{document.document_id} filer_name: #{document.filer_name}"

    Rails.logger.info("#{meta} ダウンロード開始")
    document.download
    Rails.logger.info("#{meta} ダウンロード終了")

    Rails.logger.info("#{meta} 解凍開始")
    document.unzip
    Rails.logger.info("#{meta} 解凍終了")

    Rails.logger.info("#{meta} パース開始")
    document.save_detail!
    Rails.logger.info("#{meta} パース終了")

    Rails.logger.info("#{meta} ディレクトリ削除開始")
    document.remove_dir
    Rails.logger.info("#{meta} ディレクトリ削除終了")

    sleep 0.3
  end
end
