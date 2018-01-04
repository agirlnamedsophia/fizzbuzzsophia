Rails.application.routes.draw do
  resources :posts, only: :show

  root 'home#index'
end
