class AddSecurities < ActiveRecord::Migration[6.1]
  def change
    create_table :securities do |t|
      t.integer :code, null: false, unique: true
      t.string :name, null: false, unique: true
      t.integer :market_id, null: false
      t.integer :industry_code, null: false

      t.timestamps
    end
  end
end
