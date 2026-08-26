package com.globetrotter.client;

import com.globetrotter.dto.DiscoveredPlaceResponse;
import java.util.List;

public interface GeoapifyClient {

    boolean isConfigured();

    List<DiscoveredPlaceResponse> discoverPlaces(Double latitude, Double longitude, String query, String category, Integer radiusMeters);
}
