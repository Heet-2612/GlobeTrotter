package com.globetrotter.controller;

import com.globetrotter.dto.TripBalanceResponse;
import com.globetrotter.entity.User;
import com.globetrotter.service.TripBalanceService;
import com.globetrotter.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/trips/{tripId}/balances")
public class TripBalanceController {

    private final TripBalanceService tripBalanceService;
    private final UserService userService;

    public TripBalanceController(TripBalanceService tripBalanceService, UserService userService) {
        this.tripBalanceService = tripBalanceService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<TripBalanceResponse> getTripBalances(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        TripBalanceResponse response = tripBalanceService.getTripBalances(tripId, currentUser);
        return ResponseEntity.ok(response);
    }
}
