package com.globetrotter.controller;

import com.globetrotter.dto.*;
import com.globetrotter.entity.User;
import com.globetrotter.security.AdminSecurityService;
import com.globetrotter.service.AdminDestinationService;
import com.globetrotter.service.AdminUserService;
import com.globetrotter.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final AdminUserService adminUserService;
    private final AdminDestinationService adminDestinationService;
    private final AdminSecurityService adminSecurityService;

    public AdminController(
            UserService userService,
            AdminUserService adminUserService,
            AdminDestinationService adminDestinationService,
            AdminSecurityService adminSecurityService
    ) {
        this.userService = userService;
        this.adminUserService = adminUserService;
        this.adminDestinationService = adminDestinationService;
        this.adminSecurityService = adminSecurityService;
    }

    @GetMapping("/me")
    public ResponseEntity<AdminMeResponse> getAdminProfile(@AuthenticationPrincipal UserDetails userDetails) {
        validateAdmin(userDetails);
        User adminUser = userService.getUserByEmail(userDetails.getUsername());
        AdminMeResponse response = new AdminMeResponse(
                adminUser.getId(),
                adminUser.getName(),
                adminUser.getEmail(),
                "ADMIN",
                true
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<AdminUserListPageResponse> getUsers(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String authProvider
    ) {
        validateAdmin(userDetails);
        AdminUserListPageResponse response = adminUserService.getUsers(page, size, search, authProvider);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<AdminUserDetailResponse> getUserDetail(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long userId
    ) {
        validateAdmin(userDetails);
        AdminUserDetailResponse response = adminUserService.getUserDetail(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/destinations")
    public ResponseEntity<AdminDestinationListPageResponse> getDestinations(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String region,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean isCurated
    ) {
        validateAdmin(userDetails);
        AdminDestinationListPageResponse response = adminDestinationService.getDestinations(
                page, size, search, region, type, isCurated
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/destinations/{destinationId}")
    public ResponseEntity<AdminDestinationDetailResponse> getDestinationDetail(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long destinationId
    ) {
        validateAdmin(userDetails);
        AdminDestinationDetailResponse response = adminDestinationService.getDestinationDetail(destinationId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/destinations/regions")
    public ResponseEntity<List<String>> getDestinationRegions(@AuthenticationPrincipal UserDetails userDetails) {
        validateAdmin(userDetails);
        List<String> regions = adminDestinationService.getAvailableRegions();
        return ResponseEntity.ok(regions);
    }

    private void validateAdmin(UserDetails userDetails) {
        if (userDetails == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        if (!adminSecurityService.isAdminEmail(userDetails.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: Platform Administrator privilege required.");
        }
    }
}
