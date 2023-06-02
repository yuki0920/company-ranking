class AddReferenceToIndustry < ActiveRecord::Migration[6.1]
  def change
    add_belongs_to :industries, :industry_category
  end
end
