package com.globetrotter.service;

import com.globetrotter.dto.AdminDestinationDetailResponse;
import com.globetrotter.dto.AdminDestinationListItemResponse;
import com.globetrotter.dto.AdminDestinationListPageResponse;
import com.globetrotter.entity.Destination;
import com.globetrotter.entity.DestinationAlias;
import com.globetrotter.entity.DestinationType;
import com.globetrotter.entity.Region;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.ActivityRepository;
import com.globetrotter.repository.DestinationRepository;
import com.globetrotter.repository.RegionRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminDestinationService {

    private final DestinationRepository destinationRepository;
    private final ActivityRepository activityRepository;
    private final RegionRepository regionRepository;

    public AdminDestinationService(
            DestinationRepository destinationRepository,
            ActivityRepository activityRepository,
            RegionRepository regionRepository
    ) {
        this.destinationRepository = destinationRepository;
        this.activityRepository = activityRepository;
        this.regionRepository = regionRepository;
    }

    @Transactional(readOnly = true)
    public AdminDestinationListPageResponse getDestinations(
            int page,
            int size,
            String search,
            String region,
            String type,
            Boolean isCurated
    ) {
        int sanitizedPage = Math.max(0, page);
        int sanitizedSize = Math.min(Math.max(1, size), 100);

        Pageable pageable = PageRequest.of(sanitizedPage, sanitizedSize, Sort.by(Sort.Direction.ASC, "name"));

        Specification<Destination> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), searchPattern);
                Predicate canonicalMatch = cb.like(cb.lower(root.get("canonicalName")), searchPattern);
                predicates.add(cb.or(nameMatch, canonicalMatch));
            }

            if (region != null && !region.trim().isEmpty() && !region.equalsIgnoreCase("ALL")) {
                String regionClean = region.trim().toLowerCase();
                Join<Destination, Region> regionJoin = root.join("regionEntity", JoinType.LEFT);
                Predicate entityNameMatch = cb.equal(cb.lower(regionJoin.get("name")), regionClean);
                Predicate entityCanonicalMatch = cb.equal(cb.lower(regionJoin.get("canonicalName")), regionClean);
                Predicate legacyRegionMatch = cb.equal(cb.lower(root.get("legacyRegion")), regionClean);
                predicates.add(cb.or(entityNameMatch, entityCanonicalMatch, legacyRegionMatch));
            }

            if (type != null && !type.trim().isEmpty() && !type.equalsIgnoreCase("ALL")) {
                try {
                    DestinationType destinationType = DestinationType.valueOf(type.trim().toUpperCase());
                    predicates.add(cb.equal(root.get("destinationType"), destinationType));
                } catch (IllegalArgumentException ignored) {
                    // Invalid type filter -> no match
                    predicates.add(cb.disjunction());
                }
            }

            if (isCurated != null) {
                predicates.add(cb.equal(root.get("isCurated"), isCurated));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Destination> destinationPage = destinationRepository.findAll(spec, pageable);

        List<Long> destinationIds = destinationPage.getContent().stream()
                .map(Destination::getId)
                .toList();

        Map<Long, Long> activityCounts = new HashMap<>();
        if (!destinationIds.isEmpty()) {
            List<Object[]> rawCounts = activityRepository.countActivitiesByDestinationIds(destinationIds);
            for (Object[] row : rawCounts) {
                if (row.length >= 2 && row[0] instanceof Long dId && row[1] instanceof Number count) {
                    activityCounts.put(dId, count.longValue());
                }
            }
        }

        List<AdminDestinationListItemResponse> content = destinationPage.getContent().stream()
                .map(dest -> new AdminDestinationListItemResponse(
                        dest.getId(),
                        dest.getName(),
                        dest.getCanonicalName(),
                        dest.getCountry(),
                        dest.getRegion(),
                        dest.getRegionEntity() != null ? dest.getRegionEntity().getId() : null,
                        dest.getDestinationType(),
                        dest.getSource(),
                        dest.getIsCurated(),
                        dest.getCostIndex(),
                        dest.getPopularity(),
                        dest.getImageUrl(),
                        dest.getCurrencyCode(),
                        dest.getCurrencySymbol(),
                        dest.getLatitude(),
                        dest.getLongitude(),
                        activityCounts.getOrDefault(dest.getId(), 0L)
                ))
                .toList();

        return new AdminDestinationListPageResponse(
                content,
                destinationPage.getNumber(),
                destinationPage.getSize(),
                destinationPage.getTotalElements(),
                destinationPage.getTotalPages(),
                destinationPage.hasNext(),
                destinationPage.hasPrevious()
        );
    }

    @Transactional(readOnly = true)
    public AdminDestinationDetailResponse getDestinationDetail(Long destinationId) {
        Destination dest = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Destination not found with id: " + destinationId));

        long activityCount = activityRepository.countByDestinationId(destinationId);

        List<String> aliasNames = (dest.getAliases() != null)
                ? dest.getAliases().stream().map(DestinationAlias::getAliasName).collect(Collectors.toList())
                : Collections.emptyList();

        String regionDescription = (dest.getRegionEntity() != null)
                ? dest.getRegionEntity().getDescription()
                : null;

        return new AdminDestinationDetailResponse(
                dest.getId(),
                dest.getName(),
                dest.getCanonicalName(),
                dest.getCountry(),
                dest.getRegion(),
                dest.getRegionEntity() != null ? dest.getRegionEntity().getId() : null,
                regionDescription,
                dest.getDestinationType(),
                dest.getSource(),
                dest.getIsCurated(),
                dest.getCostIndex(),
                dest.getPopularity(),
                dest.getImageUrl(),
                dest.getCurrencyCode(),
                dest.getCurrencySymbol(),
                dest.getLatitude(),
                dest.getLongitude(),
                aliasNames,
                activityCount
        );
    }

    @Transactional(readOnly = true)
    public List<String> getAvailableRegions() {
        return regionRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(Region::getName)
                .distinct()
                .toList();
    }
}
