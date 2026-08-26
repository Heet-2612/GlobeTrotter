package com.globetrotter.client;

import com.globetrotter.dto.PlaceAutocompleteResponse;
import com.globetrotter.dto.PlaceResponse;

import java.util.List;

public interface GooglePlacesClient {
    boolean isConfigured();
    List<PlaceResponse> searchText(String textQuery);
    PlaceResponse getPlaceDetails(String placeId);
    List<PlaceAutocompleteResponse> autocomplete(String input, String cityContext);
}
