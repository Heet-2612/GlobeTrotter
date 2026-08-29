package com.globetrotter.dto;

import java.util.List;

public record AdminDestinationListPageResponse(
        List<AdminDestinationListItemResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean hasNext,
        boolean hasPrevious
) {}
