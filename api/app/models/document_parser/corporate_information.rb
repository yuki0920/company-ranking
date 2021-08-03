# frozen_string_literal: true

class DocumentParser::CorporateInformation
  require 'open-uri'

  include ::ElementUtil

  def initialize(src_path)
    @src_path = src_path
    @document = Document::CorporateInformation.new
    html = URI.open(@src_path).read
    @parsed_html = Nokogiri::HTML.parse(html)
    # NOE: Prior1YearDuration は連結会社のみ、提出会社はPrior4YearDuration_NonConsolidatedMemberになる
    @is_parent = @parsed_html.css('nonfraction').any? {|element| element.attr('contextref') == 'CurrentYearDuration' }
  end

  def parse
    parse_settlement_info
    parse_employee_info

    @document
  end

  private

  def parse_settlement_info
    @parsed_html.css('nonfraction').each do |element|
      case element.attr('name')
      when /NetSales/, /:Revenue/
        if current_year_duration?(element)
          @document.net_sales = calculate_scale(element)
        elsif prior_1year_duration?(element)
          @document.last_year_net_sales = calculate_scale(element)
        end
      when /OperatingIncome/, /OperatingProfitLoss/, /OperatingRevenue1/
        if current_year_duration?(element)
          @document.operating_income = calculate_scale(element)
        elsif prior_1year_duration?(element)
          @document.last_year_operating_income = calculate_scale(element)
        end
      when /OrdinaryIncome/, /OrdinaryProfitLoss/
        if current_year_duration?(element)
          @document.ordinary_income = calculate_scale(element)
        elsif prior_1year_duration?(element)
          @document.last_year_ordinary_income = calculate_scale(element)
        end
      when /CapitalStock/ # 資本金
        if current_year_instant?(element)
          @document.capital_stock = calculate_scale(element)
        end
      when /NetAssetsSummary/ # 純資産
        if current_year_instant?(element)
          @document.net_assets = calculate_scale(element)
        end
      when /TotalAssets/ # 総資産
        if current_year_instant?(element)
          @document.total_assets = calculate_scale(element)
        end
      when /EquityToAssetRatio/ # 自己資本比率
        if current_year_instant?(element)
          @document.equity_to_asset_ratio = calculate_scale(element)
        end
      when /RateOfReturnOnEquity/ # 自己資本利益率(ROE)
        if current_year_duration?(element)
          @document.rate_of_return_on_equity = calculate_scale(element)
        end
      when /PriceEarningsRatio/ # 株価収益率(PER)
        if current_year_duration?(element)
          @document.price_earnings_ratio = calculate_scale(element)
        end
      when /NetCashProvidedByUsedInOperatingActivities/, /CashFlowsFromUsedInOperatingActivities/ # 営業CF
        if current_year_duration?(element)
          @document.net_cash_provided_by_used_in_operating_activities = calculate_scale(element)
        end
      when /NetCashProvidedByUsedInInvestingActivitie/, /CashFlowsFromUsedInInvestingActivities/ # 営業CF
        if current_year_duration?(element)
          @document.net_cash_provided_by_used_in_investing_activities = calculate_scale(element)
        end
      when /NetCashProvidedByUsedInFinancingActivities/, /CashFlowsFromUsedInFinancingActivities/ # 営業CF
        if current_year_duration?(element)
          @document.net_cash_provided_by_used_in_financing_activities = calculate_scale(element)
        end
      when /CashAndCashEquivalents/ # 営業CF
        if current_year_instant?(element)
          @document.cash_and_cash_equivalents = calculate_scale(element)
        end
      when /NumberOfEmployees/
        if current_year_instant?(element)
          @document.consolidated_number_of_employees = calculate_scale(element)
        end
      end
    end
  end

  def current_year_duration?(element)
    element.attr('contextref') == 'CurrentYearDuration' || (!@is_parent && element.attr('contextref') == 'CurrentYearDuration_NonConsolidatedMember')
  end

  def prior_1year_duration?(element)
    element.attr('contextref') == 'Prior1YearDuration' || (!@is_parent && element.attr('contextref') == 'Prior1YearDuration_NonConsolidatedMember')
  end

  def current_year_instant?(element)
    element.attr('contextref') == 'CurrentYearInstant' || (!@is_parent && element.attr('contextref') == 'CurrentYearInstant_NonConsolidatedMember')
  end

  def parse_employee_info
    @parsed_html.css('nonfraction').each do |element|
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
  attribute :capital_stock, :integer
  attribute :net_assets, :integer
  attribute :total_assets, :integer
  attribute :equity_to_asset_ratio, :float
  attribute :rate_of_return_on_equity, :float
  attribute :price_earnings_ratio, :float
  attribute :net_cash_provided_by_used_in_operating_activities, :integer
  attribute :net_cash_provided_by_used_in_investing_activities, :integer
  attribute :net_cash_provided_by_used_in_financing_activities, :integer
  attribute :cash_and_cash_equivalents, :integer
  attribute :consolidated_number_of_employees, :integer
  attribute :number_of_employees, :integer
  attribute :average_age_years, :float
  attribute :average_length_of_service_years, :float
  attribute :average_annual_salary, :integer
end
