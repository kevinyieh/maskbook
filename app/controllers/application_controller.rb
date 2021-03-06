class ApplicationController < ActionController::Base
    helper_method :current_user, :logged_in?

    def login!(user)
        @current_user = user
        session[:session_token] = @current_user.reset_session_token!
    end
    
    def logout!
        current_user.reset_session_token!
        current_user = nil
        session[:session_token] = nil
    end

    def current_user
        return nil unless session[:session_token]

        @current_user ||= User.with_attached_pfp
                                .with_attached_photos
                                .with_attached_wallpaper
                                .find_by(session_token: session[:session_token])
    end

    def logged_in?
        !!current_user
    end
end