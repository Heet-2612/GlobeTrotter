package com.globetrotter.controller;

import com.globetrotter.dto.ActivityResponse;
import com.globetrotter.service.ActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> searchActivities(
            @RequestParam(required = false) Long destinationId,
            @RequestParam(required = false) Long cityId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String source) {
        Long targetId = destinationId != null ? destinationId : cityId;
        List<ActivityResponse> response = activityService.searchActivities(targetId, search, category, source);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{activityId}")
    public ResponseEntity<ActivityResponse> getActivityById(@PathVariable Long activityId) {
        ActivityResponse response = activityService.getActivityById(activityId);
        return ResponseEntity.ok(response);
    }
}
