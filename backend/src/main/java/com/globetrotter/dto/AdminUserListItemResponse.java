package com.globetrotter.dto;

import java.time.LocalDateTime;

public class AdminUserListItemResponse {

    private Long id;
    private String name;
    private String email;
    private String authProvider;
    private String profilePhoto;
    private String preferredCurrency;
    private LocalDateTime createdAt;
    private boolean admin;

    public AdminUserListItemResponse() {
    }

    public AdminUserListItemResponse(Long id, String name, String email, String authProvider, String profilePhoto, String preferredCurrency, LocalDateTime createdAt, boolean admin) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.authProvider = authProvider;
        this.profilePhoto = profilePhoto;
        this.preferredCurrency = preferredCurrency;
        this.createdAt = createdAt;
        this.admin = admin;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getPreferredCurrency() { return preferredCurrency; }
    public void setPreferredCurrency(String preferredCurrency) { this.preferredCurrency = preferredCurrency; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isAdmin() { return admin; }
    public void setAdmin(boolean admin) { this.admin = admin; }
}
