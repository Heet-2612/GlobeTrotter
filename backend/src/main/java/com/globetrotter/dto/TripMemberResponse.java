package com.globetrotter.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.globetrotter.entity.TripMember;

import java.time.LocalDateTime;

public class TripMemberResponse {

    private Long id;
    private Long tripId;
    private Long userId;
    private String fullName;
    @JsonProperty("isGtUser")
    private boolean isGtUser;
    private String role;
    private String status;
    private LocalDateTime createdAt;

    public TripMemberResponse() {
    }

    public TripMemberResponse(Long id, Long tripId, Long userId, String fullName, boolean isGtUser, String role, String status, LocalDateTime createdAt) {
        this.id = id;
        this.tripId = tripId;
        this.userId = userId;
        this.fullName = fullName;
        this.isGtUser = isGtUser;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
    }

    public static TripMemberResponse fromEntity(TripMember member) {
        if (member == null) {
            return null;
        }
        return TripMemberResponse.builder()
                .id(member.getId())
                .tripId(member.getTrip() != null ? member.getTrip().getId() : null)
                .userId(member.getUser() != null ? member.getUser().getId() : null)
                .fullName(member.getFullName())
                .isGtUser(member.isGtUser())
                .role(member.getRole())
                .status(member.getStatus())
                .createdAt(member.getCreatedAt())
                .build();
    }

    public static TripMemberResponseBuilder builder() {
        return new TripMemberResponseBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public boolean isGtUser() { return isGtUser; }
    public void setGtUser(boolean isGtUser) { this.isGtUser = isGtUser; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class TripMemberResponseBuilder {
        private Long id;
        private Long tripId;
        private Long userId;
        private String fullName;
        private boolean isGtUser;
        private String role;
        private String status;
        private LocalDateTime createdAt;

        public TripMemberResponseBuilder id(Long id) { this.id = id; return this; }
        public TripMemberResponseBuilder tripId(Long tripId) { this.tripId = tripId; return this; }
        public TripMemberResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public TripMemberResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public TripMemberResponseBuilder isGtUser(boolean isGtUser) { this.isGtUser = isGtUser; return this; }
        public TripMemberResponseBuilder role(String role) { this.role = role; return this; }
        public TripMemberResponseBuilder status(String status) { this.status = status; return this; }
        public TripMemberResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public TripMemberResponse build() {
            return new TripMemberResponse(id, tripId, userId, fullName, isGtUser, role, status, createdAt);
        }
    }
}
