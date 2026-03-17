class RoomsController < ApplicationController 
   
    def index
        @rooms = Room.all  # Lista todas as salas
        render json: @rooms
    end

    def show 
        @room = Room.find(params[:id])  # Lista uma sala
        render json: @room
    rescue ActiveRecord::RecordNotFound # Por que usamos isso?
        render json: { error: "room_not_found"}, status: :not_found
    end
end