package com.globetrotter.controller;

import com.globetrotter.dto.CreateSettlementRequest;
import com.globetrotter.dto.SettlementResponse;
import com.globetrotter.entity.User;
import com.globetrotter.service.TripSettlementService;
import com.globetrotter.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/settlements")
public class TripSettlementController {

    private final TripSettlementService tripSettlementService;
    private final UserService userService;

    public TripSettlementController(TripSettlementService tripSettlementService, UserService userService) {
        this.tripSettlementService = tripSettlementService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<SettlementResponse> createSettlement(
            @PathVariable Long tripId,
            @Valid @RequestBody CreateSettlementRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        SettlementResponse response = tripSettlementService.createSettlement(tripId, request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<SettlementResponse>> getTripSettlements(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        List<SettlementResponse> response = tripSettlementService.getTripSettlements(tripId, currentUser);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{settlementId}")
    public ResponseEntity<SettlementResponse> getSettlementById(
            @PathVariable Long tripId,
            @PathVariable Long settlementId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        SettlementResponse response = tripSettlementService.getSettlementById(tripId, settlementId, currentUser);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{settlementId}")
    public ResponseEntity<Void> deleteSettlement(
            @PathVariable Long tripId,
            @PathVariable Long settlementId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        tripSettlementService.deleteSettlement(tripId, settlementId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
