class Post < ApplicationRecord
  scope :ordered, -> { order(:created_at) }
end
