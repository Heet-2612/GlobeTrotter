package com.globetrotter.service;

import com.globetrotter.client.GooglePlacesClient;
import com.globetrotter.dto.ActivityResponse;
import com.globetrotter.dto.PlaceAutocompleteResponse;
import com.globetrotter.dto.PlaceResponse;
import com.globetrotter.entity.Activity;
import com.globetrotter.entity.City;
import com.globetrotter.repository.ActivityRepository;
import com.globetrotter.repository.CityRepository;
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
    private final CityRepository cityRepository;
    private final ActivityRepository activityRepository;

    public GooglePlacesService(
            GooglePlacesClient googlePlacesClient,
            CityRepository cityRepository,
            ActivityRepository activityRepository
    ) {
        this.googlePlacesClient = googlePlacesClient;
        this.cityRepository = cityRepository;
        this.activityRepository = activityRepository;
    }

    public List<PlaceResponse> searchPlaces(String cityName, String query, String category) {
        if (cityName == null || cityName.isBlank()) {
            return new ArrayList<>();
        }

        String searchContext = constructContextQuery(cityName, query, category);
        logger.info("Executing Google Places search with context query: '{}'", searchContext);
        return googlePlacesClient.searchText(searchContext);
    }

    public List<PlaceAutocompleteResponse> autocomplete(String cityName, String input) {
        if (input == null || input.trim().length() < 2) {
            return new ArrayList<>();
        }
        return googlePlacesClient.autocomplete(input.trim(), cityName);
    }

    public PlaceResponse getPlaceDetails(String placeId) {
        if (placeId == null || placeId.isBlank()) {
            return null;
        }
        return googlePlacesClient.getPlaceDetails(placeId);
    }

    @Transactional
    public ActivityResponse convertPlaceToActivity(Long cityId, PlaceResponse place) {
        if (cityId == null || place == null || place.getPlaceId() == null) {
            throw new IllegalArgumentException("City ID and Place details with valid placeId are required.");
        }

        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new IllegalArgumentException("City with ID " + cityId + " not found."));

        // Check if an activity for this google_place_id already exists in this city
        Optional<Activity> existingActivity = activityRepository.findByCityIdAndGooglePlaceId(cityId, place.getPlaceId());
        if (existingActivity.isPresent()) {
            return ActivityResponse.fromEntity(existingActivity.get());
        }

        String category = mapPrimaryTypeToCategory(place.getPrimaryType());
        String currency = city.getCurrencyCode() != null ? city.getCurrencyCode() : "INR";

        Activity activity = Activity.builder()
                .city(city)
                .name(place.getName() != null ? place.getName() : "Discovered Attraction")
                .description(place.getFormattedAddress() != null ? place.getFormattedAddress() : "Discovered via Google Places")
                .category(category)
                .estimatedDurationMinutes(60)
                .estimatedCost(0.0)
                .currency(currency)
                .googlePlaceId(place.getPlaceId())
                .build();

        Activity savedActivity = activityRepository.save(activity);
        logger.info("Created new Activity entity (ID {}) from Google Place ID '{}'", savedActivity.getId(), place.getPlaceId());

        return ActivityResponse.fromEntity(savedActivity);
    }

    public String constructContextQuery(String cityName, String rawQuery, String category) {
        StringBuilder sb = new StringBuilder();

        if (rawQuery != null && !rawQuery.isBlank()) {
            sb.append(rawQuery.trim());
        } else if (category != null && !category.isBlank()) {
            sb.append(mapCategoryToQueryTerms(category));
        } else {
            sb.append("top attractions");
        }

        sb.append(" in ").append(cityName.trim());
        sb.append(", India");

        return sb.toString();
    }

    private String mapCategoryToQueryTerms(String category) {
        if (category == null) return "attractions";
        switch (category.trim().toLowerCase()) {
            case "culture": return "museums, temples, and historical landmarks";
            case "nature": return "parks, lakes, gardens, and viewpoints";
            case "food": return "restaurants, cafes, and local food";
            case "shopping": return "markets and shopping centers";
            case "adventure": return "adventure activities";
            case "nightlife": return "bars and nightlife venues";
            case "relaxation": return "spa, wellness, and quiet gardens";
            case "sightseeing": return "famous landmarks and sightseeing";
            default: return "tourist attractions";
        }
    }

    private String mapPrimaryTypeToCategory(String primaryType) {
        if (primaryType == null) return "Sightseeing";
        String lower = primaryType.toLowerCase();
        if (lower.contains("museum") || lower.contains("temple") || lower.contains("church") || lower.contains("monument") || lower.contains("historical")) {
            return "Culture";
        } else if (lower.contains("park") || lower.contains("lake") || lower.contains("garden") || lower.contains("mountain") || lower.contains("nature")) {
            return "Nature";
        } else if (lower.contains("restaurant") || lower.contains("cafe") || lower.contains("food") || lower.contains("bakery")) {
            return "Food";
        } else if (lower.contains("store") || lower.contains("shopping") || lower.contains("market") || lower.contains("mall")) {
            return "Shopping";
        } else if (lower.contains("bar") || lower.contains("night_club")) {
            return "Nightlife";
        }
        return "Sightseeing";
    }
}
