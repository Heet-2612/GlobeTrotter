package com.globetrotter.controller;

import com.globetrotter.dto.AddTripMemberRequest;
import com.globetrotter.dto.TripMemberResponse;
import com.globetrotter.entity.User;
import com.globetrotter.service.TripMemberService;
import com.globetrotter.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/trips/{tripId}/members")
public class TripMemberController {

    private final TripMemberService tripMemberService;
    private final UserService userService;

    public TripMemberController(TripMemberService tripMemberService, UserService userService) {
        this.tripMemberService = tripMemberService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<TripMemberResponse>> getMembers(
            @PathVariable Long tripId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        List<TripMemberResponse> members = tripMemberService.getTripMembers(tripId, currentUser.getId());
        return ResponseEntity.ok(members);
    }

    @PostMapping
    public ResponseEntity<TripMemberResponse> addMember(
            @PathVariable Long tripId,
            @RequestBody AddTripMemberRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        TripMemberResponse member = tripMemberService.addTripMember(tripId, request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(member);
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long tripId,
            @PathVariable Long memberId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        User currentUser = userService.getUserByEmail(userDetails.getUsername());
        tripMemberService.deactivateMember(tripId, memberId, currentUser);
        return ResponseEntity.noContent().build();
    }
}
