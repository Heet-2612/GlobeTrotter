package com.globetrotter.service;

import com.globetrotter.client.GeoapifyClient;
import com.globetrotter.dto.DiscoveredPlaceResponse;
import com.globetrotter.entity.Destination;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.DestinationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeoapifyDiscoveryService {

    private final DestinationRepository destinationRepository;
    private final GeoapifyClient geoapifyClient;

    private static final Map<String, double[]> FALLBACK_DESTINATION_COORDINATES = new HashMap<>();

    static {
        // Fallback coordinates for major curated destinations (lat, lon)
        FALLBACK_DESTINATION_COORDINATES.put("jaipur", new double[]{26.9124, 75.7873});
        FALLBACK_DESTINATION_COORDINATES.put("delhi", new double[]{28.6139, 77.2090});
        FALLBACK_DESTINATION_COORDINATES.put("agra", new double[]{27.1767, 78.0081});
        FALLBACK_DESTINATION_COORDINATES.put("mumbai", new double[]{19.0760, 72.8777});
        FALLBACK_DESTINATION_COORDINATES.put("varanasi", new double[]{25.3176, 82.9739});
        FALLBACK_DESTINATION_COORDINATES.put("udaipur", new double[]{24.5854, 73.7125});
        FALLBACK_DESTINATION_COORDINATES.put("goa", new double[]{15.2993, 74.1240});
        FALLBACK_DESTINATION_COORDINATES.put("bengaluru", new double[]{12.9716, 77.5946});
        FALLBACK_DESTINATION_COORDINATES.put("mysuru", new double[]{12.2958, 76.6394});
        FALLBACK_DESTINATION_COORDINATES.put("hampi", new double[]{15.3350, 76.4600});
        FALLBACK_DESTINATION_COORDINATES.put("chennai", new double[]{13.0827, 80.2707});
        FALLBACK_DESTINATION_COORDINATES.put("kochi", new double[]{9.9312, 76.2673});
        FALLBACK_DESTINATION_COORDINATES.put("munnar", new double[]{10.0889, 77.0595});
        FALLBACK_DESTINATION_COORDINATES.put("srinagar", new double[]{34.0837, 74.7973});
        FALLBACK_DESTINATION_COORDINATES.put("ladakh", new double[]{34.1526, 77.5771});
        FALLBACK_DESTINATION_COORDINATES.put("statue-of-unity", new double[]{21.8380, 73.7191});
    }

    public GeoapifyDiscoveryService(DestinationRepository destinationRepository, GeoapifyClient geoapifyClient) {
        this.destinationRepository = destinationRepository;
        this.geoapifyClient = geoapifyClient;
    }

    @Transactional(readOnly = true)
    public List<DiscoveredPlaceResponse> discoverPlacesForDestination(Long destinationId, String query, String category, Integer radiusMeters) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + destinationId));

        Double lat = destination.getLatitude();
        Double lon = destination.getLongitude();

        if (lat == null || lon == null) {
            String key = destination.getCanonicalName() != null ? destination.getCanonicalName().toLowerCase() : "";
            if (FALLBACK_DESTINATION_COORDINATES.containsKey(key)) {
                double[] coords = FALLBACK_DESTINATION_COORDINATES.get(key);
                lat = coords[0];
                lon = coords[1];
            }
        }

        if (lat == null || lon == null) {
            throw new IllegalArgumentException("Live discovery is unavailable for destination '" + destination.getName() + "' because latitude and longitude coordinates are missing.");
        }

        if (!geoapifyClient.isConfigured()) {
            throw new IllegalStateException("Geoapify API key is not configured. Please set GEOAPIFY_API_KEY in environment configuration.");
        }

        return geoapifyClient.discoverPlaces(lat, lon, query, category, radiusMeters);
    }
}
