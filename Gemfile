source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?('/')
  "https://github.com/#{repo_name}.git"
end

ruby '2.4.2'

gem 'foreman'
gem 'pg'
gem 'puma', '~> 3.7'
gem 'rails', '~> 5.1.4'

gem 'kaminari'

gem 'compass-rails'
gem 'sass-rails'
gem 'uglifier', '>= 1.3.0'

gem 'webpacker'
gem 'webpacker-react'

# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

gem 'turbolinks', '~> 5'

group :development, :test do
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'rspec-rails'
  gem 'selenium-webdriver'
end

group :test do
  gem 'rspec_junit_formatter'
end

group :development do
  gem 'guard-rspec', require: false
  gem 'guard-rubocop'
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console', '>= 3.3.0'
end
