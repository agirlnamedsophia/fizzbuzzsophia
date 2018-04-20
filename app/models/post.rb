class Post
  def initialize(path:)
    @path = path
  end

  def as_json(_options = {})
    @as_json ||= {
      title: title,
      short_body: short_body,
      body: body,
      created_at: created_at,
      id: id
    }
  end

  def id
    @id ||= timestamp
  end

  def created_at
    @created_at ||= Time.zone.at(timestamp).to_date
  end

  def self.find(id)
    Post.by_recency.find { |post| post.id == id.to_i }
  end

  def self.all
    @all ||= Dir["#{Rails.root}/posts/**/*.md"].map { |f| Post.new(path: f) }
  end

  def self.by_recency
    posts = Post.all
    posts.sort do |post| # rubocop:disable Style/SymbolProc
      post.created_at
    end.reverse
    posts
  end

  private

  attr_reader :path

  def timestamp
    @timestamp ||= path[/(\d+)/].to_i
  end

  def title
    @title ||= PostTitle.from_filename filename
  end

  def body
    @body = File.read path
  end

  def short_body
    @short_body ||= body.truncate_words(75).split("\n").first
  end

  def filename
    @filename ||= File.basename(path, '.md')
  end
end
