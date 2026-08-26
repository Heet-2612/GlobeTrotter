package com.globetrotter;

import com.globetrotter.dto.*;
import com.globetrotter.entity.*;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.*;
import com.globetrotter.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TripV2BackendIntegrationTest {

    @Autowired
    private TripService tripService;

    @Autowired
    private TripStopService tripStopService;

    @Autowired
    private TripActivityService tripActivityService;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private ActivityRepository activityRepository;

    private User owner;
    private User attacker;
    private Region karnatakaRegion;
    private Region tamilNaduRegion;
    private Destination jaipurDest;
    private Destination bengaluruDest;
    private Destination ootyDest;
    private Activity jaipurCuratedActivity;
    private Activity bengaluruCuratedActivity;

    @BeforeEach
    void setUp() {
        owner = userRepository.save(User.builder()
                .name("V2 Owner User")
                .email("v2owner_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password123")
                .build());

        attacker = userRepository.save(User.builder()
                .name("V2 Attacker User")
                .email("v2attacker_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password123")
                .build());

        karnatakaRegion = regionRepository.save(Region.builder()
                .name("Karnataka")
                .canonicalName("karnataka")
                .country("India")
                .description("Karnataka State")
                .build());

        tamilNaduRegion = regionRepository.save(Region.builder()
                .name("Tamil Nadu")
                .canonicalName("tamil-nadu")
                .country("India")
                .description("Tamil Nadu State")
                .build());

        jaipurDest = destinationRepository.save(Destination.builder()
                .name("Jaipur")
                .canonicalName("jaipur_v2_test")
                .country("India")
                .destinationType(DestinationType.CITY)
                .isCurated(true)
                .build());

        bengaluruDest = destinationRepository.save(Destination.builder()
                .name("Bengaluru")
                .canonicalName("bengaluru_v2_test")
                .country("India")
                .regionEntity(karnatakaRegion)
                .destinationType(DestinationType.CITY)
                .isCurated(true)
                .build());

        ootyDest = destinationRepository.save(Destination.builder()
                .name("Ooty")
                .canonicalName("ooty_v2_test")
                .country("India")
                .regionEntity(tamilNaduRegion)
                .destinationType(DestinationType.HILL_STATION)
                .isCurated(true)
                .build());

        jaipurCuratedActivity = activityRepository.save(Activity.builder()
                .destination(jaipurDest)
                .name("Jaipur Amber Fort Tour")
                .category("CULTURE")
                .estimatedDurationMinutes(120)
                .estimatedCost(500.0)
                .currency("INR")
                .source("CURATED")
                .build());

        bengaluruCuratedActivity = activityRepository.save(Activity.builder()
                .destination(bengaluruDest)
                .name("Bengaluru Palace Walk")
                .category("CULTURE")
                .estimatedDurationMinutes(90)
                .estimatedCost(300.0)
                .currency("INR")
                .source("CURATED")
                .build());
    }

    @Test
    @DisplayName("1. Create trip without budget succeed with null budget")
    void test1_CreateTripWithoutBudget() {
        CreateTripRequest req = new CreateTripRequest("V2 Summer Trip", "No budget trip", LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 10), null, null);
        TripResponse res = tripService.createTrip(req, owner);

        assertNotNull(res.getId());
        assertEquals("V2 Summer Trip", res.getName());
        assertNull(res.getBudget());
    }

    @Test
    @DisplayName("2 & 3. Create trip with multiple destinations from different State/UT regions")
    void test2_3_CreateTripWithMultipleDestinationsAcrossStates() {
        CreateTripRequest req = new CreateTripRequest("South India Grand Tour", "Multi State Trip", LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 15), null);
        TripResponse trip = tripService.createTrip(req, owner);

        TripStopResponse stop1 = tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(bengaluruDest.getId(), LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 5), "Karnataka Stop"), owner);
        TripStopResponse stop2 = tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(ootyDest.getId(), LocalDate.of(2026, 7, 6), LocalDate.of(2026, 7, 10), "Tamil Nadu Stop"), owner);
        TripStopResponse stop3 = tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(jaipurDest.getId(), LocalDate.of(2026, 7, 11), LocalDate.of(2026, 7, 15), "Rajasthan Stop"), owner);

        assertEquals(1, stop1.getStopOrder());
        assertEquals(2, stop2.getStopOrder());
        assertEquals(3, stop3.getStopOrder());
        assertEquals(bengaluruDest.getId(), stop1.getDestination().getId());
        assertEquals(ootyDest.getId(), stop2.getDestination().getId());
        assertEquals(jaipurDest.getId(), stop3.getDestination().getId());
    }

    @Test
    @DisplayName("4. Reject stop outside trip dates")
    void test4_RejectStopOutsideTripDates() {
        CreateTripRequest req = new CreateTripRequest("Date Bounds Trip", "Desc", LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 5), null);
        TripResponse trip = tripService.createTrip(req, owner);

        assertThrows(IllegalArgumentException.class, () ->
                tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(bengaluruDest.getId(), LocalDate.of(2026, 6, 30), LocalDate.of(2026, 7, 3), null), owner)
        );

        assertThrows(IllegalArgumentException.class, () ->
                tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(bengaluruDest.getId(), LocalDate.of(2026, 7, 3), LocalDate.of(2026, 7, 6), null), owner)
        );
    }

    @Test
    @DisplayName("5. Reject invalid destination ID")
    void test5_RejectInvalidDestination() {
        CreateTripRequest req = new CreateTripRequest("Trip 1", "Desc", LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 10), null);
        TripResponse trip = tripService.createTrip(req, owner);

        assertThrows(ResourceNotFoundException.class, () ->
                tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(999999L, LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 5), null), owner)
        );
    }

    @Test
    @DisplayName("6. Add CURATED activity to matching destination stop")
    void test6_AddCuratedActivityToMatchingDestination() {
        CreateTripRequest req = new CreateTripRequest("Curated Trip", "Desc", LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 5), null);
        TripResponse trip = tripService.createTrip(req, owner);

        TripStopResponse stop = tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(jaipurDest.getId(), LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 5), null), owner);

        CreateTripActivityRequest actReq = new CreateTripActivityRequest(jaipurCuratedActivity.getId(), LocalDate.of(2026, 9, 2), null, "Check out Sheesh Mahal", 500.0);
        TripActivityResponse actRes = tripActivityService.createTripActivity(trip.getId(), stop.getId(), actReq, owner);

        assertNotNull(actRes.getId());
        assertEquals(jaipurCuratedActivity.getId(), actRes.getActivity().getId());
        assertEquals("CURATED", actRes.getActivity().getSource());
    }

    @Test
    @DisplayName("7. Reject activity belonging to another destination")
    void test7_RejectActivityBelongingToAnotherDestination() {
        CreateTripRequest req = new CreateTripRequest("Mismatch Trip", "Desc", LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 5), null);
        TripResponse trip = tripService.createTrip(req, owner);

        TripStopResponse stopJaipur = tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(jaipurDest.getId(), LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 5), null), owner);

        CreateTripActivityRequest actReqMismatch = new CreateTripActivityRequest(bengaluruCuratedActivity.getId(), LocalDate.of(2026, 9, 2), null, null, null);

        assertThrows(IllegalArgumentException.class, () ->
                tripActivityService.createTripActivity(trip.getId(), stopJaipur.getId(), actReqMismatch, owner)
        );
    }

    @Test
    @DisplayName("8 & 9. Add Geoapify POI to trip and persist candidate with source = GEOAPIFY")
    void test8_9_AddGeoapifyPoiToTrip() {
        CreateTripRequest req = new CreateTripRequest("Geoapify Trip", "Desc", LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 5), null);
        TripResponse trip = tripService.createTrip(req, owner);

        TripStopResponse stop = tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(bengaluruDest.getId(), LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 5), null), owner);

        AddDiscoveredActivityRequest discReq = new AddDiscoveredActivityRequest(
                "geoapify_ext_999",
                "Lalbagh Botanical Garden Glass House",
                "Lalbagh Road, Mavalli, Bengaluru",
                "NATURE",
                12.9507,
                77.5848,
                "Lalbagh Road, Mavalli, Bengaluru",
                "https://example.com/lalbagh.jpg",
                LocalDate.of(2026, 10, 2),
                null,
                "Morning visit",
                100.0
        );

        TripActivityResponse res = tripActivityService.addDiscoveredActivityToStop(trip.getId(), stop.getId(), discReq, owner);

        assertNotNull(res.getId());
        assertEquals("Lalbagh Botanical Garden Glass House", res.getActivity().getName());
        assertEquals("GEOAPIFY", res.getActivity().getSource());
        assertEquals("geoapify_ext_999", res.getActivity().getExternalId());
        assertEquals(12.9507, res.getActivity().getLatitude());
        assertEquals(77.5848, res.getActivity().getLongitude());
    }

    @Test
    @DisplayName("10. Re-adding same externalId reuses existing Activity record without duplication")
    void test10_ReaddingSameExternalIdReusesActivity() {
        CreateTripRequest req = new CreateTripRequest("Deduplication Trip", "Desc", LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 10), null);
        TripResponse trip = tripService.createTrip(req, owner);

        TripStopResponse stop = tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(bengaluruDest.getId(), LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 10), null), owner);

        AddDiscoveredActivityRequest discReq1 = new AddDiscoveredActivityRequest(
                "geoapify_shared_111", "Cubbon Park Walk", "Cubbon Park", "NATURE", 12.9763, 77.5929, "Cubbon Park", null, LocalDate.of(2026, 11, 2), null, null, null
        );
        AddDiscoveredActivityRequest discReq2 = new AddDiscoveredActivityRequest(
                "geoapify_shared_111", "Cubbon Park Walk", "Cubbon Park", "NATURE", 12.9763, 77.5929, "Cubbon Park", null, LocalDate.of(2026, 11, 4), null, null, null
        );

        TripActivityResponse act1 = tripActivityService.addDiscoveredActivityToStop(trip.getId(), stop.getId(), discReq1, owner);
        TripActivityResponse act2 = tripActivityService.addDiscoveredActivityToStop(trip.getId(), stop.getId(), discReq2, owner);

        assertEquals(act1.getActivity().getId(), act2.getActivity().getId());
        assertEquals("geoapify_shared_111", act2.getActivity().getExternalId());
    }

    @Test
    @DisplayName("11. Geoapify persisted activity does not appear in curated activities endpoint")
    void test11_GeoapifyActivityNotInCuratedEndpoint() {
        CreateTripRequest req = new CreateTripRequest("Curated Filter Trip", "Desc", LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 5), null);
        TripResponse trip = tripService.createTrip(req, owner);

        TripStopResponse stop = tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(jaipurDest.getId(), LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 5), null), owner);

        AddDiscoveredActivityRequest discReq = new AddDiscoveredActivityRequest(
                "geoapify_jaipur_cafe", "Chokhi Dhani Cafe", "Tonk Road", "FOOD", 26.7667, 75.8333, "Tonk Road", null, LocalDate.of(2026, 12, 2), null, null, null
        );
        tripActivityService.addDiscoveredActivityToStop(trip.getId(), stop.getId(), discReq, owner);

        var curatedList = activityService.getCuratedActivitiesForDestination(jaipurDest.getId());

        assertTrue(curatedList.stream().allMatch(a -> "CURATED".equalsIgnoreCase(a.getSource())));
        assertTrue(curatedList.stream().noneMatch(a -> "geoapify_jaipur_cafe".equalsIgnoreCase(a.getExternalId())));
    }

    @Test
    @DisplayName("12. Reject unauthenticated / unauthorized trip modification")
    void test12_RejectUnauthorizedTripModification() {
        CreateTripRequest req = new CreateTripRequest("Owner Trip", "Desc", LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 5), null);
        TripResponse trip = tripService.createTrip(req, owner);

        assertThrows(ResourceNotFoundException.class, () ->
                tripStopService.createTripStop(trip.getId(), new CreateTripStopRequest(bengaluruDest.getId(), LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 5), null), attacker)
        );
    }

    @Test
    @DisplayName("13. Reject Geoapify activity addition to a stop belonging to another trip")
    void test13_RejectGeoapifyActivityAdditionToCrossTripStop() {
        CreateTripRequest req1 = new CreateTripRequest("Trip 1", "Desc", LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 5), null);
        TripResponse trip1 = tripService.createTrip(req1, owner);

        CreateTripRequest req2 = new CreateTripRequest("Trip 2", "Desc", LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 5), null);
        TripResponse trip2 = tripService.createTrip(req2, owner);

        TripStopResponse stopTrip1 = tripStopService.createTripStop(trip1.getId(), new CreateTripStopRequest(bengaluruDest.getId(), LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 5), null), owner);

        AddDiscoveredActivityRequest discReq = new AddDiscoveredActivityRequest(
                "geoapify_cross_check", "Cross Stop Test", "Desc", "FOOD", 12.97, 77.59, "Address", null, LocalDate.of(2026, 7, 2), null, null, null
        );

        assertThrows(ResourceNotFoundException.class, () ->
                tripActivityService.addDiscoveredActivityToStop(trip2.getId(), stopTrip1.getId(), discReq, owner)
        );
    }
}
