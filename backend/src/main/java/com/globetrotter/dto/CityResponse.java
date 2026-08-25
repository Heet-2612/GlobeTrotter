package com.globetrotter.dto;

import com.globetrotter.entity.City;

public class CityResponse {

    private Long id;
    private String name;
    private String country;
    private String region;
    private Double costIndex;
    private Integer popularity;
    private String imageUrl;
    private String currencyCode;
    private String currencySymbol;

    public CityResponse() {
    }

    public CityResponse(Long id, String name, String country, String region, Double costIndex, Integer popularity, String imageUrl, String currencyCode, String currencySymbol) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.region = region;
        this.costIndex = costIndex;
        this.popularity = popularity;
        this.imageUrl = imageUrl;
        this.currencyCode = currencyCode;
        this.currencySymbol = currencySymbol;
    }

    public CityResponse(Long id, String name, String country, String region, Double costIndex, Integer popularity, String imageUrl) {
        this(id, name, country, region, costIndex, popularity, imageUrl, "INR", "₹");
    }

    public static CityResponse fromEntity(City city) {
        if (city == null) return null;
        return new CityResponse(
                city.getId(),
                city.getName(),
                city.getCountry(),
                city.getRegion(),
                city.getCostIndex(),
                city.getPopularity(),
                city.getImageUrl(),
                city.getCurrencyCode(),
                city.getCurrencySymbol()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Double getCostIndex() { return costIndex; }
    public void setCostIndex(Double costIndex) { this.costIndex = costIndex; }

    public Integer getPopularity() { return popularity; }
    public void setPopularity(Integer popularity) { this.popularity = popularity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCurrencyCode() { return currencyCode; }
    public void setCurrencyCode(String currencyCode) { this.currencyCode = currencyCode; }

    public String getCurrencySymbol() { return currencySymbol; }
    public void setCurrencySymbol(String currencySymbol) { this.currencySymbol = currencySymbol; }
}
