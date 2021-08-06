# frozen_string_literal: true

module Api
  module V1
    class CompaniesController < ApplicationController
      include Pagy::Backend

      def index
        securities = Security.joins(:documents, :industry, :market).eager_load(:documents, :industry, :market)
        securities = securities.where(industry: { id: params[:industry_id] }) if params[:industry_id]
        securities = securities.where(market: { id: params[:market_id] }) if params[:market_id]

        if (query = params[:q])
          securities = case query
          when /^[0-9]+$/
            securities.where(code: query)
          else
            securities.where('documents.company_name ILIKE :query OR documents.company_name_en ILIKE :query', query: "%#{query}%")
          end
        end

        case params[:sort_type]
        when 'average_annual_salary'
          securities = securities.order('documents.average_annual_salary DESC NULLS LAST')
        when 'net_sales'
          securities = securities.order('documents.net_sales DESC NULLS LAST')
        when 'ordinary_income'
          securities = securities.order('documents.ordinary_income DESC NULLS LAST')
        else
          raise
        end

        meta, @securities = pagy(securities)
        @meta = pagy_metadata(meta)

        render 'index.json.jb'
      end

      def show
        @security = Security.find_by!(code: params[:id])
        render 'show.json.jb'
      rescue ActiveRecord::RecordNotFound
        render json: { message: 'Not found' }, status: :not_found
      end
    end
  end
end
