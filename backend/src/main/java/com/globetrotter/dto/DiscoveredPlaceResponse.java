package com.globetrotter.dto;

public class DiscoveredPlaceResponse {

    private String id;
    private String externalId;
    private String name;
    private String description;
    private String category;
    private String subcategoryId;
    private Double latitude;
    private Double longitude;
    private String address;
    private String imageUrl;
    private String source;
    private String attribution;

    public DiscoveredPlaceResponse() {
        this.source = "GEOAPIFY";
        this.attribution = "Powered by Geoapify • © OpenStreetMap contributors";
    }

    public DiscoveredPlaceResponse(String id, String externalId, String name, String description, String category, Double latitude, Double longitude, String address, String imageUrl) {
        this.id = id;
        this.externalId = externalId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.imageUrl = imageUrl;
        this.source = "GEOAPIFY";
        this.attribution = "Powered by Geoapify • © OpenStreetMap contributors";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getExternalId() { return externalId; }
    public void setExternalId(String externalId) { this.externalId = externalId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubcategoryId() { return subcategoryId; }
    public void setSubcategoryId(String subcategoryId) { this.subcategoryId = subcategoryId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getAttribution() { return attribution; }
    public void setAttribution(String attribution) { this.attribution = attribution; }
}
