class PostGenerator < Rails::Generators::Base
  desc "Creates blank markdown files in a folder with the current timestamp"

  def create_post_file
    title = ARGV[0]&.split.join('_').downcase
    create_file "posts/#{timestamp}/#{title}.md"
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
