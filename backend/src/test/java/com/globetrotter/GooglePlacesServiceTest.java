package com.globetrotter;

import com.globetrotter.client.GooglePlacesClient;
import com.globetrotter.dto.ActivityResponse;
import com.globetrotter.dto.PlaceAutocompleteResponse;
import com.globetrotter.dto.PlaceResponse;
import com.globetrotter.entity.Activity;
import com.globetrotter.entity.Destination;
import com.globetrotter.repository.ActivityRepository;
import com.globetrotter.repository.DestinationRepository;
import com.globetrotter.service.GooglePlacesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class GooglePlacesServiceTest {

    private GooglePlacesClient googlePlacesClient;
    private DestinationRepository destinationRepository;
    private ActivityRepository activityRepository;
    private GooglePlacesService googlePlacesService;

    @BeforeEach
    void setUp() {
        googlePlacesClient = mock(GooglePlacesClient.class);
        destinationRepository = mock(DestinationRepository.class);
        activityRepository = mock(ActivityRepository.class);
        googlePlacesService = new GooglePlacesService(googlePlacesClient, destinationRepository, activityRepository);
    }

    @Test
    void testSearchPlaces() {
        PlaceResponse place1 = new PlaceResponse("place_1", "City Palace", "Udaipur, Rajasthan", 24.57, 73.68, 4.6, "http://maps", "tourist_attraction", null);
        when(googlePlacesClient.searchText(anyString())).thenReturn(List.of(place1));

        List<PlaceResponse> results = googlePlacesService.searchPlaces("Udaipur", "City Palace", "tourist_attraction");
        assertNotNull(results);
    }

    @Test
    void testAutocomplete() {
        PlaceAutocompleteResponse auto1 = new PlaceAutocompleteResponse("place_1", "City Palace", "Udaipur");
        when(googlePlacesClient.autocomplete(anyString(), any())).thenReturn(List.of(auto1));

        List<PlaceAutocompleteResponse> results = googlePlacesService.autocomplete("City", "Udaipur");
        assertNotNull(results);
    }

    @Test
    void testConvertPlaceToActivityNewRecord() {
        Destination destination = Destination.builder().id(1L).name("Udaipur").currencyCode("INR").currencySymbol("₹").build();
        when(destinationRepository.findById(1L)).thenReturn(Optional.of(destination));
        when(activityRepository.findByDestinationIdAndGooglePlaceId(1L, "place_999")).thenReturn(Optional.empty());

        Activity saved = Activity.builder()
                .id(100L)
                .destination(destination)
                .name("Saheliyon Ki Bari")
                .description("Courtyard of the Maidens")
                .category("Nature")
                .estimatedDurationMinutes(60)
                .estimatedCost(0.0)
                .currency("INR")
                .googlePlaceId("place_999")
                .build();

        when(activityRepository.save(any(Activity.class))).thenReturn(saved);

        PlaceResponse place = new PlaceResponse("place_999", "Saheliyon Ki Bari", "Courtyard of the Maidens", 24.60, 73.69, 4.5, "http://maps", "park", null);
        ActivityResponse res = googlePlacesService.convertPlaceToActivity(1L, place);

        assertNotNull(res);
        assertEquals(100L, res.getId());
        assertEquals("Saheliyon Ki Bari", res.getName());
        assertEquals("place_999", res.getGooglePlaceId());

        ArgumentCaptor<Activity> captor = ArgumentCaptor.forClass(Activity.class);
        verify(activityRepository).save(captor.capture());
        assertEquals("place_999", captor.getValue().getGooglePlaceId());
    }

    @Test
    void testConvertPlaceToActivityReusesExisting() {
        Destination destination = Destination.builder().id(1L).name("Udaipur").currencyCode("INR").build();
        Activity existing = Activity.builder()
                .id(50L)
                .destination(destination)
                .name("Saheliyon Ki Bari")
                .googlePlaceId("place_999")
                .build();

        when(destinationRepository.findById(1L)).thenReturn(Optional.of(destination));
        when(activityRepository.findByDestinationIdAndGooglePlaceId(1L, "place_999")).thenReturn(Optional.of(existing));

        PlaceResponse place = new PlaceResponse("place_999", "Saheliyon Ki Bari", "Courtyard of the Maidens", 24.60, 73.69, 4.5, "http://maps", "park", null);
        ActivityResponse res = googlePlacesService.convertPlaceToActivity(1L, place);

        assertNotNull(res);
        assertEquals(50L, res.getId());
        verify(activityRepository, never()).save(any(Activity.class));
    }
}
