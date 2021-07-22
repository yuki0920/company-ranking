module Api
  module V1
    class CompaniesController < ApplicationController
      include Pagy::Backend

      def index
        documents = Document.where('submitted_at > ?', Date.today.last_year).includes(:security).order('average_annual_salary DESC NULLS LAST')
        meta, @documents = pagy(documents)
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
