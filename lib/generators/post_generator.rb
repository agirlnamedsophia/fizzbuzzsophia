class PostGenerator < Rails::Generators::Base
  def create_post_file
    title = ARGV[0]
    parsed_title = title.split.join('_').downcase
    create_file "posts/#{timestamp}/#{parsed_title}.md", "# #{created_at}"
  end

  def created_at
    @created_at ||= now.to_date
  end

  def timestamp
    @timestamp ||= now.to_i
  end

  def now
    @now ||= Time.zone.now
  end
end
