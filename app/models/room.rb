class Room < ApplicationRecord
  # Associações
  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships
  has_many :messages, dependent: :destroy

  # Validações
  validates :name, presence: true
end
