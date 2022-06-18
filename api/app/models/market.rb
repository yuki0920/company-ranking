# frozen_string_literal: true

class Market < ApplicationRecord
  INITIAL_DATA = [
    { name: 'プライム' },
    { name: 'スタンダード' },
    { name: 'グロース' }
  ].freeze

  has_many :securities

  class << self
    def create_seed
      INITIAL_DATA.each do |data|
        create!(data)
      end
    end
  end
end
