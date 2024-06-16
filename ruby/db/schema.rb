# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_06_16_082548) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "documents", force: :cascade do |t|
    t.string "security_code", null: false
    t.string "document_id", null: false
    t.string "edinet_code", null: false
    t.string "filer_name", null: false
    t.date "period_started_at", null: false
    t.date "period_ended_at", null: false
    t.datetime "details_searched_at", precision: nil
    t.string "company_name"
    t.string "company_name_en"
    t.string "head_office_location"
    t.date "submitted_at"
    t.string "fiscal_year"
    t.string "representative"
    t.integer "number_of_employees"
    t.float "average_age_years"
    t.float "average_length_of_service_years"
    t.bigint "average_annual_salary"
    t.bigint "last_year_net_sales"
    t.bigint "net_sales"
    t.bigint "last_year_operating_income"
    t.bigint "operating_income"
    t.bigint "last_year_ordinary_income"
    t.bigint "ordinary_income"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "capital_stock"
    t.bigint "net_assets"
    t.bigint "total_assets"
    t.float "equity_to_asset_ratio"
    t.float "rate_of_return_on_equity"
    t.float "price_earnings_ratio"
    t.bigint "net_cash_provided_by_used_in_operating_activities"
    t.bigint "net_cash_provided_by_used_in_investing_activities"
    t.bigint "net_cash_provided_by_used_in_financing_activities"
    t.bigint "cash_and_cash_equivalents"
    t.integer "consolidated_number_of_employees"
    t.bigint "total_number_of_issued_shares"
    t.float "payout_ratio"
    t.index ["document_id"], name: "index_documents_on_document_id", unique: true
    t.index ["security_code"], name: "index_documents_on_security_code"
  end

  create_table "industries", force: :cascade do |t|
    t.string "name", null: false
    t.integer "code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "industry_category_id"
    t.index ["code"], name: "index_industries_on_code", unique: true
    t.index ["industry_category_id"], name: "index_industries_on_industry_category_id"
    t.index ["name"], name: "index_industries_on_name", unique: true
  end

  create_table "industry_categories", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_industry_categories_on_name", unique: true
  end

  create_table "markets", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_markets_on_name", unique: true
  end

  create_table "securities", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
    t.bigint "market_id", null: false
    t.integer "industry_code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_securities_on_code", unique: true
    t.index ["industry_code"], name: "index_securities_on_industry_code"
    t.index ["market_id"], name: "index_securities_on_market_id"
    t.index ["name"], name: "index_securities_on_name", unique: true
  end

  create_table "security_lists", force: :cascade do |t|
    t.string "file_title", null: false
    t.date "downloaded_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["file_title"], name: "index_security_lists_on_file_title", unique: true
  end

  add_foreign_key "documents", "securities", column: "security_code", primary_key: "code"
  add_foreign_key "securities", "industries", column: "industry_code", primary_key: "code"
end
