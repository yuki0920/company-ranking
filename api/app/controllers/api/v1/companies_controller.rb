module Api
  module V1
    class CompaniesController < ApplicationController
      include Pagy::Backend

      def index
        securities = Security.joins(:documents).eager_load(:documents)

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
        render json: { message: 'Not found' }, status: 404
      end
    end
  end
end
