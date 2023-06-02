class AddSecurityLists < ActiveRecord::Migration[6.1]
  def change
    create_table :security_lists do |t|
      t.string :file_title, null: false
      t.date :downloaded_at, null: false

      t.timestamps
    end

    add_index :security_lists, :file_title, unique: true
  end
end
