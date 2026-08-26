package com.globetrotter.dto;

import com.globetrotter.entity.Region;

public class RegionResponse {

    private Long id;
    private String name;
    private String canonicalName;
    private String country;
    private String description;
    private String imageUrl;

    public RegionResponse() {
    }

    public RegionResponse(Long id, String name, String canonicalName, String country, String description, String imageUrl) {
        this.id = id;
        this.name = name;
        this.canonicalName = canonicalName;
        this.country = country;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public static RegionResponse fromEntity(Region region) {
        if (region == null) return null;
        return new RegionResponse(
                region.getId(),
                region.getName(),
                region.getCanonicalName(),
                region.getCountry(),
                region.getDescription(),
                region.getImageUrl()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCanonicalName() { return canonicalName; }
    public void setCanonicalName(String canonicalName) { this.canonicalName = canonicalName; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
