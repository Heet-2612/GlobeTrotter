package com.globetrotter.dto;

import com.globetrotter.entity.DestinationSource;
import com.globetrotter.entity.DestinationType;

public record AdminDestinationListItemResponse(
        Long id,
        String name,
        String canonicalName,
        String country,
        String region,
        Long regionId,
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
        long activityCount
) {}
