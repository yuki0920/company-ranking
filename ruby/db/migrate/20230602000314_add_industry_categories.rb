class AddIndustryCategories < ActiveRecord::Migration[6.1]
  def change
    create_table :industry_categories do |t|
      t.string :name, null: false

      t.timestamps
    end

    add_index :industry_categories, :name, unique: true
  end
end
