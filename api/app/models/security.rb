class Security < ApplicationRecord
  require 'spreadsheet'

  HEADER = {'日付' => 0, 'コード' => 1, '銘柄名' => 2, '市場・商品区分' => 3, '33業種コード' => 4, '33業種区分' => 5, '17業種コード' => 6, '17業種区分' => 7, '規模コード' => 8, '規模区分' => 9}.freeze

  has_many :documents, foreign_key: :security_code, primary_key: :code

  validates :code, uniqueness: true, presence: true
  validates :name, uniqueness: true, presence: true
  validates :segment_name, presence: true
  validates :industry_code, presence: true
  validates :industry_name, presence: true

  class << self
    def batch_save
      file_path = SecurityList.dest_path

      book = Spreadsheet.open(file_path)
      sheet = book.worksheet('Sheet1')

      sheet.rows.each do |row|
        code = row[HEADER['コード']]
        next if Security.find_by(code: code)

        Security.create!(
          code: code,
          name: row[HEADER['銘柄名']],
          segment_name: row[HEADER['市場・商品区分']],
          industry_code: row[HEADER['33業種コード']],
          industry_name: row[HEADER['33業種区分']],
        )
      end
    end
  end
end
