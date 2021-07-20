require 'rails_helper'

RSpec.describe DocumentParser::Header do
  describe 'パース後のattributesについて' do
    it 'S100L0TZ 電通' do
      src_path = Rails.root.join('spec/fixture/documents/S100L0TZ/XBRL/PublicDoc/0000000_header_jpcrp030000-asr-001_E04760-000_2020-12-31_01_2021-03-26_ixbrl.htm').to_s
      parser = described_class.new(src_path)
      document = parser.parse

      aggregate_failures do
        expect(document.submitted_at).to eq '2021年３月26日'
        expect(document.fiscal_year).to eq '第172期(自　2020年１月１日　至　2020年12月31日)'
        expect(document.company_name).to eq '株式会社電通グループ'
        expect(document.company_name_en).to eq 'DENTSU GROUP INC.'
        expect(document.representative).to eq '代表取締役社長執行役員　山本敏博'
        expect(document.head_office_location).to eq '東京都港区東新橋一丁目８番１号'
      end
    end

    it 'S100LLIE ソフトバンク' do
      src_path = Rails.root.join('spec/fixture/documents/S100LLIE/XBRL/PublicDoc/0000000_header_jpcrp030000-asr-001_E02778-000_2021-03-31_01_2021-06-23_ixbrl.htm').to_s
      parser = described_class.new(src_path)
      document = parser.parse

      aggregate_failures do
        expect(document.submitted_at).to eq '2021年６月23日'
        expect(document.fiscal_year).to eq '第41期（自　2020年４月１日　至　2021年３月31日）'
        expect(document.company_name).to eq 'ソフトバンクグループ株式会社'
        expect(document.company_name_en).to eq 'SoftBank Group Corp.'
        expect(document.representative).to eq '代表取締役 会長 兼 社長執行役員　　孫　正義'
        expect(document.head_office_location).to eq '東京都港区海岸一丁目７番１号'
      end
    end
  end
end
