# frozen_string_literal: true

class Security < ApplicationRecord
  belongs_to :market
  belongs_to :industry, foreign_key: :industry_code, primary_key: :code
  has_many :documents, foreign_key: :security_code, primary_key: :code, dependent: :destroy

  validates :code, uniqueness: true, presence: true
  validates :name, uniqueness: true, presence: true
end
