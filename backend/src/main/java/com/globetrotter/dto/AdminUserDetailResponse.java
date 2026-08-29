package com.globetrotter.dto;

import java.time.LocalDateTime;

public class AdminUserDetailResponse {

    private Long id;
    private String name;
    private String email;
    private String authProvider;
    private String profilePhoto;
    private String languagePreference;
    private String preferredCurrency;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean admin;
    private long tripsCreatedCount;
    private long tripMembershipsCount;

    public AdminUserDetailResponse() {
    }

    public AdminUserDetailResponse(
            Long id,
            String name,
            String email,
            String authProvider,
            String profilePhoto,
            String languagePreference,
            String preferredCurrency,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            boolean admin,
            long tripsCreatedCount,
            long tripMembershipsCount
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.authProvider = authProvider;
        this.profilePhoto = profilePhoto;
        this.languagePreference = languagePreference;
        this.preferredCurrency = preferredCurrency;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.admin = admin;
        this.tripsCreatedCount = tripsCreatedCount;
        this.tripMembershipsCount = tripMembershipsCount;
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

    public String getLanguagePreference() { return languagePreference; }
    public void setLanguagePreference(String languagePreference) { this.languagePreference = languagePreference; }

    public String getPreferredCurrency() { return preferredCurrency; }
    public void setPreferredCurrency(String preferredCurrency) { this.preferredCurrency = preferredCurrency; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isAdmin() { return admin; }
    public void setAdmin(boolean admin) { this.admin = admin; }

    public long getTripsCreatedCount() { return tripsCreatedCount; }
    public void setTripsCreatedCount(long tripsCreatedCount) { this.tripsCreatedCount = tripsCreatedCount; }

    public long getTripMembershipsCount() { return tripMembershipsCount; }
    public void setTripMembershipsCount(long tripMembershipsCount) { this.tripMembershipsCount = tripMembershipsCount; }
}
