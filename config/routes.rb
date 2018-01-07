Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts, only: :index
    end
  end

  root 'home#index'
end
