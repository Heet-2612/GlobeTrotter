package com.globetrotter.controller;

import com.globetrotter.dto.DestinationResponse;
import com.globetrotter.service.DestinationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
public class DestinationController {

    private final DestinationService destinationService;

    public DestinationController(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @GetMapping
    public ResponseEntity<List<DestinationResponse>> searchDestinations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) Long regionId) {
        List<DestinationResponse> response = destinationService.searchDestinations(search, country, region, regionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{destinationId}")
    public ResponseEntity<DestinationResponse> getDestinationById(@PathVariable Long destinationId) {
        DestinationResponse response = destinationService.getDestinationById(destinationId);
        return ResponseEntity.ok(response);
    }
}
