class AddDocuments < ActiveRecord::Migration[6.1]
  def change
    create_table :documents do |t|
      t.integer :security_code, null: false
      t.string :document_id, null: false
      t.string :edinet_code, null: false
      t.string :filer_name, null: false
      t.date :period_started_at, null: false
      t.date :period_ended_at, null: false
      t.datetime :details_searched_at
      t.string :company_name
      t.string :company_name_en
      t.string :head_office_location
      t.date :submitted_at
      t.string :fiscal_year
      t.string :representative
      t.integer :number_of_employees
      t.float :average_age_years
      t.float :average_length_of_service_years
      t.bigint :average_annual_salary
      t.bigint :last_year_net_sales
      t.bigint :net_sales
      t.bigint :last_year_operating_income
      t.bigint :operating_income
      t.bigint :last_year_ordinary_income
      t.bigint :ordinary_income

      t.timestamps
    end

    add_foreign_key :documents, :securities, column: :security_code, primary_key: :code
    add_index :documents, :document_id, unique: true
    add_index :documents, :edinet_code, unique: true
    add_index :documents, :security_code
  end
end
