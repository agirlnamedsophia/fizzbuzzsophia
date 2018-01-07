class Post
  attr_reader :body

  def initialize(path:)
    @path = path
  end

  def title
    @title ||= PostTitle.from_filename filename
  end

  def body
    @body = File.read path
  end

  def created_at
    @created_at ||= Time.zone.at(timestamp)
  end

  def as_json(options={})
    @as_json ||= { title: title, body: body, created_at: created_at, id: timestamp }
  end

  def self.all
    @all ||= Dir["#{Rails.root}/posts/**/*.md"].map { |f| Post.new(path: f) }
  end

  def self.ordered
    Post.all.sort { |post| post.created_at }
  end

  private

  attr_reader :path

  def timestamp
    @timestamp ||= path[/(\d+)/].to_i
  end

  def filename
    @filename ||= File.basename(path, '.md')
  end
end
