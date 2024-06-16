class RemoveForeignKeyFromDocuments < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key :documents, :securities, column: :security_code, primary_key: :code
  end
end
