class Post < ApplicationRecord
  scope :ordered, -> { order(:created_at) }
  validates :title, :body, presence: true
end
