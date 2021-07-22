module Api
  module V1
    class IndustriesController < ApplicationController
      def index
        @industries = Industry.order(code: :asc)
        @industries_count = Security.joins(:documents).group(:industry_code).count

        render 'index.json.jb'
      end
    end
  end
end
