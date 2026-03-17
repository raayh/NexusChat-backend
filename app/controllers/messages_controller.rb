class MessagesController < ApplicationController
    before_action :authenticate_user!

    def index
        @room = Room.find(params[:room_id])  # Lista todas as salas
        @messages = @room.messages
        render json: @messages
    end

    def create
        @room = Room.find(params[:room_id])
        @message = @room.messages.build(message_params.merge(user: current_user))

        if @message.save 
            render json: @message, status: :created
        else
            render json: @message.errors, status: :unprocessable_entity
        end
    end

    private

    def message_params
        params.permit(:content) # só deixa passar o content!
    end
end