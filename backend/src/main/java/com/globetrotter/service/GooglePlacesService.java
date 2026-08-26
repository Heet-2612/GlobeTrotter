package com.globetrotter.service;

import com.globetrotter.client.GooglePlacesClient;
import com.globetrotter.dto.ActivityResponse;
import com.globetrotter.dto.PlaceAutocompleteResponse;
import com.globetrotter.dto.PlaceResponse;
import com.globetrotter.entity.Activity;
import com.globetrotter.entity.Destination;
import com.globetrotter.repository.ActivityRepository;
import com.globetrotter.repository.DestinationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GooglePlacesService {

    private static final Logger logger = LoggerFactory.getLogger(GooglePlacesService.class);

    private final GooglePlacesClient googlePlacesClient;
    private final DestinationRepository destinationRepository;
    private final ActivityRepository activityRepository;

    public GooglePlacesService(
            GooglePlacesClient googlePlacesClient,
            DestinationRepository destinationRepository,
            ActivityRepository activityRepository
    ) {
        this.googlePlacesClient = googlePlacesClient;
        this.destinationRepository = destinationRepository;
        this.activityRepository = activityRepository;
    }

    public List<PlaceResponse> searchPlaces(String cityName, String query, String category) {
        if (cityName == null || cityName.isBlank()) {
            throw new IllegalArgumentException("City/Destination name is required for searching places.");
        }

        StringBuilder searchQuery = new StringBuilder();
        if (query != null && !query.isBlank()) {
            searchQuery.append(query.trim());
        }
        if (category != null && !category.isBlank()) {
            if (searchQuery.length() > 0) searchQuery.append(" ");
            searchQuery.append(category.trim());
        }

        if (searchQuery.length() == 0) {
            searchQuery.append("tourist attractions");
        }

        String fullQuery = searchQuery.toString() + " in " + cityName.trim();

        if (!googlePlacesClient.isConfigured()) {
            logger.warn("Google Places API key is not configured. Returning empty list.");
            return new ArrayList<>();
        }

        return googlePlacesClient.searchText(fullQuery);
    }

    public List<PlaceAutocompleteResponse> autocomplete(String input, String cityContext) {
        if (input == null || input.isBlank()) {
            return new ArrayList<>();
        }

        if (!googlePlacesClient.isConfigured()) {
            logger.warn("Google Places API key is not configured. Returning empty autocomplete list.");
            return new ArrayList<>();
        }

        return googlePlacesClient.autocomplete(input, cityContext);
    }

    public PlaceResponse getPlaceDetails(String placeId) {
        if (placeId == null || placeId.isBlank()) {
            throw new IllegalArgumentException("Place ID is required.");
        }
        return googlePlacesClient.getPlaceDetails(placeId);
    }

    @Transactional
    public ActivityResponse convertPlaceToActivity(Long destinationId, PlaceResponse place) {
        if (destinationId == null || place == null || place.getPlaceId() == null) {
            throw new IllegalArgumentException("Destination ID and Place details with valid placeId are required.");
        }

        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new IllegalArgumentException("Destination with ID " + destinationId + " not found."));

        // Check if an activity for this google_place_id already exists in this destination
        Optional<Activity> existingActivity = activityRepository.findByDestinationIdAndGooglePlaceId(destinationId, place.getPlaceId());
        if (existingActivity.isPresent()) {
            return ActivityResponse.fromEntity(existingActivity.get());
        }

        String category = mapPrimaryTypeToCategory(place.getPrimaryType());
        String currency = destination.getCurrencyCode() != null ? destination.getCurrencyCode() : "INR";

        Activity activity = Activity.builder()
                .destination(destination)
                .name(place.getName() != null ? place.getName() : "Discovered Attraction")
                .description(place.getFormattedAddress() != null ? place.getFormattedAddress() : "Discovered via Google Places")
                .category(category)
                .estimatedDurationMinutes(60)
                .estimatedCost(0.0)
                .currency(currency)
                .googlePlaceId(place.getPlaceId())
                .build();

        Activity savedActivity = activityRepository.save(activity);
        return ActivityResponse.fromEntity(savedActivity);
    }

    private String mapPrimaryTypeToCategory(String primaryType) {
        if (primaryType == null) return "SIGHTSEEING";
        String type = primaryType.toLowerCase();

        if (type.contains("restaurant") || type.contains("food") || type.contains("cafe") || type.contains("bakery")) {
            return "FOOD";
        } else if (type.contains("museum") || type.contains("art_gallery") || type.contains("church") || type.contains("place_of_worship") || type.contains("hindu_temple") || type.contains("mosque")) {
            return "CULTURE";
        } else if (type.contains("park") || type.contains("natural_feature") || type.contains("beach") || type.contains("hiking")) {
            return "RELAXATION";
        } else if (type.contains("amusement_park") || type.contains("zoo") || type.contains("aquarium")) {
            return "ENTERTAINMENT";
        } else if (type.contains("night_club") || type.contains("bar")) {
            return "NIGHTLIFE";
        } else if (type.contains("shopping_mall") || type.contains("store")) {
            return "SHOPPING";
        }
        return "SIGHTSEEING";
    }
}
