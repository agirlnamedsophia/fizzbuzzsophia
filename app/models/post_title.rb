class PostTitle
  def self.from_filename(filename)
    filename.split('_').join(' ').titleize
  end
end
