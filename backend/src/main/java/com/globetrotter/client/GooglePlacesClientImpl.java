package com.globetrotter.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetrotter.dto.PlaceAutocompleteResponse;
import com.globetrotter.dto.PlaceResponse;
import com.globetrotter.exception.GooglePlacesApiException;
import com.globetrotter.exception.GooglePlacesConfigException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GooglePlacesClientImpl implements GooglePlacesClient {

    private static final Logger logger = LoggerFactory.getLogger(GooglePlacesClientImpl.class);
    private static final String GOOGLE_PLACES_BASE_URL = "https://places.googleapis.com/v1";

    private final String apiKey;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GooglePlacesClientImpl(
            @Value("${google.places.api-key:${GOOGLE_MAPS_API_KEY:}}") String apiKey,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.restClient = RestClient.builder()
                .baseUrl(GOOGLE_PLACES_BASE_URL)
                .build();
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean isConfigured() {
        return !apiKey.isEmpty();
    }

    @Override
    public List<PlaceResponse> searchText(String textQuery) {
        if (!isConfigured()) {
            throw new GooglePlacesConfigException("Google Places API is not configured. Please set GOOGLE_MAPS_API_KEY in .env.");
        }

        try {
            Map<String, Object> body = new HashMap<>();
            body.put("textQuery", textQuery);

            String responseString = restClient.post()
                    .uri("/places:searchText")
                    .header("X-Goog-Api-Key", apiKey)
                    .header("X-Goog-FieldMask", "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.googleMapsUri,places.primaryType")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            return parseTextSearchResponse(responseString);
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            handleHttpError(e);
            return new ArrayList<>();
        } catch (Exception e) {
            logger.error("Network or execution error calling Google Places searchText: {}", e.getMessage());
            throw new GooglePlacesApiException(500, "Unable to connect to Google Places API. Please check your network connection.");
        }
    }

    @Override
    public PlaceResponse getPlaceDetails(String placeId) {
        if (!isConfigured()) {
            throw new GooglePlacesConfigException("Google Places API is not configured. Please set GOOGLE_MAPS_API_KEY in .env.");
        }

        try {
            String responseString = restClient.get()
                    .uri("/places/{placeId}", placeId)
                    .header("X-Goog-Api-Key", apiKey)
                    .header("X-Goog-FieldMask", "id,displayName,formattedAddress,location,rating,googleMapsUri,primaryType")
                    .retrieve()
                    .body(String.class);

            return parsePlaceDetailsNode(objectMapper.readTree(responseString));
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            handleHttpError(e);
            return null;
        } catch (Exception e) {
            logger.error("Network or execution error calling Google Places getPlaceDetails: {}", e.getMessage());
            throw new GooglePlacesApiException(500, "Unable to connect to Google Places API. Please check your network connection.");
        }
    }

    @Override
    public List<PlaceAutocompleteResponse> autocomplete(String input, String cityContext) {
        if (!isConfigured()) {
            throw new GooglePlacesConfigException("Google Places API is not configured. Please set GOOGLE_MAPS_API_KEY in .env.");
        }

        try {
            Map<String, Object> body = new HashMap<>();
            String fullInput = (cityContext != null && !cityContext.isBlank())
                    ? input + " in " + cityContext
                    : input;
            body.put("input", fullInput);

            String responseString = restClient.post()
                    .uri("/places:autocomplete")
                    .header("X-Goog-Api-Key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            return parseAutocompleteResponse(responseString, input);
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            handleHttpError(e);
            return new ArrayList<>();
        } catch (Exception e) {
            logger.error("Network or execution error calling Google Places autocomplete: {}", e.getMessage());
            throw new GooglePlacesApiException(500, "Unable to connect to Google Places API. Please check your network connection.");
        }
    }

    private void handleHttpError(Exception e) {
        int statusCode = 500;
        if (e instanceof HttpClientErrorException) {
            statusCode = ((HttpClientErrorException) e).getStatusCode().value();
        } else if (e instanceof HttpServerErrorException) {
            statusCode = ((HttpServerErrorException) e).getStatusCode().value();
        }

        logger.error("Google Places API HTTP error (status {}): {}", statusCode, e.getMessage());

        if (statusCode == 401 || statusCode == 403) {
            throw new GooglePlacesApiException(statusCode, "Google Places API key is invalid or unauthorized (HTTP " + statusCode + ").");
        } else if (statusCode == 429) {
            throw new GooglePlacesApiException(429, "Google Places API quota or billing limit exceeded (HTTP 429).");
        } else if (statusCode == 400) {
            throw new GooglePlacesApiException(400, "Google Places API request invalid (HTTP 400).");
        } else {
            throw new GooglePlacesApiException(statusCode, "Google Places API service error (HTTP " + statusCode + ").");
        }
    }

    private List<PlaceResponse> parseTextSearchResponse(String jsonString) {
        List<PlaceResponse> results = new ArrayList<>();
        if (jsonString == null || jsonString.isBlank()) return results;

        try {
            JsonNode root = objectMapper.readTree(jsonString);
            JsonNode placesNode = root.get("places");
            if (placesNode != null && placesNode.isArray()) {
                for (JsonNode placeNode : placesNode) {
                    PlaceResponse p = parsePlaceDetailsNode(placeNode);
                    if (p != null) results.add(p);
                }
            }
        } catch (Exception e) {
            logger.error("Error parsing text search response: {}", e.getMessage());
        }
        return results;
    }

    private PlaceResponse parsePlaceDetailsNode(JsonNode node) {
        if (node == null || node.isMissingNode()) return null;

        String id = node.path("id").asText(null);
        if (id == null || id.isBlank()) return null;

        String name = node.path("displayName").path("text").asText("Discovered Place");
        String formattedAddress = node.path("formattedAddress").asText("Address unavailable");

        Double lat = node.path("location").has("latitude") ? node.path("location").get("latitude").asDouble() : null;
        Double lng = node.path("location").has("longitude") ? node.path("location").get("longitude").asDouble() : null;

        Double rating = node.has("rating") ? node.get("rating").asDouble() : null;
        String googleMapsUri = node.path("googleMapsUri").asText(null);
        String primaryType = node.path("primaryType").asText("attraction");

        return new PlaceResponse(id, name, formattedAddress, lat, lng, rating, googleMapsUri, primaryType, null);
    }

    private List<PlaceAutocompleteResponse> parseAutocompleteResponse(String jsonString, String fallbackInput) {
        List<PlaceAutocompleteResponse> suggestions = new ArrayList<>();
        if (jsonString == null || jsonString.isBlank()) return suggestions;

        try {
            JsonNode root = objectMapper.readTree(jsonString);
            JsonNode suggestionsNode = root.get("suggestions");
            if (suggestionsNode != null && suggestionsNode.isArray()) {
                for (JsonNode sug : suggestionsNode) {
                    JsonNode placePrediction = sug.get("placePrediction");
                    if (placePrediction != null) {
                        String placeId = placePrediction.path("placeId").asText(null);
                        String text = placePrediction.path("structuredFormat").path("mainText").path("text").asText(
                                placePrediction.path("text").path("text").asText(fallbackInput)
                        );
                        String secText = placePrediction.path("structuredFormat").path("secondaryText").path("text").asText("");

                        if (placeId != null) {
                            suggestions.add(new PlaceAutocompleteResponse(placeId, text, secText));
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error parsing autocomplete response: {}", e.getMessage());
        }
        return suggestions;
    }
}
