Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts, only: %i[index show]
    end
  end
  resources :posts, only: :show
  root 'home#index'
end
