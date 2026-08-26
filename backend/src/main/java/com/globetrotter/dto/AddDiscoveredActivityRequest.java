package com.globetrotter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class AddDiscoveredActivityRequest {

    @NotBlank(message = "External ID is required")
    private String externalId;

    @NotBlank(message = "Name is required")
    private String name;

    private String description;
    private String category;
    private Double latitude;
    private Double longitude;
    private String address;
    private String imageUrl;

    @NotNull(message = "Scheduled date is required")
    private LocalDate scheduledDate;

    private LocalTime startTime;
    private String notes;
    private Double customCost;

    public AddDiscoveredActivityRequest() {
    }

    public AddDiscoveredActivityRequest(String externalId, String name, String description, String category, Double latitude, Double longitude, String address, String imageUrl, LocalDate scheduledDate, LocalTime startTime, String notes, Double customCost) {
        this.externalId = externalId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.imageUrl = imageUrl;
        this.scheduledDate = scheduledDate;
        this.startTime = startTime;
        this.notes = notes;
        this.customCost = customCost;
    }

    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Double getCustomCost() { return customCost; }
    public void setCustomCost(Double customCost) { this.customCost = customCost; }
}
