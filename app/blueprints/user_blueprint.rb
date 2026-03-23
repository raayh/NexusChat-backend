class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :name, :nickname, :image, :email
end
