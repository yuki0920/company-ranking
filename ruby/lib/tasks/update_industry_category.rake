# frozen_string_literal: true

namespace :update_industry_category do
  desc '書類一覧取得APIからdocumentを取得する'

  task execute: :environment do
    Industry.find_each do |industry|
      Industry::INITIAL_DATA.each do |data|
        if industry.name == data[:name]
          industry.update!(industry_category_id: data[:industry_category_id])
        end
      end
    end
  end
end
