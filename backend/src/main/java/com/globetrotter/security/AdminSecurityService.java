package com.globetrotter.security;

import com.globetrotter.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AdminSecurityService {

    @Value("${app.admin.email:admin@globetrotter.com}")
    private String adminEmail;

    public boolean isAdminEmail(String email) {
        if (email == null || adminEmail == null) {
            return false;
        }
        return email.trim().equalsIgnoreCase(adminEmail.trim());
    }

    public boolean isAdmin(User user) {
        return user != null && isAdminEmail(user.getEmail());
    }

    public String getAdminEmail() {
        return adminEmail;
    }
}
