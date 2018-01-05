class Api::V1::PostsController < ApiController

  def index
    @posts = Post.ordered.page(params[:page]).per(2)
    render json: @posts, current_page: @posts.current_page, next_page: @posts.next_page
  end

  def create
    post = Post.new(create_params)
    if post.valid?
      post.save!
    else
      Rails.logger.info "post invalid #{create_params}"
    end
  end

  private

  def create_params
    params.require(:post).permit(:title, :body)
  end
end
