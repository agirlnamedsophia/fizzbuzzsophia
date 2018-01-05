class Api::V1::PostsController < ApplicationController
  def index
    @posts = Post.ordered.page(params[:page])
    render json: @posts
  end
end
