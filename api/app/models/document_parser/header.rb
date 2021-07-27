# frozen_string_literal: true

class DocumentParser::Header
  require 'open-uri'

  def initialize(src_path)
    @src_path = src_path
    @document = Document::Header.new
  end

  def parse
    html = URI.open(@src_path).read
    parsed_html = Nokogiri::HTML.parse(html)

    parsed_html.css('nonnumeric').each do |element|
      case element.attr('name')
      when 'jpcrp_cor:FilingDateCoverPage'
        @document.submitted_at = element.children[0].text
      when 'jpcrp_cor:FiscalYearCoverPage'
        @document.fiscal_year = element.children[0].text
      when 'jpcrp_cor:CompanyNameCoverPage'
        @document.company_name = element.children[0].text
      when 'jpcrp_cor:CompanyNameInEnglishCoverPage'
        @document.company_name_en = element.children[0].text
      when 'jpcrp_cor:TitleAndNameOfRepresentativeCoverPage'
        @document.representative = element.children[0].text
      when 'jpcrp_cor:AddressOfRegisteredHeadquarterCoverPage'
        @document.head_office_location = element.children[0].text
      end
    end

    @document
  end
end

class Document::Header
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :submitted_at, :string
  attribute :fiscal_year, :string
  attribute :company_name, :string
  attribute :company_name_en, :string
  attribute :representative, :string
  attribute :head_office_location, :string
end
