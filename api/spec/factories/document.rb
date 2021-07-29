# frozen_string_literal: true

FactoryBot.define do
  factory :document, class: 'Document' do
    document_id {  'S100LMHG' }
    edinet_code {  'E00210' }
    filer_name { 'ＮＥＣネッツエスアイ株式会社' }
    period_started_at { Date.new(2021, 4, 1) }
    period_ended_at { Date.new(2022, 3, 31) }
    details_searched_at { Date.new(2022, 6, 30) }
    company_name {  'ＮＥＣネッツエスアイ株式会社' }
    company_name_en { 'NEC Networks & System Integration }Corporation' }
    head_office_location { '東京都文京区後楽二丁目6番1号' }
    submitted_at { Date.new(2022, 6, 24) }
    fiscal_year {  '第89期（自　2020年 4月 1日　至　2021年 3月31日）' }
    representative { '代表取締役執行役員社長　牛島　祐之' }
    number_of_employees { 4996 }
    average_age_years { 44.1 }
    average_length_of_service_years { 16.8 }
    average_annual_salary { 7_749_000 }
    last_year_net_sales { 303_616_000_000 }
    net_sales { 339_109_000_000 }
    last_year_operating_income { nil }
    operating_income {  nil }
    last_year_ordinary_income { 15_938_000_000 }
    ordinary_income { 25_493_000_000 }
  end
end
