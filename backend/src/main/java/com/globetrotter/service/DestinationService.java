package com.globetrotter.service;

import com.globetrotter.dto.DestinationResponse;
import com.globetrotter.entity.Destination;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.DestinationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepository;

    public DestinationService(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @Transactional(readOnly = true)
    public List<DestinationResponse> searchDestinations(String search, String country, String region, Long regionId, Boolean curated) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String cleanCountry = (country != null && !country.trim().isEmpty()) ? country.trim() : null;
        String cleanRegion = (region != null && !region.trim().isEmpty()) ? region.trim() : null;

        return destinationRepository.searchDestinations(cleanSearch, cleanCountry, cleanRegion, regionId, curated)
                .stream()
                .map(DestinationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DestinationResponse getDestinationById(Long destinationId) {
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + destinationId));
        return DestinationResponse.fromEntity(destination);
    }
}
