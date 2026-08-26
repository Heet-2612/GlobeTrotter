package com.globetrotter.dto;

import com.globetrotter.entity.User;

import java.time.LocalDateTime;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String profilePhoto;
    private String languagePreference;
    private String preferredCurrency;
    private LocalDateTime createdAt;

    public UserResponse() {
    }

    public UserResponse(Long id, String name, String email, String profilePhoto, String languagePreference, String preferredCurrency, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.profilePhoto = profilePhoto;
        this.languagePreference = languagePreference;
        this.preferredCurrency = preferredCurrency;
        this.createdAt = createdAt;
    }

    public static UserResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePhoto(user.getProfilePhoto())
                .languagePreference(user.getLanguagePreference())
                .preferredCurrency(user.getPreferredCurrency() != null ? user.getPreferredCurrency() : "INR")
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public String getLanguagePreference() { return languagePreference; }
    public void setLanguagePreference(String languagePreference) { this.languagePreference = languagePreference; }

    public String getPreferredCurrency() { return preferredCurrency; }
    public void setPreferredCurrency(String preferredCurrency) { this.preferredCurrency = preferredCurrency; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class UserResponseBuilder {
        private Long id;
        private String name;
        private String email;
        private String profilePhoto;
        private String languagePreference;
        private String preferredCurrency;
        private LocalDateTime createdAt;

        public UserResponseBuilder id(Long id) { this.id = id; return this; }
        public UserResponseBuilder name(String name) { this.name = name; return this; }
        public UserResponseBuilder email(String email) { this.email = email; return this; }
        public UserResponseBuilder profilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; return this; }
        public UserResponseBuilder languagePreference(String languagePreference) { this.languagePreference = languagePreference; return this; }
        public UserResponseBuilder preferredCurrency(String preferredCurrency) { this.preferredCurrency = preferredCurrency; return this; }
        public UserResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public UserResponse build() {
            return new UserResponse(id, name, email, profilePhoto, languagePreference, preferredCurrency, createdAt);
        }
    }
}
