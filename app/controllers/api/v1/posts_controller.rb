class Api::V1::PostsController < ApplicationController
  def index
    @posts = Post.ordered.page(params[:page]).per(2)
    render json: @posts
  end
end
