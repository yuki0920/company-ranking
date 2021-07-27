# frozen_string_literal: true

require 'spreadsheet'

HEADER = { '日付' => 0, 'コード' => 1, '銘柄名' => 2, '市場・商品区分' => 3, '33業種コード' => 4, '33業種区分' => 5, '17業種コード' => 6, '17業種区分' => 7, '規模コード' => 8,
           '規模区分' => 9 }.freeze

namespace :save_securities do
  desc '月に2回東証から銘柄銘柄のリストをダウンロードしダウンロードしたファイルから証券を更新する'

  task every_2weeks: :environment do
    return unless Date.today.day.in?([1, 15])

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
      code = row[HEADER['コード']]
      next if Security.find_by(code: code)

      name = row[HEADER['銘柄名']]
      puts "#{code}: #{name} の保存開始"

      market_hash = Market::INITIAL_DATA.find { |market| row[HEADER['市場・商品区分']].match?(market[:name]) }
      next unless market_hash

      market = Market.find_by!(name: market_hash[:name])

      Security.create!(
        code: code,
        name: name,
        market: market,
        industry_code: row[HEADER['33業種コード']].to_i
      )
      puts "#{code}: #{name} の保存終了"
    end
  end
end
