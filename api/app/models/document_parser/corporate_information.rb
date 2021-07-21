class DocumentParser::CorporateInformation
  require 'open-uri'

  include ::ElementUtil

  def initialize(src_path)
    @src_path = src_path
    @document = Document::CorporateInformation.new
  end

  def parse
    html = URI.open(@src_path).read
    parsed_html = Nokogiri::HTML.parse(html)
    is_parent = html.include?('連結経営指標等')

    parsed_html.css('nonfraction').each do |element|
      case element.attr('name')
      when /NetSales/, /:Revenue/
        if element.attr('contextref') == 'Prior1YearDuration'
          @document.last_year_net_sales = calculate_scale(element)
        elsif !is_parent && element.attr('contextref') == 'Prior1YearDuration_NonConsolidatedMember'
          @document.last_year_net_sales = calculate_scale(element)
        elsif element.attr('contextref') == 'CurrentYearDuration'
          @document.net_sales = calculate_scale(element)
        elsif !is_parent && element.attr('contextref') == 'CurrentYearDuration_NonConsolidatedMember'
          @document.net_sales = calculate_scale(element)
        end
      when /OperatingIncome/, /OperatingProfitLoss/, /OperatingRevenue1/
        if element.attr('contextref') == 'Prior1YearDuration'
          @document.last_year_operating_income = calculate_scale(element)
        elsif !is_parent && element.attr('contextref') == 'Prior1YearDuration_NonConsolidatedMember'
          @document.last_year_operating_income = calculate_scale(element)
        elsif element.attr('contextref') == 'CurrentYearDuration'
          @document.operating_income = calculate_scale(element)
        elsif !is_parent && element.attr('contextref') == 'CurrentYearDuration_NonConsolidatedMember'
          @document.operating_income = calculate_scale(element)
        end
      when /OrdinaryIncome/, /OrdinaryProfitLoss/
        if element.attr('contextref') == 'Prior1YearDuration'
          @document.last_year_ordinary_income = calculate_scale(element)
        elsif !is_parent && element.attr('contextref') == 'Prior1YearDuration_NonConsolidatedMember'
          @document.last_year_ordinary_income = calculate_scale(element)
        elsif element.attr('contextref') == 'CurrentYearDuration'
          @document.ordinary_income = calculate_scale(element)
        elsif !is_parent && element.attr('contextref') == 'CurrentYearDuration_NonConsolidatedMember'
          @document.ordinary_income = calculate_scale(element)
        end
      end
    end

    parsed_html.css('nonfraction').each do |element|
      next unless element.attr('contextref') == 'CurrentYearInstant_NonConsolidatedMember'

      case element.attr('name')
      when 'jpcrp_cor:NumberOfEmployees'
        @document.number_of_employees = calculate_scale(element)
      when 'jpcrp_cor:AverageAgeYearsInformationAboutReportingCompanyInformationAboutEmployees'
        @document.average_age_years = element.text
      when 'jpcrp_cor:AverageLengthOfServiceYearsInformationAboutReportingCompanyInformationAboutEmployees'
        @document.average_length_of_service_years = element.text
      when 'jpcrp_cor:AverageAnnualSalaryInformationAboutReportingCompanyInformationAboutEmployees'
        @document.average_annual_salary = calculate_scale(element)
      end
    end

    @document
  end
end

class Document::CorporateInformation
  include ActiveModel::Model
  include ActiveModel::Attributes

  attribute :last_year_net_sales, :integer
  attribute :net_sales, :integer
  attribute :last_year_operating_income, :integer
  attribute :operating_income, :integer
  attribute :last_year_ordinary_income, :integer
  attribute :ordinary_income, :integer
  attribute :number_of_employees, :integer
  attribute :average_age_years, :float
  attribute :average_length_of_service_years, :float
  attribute :average_annual_salary, :integer
end
