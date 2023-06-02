# frozen_string_literal: true

FactoryBot.define do
  factory :security, class: 'Security' do
    code { 1000 }
    name { 'ＮＥＣネッツエスアイ' }
  end
end
