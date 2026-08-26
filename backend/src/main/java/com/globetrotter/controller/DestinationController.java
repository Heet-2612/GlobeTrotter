package com.globetrotter.controller;

import com.globetrotter.dto.ActivityResponse;
import com.globetrotter.dto.DestinationResponse;
import com.globetrotter.dto.DiscoveredPlaceResponse;
import com.globetrotter.service.ActivityService;
import com.globetrotter.service.DestinationService;
import com.globetrotter.service.GeoapifyDiscoveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;
    private final ActivityService activityService;
    private final GeoapifyDiscoveryService geoapifyDiscoveryService;

    public DestinationController(DestinationService destinationService, ActivityService activityService, GeoapifyDiscoveryService geoapifyDiscoveryService) {
        this.destinationService = destinationService;
        this.activityService = activityService;
        this.geoapifyDiscoveryService = geoapifyDiscoveryService;
    }

    @GetMapping
    public ResponseEntity<List<DestinationResponse>> searchDestinations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Long regionId,
            @RequestParam(required = false) Boolean curated) {
        List<DestinationResponse> response = destinationService.searchDestinations(search, country, region, regionId, curated);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{destinationId}")
    public ResponseEntity<DestinationResponse> getDestinationById(@PathVariable Long destinationId) {
        DestinationResponse response = destinationService.getDestinationById(destinationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{destinationId}/activities")
    public ResponseEntity<List<ActivityResponse>> getActivitiesByDestinationId(@PathVariable Long destinationId) {
        List<ActivityResponse> response = activityService.searchActivities(destinationId, null, null);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{destinationId}/activities/curated")
    public ResponseEntity<List<ActivityResponse>> getCuratedActivitiesByDestinationId(@PathVariable Long destinationId) {
        List<ActivityResponse> response = activityService.getCuratedActivitiesForDestination(destinationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{destinationId}/discover")
    public ResponseEntity<List<DiscoveredPlaceResponse>> discoverPlaces(
            @PathVariable Long destinationId,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "5000") Integer radius) {
        List<DiscoveredPlaceResponse> response = geoapifyDiscoveryService.discoverPlacesForDestination(destinationId, query, category, radius);
        return ResponseEntity.ok(response);
    }
}
