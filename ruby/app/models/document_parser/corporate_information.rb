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
    @is_consolidated_company = @parsed_html.css('nonfraction').any? { |element| element.attr('contextref') == 'CurrentYearDuration' }
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
      # 連結経営指標等
      when /NetSales/, /:Revenue/ # 売上高
        if current_year_duration?(element)
          @document.net_sales = calculate_scale(element)
        elsif prior_1year_duration?(element)
          @document.last_year_net_sales = calculate_scale(element)
        end
      when /OperatingIncome/, /OperatingProfitLoss/, /OperatingRevenue1/ # 営業利益
        if current_year_duration?(element)
          @document.operating_income = calculate_scale(element)
        elsif prior_1year_duration?(element)
          @document.last_year_operating_income = calculate_scale(element)
        end
      when /OrdinaryIncome/, /OrdinaryProfitLoss/ # 経常利益
        if current_year_duration?(element)
          @document.ordinary_income = calculate_scale(element)
        elsif prior_1year_duration?(element)
          @document.last_year_ordinary_income = calculate_scale(element)
        end
      when /TotalAssets/ # 総資産
        if current_year_instant?(element)
          @document.total_assets = calculate_scale(element)
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
      when /NumberOfEmployees/ # 従業員数
        if current_year_instant?(element)
          @document.consolidated_number_of_employees = calculate_scale(element)
        end
      # 提出会社の経営指標等
      when /CapitalStock/ # 資本金
        if current_year_non_consolidated_instant?(element)
          @document.capital_stock = calculate_scale(element)
        end
      when /IssuedShares/ # 発行済株式総数
        if current_year_non_consolidated_instant?(element)
          @document.total_number_of_issued_shares = calculate_scale(element)
        end
      when /NetAssetsSummary/ # 純資産
        if current_year_non_consolidated_instant?(element)
          @document.net_assets = calculate_scale(element)
        end
      when /RateOfReturnOnEquity/ # 自己資本利益率(ROE)
        if current_year_non_consolidated_duration?(element)
          @document.rate_of_return_on_equity = calculate_scale(element)
        end
      when /PriceEarningsRatio/ # 株価収益率(PER)
        if current_year_non_consolidated_duration?(element)
          @document.price_earnings_ratio = calculate_scale(element)
        end
      when /EquityToAssetRatio/ # 自己資本比率
        if current_year_non_consolidated_instant?(element)
          @document.equity_to_asset_ratio = calculate_scale(element)
        end
      when /PayoutRatio/ # 配当性向
        if current_year_non_consolidated_duration?(element)
          @document.payout_ratio = calculate_scale(element)
        end
      end
    end
  end

  # TODO: rename & refactor
  def current_year_duration?(element)
    element.attr('contextref') == 'CurrentYearDuration' || (!@is_consolidated_company && element.attr('contextref') == 'CurrentYearDuration_NonConsolidatedMember')
  end

  def prior_1year_duration?(element)
    element.attr('contextref') == 'Prior1YearDuration' || (!@is_consolidated_company && element.attr('contextref') == 'Prior1YearDuration_NonConsolidatedMember')
  end

  def current_year_instant?(element)
    element.attr('contextref') == 'CurrentYearInstant' || (!@is_consolidated_company && element.attr('contextref') == 'CurrentYearInstant_NonConsolidatedMember')
  end

  def current_year_non_consolidated_duration?(element)
    element.attr('contextref') == 'CurrentYearDuration_NonConsolidatedMember'
  end

  def current_year_non_consolidated_instant?(element)
    element.attr('contextref') == 'CurrentYearInstant_NonConsolidatedMember'
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
        @document.average_annual_salary = adjust_salary(calculate_scale(element))
      end
    end
  end
end

class Document::CorporateInformation
  include ActiveModel::Model
  include ActiveModel::Attributes

  # 連結経営指標等
  attribute :last_year_net_sales, :integer # 売上高
  attribute :net_sales, :integer # 売上高
  attribute :last_year_operating_income, :integer # 営業利益
  attribute :operating_income, :integer # 営業利益
  attribute :last_year_ordinary_income, :integer # 経常利益
  attribute :ordinary_income, :integer # 経常利益
  attribute :total_assets, :integer # 総資産
  attribute :net_cash_provided_by_used_in_operating_activities, :integer # 営業CF
  attribute :net_cash_provided_by_used_in_investing_activities, :integer # 投資CF
  attribute :net_cash_provided_by_used_in_financing_activities, :integer # 財務CF
  attribute :cash_and_cash_equivalents, :integer # 現金及び現金同等物

  # 提出会社の経営指標等
  attribute :capital_stock, :integer # 資本金
  attribute :total_number_of_issued_shares, :integer # 発行済株式総数
  attribute :net_assets, :integer # 純資産
  attribute :rate_of_return_on_equity, :float # 自己資本利益率(ROE)
  attribute :price_earnings_ratio, :float # 株価収益率(PER)
  attribute :equity_to_asset_ratio, :float # 自己資本比率
  attribute :payout_ratio, :float # 配当性向

  # 従業員の状況
  attribute :consolidated_number_of_employees, :integer # 従業員数
  attribute :number_of_employees, :integer # 従業員数
  attribute :average_age_years, :float # 平均年齢
  attribute :average_length_of_service_years, :float # 平均勤続年数
  attribute :average_annual_salary, :integer # 平均年間給与
end
