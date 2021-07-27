# frozen_string_literal: true

module Api
  module V1
    class IndustryIdsController < ApplicationController
      def index
        @industry_ids = Industry.ids

        render 'index.json.jb'
      end
    end
  end
end
