# frozen_string_literal: true

module Api
  module V1
    class MarketIdsController < ApplicationController
      def index
        @market_ids = Market.ids

        render 'index.json.jb'
      end
    end
  end
end
