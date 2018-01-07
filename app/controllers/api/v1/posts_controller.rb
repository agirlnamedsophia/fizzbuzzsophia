class Api::V1::PostsController < ApiController
  def index
    @posts = Kaminari.paginate_array(Post.ordered).page(params[:page]).per(1)
    render json: @posts, current_page: @posts.current_page, next_page: @posts.next_page
  end
end
