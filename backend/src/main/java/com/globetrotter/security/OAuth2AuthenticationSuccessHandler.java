package com.globetrotter.security;

import com.globetrotter.service.OAuth2ExchangeService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final OAuth2ExchangeService exchangeService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public OAuth2AuthenticationSuccessHandler(OAuth2ExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        Boolean emailVerified = oAuth2User.getAttribute("email_verified");
        if (emailVerified == null || !emailVerified) {
            getRedirectStrategy().sendRedirect(request, response, frontendUrl + "/#oauth2?error=unverified_email");
            return;
        }

        String exchangeCode = exchangeService.generateAndStoreCode(oAuth2User.getAttributes());
        
        String targetUrl = frontendUrl + "/#oauth2?code=" + exchangeCode;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
