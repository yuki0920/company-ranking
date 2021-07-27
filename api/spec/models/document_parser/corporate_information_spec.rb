# frozen_string_literal: true

require 'rails_helper'

RSpec.describe DocumentParser::CorporateInformation do
  describe 'パース後のattributesについて' do
    it 'S100L0TZ 電通' do
      src_path = Rails.root.join('spec/fixture/documents/S100L0TZ/XBRL/PublicDoc/0101010_honbun_jpcrp030000-asr-001_E04760-000_2020-12-31_01_2021-03-26_ixbrl.htm').to_s
      parser = described_class.new(src_path)
      document = parser.parse

      aggregate_failures do
        expect(document.last_year_net_sales).to eq 1_047_881_000_000
        expect(document.net_sales).to eq 939_243_000_000
        expect(document.last_year_operating_income).to eq(-3_358_000_000)
        expect(document.operating_income).to eq(-140_625_000_000)
        expect(document.last_year_ordinary_income).to be_nil
        expect(document.ordinary_income).to be_nil
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
        expect(document.last_year_net_sales).to eq 5_238_938_000_000
        expect(document.net_sales).to eq 5_628_167_000_000
        expect(document.last_year_operating_income).to be_nil
        expect(document.operating_income).to be_nil
        expect(document.last_year_ordinary_income).to be_nil
        expect(document.ordinary_income).to be_nil

        expect(document.number_of_employees).to eq 241
        expect(document.average_age_years).to eq 40.0
        expect(document.average_length_of_service_years).to eq 8.9
        expect(document.average_annual_salary).to eq 14_049_675
      end
    end
  end
end
