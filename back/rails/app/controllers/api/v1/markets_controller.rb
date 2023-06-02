# frozen_string_literal: true

module Api
  module V1
    class MarketsController < ApplicationController
      def index
        @markets = Market.order(id: :asc)
        @markets_count = Security.joins(:documents).group(:market_id).count

        render 'index.json.jb'
      end

      def show
        @market = Market.find(params[:id])

        render 'show.json.jb'
      end
    end
  end
end
