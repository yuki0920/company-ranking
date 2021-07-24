class RemoveUniqueIndexEdinetCode < ActiveRecord::Migration[6.1]
  def change
    remove_index :documents, :edinet_code, unique: true
  end
end
