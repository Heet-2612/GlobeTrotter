package com.globetrotter.dto;

public class PlaceResponse {

    private String placeId;
    private String name;
    private String formattedAddress;
    private Double latitude;
    private Double longitude;
    private Double rating;
    private String googleMapsUri;
    private String primaryType;
    private String photoUrl;

    public PlaceResponse() {
    }

    public PlaceResponse(String placeId, String name, String formattedAddress, Double latitude, Double longitude, Double rating, String googleMapsUri, String primaryType, String photoUrl) {
        this.placeId = placeId;
        this.name = name;
        this.formattedAddress = formattedAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
        this.googleMapsUri = googleMapsUri;
        this.primaryType = primaryType;
        this.photoUrl = photoUrl;
    }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getFormattedAddress() { return formattedAddress; }
    public void setFormattedAddress(String formattedAddress) { this.formattedAddress = formattedAddress; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getGoogleMapsUri() { return googleMapsUri; }
    public void setGoogleMapsUri(String googleMapsUri) { this.googleMapsUri = googleMapsUri; }

    public String getPrimaryType() { return primaryType; }
    public void setPrimaryType(String primaryType) { this.primaryType = primaryType; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
}
