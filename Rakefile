require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

begin
  require 'rubocop/rake_task'
  RuboCop::RakeTask.new

  task(:default).clear
  task default: %i[rubocop spec]
rescue LoadError
end
