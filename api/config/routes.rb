Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :hello, only: :index
      resources :companies, only: %i(index show)
      resources :industries, only: %i(index)
    end
  end
end
