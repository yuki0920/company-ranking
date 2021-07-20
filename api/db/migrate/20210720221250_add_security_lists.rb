class AddSecurityLists < ActiveRecord::Migration[6.1]
  def change
    create_table :security_lists do |t|
      t.string :file_title, null: false, unique: true
      t.date :downloaded_at, null: false

      t.timestamps
    end
  end
end
