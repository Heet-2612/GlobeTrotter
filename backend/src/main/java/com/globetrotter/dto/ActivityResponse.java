package com.globetrotter.dto;

import com.globetrotter.entity.Activity;
import com.globetrotter.service.ActivityImageRegistry;

public class ActivityResponse {

    private Long id;
    private Long destinationId;
    private String destinationName;
    private Long cityId;
    private String cityName;
    private String name;
    private String description;
    private String category;
    private String subcategoryId;
    private String imageStrategy;
    private Integer estimatedDurationMinutes;
    private Double estimatedCost;
    private String currency;
    private String imageUrl;
    private String googlePlaceId;
    private String source;
    private String externalId;
    private Double latitude;
    private Double longitude;

    public ActivityResponse() {
    }

    public ActivityResponse(Long id, Long destinationId, String destinationName, String name, String description, String category, Integer estimatedDurationMinutes, Double estimatedCost, String currency, String imageUrl, String googlePlaceId) {
        this.id = id;
        this.destinationId = destinationId;
        this.destinationName = destinationName;
        this.cityId = destinationId;
        this.cityName = destinationName;
        this.name = name;
        this.description = description;
        this.category = category;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.estimatedCost = estimatedCost;
        this.currency = currency;
        this.imageUrl = imageUrl;
        this.googlePlaceId = googlePlaceId;
    }

    public static ActivityResponse fromEntity(Activity activity, ActivityImageRegistry registry) {
        if (activity == null) return null;
        String currency = activity.getCurrency();
        if ((currency == null || currency.isBlank()) && activity.getDestination() != null) {
            currency = activity.getDestination().getCurrencyCode();
        }
        Long destId = activity.getDestination() != null ? activity.getDestination().getId() : null;
        String destName = activity.getDestination() != null ? activity.getDestination().getName() : null;

        String resolvedUrl = registry != null ? registry.resolveImageUrl(activity) : activity.getImageUrl();

        ActivityResponse response = new ActivityResponse(
                activity.getId(),
                destId,
                destName,
                activity.getName(),
                activity.getDescription(),
                activity.getCategory(),
                activity.getEstimatedDurationMinutes(),
                activity.getEstimatedCost(),
                currency != null ? currency : "INR",
                resolvedUrl,
                activity.getGooglePlaceId()
        );
        String subcat = activity.getSubcategoryId();
        if (subcat == null && registry != null) {
            subcat = registry.inferSubcategoryId(activity.getName(), activity.getCategory(), destName);
        }
        response.setSubcategoryId(subcat);
        response.setImageStrategy(activity.getImageStrategy());
        response.setSource(activity.getSource());
        response.setExternalId(activity.getExternalId());
        response.setLatitude(activity.getLatitude());
        response.setLongitude(activity.getLongitude());
        return response;
    }

    public static ActivityResponse fromEntity(Activity activity) {
        return fromEntity(activity, null);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDestinationId() { return destinationId; }
    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
        this.cityId = destinationId;
    }

    public String getDestinationName() { return destinationName; }
    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
        this.cityName = destinationName;
    }

    public Long getCityId() { return cityId != null ? cityId : destinationId; }
    public void setCityId(Long cityId) {
        this.cityId = cityId;
        if (this.destinationId == null) this.destinationId = cityId;
    }

    public String getCityName() { return cityName != null ? cityName : destinationName; }
    public void setCityName(String cityName) {
        this.cityName = cityName;
        if (this.destinationName == null) this.destinationName = cityName;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubcategoryId() { return subcategoryId; }
    public void setSubcategoryId(String subcategoryId) { this.subcategoryId = subcategoryId; }

    public String getImageStrategy() { return imageStrategy; }
    public void setImageStrategy(String imageStrategy) { this.imageStrategy = imageStrategy; }

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

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
