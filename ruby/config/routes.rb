Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :hello, only: :index
      resources :companies, only: %i(index show)
      resources :industries, only: %i(index show)
      resources :markets, only: %i(index show)
      resources :company_ids, only: %i(index)
      resources :industry_ids, only: %i(index)
      resources :market_ids, only: %i(index)
    end
  end
end