package com.globetrotter.service;

import com.globetrotter.dto.CityResponse;
import com.globetrotter.dto.DestinationResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Deprecated
@Service
public class CityService {

    private final DestinationService destinationService;

    public CityService(DestinationService destinationService) {
        this.destinationService = destinationService;
    }

    @Transactional(readOnly = true)
    public List<CityResponse> searchCities(String search, String country, String region) {
        return searchCities(search, country, region, null);
    }

    @Transactional(readOnly = true)
    public List<CityResponse> searchCities(String search, String country, String region, Boolean curated) {
        List<DestinationResponse> destinations = destinationService.searchDestinations(search, country, region, null, curated);
        return destinations.stream()
                .map(d -> new CityResponse(d.getId(), d.getName(), d.getCountry(), d.getRegion(), d.getCostIndex(), d.getPopularity(), d.getImageUrl(), d.getCurrencyCode(), d.getCurrencySymbol()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CityResponse getCityById(Long cityId) {
        DestinationResponse d = destinationService.getDestinationById(cityId);
        return new CityResponse(d.getId(), d.getName(), d.getCountry(), d.getRegion(), d.getCostIndex(), d.getPopularity(), d.getImageUrl(), d.getCurrencyCode(), d.getCurrencySymbol());
    }
}
