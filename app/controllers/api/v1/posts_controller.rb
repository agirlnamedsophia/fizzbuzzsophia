class Api::V1::PostsController < ApplicationController
  def show
    @post = Post.find params[:id]
    render json: @post
  end
end
