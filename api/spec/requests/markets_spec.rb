# frozen_string_literal: true

require 'rails_helper'
RSpec.describe '/api/v1/markets', type: :request do
  let(:market) { create(:market) }
  let(:industry) { create(:industry) }
  let(:security) { create(:security, market: market, industry: industry) }

  before do
    create(:document, security: security)
  end

  describe 'GET /api/v1/markets' do
    it do
      get '/api/v1/markets'

      expect(response).to have_http_status :ok

      assert_request_schema_confirm
      assert_response_schema_confirm
    end
  end

  describe 'GET /api/v1/markets/:id' do
    it do
      get "/api/v1/markets/#{market.id}"

      expect(response).to have_http_status :ok

      assert_request_schema_confirm
      assert_response_schema_confirm
    end
  end
end
