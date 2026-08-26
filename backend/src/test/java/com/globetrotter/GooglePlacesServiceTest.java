package com.globetrotter;

import com.globetrotter.client.GooglePlacesClient;
import com.globetrotter.dto.ActivityResponse;
import com.globetrotter.dto.PlaceAutocompleteResponse;
import com.globetrotter.dto.PlaceResponse;
import com.globetrotter.entity.Activity;
import com.globetrotter.entity.City;
import com.globetrotter.repository.ActivityRepository;
import com.globetrotter.repository.CityRepository;
import com.globetrotter.service.GooglePlacesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class GooglePlacesServiceTest {

    private GooglePlacesClient googlePlacesClient;
    private CityRepository cityRepository;
    private ActivityRepository activityRepository;
    private GooglePlacesService googlePlacesService;

    @BeforeEach
    void setUp() {
        googlePlacesClient = mock(GooglePlacesClient.class);
        cityRepository = mock(CityRepository.class);
        activityRepository = mock(ActivityRepository.class);

        googlePlacesService = new GooglePlacesService(googlePlacesClient, cityRepository, activityRepository);
    }

    @Test
    void testQueryConstruction() {
        String query1 = googlePlacesService.constructContextQuery("Udaipur", "museum", null);
        assertEquals("museum in Udaipur, India", query1);

        String query2 = googlePlacesService.constructContextQuery("Jaipur", null, "Culture");
        assertEquals("museums, temples, and historical landmarks in Jaipur, India", query2);

        String query3 = googlePlacesService.constructContextQuery("Goa", null, null);
        assertEquals("top attractions in Goa, India", query3);
    }

    @Test
    void testSearchPlacesWithValidResults() {
        PlaceResponse sample = new PlaceResponse("place_123", "Bagore Ki Haveli", "Gangaur Ghat, Udaipur", 24.57, 73.68, 4.6, "http://maps.google.com", "museum", null);
        when(googlePlacesClient.searchText(any())).thenReturn(List.of(sample));

        List<PlaceResponse> results = googlePlacesService.searchPlaces("Udaipur", "museum", null);
        assertEquals(1, results.size());
        assertEquals("place_123", results.get(0).getPlaceId());
        assertEquals("Bagore Ki Haveli", results.get(0).getName());

        verify(googlePlacesClient).searchText("museum in Udaipur, India");
    }

    @Test
    void testSearchPlacesEmptyResponse() {
        when(googlePlacesClient.searchText(any())).thenReturn(new ArrayList<>());

        List<PlaceResponse> results = googlePlacesService.searchPlaces("Udaipur", "nonsense", null);
        assertTrue(results.isEmpty());
    }

    @Test
    void testAutocompleteShortInputIgnored() {
        List<PlaceAutocompleteResponse> suggestions = googlePlacesService.autocomplete("Udaipur", "a");
        assertTrue(suggestions.isEmpty());
        verify(googlePlacesClient, never()).autocomplete(any(), any());
    }

    @Test
    void testAutocompleteValidInput() {
        PlaceAutocompleteResponse sug = new PlaceAutocompleteResponse("place_abc", "City Palace", "Udaipur, Rajasthan");
        when(googlePlacesClient.autocomplete("City", "Udaipur")).thenReturn(List.of(sug));

        List<PlaceAutocompleteResponse> results = googlePlacesService.autocomplete("Udaipur", "City");
        assertEquals(1, results.size());
        assertEquals("City Palace", results.get(0).getText());
    }

    @Test
    void testConvertPlaceToActivityNewRecord() {
        City city = City.builder().id(1L).name("Udaipur").currencyCode("INR").currencySymbol("₹").build();
        when(cityRepository.findById(1L)).thenReturn(Optional.of(city));
        when(activityRepository.findByCityIdAndGooglePlaceId(1L, "place_999")).thenReturn(Optional.empty());

        Activity saved = Activity.builder()
                .id(100L)
                .city(city)
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
        City city = City.builder().id(1L).name("Udaipur").currencyCode("INR").build();
        Activity existing = Activity.builder()
                .id(50L)
                .city(city)
                .name("Saheliyon Ki Bari")
                .googlePlaceId("place_999")
                .build();

        when(cityRepository.findById(1L)).thenReturn(Optional.of(city));
        when(activityRepository.findByCityIdAndGooglePlaceId(1L, "place_999")).thenReturn(Optional.of(existing));

        PlaceResponse place = new PlaceResponse("place_999", "Saheliyon Ki Bari", "Address", 24.60, 73.69, 4.5, "http://maps", "park", null);
        ActivityResponse res = googlePlacesService.convertPlaceToActivity(1L, place);

        assertEquals(50L, res.getId());
        verify(activityRepository, never()).save(any());
    }
}
