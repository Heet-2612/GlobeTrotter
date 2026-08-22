package com.globetrotter.dto;

import com.globetrotter.entity.Trip;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TripResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String coverPhoto;
    private BigDecimal budget;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public TripResponse() {
    }

    public TripResponse(Long id, String name, String description, LocalDate startDate, LocalDate endDate, String coverPhoto, BigDecimal budget, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.coverPhoto = coverPhoto;
        this.budget = budget;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TripResponse fromEntity(Trip trip) {
        if (trip == null) {
            return null;
        }
        return new TripResponse(
                trip.getId(),
                trip.getName(),
                trip.getDescription(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getCoverPhoto(),
                trip.getBudget(),
                trip.getCreatedAt(),
                trip.getUpdatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
