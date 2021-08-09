# frozen_string_literal: true

namespace :save_document_summary do
  desc '書類一覧取得APIからdocumentを取得する'

  # NOTE: 初期化時のみ実行される
  task year: :environment do
    (Time.zone.now.yesterday.years_ago(1)..Time.zone.now).each do |date|
      puts "#{date}分の書類取得開始"
      Document.save_summary(date)
      puts "#{date}分の書類取得終了"
    end
  end

  # NOTE: 証券リストの更新のタイミングでsecurityがなく保存できなかったdocumentを再取得する
  task month: :environment do
    return unless Time.zone.now.day.in?([1, 15])

    (Time.zone.now.weeks_ago(5)..Time.zone.now).each do |date|
      puts "#{date}分の書類取得開始"
      Document.save_summary(date)
      puts "#{date}分の書類取得終了"
    end
  end

  # NOTE: データ取得確認用
  task weeks: :environment do
    return unless Time.zone.now.wday == 1

    (Time.zone.now.weeks_ago(2)..Time.zone.now).each do |date|
      puts "#{date}分の書類取得開始"
      Document.save_summary(date)
      puts "#{date}分の書類取得終了"
    end
  end

  # NOTE: 毎日の定時実行
  task day: :environment do
    (Time.zone.now.yesterday..Time.zone.now).each do |date|
      puts "#{date}分の書類取得開始"
      Document.save_summary(date)
      puts "#{date}分の書類取得終了"
    end
  end
end
