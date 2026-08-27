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
        FALLBACK_DESTINATION_COORDINATES.put("new delhi", new double[]{28.6139, 77.2090});
        FALLBACK_DESTINATION_COORDINATES.put("agra", new double[]{27.1767, 78.0081});
        FALLBACK_DESTINATION_COORDINATES.put("mumbai", new double[]{19.0760, 72.8777});
        FALLBACK_DESTINATION_COORDINATES.put("varanasi", new double[]{25.3176, 82.9739});
        FALLBACK_DESTINATION_COORDINATES.put("udaipur", new double[]{24.5854, 73.7125});
        FALLBACK_DESTINATION_COORDINATES.put("ahmedabad", new double[]{23.0225, 72.5714});
        FALLBACK_DESTINATION_COORDINATES.put("hyderabad", new double[]{17.3850, 78.4867});
        FALLBACK_DESTINATION_COORDINATES.put("jaisalmer", new double[]{26.9157, 70.9083});
        FALLBACK_DESTINATION_COORDINATES.put("jodhpur", new double[]{26.2389, 73.0243});
        FALLBACK_DESTINATION_COORDINATES.put("kolkata", new double[]{22.5726, 88.3639});
        FALLBACK_DESTINATION_COORDINATES.put("amritsar", new double[]{31.6340, 74.8723});
        FALLBACK_DESTINATION_COORDINATES.put("goa", new double[]{15.2993, 74.1240});
        FALLBACK_DESTINATION_COORDINATES.put("bengaluru", new double[]{12.9716, 77.5946});
        FALLBACK_DESTINATION_COORDINATES.put("bangalore", new double[]{12.9716, 77.5946});
        FALLBACK_DESTINATION_COORDINATES.put("mysuru", new double[]{12.2958, 76.6394});
        FALLBACK_DESTINATION_COORDINATES.put("mysore", new double[]{12.2958, 76.6394});
        FALLBACK_DESTINATION_COORDINATES.put("hampi", new double[]{15.3350, 76.4600});
        FALLBACK_DESTINATION_COORDINATES.put("chennai", new double[]{13.0827, 80.2707});
        FALLBACK_DESTINATION_COORDINATES.put("kochi", new double[]{9.9312, 76.2673});
        FALLBACK_DESTINATION_COORDINATES.put("alleppey", new double[]{9.4981, 76.3388});
        FALLBACK_DESTINATION_COORDINATES.put("munnar", new double[]{10.0889, 77.0595});
        FALLBACK_DESTINATION_COORDINATES.put("srinagar", new double[]{34.0837, 74.7973});
        FALLBACK_DESTINATION_COORDINATES.put("ladakh", new double[]{34.1526, 77.5771});
        FALLBACK_DESTINATION_COORDINATES.put("leh", new double[]{34.1526, 77.5771});
        FALLBACK_DESTINATION_COORDINATES.put("statue-of-unity", new double[]{21.8380, 73.7191});
        FALLBACK_DESTINATION_COORDINATES.put("shimla", new double[]{31.1048, 77.1734});
        FALLBACK_DESTINATION_COORDINATES.put("manali", new double[]{32.2432, 77.1892});
        FALLBACK_DESTINATION_COORDINATES.put("rishikesh", new double[]{30.0869, 78.2676});
        FALLBACK_DESTINATION_COORDINATES.put("pune", new double[]{18.5204, 73.8567});
        FALLBACK_DESTINATION_COORDINATES.put("surat", new double[]{21.1702, 72.8311});
        FALLBACK_DESTINATION_COORDINATES.put("vadodara", new double[]{22.3072, 73.1812});
        FALLBACK_DESTINATION_COORDINATES.put("rajkot", new double[]{22.3039, 70.8022});
        FALLBACK_DESTINATION_COORDINATES.put("rann-of-kutch", new double[]{23.8329, 69.8398});
        FALLBACK_DESTINATION_COORDINATES.put("rann of kutch", new double[]{23.8329, 69.8398});
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
            } else {
                String nameKey = destination.getName() != null ? destination.getName().toLowerCase() : "";
                if (FALLBACK_DESTINATION_COORDINATES.containsKey(nameKey)) {
                    double[] coords = FALLBACK_DESTINATION_COORDINATES.get(nameKey);
                    lat = coords[0];
                    lon = coords[1];
                }
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
