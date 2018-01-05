class ApiController < ActionController::API
  include ActionController::HttpAuthentication::Basic::ControllerMethods

  prepend_before_action :return_json
  before_action :disallow_all, :authenticate

  private

  def authenticate
    http_basic_authenticate_with(name: ENV.fetch('API_USERNAME'), password: ENV.fetch('API_PASSWORD')) unless local?
  end

  def disallow_all
    head :unauthorized unless local?
  end

  def local?
    @local ||= request.remote_ip == '127.0.0.1'
  end

  def return_json
    request.format = :json
  end
end
