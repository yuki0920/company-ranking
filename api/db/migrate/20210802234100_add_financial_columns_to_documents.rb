class AddFinancialColumnsToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :capital_stock, :bigint
    add_column :documents, :net_assets, :bigint
    add_column :documents, :total_assets, :bigint
    add_column :documents, :equity_to_asset_ratio, :float
    add_column :documents, :rate_of_return_on_equity, :float
    add_column :documents, :price_earnings_ratio, :float
    add_column :documents, :net_cash_provided_by_used_in_operating_activities, :bigint
    add_column :documents, :net_cash_provided_by_used_in_investing_activities, :bigint
    add_column :documents, :net_cash_provided_by_used_in_financing_activities, :bigint
    add_column :documents, :cash_and_cash_equivalents, :bigint
    add_column :documents, :consolidated_number_of_employees, :integer
  end
end
