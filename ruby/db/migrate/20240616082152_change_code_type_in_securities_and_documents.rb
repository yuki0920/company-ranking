class ChangeCodeTypeInSecuritiesAndDocuments < ActiveRecord::Migration[6.1]
  def up
    change_column :securities, :code, :string
    change_column :documents, :security_code, :string
  end

  def down
    change_column :securities, :code, :integer
    change_column :documents, :security_code, :integer
  end
end
