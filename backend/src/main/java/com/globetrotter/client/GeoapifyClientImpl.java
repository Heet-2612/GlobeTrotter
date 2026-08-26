package com.globetrotter.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetrotter.dto.DiscoveredPlaceResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Component
public class GeoapifyClientImpl implements GeoapifyClient {

    private static final Logger logger = LoggerFactory.getLogger(GeoapifyClientImpl.class);
    private static final String GEOAPIFY_BASE_URL = "https://api.geoapify.com";

    private final String apiKey;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeoapifyClientImpl(
            @Value("${geoapify.api-key:${GEOAPIFY_API_KEY:${VITE_GEOAPIFY_API_KEY:}}}") String apiKey,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.restClient = RestClient.builder()
                .baseUrl(GEOAPIFY_BASE_URL)
                .build();
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean isConfigured() {
        return !apiKey.isEmpty();
    }

    @Override
    public List<DiscoveredPlaceResponse> discoverPlaces(Double latitude, Double longitude, String query, String category, Integer radiusMeters) {
        if (!isConfigured()) {
            throw new IllegalStateException("Geoapify Places API key is missing or not configured.");
        }

        if (latitude == null || longitude == null) {
            throw new IllegalArgumentException("Latitude and longitude coordinates are required for live place discovery.");
        }

        int radius = (radiusMeters != null && radiusMeters > 0) ? radiusMeters : 5000;
        String filter = String.format("circle:%f,%f,%d", longitude, latitude, radius);
        String bias = String.format("proximity:%f,%f", longitude, latitude);

        String categoriesParam = resolveGeoapifyCategories(category);

        StringBuilder uriBuilder = new StringBuilder("/v2/places?");
        uriBuilder.append("filter=").append(filter);
        uriBuilder.append("&bias=").append(bias);

        if (categoriesParam != null && !categoriesParam.isBlank()) {
            uriBuilder.append("&categories=").append(categoriesParam);
        }

        if (query != null && !query.trim().isEmpty()) {
            uriBuilder.append("&text=").append(encodeParam(query.trim()));
        }

        uriBuilder.append("&limit=20");
        uriBuilder.append("&apiKey=").append(apiKey);

        try {
            String jsonResponse = restClient.get()
                    .uri(uriBuilder.toString())
                    .retrieve()
                    .body(String.class);

            return parseGeoapifyResponse(jsonResponse);
        } catch (Exception e) {
            logger.error("Error executing Geoapify place discovery request: {}", e.getMessage());
            throw new RuntimeException("Geoapify place discovery service failed: " + e.getMessage());
        }
    }

    private List<DiscoveredPlaceResponse> parseGeoapifyResponse(String jsonResponse) {
        List<DiscoveredPlaceResponse> results = new ArrayList<>();
        if (jsonResponse == null || jsonResponse.isBlank()) {
            return results;
        }

        try {
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode features = root.get("features");
            if (features != null && features.isArray()) {
                for (JsonNode feature : features) {
                    JsonNode properties = feature.get("properties");
                    if (properties == null) continue;

                    String placeId = properties.hasNonNull("place_id") ? properties.get("place_id").asText() : null;
                    String name = properties.hasNonNull("name") ? properties.get("name").asText() : null;
                    if (name == null || name.isBlank()) {
                        name = properties.hasNonNull("address_line1") ? properties.get("address_line1").asText() : "Discovered Location";
                    }

                    String formattedAddress = properties.hasNonNull("formatted") ? properties.get("formatted").asText() : "";
                    Double lat = properties.hasNonNull("lat") ? properties.get("lat").asDouble() : null;
                    Double lon = properties.hasNonNull("lon") ? properties.get("lon").asDouble() : null;

                    String normalizedCategory = "SIGHTSEEING";
                    if (properties.has("categories") && properties.get("categories").isArray()) {
                        normalizedCategory = mapGeoapifyCategory(properties.get("categories"));
                    }

                    DiscoveredPlaceResponse place = new DiscoveredPlaceResponse();
                    place.setId(placeId);
                    place.setExternalId(placeId);
                    place.setName(name);
                    place.setDescription(formattedAddress);
                    place.setAddress(formattedAddress);
                    place.setCategory(normalizedCategory);
                    place.setLatitude(lat);
                    place.setLongitude(lon);

                    results.add(place);
                }
            }
        } catch (Exception e) {
            logger.error("Error parsing Geoapify response payload", e);
        }

        return results;
    }

    private String resolveGeoapifyCategories(String inputCategory) {
        if (inputCategory == null || inputCategory.isBlank()) {
            return "tourism,entertainment,catering,commercial,leisure,natural";
        }
        String cat = inputCategory.toLowerCase().trim();
        switch (cat) {
            case "culture":
            case "heritage":
            case "tourism":
                return "tourism,entertainment";
            case "food":
            case "catering":
            case "restaurant":
                return "catering";
            case "nature":
            case "leisure":
            case "park":
                return "natural,leisure";
            case "shopping":
            case "commercial":
                return "commercial";
            case "adventure":
                return "leisure,natural,tourism";
            default:
                return "tourism,entertainment,catering,commercial,leisure,natural";
        }
    }

    private String mapGeoapifyCategory(JsonNode categoriesArray) {
        String catsString = categoriesArray.toString().toLowerCase();
        if (catsString.contains("catering") || catsString.contains("restaurant") || catsString.contains("cafe")) {
            return "FOOD";
        }
        if (catsString.contains("museum") || catsString.contains("historic") || catsString.contains("building.historic") || catsString.contains("monument")) {
            return "CULTURE";
        }
        if (catsString.contains("natural") || catsString.contains("park") || catsString.contains("garden") || catsString.contains("beach")) {
            return "NATURE";
        }
        if (catsString.contains("commercial") || catsString.contains("shopping") || catsString.contains("mall")) {
            return "SHOPPING";
        }
        if (catsString.contains("leisure") || catsString.contains("sport") || catsString.contains("entertainment")) {
            return "ADVENTURE";
        }
        return "SIGHTSEEING";
    }

    private String encodeParam(String val) {
        try {
            return java.net.URLEncoder.encode(val, java.nio.charset.StandardCharsets.UTF_8.name());
        } catch (Exception e) {
            return val;
        }
    }
}
