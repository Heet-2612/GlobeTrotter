package com.globetrotter;

import com.globetrotter.client.GeoapifyClient;
import com.globetrotter.dto.DiscoveredPlaceResponse;
import com.globetrotter.entity.Destination;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.DestinationRepository;
import com.globetrotter.service.GeoapifyDiscoveryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class GeoapifyDiscoveryServiceTest {

    @Mock
    private DestinationRepository destinationRepository;

    @Mock
    private GeoapifyClient geoapifyClient;

    @InjectMocks
    private GeoapifyDiscoveryService geoapifyDiscoveryService;

    private Destination jaipurWithCoords;
    private Destination unknownWithoutCoords;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        jaipurWithCoords = Destination.builder()
                .id(1L)
                .name("Jaipur")
                .canonicalName("jaipur")
                .country("India")
                .latitude(26.9124)
                .longitude(75.7873)
                .build();

        unknownWithoutCoords = Destination.builder()
                .id(99L)
                .name("Remote Mystery Spot")
                .canonicalName("remote-mystery-spot")
                .country("Unknown")
                .latitude(null)
                .longitude(null)
                .build();
    }

    @Test
    @DisplayName("1. Valid destination with coordinates calls Geoapify and returns GEOAPIFY source results")
    void test1_ValidDestinationWithCoordsReturnsGeoapifyResults() {
        when(destinationRepository.findById(1L)).thenReturn(Optional.of(jaipurWithCoords));
        when(geoapifyClient.isConfigured()).thenReturn(true);

        DiscoveredPlaceResponse place = new DiscoveredPlaceResponse();
        place.setId("place-123");
        place.setExternalId("place-123");
        place.setName("Amber Fort Viewpoint");
        place.setCategory("CULTURE");
        place.setLatitude(26.9855);
        place.setLongitude(75.8513);
        place.setSource("GEOAPIFY");

        when(geoapifyClient.discoverPlaces(eq(26.9124), eq(75.7873), eq("restaurant"), eq("CULTURE"), eq(5000)))
                .thenReturn(List.of(place));

        List<DiscoveredPlaceResponse> results = geoapifyDiscoveryService.discoverPlacesForDestination(1L, "restaurant", "CULTURE", 5000);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals("Amber Fort Viewpoint", results.get(0).getName());
        assertEquals("GEOAPIFY", results.get(0).getSource());
        assertEquals("place-123", results.get(0).getExternalId());
        assertFalse(results.get(0).getAttribution().isEmpty());

        verify(geoapifyClient, times(1)).discoverPlaces(eq(26.9124), eq(75.7873), eq("restaurant"), eq("CULTURE"), eq(5000));
    }

    @Test
    @DisplayName("2. Non-existent destination throws ResourceNotFoundException (404)")
    void test2_NonExistentDestinationThrowsNotFound() {
        when(destinationRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                geoapifyDiscoveryService.discoverPlacesForDestination(999L, null, null, 5000)
        );

        verifyNoInteractions(geoapifyClient);
    }

    @Test
    @DisplayName("3. Destination with no coordinates throws IllegalArgumentException explaining missing coordinates")
    void test3_DestinationWithNoCoordinatesThrowsIllegalArgument() {
        when(destinationRepository.findById(99L)).thenReturn(Optional.of(unknownWithoutCoords));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                geoapifyDiscoveryService.discoverPlacesForDestination(99L, null, null, 5000)
        );

        assertTrue(ex.getMessage().contains("latitude and longitude coordinates are missing"));
        verifyNoInteractions(geoapifyClient);
    }

    @Test
    @DisplayName("4. Unconfigured Geoapify API key throws IllegalStateException")
    void test4_UnconfiguredGeoapifyThrowsIllegalState() {
        when(destinationRepository.findById(1L)).thenReturn(Optional.of(jaipurWithCoords));
        when(geoapifyClient.isConfigured()).thenReturn(false);

        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                geoapifyDiscoveryService.discoverPlacesForDestination(1L, null, null, 5000)
        );

        assertTrue(ex.getMessage().contains("Geoapify API key is not configured"));
        verify(geoapifyClient, times(1)).isConfigured();
        verify(geoapifyClient, never()).discoverPlaces(any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("5. Geoapify returning empty list handles gracefully")
    void test5_GeoapifyEmptyListHandledGracefully() {
        when(destinationRepository.findById(1L)).thenReturn(Optional.of(jaipurWithCoords));
        when(geoapifyClient.isConfigured()).thenReturn(true);
        when(geoapifyClient.discoverPlaces(any(), any(), any(), any(), any())).thenReturn(Collections.emptyList());

        List<DiscoveredPlaceResponse> results = geoapifyDiscoveryService.discoverPlacesForDestination(1L, "rare_query", null, 5000);

        assertNotNull(results);
        assertTrue(results.isEmpty());
    }

    @Test
    @DisplayName("6. Geoapify client failure propagates clean exception without exposing API key")
    void test6_GeoapifyFailurePropagatesCleanException() {
        when(destinationRepository.findById(1L)).thenReturn(Optional.of(jaipurWithCoords));
        when(geoapifyClient.isConfigured()).thenReturn(true);
        when(geoapifyClient.discoverPlaces(any(), any(), any(), any(), any()))
                .thenThrow(new RuntimeException("Geoapify service timeout"));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                geoapifyDiscoveryService.discoverPlacesForDestination(1L, null, null, 5000)
        );

        assertEquals("Geoapify service timeout", ex.getMessage());
        assertFalse(ex.getMessage().contains("secret_api_key"));
    }
}
