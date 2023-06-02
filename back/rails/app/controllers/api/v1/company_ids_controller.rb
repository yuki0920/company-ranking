# frozen_string_literal: true

module Api
  module V1
    class CompanyIdsController < ApplicationController
      def index
        @security_ids = Security.joins(:documents).pluck(:code)

        render 'index.json.jb'
      end
    end
  end
end
