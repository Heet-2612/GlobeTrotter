package com.globetrotter.controller;

import com.globetrotter.dto.TripAnalyticsResponse;
import com.globetrotter.entity.ExpenseCategory;
import com.globetrotter.entity.User;
import com.globetrotter.service.TripAnalyticsService;
import com.globetrotter.service.UserService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/trips/{tripId}/analytics")
public class TripAnalyticsController {

    private final TripAnalyticsService tripAnalyticsService;
    private final UserService userService;

    public TripAnalyticsController(TripAnalyticsService tripAnalyticsService, UserService userService) {
        this.tripAnalyticsService = tripAnalyticsService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<TripAnalyticsResponse> getTripAnalytics(
            @PathVariable Long tripId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) ExpenseCategory category,
            @RequestParam(required = false) Long memberId,
            @RequestParam(required = false) String source,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        TripAnalyticsResponse response = tripAnalyticsService.getTripAnalytics(tripId, from, to, category, memberId, source, currentUser);
        return ResponseEntity.ok(response);
    }
}
