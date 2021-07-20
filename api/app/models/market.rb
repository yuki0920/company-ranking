class Market  < ApplicationRecord
  INITIAL_DATA = [
    { name: '市場第一部' },
    { name: '市場第二部' },
    { name: 'マザーズ' },
    { name: 'JASDAQ' }
  ].freeze

  class << self
    def create_seed
      INITIAL_DATA.each do |data|
        create!(data)
      end
    end
  end
end
