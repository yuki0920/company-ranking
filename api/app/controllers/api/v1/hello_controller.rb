module Api
  module V1
    class HelloController < ApplicationController
      def index
        render json: 'Hello'
      end
    end
  end
end
