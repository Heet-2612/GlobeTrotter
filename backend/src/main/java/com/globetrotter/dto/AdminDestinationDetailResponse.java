package com.globetrotter.dto;

import com.globetrotter.entity.DestinationSource;
import com.globetrotter.entity.DestinationType;

import java.util.List;

public record AdminDestinationDetailResponse(
        Long id,
        String name,
        String canonicalName,
        String country,
        String region,
        Long regionId,
        String regionDescription,
        DestinationType destinationType,
        DestinationSource source,
        Boolean isCurated,
        Double costIndex,
        Integer popularity,
        String imageUrl,
        String currencyCode,
        String currencySymbol,
        Double latitude,
        Double longitude,
        List<String> aliases,
        long activityCount
) {}
