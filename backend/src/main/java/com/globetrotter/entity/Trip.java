package com.globetrotter.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "cover_photo", length = 500)
    private String coverPhoto;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Trip() {
    }

    public Trip(Long id, User user, String name, String description, LocalDate startDate, LocalDate endDate, String coverPhoto, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.coverPhoto = coverPhoto;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TripBuilder builder() {
        return new TripBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getCoverPhoto() { return coverPhoto; }
    public void setCoverPhoto(String coverPhoto) { this.coverPhoto = coverPhoto; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static class TripBuilder {
        private Long id;
        private User user;
        private String name;
        private String description;
        private LocalDate startDate;
        private LocalDate endDate;
        private String coverPhoto;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public TripBuilder id(Long id) { this.id = id; return this; }
        public TripBuilder user(User user) { this.user = user; return this; }
        public TripBuilder name(String name) { this.name = name; return this; }
        public TripBuilder description(String description) { this.description = description; return this; }
        public TripBuilder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
        public TripBuilder endDate(LocalDate endDate) { this.endDate = endDate; return this; }
        public TripBuilder coverPhoto(String coverPhoto) { this.coverPhoto = coverPhoto; return this; }
        public TripBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TripBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Trip build() {
            return new Trip(id, user, name, description, startDate, endDate, coverPhoto, createdAt, updatedAt);
        }
    }
}
