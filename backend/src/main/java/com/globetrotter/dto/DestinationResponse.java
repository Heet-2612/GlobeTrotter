package com.globetrotter.dto;

import com.globetrotter.entity.Destination;
import com.globetrotter.entity.DestinationAlias;
import com.globetrotter.entity.DestinationSource;
import com.globetrotter.entity.DestinationType;

import java.util.List;
import java.util.stream.Collectors;

public class DestinationResponse {

    private Long id;
    private String name;
    private String canonicalName;
    private String country;
    private Long regionId;
    private String regionName;
    private String region;
    private DestinationType destinationType;
    private DestinationSource source;
    private Boolean isCurated;
    private Double costIndex;
    private Integer popularity;
    private String imageUrl;
    private String currencyCode;
    private String currencySymbol;
    private Double latitude;
    private Double longitude;
    private List<String> aliases;

    public DestinationResponse() {
    }

    public DestinationResponse(Long id, String name, String canonicalName, String country, Long regionId, String regionName, DestinationType destinationType, DestinationSource source, Boolean isCurated, Double costIndex, Integer popularity, String imageUrl, String currencyCode, String currencySymbol, Double latitude, Double longitude, List<String> aliases) {
        this.id = id;
        this.name = name;
        this.canonicalName = canonicalName;
        this.country = country;
        this.regionId = regionId;
        this.regionName = regionName;
        this.region = regionName != null ? regionName : "India";
        this.destinationType = destinationType != null ? destinationType : DestinationType.CITY;
        this.source = source != null ? source : DestinationSource.CURATED;
        this.isCurated = isCurated != null ? isCurated : true;
        this.costIndex = costIndex != null ? costIndex : 1.0;
        this.popularity = popularity != null ? popularity : 50;
        this.imageUrl = imageUrl;
        this.currencyCode = currencyCode != null ? currencyCode : "INR";
        this.currencySymbol = currencySymbol != null ? currencySymbol : "₹";
        this.latitude = latitude;
        this.longitude = longitude;
        this.aliases = aliases;
    }

    public static DestinationResponse fromEntity(Destination destination) {
        if (destination == null) return null;
        List<String> aliasList = (destination.getAliases() != null)
                ? destination.getAliases().stream().map(DestinationAlias::getAliasName).collect(Collectors.toList())
                : null;

        Long regId = (destination.getRegionEntity() != null) ? destination.getRegionEntity().getId() : null;
        String regName = destination.getRegion();

        return new DestinationResponse(
                destination.getId(),
                destination.getName(),
                destination.getCanonicalName(),
                destination.getCountry(),
                regId,
                regName,
                destination.getDestinationType(),
                destination.getSource(),
                destination.getIsCurated(),
                destination.getCostIndex(),
                destination.getPopularity(),
                destination.getImageUrl(),
                destination.getCurrencyCode(),
                destination.getCurrencySymbol(),
                destination.getLatitude(),
                destination.getLongitude(),
                aliasList
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

    public Long getRegionId() { return regionId; }
    public void setRegionId(Long regionId) { this.regionId = regionId; }

    public String getRegionName() { return regionName; }
    public void setRegionName(String regionName) { this.regionName = regionName; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public DestinationType getDestinationType() { return destinationType; }
    public void setDestinationType(DestinationType destinationType) { this.destinationType = destinationType; }

    public DestinationSource getSource() { return source; }
    public void setSource(DestinationSource source) { this.source = source; }

    public Boolean getIsCurated() { return isCurated; }
    public void setIsCurated(Boolean isCurated) { this.isCurated = isCurated; }

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

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public List<String> getAliases() { return aliases; }
    public void setAliases(List<String> aliases) { this.aliases = aliases; }
}
