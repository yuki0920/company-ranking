# frozen_string_literal: true

namespace :save_document_summary do
  desc '書類一覧取得APIからdocumentを取得する'

  # NOTE: 初期化時のみ実行される
  task year: :environment do
    (Time.zone.now.yesterday.years_ago(1).to_date..Time.zone.now.to_date).each do |date|
      save_summary(date)
    end
  end

  # NOTE: 証券リストの更新のタイミングでsecurityがなく保存できなかったdocumentを再取得する
  task month: :environment do
    (Time.zone.now.weeks_ago(5).to_date..Time.zone.now.to_date).each do |date|
      save_summary(date)
    end
  end

  # NOTE: データ取得確認用
  task weeks: :environment do
    (Time.zone.now.weeks_ago(2).to_date..Time.zone.now.to_date).each do |date|
      save_summary(date)
    end
  end

  # NOTE: 毎日の定時実行
  task day: :environment do
    (Time.zone.now.yesterday.to_date..Time.zone.now.to_date).each do |date|
      save_summary(date)
    end
  end

  # NOTE: 指定した月から実行
  # rake save_document_summary:before[3]
  task :before, ['month'] => :environment do |_, args|
    month = args.month.to_i

    (Time.zone.now.yesterday.months_ago(month).to_date..Time.zone.now.to_date).each do |date|
      save_summary(date)
    end
  end

  def save_summary(date)
    puts "#{date}分の書類取得開始"
    Document.save_summary(date)
    puts "#{date}分の書類取得終了"
  end
end
