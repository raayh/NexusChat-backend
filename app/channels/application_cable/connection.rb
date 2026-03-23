module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      # Pegamos os três tokens que o Frontend manda na URL
      uid = request.params[:uid]
      client_id = request.params[:client]
      access_token = request.params[:access_token]

       # Buscamos o usuário no banco pelo email (uid)
       user = User.find_by(uid: uid)

      # O Devise tem uma função mágica para verificar o token:
      # user.valid_token?(access_token, client_id)
      
      if user && user.valid_token?(access_token, client_id)
        # Se chegou aqui, o user existe E o token bateu!
        # Retorne apenas a variável do usuário:
        user
      else
        # Se for fantasma ou token falso, chama o método de expulsão:
        reject_unauthorized_connection
      end

    end
end
