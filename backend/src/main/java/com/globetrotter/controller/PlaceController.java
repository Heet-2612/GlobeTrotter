package com.globetrotter.controller;

import com.globetrotter.dto.ActivityResponse;
import com.globetrotter.dto.PlaceAutocompleteResponse;
import com.globetrotter.dto.PlaceResponse;
import com.globetrotter.exception.GooglePlacesApiException;
import com.globetrotter.exception.GooglePlacesConfigException;
import com.globetrotter.service.GooglePlacesService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/places")
@CrossOrigin(origins = "*")
public class PlaceController {

    private final GooglePlacesService googlePlacesService;

    public PlaceController(GooglePlacesService googlePlacesService) {
        this.googlePlacesService = googlePlacesService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<PlaceResponse>> searchPlaces(
            @RequestParam("city") String city,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "category", required = false) String category
    ) {
        List<PlaceResponse> results = googlePlacesService.searchPlaces(city, query, category);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<PlaceAutocompleteResponse>> autocomplete(
            @RequestParam(value = "city", required = false) String city,
            @RequestParam("input") String input
    ) {
        List<PlaceAutocompleteResponse> suggestions = googlePlacesService.autocomplete(city, input);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/{placeId}")
    public ResponseEntity<PlaceResponse> getPlaceDetails(@PathVariable("placeId") String placeId) {
        PlaceResponse place = googlePlacesService.getPlaceDetails(placeId);
        if (place == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(place);
    }

    @PostMapping("/convert-to-activity")
    public ResponseEntity<ActivityResponse> convertPlaceToActivity(
            @RequestParam("cityId") Long cityId,
            @RequestBody PlaceResponse placeResponse
    ) {
        ActivityResponse activityResponse = googlePlacesService.convertPlaceToActivity(cityId, placeResponse);
        return ResponseEntity.ok(activityResponse);
    }

    @ExceptionHandler(GooglePlacesConfigException.class)
    public ResponseEntity<Map<String, Object>> handleConfigException(GooglePlacesConfigException e) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "CONFIG_ERROR");
        body.put("message", e.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    @ExceptionHandler(GooglePlacesApiException.class)
    public ResponseEntity<Map<String, Object>> handleApiException(GooglePlacesApiException e) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "API_ERROR");
        body.put("message", e.getMessage());
        return ResponseEntity.status(e.getStatusCode()).body(body);
    }
}
