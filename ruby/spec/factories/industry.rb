# frozen_string_literal: true

FactoryBot.define do
  factory :industry, class: 'Industry' do
    name { '情報・通信業' }
    code { 5250 }
  end
end
