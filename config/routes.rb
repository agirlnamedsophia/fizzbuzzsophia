Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts, only: :show
    end
  end

  root 'home#index'
end
