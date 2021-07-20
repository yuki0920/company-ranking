class Industry  < ApplicationRecord
  INITIAL_DATA = [
    { name: '水産・農林業', code: 50 },
    { name: '鉱業', code: 1050 },
    { name: '建設業', code: 2050 },
    { name: '食料品', code: 3050 },
    { name: '繊維製品', code: 3100 },
    { name: 'パルプ・紙', code: 3150 },
    { name: '化学', code: 3200 },
    { name: '医薬品', code: 3250 },
    { name: '石油・石炭製品', code: 3300 },
    { name: 'ゴム製品', code: 3350 },
    { name: 'ガラス・土石製品', code: 3400 },
    { name: '鉄鋼', code: 3450 },
    { name: '非鉄金属', code: 3500 },
    { name: '金属製品', code: 3550 },
    { name: '機械', code: 3600 },
    { name: '電気機器', code: 3650 },
    { name: '輸送用機器', code: 3700 },
    { name: '精密機器', code: 3750 },
    { name: 'その他製品', code: 3800 },
    { name: '電気・ガス業', code: 4050 },
    { name: '陸運業', code: 5050 },
    { name: '海運業', code: 5100 },
    { name: '空運業', code: 5150 },
    { name: '倉庫・運輸関連業', code: 5200 },
    { name: '情報・通信業', code: 5250 },
    { name: '卸売業', code: 6050 },
    { name: '小売業', code: 6100 },
    { name: '銀行業', code: 7050 },
    { name: '証券、商品先物取引業', code: 7100 },
    { name: '保険業', code: 7150 },
    { name: 'その他金融業', code: 7200 },
    { name: '不動産業', code: 8050 },
    { name: 'サービス業', code: 9050 }
  ].freeze

  class << self
    def create_seed
      INITIAL_DATA.each do |data|
        create!(data)
      end
    end
  end
end
