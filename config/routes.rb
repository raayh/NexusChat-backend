Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
  
  resources :rooms do
    resources :messages, only: [:index, :create]
  end
  #Cria o GET /rooms, POST /rooms, GET /rooms/:id, etc
end
