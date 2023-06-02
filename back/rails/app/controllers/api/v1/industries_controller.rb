# frozen_string_literal: true

module Api
  module V1
    class IndustriesController < ApplicationController
      def index
        @industry_categories = IndustryCategory.all
        @industries = Industry.order(code: :asc).group_by(&:industry_category_id)
        @industries_count = Security.joins(:documents).group(:industry_code).count

        render 'index.json.jb'
      end

      def show
        @industry = Industry.find(params[:id])

        render 'show.json.jb'
      end
    end
  end
end
