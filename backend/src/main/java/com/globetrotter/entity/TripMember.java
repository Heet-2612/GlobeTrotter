package com.globetrotter.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "trip_members")
public class TripMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "role", nullable = false, length = 20)
    private String role = "MEMBER";

    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public TripMember() {
    }

    public TripMember(Long id, Trip trip, User user, String fullName, String role, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.trip = trip;
        this.user = user;
        this.fullName = fullName;
        this.role = role != null ? role : "MEMBER";
        this.status = status != null ? status : "ACTIVE";
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TripMemberBuilder builder() {
        return new TripMemberBuilder();
    }

    public boolean isGtUser() {
        return this.user != null;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class TripMemberBuilder {
        private Long id;
        private Trip trip;
        private User user;
        private String fullName;
        private String role = "MEMBER";
        private String status = "ACTIVE";
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public TripMemberBuilder id(Long id) { this.id = id; return this; }
        public TripMemberBuilder trip(Trip trip) { this.trip = trip; return this; }
        public TripMemberBuilder user(User user) { this.user = user; return this; }
        public TripMemberBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public TripMemberBuilder role(String role) { this.role = role; return this; }
        public TripMemberBuilder status(String status) { this.status = status; return this; }
        public TripMemberBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TripMemberBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public TripMember build() {
            return new TripMember(id, trip, user, fullName, role, status, createdAt, updatedAt);
        }
    }
}
