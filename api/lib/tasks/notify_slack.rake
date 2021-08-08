# frozen_string_literal: true

require 'spreadsheet'

namespace :notify_slack do
  desc '月に2回rakeタスクの更新状況をslackに通知する'

  task every_2weeks: :environment do
    notifier = Slack::Notifier.new(ENV['SLACK_WEBHOOK_URL'])
    message = "#{Time.zone.today}\n"
    message += created_securities_message
    message += created_documents_message
    message += updated_documents_message
    notifier.ping(message)
  end

  def created_securities_message
    created_securities = Security.where('created_at > ?', Time.zone.today.ago(1.week))
    count = created_securities.count
    names = created_securities.first(10).pluck(:name)
    <<~MESSAGE
      証券リストのダウンロードと証券(会社)の作成
      "新規登録数 #{count}件"
      "新規登録の会社名(最大10件) #{names}\n"
      ---\n
    MESSAGE
  end

  def created_documents_message
    created_documents = Document.where('created_at > ?', Time.zone.today.ago(1.week))
    count = created_documents.count
    names = created_documents.first(10).pluck(:filer_name)
    <<~MESSAGE
      ドキュメントの作成
      "新規登録数 #{count}件"
      "新規登録の会社名(最大10件) #{names}"
      ---\n
    MESSAGE
  end

  def updated_documents_message
    updated_documents = Document.where('details_searched_at > ?', Time.zone.today.ago(1.week))
    count = updated_documents.count
    names = updated_documents.first(10).pluck(:filer_name)
    <<~MESSAGE
      ドキュメントの更新
      "新規登録数 #{count}件"
      "更新対象の会社名(最大10件) #{names}"
    MESSAGE
  end
end
