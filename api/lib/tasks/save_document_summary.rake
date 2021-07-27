# frozen_string_literal: true

namespace :save_document_summary do
  desc '書類一覧取得APIからdocumentを取得する'

  # NOTE: 初期化時のみ実行される
  task year: :environment do
    (Date.yesterday.years_ago(1)..Date.today).each do |date|
      puts "#{date}分の書類取得開始"
      Document.save_summary(date)
      puts "#{date}分の書類取得終了"
    end
  end

  # NOTE: 証券リストの更新のタイミングでsecurityがなく保存できなかったdocumentを再取得する
  task month: :environment do
    return unless Date.today.day.in?([1, 15])

    (Date.today.weeks_ago(5)..Date.today).each do |date|
      puts "#{date}分の書類取得開始"
      Document.save_summary(date)
      puts "#{date}分の書類取得終了"
    end
  end

  # NOTE: データ取得確認用
  task weeks: :environment do
    return unless Date.today.wday == 1

    (Date.today.weeks_ago(2)..Date.today).each do |date|
      puts "#{date}分の書類取得開始"
      Document.save_summary(date)
      puts "#{date}分の書類取得終了"
    end
  end

  # NOTE: 毎日の定時実行
  task day: :environment do
    (Date.yesterday..Date.today).each do |date|
      puts "#{date}分の書類取得開始"
      Document.save_summary(date)
      puts "#{date}分の書類取得終了"
    end
  end
end
