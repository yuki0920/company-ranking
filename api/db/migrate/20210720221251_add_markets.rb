class AddMarkets < ActiveRecord::Migration[6.1]
  def change
    create_table :markets do |t|
      t.string :name, null: false

      t.timestamps
    end

    add_index :markets, :name, unique: true
  end
end
