# frozen_string_literal: true

require_relative '../../app/models/element_util'

namespace :adjust_salary do
  include ElementUtil

  desc 'Adjust salary'

  task execute: :environment do
    Document.where('average_annual_salary > 5000000000').find_each do |document|
      new_salaly = adjust_salary(document.average_annual_salary)
      puts "Adjusting security_code: #{document.security_code} name: #{document.filer_name} salary: #{document.average_annual_salary} -> #{new_salaly}"
      document.update!(average_annual_salary: new_salaly)
    end
  end
end
