class AddForeignKeyToDocuments < ActiveRecord::Migration[7.0]
  def change
    add_foreign_key :documents, :securities, column: :security_code, primary_key: :code
  end
end
