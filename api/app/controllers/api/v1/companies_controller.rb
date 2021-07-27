# frozen_string_literal: true

module Api
  module V1
    class CompaniesController < ApplicationController
      include Pagy::Backend

      def index
        securities = Security.joins(:documents, :industry).eager_load(:documents, :industry)
        securities = securities.where(industry: { id: params[:industry_id] }) if params[:industry_id]

        if query = params[:q]
          case query
          when /^[0-9]+$/
            securities = securities.where(code: query)
          else
            securities = securities.where("securities.name LIKE ?", "%#{query}%")
          end
        end

        case params[:sort_type]
        when 'average_annual_salary'
          securities = securities.order('documents.average_annual_salary DESC NULLS LAST')
        when 'net_sales'
          securities = securities.order('documents.net_sales DESC NULLS LAST')
        end

        meta, @securities = pagy(securities)
        @meta = pagy_metadata(meta)

        render 'index.json.jb'
      end

      def show
        @security = Security.find(params[:id])
        render 'show.json.jb'
      rescue ActiveRecord::RecordNotFound
        render json: { message: 'Not found' }, status: :not_found
      end
    end
  end
end
