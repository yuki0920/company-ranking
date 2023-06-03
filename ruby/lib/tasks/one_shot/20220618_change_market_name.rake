# frozen_string_literal: true

MARKET_NAME_MAPPING = {
  '市場第一部' => 'プライム',
  '市場第二部' => 'スタンダード',
  'マザーズ' => 'グロース'
}.freeze

namespace :change_market_name do
  task security: :environment do
    market = Market.find_by(name: 'マザーズ')
    Security.includes(:market).find_each.each do |security|
      if security.market.name == 'JASDAQ'
        security.update!(market: market)
      end
    end
  end

  task market_name: :environment do
    Market.all.each do |market|
      new_name = MARKET_NAME_MAPPING[market.name]
      market.update!(name: new_name)
    end

    Market.find_by(name: 'JASDAQ').destroy!
  end
end
