class AddIndustries < ActiveRecord::Migration[6.1]
  def change
    create_table :industries do |t|
      t.string :name, null: false
      t.integer :code, null: false

      t.timestamps
    end

    add_index :industries, :name, unique: true
    add_index :industries, :code, unique: true
  end
end
