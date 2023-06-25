# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DocumentParser::CorporateInformation do
  describe 'パース後のattributesについて' do
    context '連結会社の場合' do
      it 'S100L0TZ 電通' do
        src_path = Rails.root.join('spec/fixture/documents/S100L0TZ/XBRL/PublicDoc/0101010_honbun_jpcrp030000-asr-001_E04760-000_2020-12-31_01_2021-03-26_ixbrl.htm').to_s
        parser = described_class.new(src_path)
        document = parser.parse

        aggregate_failures do
          # 連結経営指標等
          expect(document.last_year_net_sales).to eq 1_047_881_000_000
          expect(document.net_sales).to eq 939_243_000_000
          expect(document.last_year_operating_income).to eq(-3_358_000_000)
          expect(document.operating_income).to eq(-140_625_000_000)
          expect(document.last_year_ordinary_income).to be_nil
          expect(document.ordinary_income).to be_nil
          expect(document.total_assets).to eq 3_380_412_000_000
          expect(document.net_cash_provided_by_used_in_operating_activities).to eq 88_313_000_000
          expect(document.net_cash_provided_by_used_in_investing_activities).to eq(137_013_000_000)
          expect(document.net_cash_provided_by_used_in_financing_activities).to eq(-96_622_000_000)
          expect(document.cash_and_cash_equivalents).to eq 530_692_000_000
          expect(document.consolidated_number_of_employees).to eq 64_533

          # 提出会社の経営指標等
          expect(document.capital_stock).to eq 74_609_000_000
          expect(document.total_number_of_issued_shares).to eq 288_410_000
          expect(document.net_assets).to eq 616_425_000_000
          expect(document.rate_of_return_on_equity).to eq 0
          expect(document.price_earnings_ratio).to eq 0
          expect(document.equity_to_asset_ratio).to eq 0.564
          expect(document.payout_ratio).to eq 0

          # 従業員の状況
          expect(document.number_of_employees).to eq 164
          expect(document.average_age_years).to eq 46.4
          expect(document.average_length_of_service_years).to eq 17.3
          expect(document.average_annual_salary).to eq 13_418_790
        end
      end

      it 'S100LLIE ソフトバンク' do
        src_path = Rails.root.join('spec/fixture/documents/S100LLIE/XBRL/PublicDoc/0101010_honbun_jpcrp030000-asr-001_E02778-000_2021-03-31_01_2021-06-23_ixbrl.htm').to_s
        parser = described_class.new(src_path)
        document = parser.parse

        aggregate_failures do
          # 連結経営指標等
          expect(document.last_year_net_sales).to eq 5_238_938_000_000
          expect(document.net_sales).to eq 5_628_167_000_000
          expect(document.last_year_operating_income).to be_nil
          expect(document.operating_income).to be_nil
          expect(document.last_year_ordinary_income).to be_nil
          expect(document.ordinary_income).to be_nil
          expect(document.total_assets).to eq 45_750_453_000_000
          expect(document.net_cash_provided_by_used_in_operating_activities).to eq 557_250_000_000
          expect(document.net_cash_provided_by_used_in_investing_activities).to eq(-1_468_599_000_000)
          expect(document.net_cash_provided_by_used_in_financing_activities).to eq 2_194_077_000_000
          expect(document.cash_and_cash_equivalents).to eq 4_662_725_000_000
          expect(document.consolidated_number_of_employees).to eq 58_786

          # 提出会社の経営指標等
          expect(document.capital_stock).to eq 238_772_000_000
          expect(document.total_number_of_issued_shares).to eq 2_089_814_330
          expect(document.net_assets).to eq 3_536_120_000_000
          expect(document.rate_of_return_on_equity).to eq 0.36600000000000005
          expect(document.price_earnings_ratio).to eq 12.6
          expect(document.equity_to_asset_ratio).to eq 0.18300000000000002
          expect(document.payout_ratio).to eq 0.059000000000000004

          # 従業員の状況
          expect(document.number_of_employees).to eq 241
          expect(document.average_age_years).to eq 40.0
          expect(document.average_length_of_service_years).to eq 8.9
          expect(document.average_annual_salary).to eq 14_049_675
        end
      end
    end

    context '単体のみの場合' do
      it 'S100LL7Y オービックビジネスコンサルタント' do
        src_path = Rails.root.join('spec/fixture/documents/S100LL7Y/XBRL/PublicDoc/0101010_honbun_jpcrp030000-asr-001_E05048-000_2021-03-31_01_2021-06-22_ixbrl.htm').to_s
        parser = described_class.new(src_path)
        document = parser.parse

        aggregate_failures do
          # 提出会社の経営指標等
          expect(document.last_year_net_sales).to eq 30_068_682_000
          expect(document.net_sales).to eq 29_252_330_000
          expect(document.last_year_operating_income).to be_nil
          expect(document.operating_income).to be_nil
          expect(document.last_year_ordinary_income).to eq 14_030_263_000
          expect(document.ordinary_income).to eq 13_934_707_000
          expect(document.total_assets).to eq 158_362_403_000
          expect(document.net_cash_provided_by_used_in_operating_activities).to eq 11_918_009_000
          expect(document.net_cash_provided_by_used_in_investing_activities).to eq(-753_506_000)
          expect(document.net_cash_provided_by_used_in_financing_activities).to eq(-3_760_154_000)
          expect(document.cash_and_cash_equivalents).to eq 114_095_127_000
          expect(document.consolidated_number_of_employees).to eq 898

          # 提出会社の経営指標等
          expect(document.capital_stock).to eq 10_519_000_000
          expect(document.total_number_of_issued_shares).to eq 80_704_000
          expect(document.net_assets).to eq 128_562_860_000
          expect(document.rate_of_return_on_equity).to eq 0.078
          expect(document.price_earnings_ratio).to eq 45.1
          expect(document.equity_to_asset_ratio).to eq 0.812
          expect(document.payout_ratio).to eq 0.428

          # 従業員の状況
          expect(document.number_of_employees).to eq 898
          expect(document.average_age_years).to eq 34.1
          expect(document.average_length_of_service_years).to eq 10.1
          expect(document.average_annual_salary).to eq 6_864_979
        end
      end
    end
  end
end
