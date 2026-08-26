package com.globetrotter.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "estimated_duration_minutes", nullable = false)
    private Integer estimatedDurationMinutes;

    @Column(name = "estimated_cost", nullable = false, columnDefinition = "numeric(10,2)")
    private Double estimatedCost;

    @Column(length = 10)
    private String currency;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "google_place_id", length = 255)
    private String googlePlaceId;

    public Activity() {
    }

    public Activity(Long id, Destination destination, String name, String description, String category, Integer estimatedDurationMinutes, Double estimatedCost, String currency, String imageUrl, String googlePlaceId) {
        this.id = id;
        this.destination = destination;
        this.name = name;
        this.description = description;
        this.category = category;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.estimatedCost = estimatedCost;
        this.currency = currency;
        this.imageUrl = imageUrl;
        this.googlePlaceId = googlePlaceId;
    }

    public Activity(Long id, Destination destination, String name, String description, String category, Integer estimatedDurationMinutes, Double estimatedCost, String currency, String imageUrl) {
        this(id, destination, name, description, category, estimatedDurationMinutes, estimatedCost, currency, imageUrl, null);
    }

    public static ActivityBuilder builder() {
        return new ActivityBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Destination getDestination() { return destination; }
    public void setDestination(Destination destination) { this.destination = destination; }

    @Deprecated
    public Destination getCity() { return destination; }
    @Deprecated
    public void setCity(Destination destination) { this.destination = destination; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getEstimatedDurationMinutes() { return estimatedDurationMinutes; }
    public void setEstimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getGooglePlaceId() { return googlePlaceId; }
    public void setGooglePlaceId(String googlePlaceId) { this.googlePlaceId = googlePlaceId; }

    public static class ActivityBuilder {
        private Long id;
        private Destination destination;
        private String name;
        private String description;
        private String category;
        private Integer estimatedDurationMinutes;
        private Double estimatedCost;
        private String currency;
        private String imageUrl;
        private String googlePlaceId;

        public ActivityBuilder id(Long id) { this.id = id; return this; }
        public ActivityBuilder destination(Destination destination) { this.destination = destination; return this; }
        public ActivityBuilder city(Destination destination) { this.destination = destination; return this; }
        public ActivityBuilder name(String name) { this.name = name; return this; }
        public ActivityBuilder description(String description) { this.description = description; return this; }
        public ActivityBuilder category(String category) { this.category = category; return this; }
        public ActivityBuilder estimatedDurationMinutes(Integer estimatedDurationMinutes) { this.estimatedDurationMinutes = estimatedDurationMinutes; return this; }
        public ActivityBuilder estimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; return this; }
        public ActivityBuilder currency(String currency) { this.currency = currency; return this; }
        public ActivityBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ActivityBuilder googlePlaceId(String googlePlaceId) { this.googlePlaceId = googlePlaceId; return this; }

        public Activity build() {
            return new Activity(id, destination, name, description, category, estimatedDurationMinutes, estimatedCost, currency, imageUrl, googlePlaceId);
        }
    }
}
