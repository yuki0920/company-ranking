# frozen_string_literal: true

require 'rails_helper'
RSpec.describe '/api/v1/industries', type: :request do
  let(:market) { create(:market) }
  let(:industry_category) { IndustryCategory.first }
  let(:industry) { create(:industry, industry_category: industry_category) }
  let(:security) { create(:security, market: market, industry: industry) }

  before do
    create(:document, security: security)
  end

  describe 'GET /api/v1/industries' do
    it do
      get "/api/v1/industries"

      expect(response).to have_http_status :ok

      assert_request_schema_confirm
      assert_response_schema_confirm
    end
  end

  describe 'GET /api/v1/industries/:id' do
    it do
      get "/api/v1/industries/#{industry.id}"

      expect(response).to have_http_status :ok

      assert_request_schema_confirm
      assert_response_schema_confirm
    end
  end
end
