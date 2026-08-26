package com.globetrotter.entity;

@Deprecated
public class City extends Destination {

    public City() {
        super();
    }

    public City(Long id, String name, String country, String region, Double costIndex, Integer popularity, String imageUrl, String currencyCode, String currencySymbol) {
        super(id, null, name, name != null ? name.toLowerCase() : null, country, region, DestinationType.CITY, DestinationSource.CURATED, true, costIndex, popularity, imageUrl, currencyCode, currencySymbol, null, null);
    }

    public City(Long id, String name, String country, String region, Double costIndex, Integer popularity, String imageUrl) {
        this(id, name, country, region, costIndex, popularity, imageUrl, "INR", "₹");
    }
}
