class AddSecurities < ActiveRecord::Migration[6.1]
  def change
    create_table :securities do |t|
      t.integer :code, null: false
      t.string :name, null: false
      t.belongs_to :market, null: false, index: true
      t.integer :industry_code, null: false

      t.timestamps
    end

    add_foreign_key :securities, :industries, column: :industry_code, primary_key: :code
    add_index :securities, :code, unique: true
    add_index :securities, :name, unique: true
    add_index :securities, :industry_code
  end
end
