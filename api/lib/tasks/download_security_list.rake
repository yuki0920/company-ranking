namespace :save_securities do
  desc '月に2回東証から銘柄銘柄のリストをダウンロードしダウンロードしたファイルから証券を更新する'

  task every_2weeks: :environment do
    puts '証券一覧のダウンロード開始'
    SecurityList.download
    puts '証券一覧のダウンロード終了'

    puts '証券の保存開始'
    Security.batch_save
    puts '証券の保存終了'
  end
end
