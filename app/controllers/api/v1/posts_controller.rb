class Api::V1::PostsController < ApiController
  def index
    @posts = Kaminari.paginate_array(Post.ordered).page(params[:page]).per(10)
    current_page = @posts.current_page
    next_page = @posts.next_page

    render json: @posts, current_page: current_page, next_page: next_page
  end

  def show
    @post = Post.find(params[:id])
    render json: @post
  end
end
