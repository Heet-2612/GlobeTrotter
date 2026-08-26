package com.globetrotter.dto;

public class PlaceAutocompleteResponse {

    private String placeId;
    private String text;
    private String secondaryText;

    public PlaceAutocompleteResponse() {
    }

    public PlaceAutocompleteResponse(String placeId, String text, String secondaryText) {
        this.placeId = placeId;
        this.text = text;
        this.secondaryText = secondaryText;
    }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getSecondaryText() { return secondaryText; }
    public void setSecondaryText(String secondaryText) { this.secondaryText = secondaryText; }
}
