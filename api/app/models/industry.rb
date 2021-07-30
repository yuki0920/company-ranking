# frozen_string_literal: true

class Industry < ApplicationRecord
  INITIAL_DATA = [
    { name: '水産・農林業', code: 50, industry_category_id: 10 },
    { name: '鉱業', code: 1050, industry_category_id: 10 },
    { name: '建設業', code: 2050, industry_category_id: 9 },
    { name: '食料品', code: 3050, industry_category_id: 2 },
    { name: '繊維製品', code: 3100, industry_category_id: 2 },
    { name: 'パルプ・紙', code: 3150, industry_category_id: 2 },
    { name: '化学', code: 3200, industry_category_id: 2 },
    { name: '医薬品', code: 3250, industry_category_id: 2 },
    { name: '石油・石炭製品', code: 3300, industry_category_id: 3 },
    { name: 'ゴム製品', code: 3350, industry_category_id: 3 },
    { name: 'ガラス・土石製品', code: 3400, industry_category_id: 3 },
    { name: '鉄鋼', code: 3450, industry_category_id: 4 },
    { name: '非鉄金属', code: 3500, industry_category_id: 4 },
    { name: '金属製品', code: 3550, industry_category_id: 4 },
    { name: '機械', code: 3600, industry_category_id: 5 },
    { name: '電気機器', code: 3650, industry_category_id: 5 },
    { name: '輸送用機器', code: 3700, industry_category_id: 5 },
    { name: '精密機器', code: 3750, industry_category_id: 5 },
    { name: 'その他製品', code: 3800, industry_category_id: 1 },
    { name: '電気・ガス業', code: 4050, industry_category_id: 10 },
    { name: '陸運業', code: 5050, industry_category_id: 6 },
    { name: '海運業', code: 5100, industry_category_id: 6 },
    { name: '空運業', code: 5150, industry_category_id: 6 },
    { name: '倉庫・運輸関連業', code: 5200, industry_category_id: 6 },
    { name: '情報・通信業', code: 5250, industry_category_id: 1 },
    { name: '卸売業', code: 6050, industry_category_id: 7 },
    { name: '小売業', code: 6100, industry_category_id: 7 },
    { name: '銀行業', code: 7050, industry_category_id: 8 },
    { name: '証券、商品先物取引業', code: 7100, industry_category_id: 8 },
    { name: '保険業', code: 7150, industry_category_id: 8 },
    { name: 'その他金融業', code: 7200, industry_category_id: 8 },
    { name: '不動産業', code: 8050, industry_category_id: 9 },
    { name: 'サービス業', code: 9050, industry_category_id: 7 }
  ].freeze

  has_many :securities, foreign_key: :industry_code, primary_key: :code
  extend ActiveHash::Associations::ActiveRecordExtensions
  belongs_to_active_hash :industry_category

  class << self
    def create_seed
      INITIAL_DATA.each do |data|
        create!(data)
      end
    end
  end
end
