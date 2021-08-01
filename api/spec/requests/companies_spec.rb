# frozen_string_literal: true

require 'rails_helper'
RSpec.describe '/api/v1/companies', type: :request do
  let(:market) { create(:market) }
  let(:industry) { create(:industry) }
  let(:security) { create(:security, market: market, industry: industry) }

  before do
    create(:document, security: security)
  end

  describe 'GET /api/v1/companies' do
    context 'pageなし' do
      it do
        get "/api/v1/companies", params: { sort_type: 'net_sales' }

        expect(response).to have_http_status :ok

        result = JSON.parse(response.body).symbolize_keys
        expect(result[:companies]).to be_present

        assert_request_schema_confirm
        assert_response_schema_confirm
      end
    end

    context 'pageあり' do
      it do
        get "/api/v1/companies", params: { page: 1, sort_type: 'net_sales' }

        expect(response).to have_http_status :ok

        result = JSON.parse(response.body).symbolize_keys
        expect(result[:companies]).to be_present

        assert_request_schema_confirm
        assert_response_schema_confirm
      end
    end

    context 'queryが文字列' do
      it do
        get "/api/v1/companies", params: { page: 1, sort_type: 'net_sales', q: 'ネッツエスアイ' }

        expect(response).to have_http_status :ok

        result = JSON.parse(response.body).symbolize_keys
        expect(result[:companies]).to be_present

        assert_request_schema_confirm
        assert_response_schema_confirm
      end
    end

    context 'queryが存在しない社名の場合' do
      it do
        get "/api/v1/companies", params: { page: 1, sort_type: 'net_sales', q: 'ネットワーク' }

        expect(response).to have_http_status :ok

        result = JSON.parse(response.body).symbolize_keys
        expect(result[:companies]).to be_empty

        assert_request_schema_confirm
        assert_response_schema_confirm
      end
    end

    context 'queryが英語の文字列' do
      it do
        get "/api/v1/companies", params: { page: 1, sort_type: 'net_sales', q: 'Networks' }

        expect(response).to have_http_status :ok

        result = JSON.parse(response.body).symbolize_keys
        expect(result[:companies]).to be_present

        assert_request_schema_confirm
        assert_response_schema_confirm
      end
    end

    context 'queryが英語の文字列の小文字' do
      it do
        get "/api/v1/companies", params: { page: 1, sort_type: 'net_sales', q: 'networks' }

        expect(response).to have_http_status :ok

        result = JSON.parse(response.body).symbolize_keys
        expect(result[:companies]).to be_present

        assert_request_schema_confirm
        assert_response_schema_confirm
      end
    end

    context 'queryが数値' do
      it do
        get "/api/v1/companies", params: { page: 1, sort_type: 'net_sales', q: '1000' }

        expect(response).to have_http_status :ok

        result = JSON.parse(response.body).symbolize_keys
        expect(result[:companies]).to be_present

        assert_request_schema_confirm
        assert_response_schema_confirm
      end
    end
  end

  describe 'GET /api/v1/companies/:id' do
    it do
      get "/api/v1/companies/#{security.code}"

      expect(response).to have_http_status :ok

      assert_request_schema_confirm
      assert_response_schema_confirm
    end
  end
end
