# frozen_string_literal: true

require 'spreadsheet'

HEADER = { '日付' => 0, 'コード' => 1, '銘柄名' => 2, '市場・商品区分' => 3, '33業種コード' => 4, '33業種区分' => 5, '17業種コード' => 6, '17業種区分' => 7, '規模コード' => 8,
           '規模区分' => 9 }.freeze

namespace :save_securities do
  desc '月に2回東証から銘柄銘柄のリストをダウンロードしダウンロードしたファイルから証券を更新する'

  task every_2weeks: :environment do
    return unless Time.zone.now.day.in?([1, 15])

    puts '証券一覧のダウンロード開始'
    SecurityList.download
    puts '証券一覧のダウンロード終了'
    puts '証券の保存開始'
    save!
    puts '証券の保存終了'
  end

  task all: :environment do
    puts '証券一覧のダウンロード開始'
    SecurityList.download
    puts '証券一覧のダウンロード終了'
    puts '証券の保存開始'
    save!
    puts '証券の保存終了'
  end

  def save!
    file_path = SecurityList.dest_path

    book = Spreadsheet.open(file_path)
    sheet = book.worksheet('Sheet1')
    sheet.rows[1..].each do |row|
      market = row[HEADER['市場・商品区分']]
      market_data = Market::INITIAL_DATA.find { |mark| market.match?(mark[:name]) }
      unless market_data
        puts "#{row[HEADER['銘柄名']]} の市場 #{market} が見つからないためスキップ"
        next
      end

      market = Market.find_by!(name: market_data[:name])
      code = row[HEADER['コード']]
      name = row[HEADER['銘柄名']]
      industry_code = row[HEADER['33業種コード']].to_i

      security = Security.find_by(code: code)
      if security.present?
        puts "#{code}: #{name} の更新開始"
        security.update!(
          name: name,
          market: market,
          industry_code: industry_code
        )
      else
        puts "#{code}: #{name} の新規作成開始"
        Security.create!(
          code: code,
          name: name,
          market: market,
          industry_code: industry_code
        )
      end

      puts "#{code}: #{name} の保存終了"

      same_securities = Security.where(name: name).order(created_at: :desc)
      next if same_securities.count <= 1

      puts "#{code}: #{name} は同じ名前の証券が#{same_securities.count}件存在するため、古い証券を削除"
      same_securities.each_with_index do |sec, i|
        next if i.zero?

        puts "#{code}: #{name} 削除"
        sec.destroy!
      end
    end
  end
end
