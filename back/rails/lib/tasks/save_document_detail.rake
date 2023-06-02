# frozen_string_literal: true

namespace :save_document_detail do
  desc '書類取得APIから書類ダウンロードし解析してレコードに保存'

  task batch: :environment do
    # NOTE: submitted_atの制約をつけて提出日1年以内を対象に毎日 or 毎週定期実行する
    Document.where(details_searched_at: nil).find_each do |document|
      execute(document)
    rescue StandardError => e
      puts "[Error] document_id: #{document.document_id}, #{e.class}: #{e.message}"
    end
  end

  # NOTE: rake save_document_detail:target\['S100LMNS'\] カッコをエスケープする
  task :target, ['document_id'] => :environment do |_, args|
    document_id = args.document_id

    document = Document.find_by(document_id: document_id)

    unless document
      puts "#{document_id}の書類はありません"
      exit
    end

    execute(document)
  end

  def execute(document)
    meta = "[Info] code: #{document.security_code}, id: #{document.id}, document_id: #{document.document_id} filer_name: #{document.filer_name}"
    puts "#{meta} ダウンロード開始"
    document.download
    puts "#{meta} ダウンロード終了"
    puts "#{meta} 解凍開始"
    document.unzip
    puts "#{meta} 解凍終了"
    puts "#{meta} パース開始"
    document.save_detail!
    puts "#{meta} パース終了"
    puts "#{meta} ディレクトリ削除開始"
    document.remove_dir
    puts "#{meta} ディレクトリ削除終了"

    sleep 0.3
  end
end
