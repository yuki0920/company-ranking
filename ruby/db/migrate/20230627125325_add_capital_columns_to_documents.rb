class AddCapitalColumnsToDocuments < ActiveRecord::Migration[6.1]
  def change
    add_column :documents, :total_number_of_issued_shares, :bigint
    add_column :documents, :payout_ratio, :float
  end
end
