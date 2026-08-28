package com.globetrotter.service;

import com.globetrotter.dto.ActivityResponse;
import com.globetrotter.entity.Activity;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.ActivityRepository;
import com.globetrotter.repository.DestinationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final DestinationRepository destinationRepository;
    private final ActivityImageRegistry activityImageRegistry;

    public ActivityService(ActivityRepository activityRepository, DestinationRepository destinationRepository, ActivityImageRegistry activityImageRegistry) {
        this.activityRepository = activityRepository;
        this.destinationRepository = destinationRepository;
        this.activityImageRegistry = activityImageRegistry;
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> searchActivities(Long destinationId, String search, String category, String source) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String cleanCategory = (category != null && !category.trim().isEmpty()) ? category.trim() : null;
        String cleanSource = (source != null && !source.trim().isEmpty()) ? source.trim() : null;

        return activityRepository.searchActivities(destinationId, cleanSearch, cleanCategory, cleanSource)
                .stream()
                .map(a -> ActivityResponse.fromEntity(a, activityImageRegistry))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> searchActivities(Long destinationId, String search, String category) {
        return searchActivities(destinationId, search, category, null);
    }

    @Transactional(readOnly = true)
    public List<ActivityResponse> getCuratedActivitiesForDestination(Long destinationId) {
        destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + destinationId));

        return activityRepository.findByDestinationIdAndSourceIgnoreCaseOrderByNameAsc(destinationId, "CURATED")
                .stream()
                .map(a -> ActivityResponse.fromEntity(a, activityImageRegistry))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ActivityResponse getActivityById(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + activityId));
        return ActivityResponse.fromEntity(activity, activityImageRegistry);
    }
}
