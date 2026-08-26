package com.globetrotter.dto;

import com.globetrotter.entity.Destination;

public class CityResponse extends DestinationResponse {

    public CityResponse() {
        super();
    }

    public CityResponse(Long id, String name, String country, String region, Double costIndex, Integer popularity, String imageUrl, String currencyCode, String currencySymbol) {
        super(id, name, name != null ? name.toLowerCase() : null, country, null, region, null, null, true, costIndex, popularity, imageUrl, currencyCode, currencySymbol, null, null, null);
    }

    public CityResponse(Long id, String name, String country, String region, Double costIndex, Integer popularity, String imageUrl) {
        this(id, name, country, region, costIndex, popularity, imageUrl, "INR", "₹");
    }

    public static CityResponse fromEntity(Destination destination) {
        if (destination == null) return null;
        return new CityResponse(
                destination.getId(),
                destination.getName(),
                destination.getCountry(),
                destination.getRegion(),
                destination.getCostIndex(),
                destination.getPopularity(),
                destination.getImageUrl(),
                destination.getCurrencyCode(),
                destination.getCurrencySymbol()
        );
    }

    public static CityResponse fromDestination(Destination destination) {
        return fromEntity(destination);
    }
}
