class ApiController < ActionController::API
  include ActionController::HttpAuthentication::Basic::ControllerMethods

  prepend_before_action :return_json

  private

  def return_json
    request.format = :json
  end
end
