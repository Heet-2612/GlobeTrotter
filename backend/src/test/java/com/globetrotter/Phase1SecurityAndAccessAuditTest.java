package com.globetrotter;

import com.globetrotter.dto.*;
import com.globetrotter.entity.Trip;
import com.globetrotter.entity.TripMember;
import com.globetrotter.entity.User;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.*;
import com.globetrotter.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class Phase1SecurityAndAccessAuditTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripMemberRepository tripMemberRepository;

    @Autowired
    private TripService tripService;

    @Autowired
    private TripMemberService tripMemberService;

    @Autowired
    private TripStopService tripStopService;

    @Autowired
    private TripActivityService tripActivityService;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private DestinationRepository destinationRepository;

    private User ownerUser;
    private User memberUser;
    private User nonMemberUser;
    private TripResponse createdTrip;

    @BeforeEach
    void setUp() {
        ownerUser = userRepository.save(User.builder()
                .name("Audit Owner")
                .email("auditowner_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .build());

        memberUser = userRepository.save(User.builder()
                .name("Audit Member")
                .email("auditmember_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .build());

        nonMemberUser = userRepository.save(User.builder()
                .name("Audit NonMember")
                .email("auditnonmember_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .build());

        CreateTripRequest createReq = new CreateTripRequest(
                "Audit Himalayan Trip",
                "Description for audit",
                LocalDate.now(),
                LocalDate.now().plusDays(7),
                null,
                new BigDecimal("50000.00")
        );

        createdTrip = tripService.createTrip(createReq, ownerUser);

        // Add memberUser as GT member
        tripMemberService.addTripMember(createdTrip.getId(), new AddTripMemberRequest(memberUser.getId(), null), ownerUser);
    }

    @Test
    void test1_OwnerAutoMembershipAndBackfill() {
        List<TripMember> members = tripMemberRepository.findByTripId(createdTrip.getId());
        assertTrue(members.stream().anyMatch(m -> m.getUser() != null && m.getUser().getId().equals(ownerUser.getId()) && "OWNER".equals(m.getRole())));
    }

    @Test
    void test2_ActiveGtMemberCanViewSharedTripAndAppearsInUserTrips() {
        // Active GT member gets trip in dashboard
        List<TripResponse> memberTrips = tripService.getUserTrips(memberUser);
        assertTrue(memberTrips.stream().anyMatch(t -> t.getId().equals(createdTrip.getId())));

        // Active GT member can view trip details
        TripResponse retrieved = tripService.getTripById(createdTrip.getId(), memberUser);
        assertEquals(createdTrip.getId(), retrieved.getId());

        // Active GT member can view budget summary
        BudgetSummaryResponse budget = budgetService.getTripBudgetSummary(createdTrip.getId(), memberUser);
        assertNotNull(budget);
    }

    @Test
    void test3_ActiveGtMemberCannotPerformOwnerMutations() {
        Long tripId = createdTrip.getId();

        // 1. Cannot edit trip
        UpdateTripRequest updateReq = new UpdateTripRequest("Hacked Name", "Hacked", LocalDate.now(), LocalDate.now().plusDays(7), null, new BigDecimal("1000.00"));
        assertThrows(ResourceNotFoundException.class, () -> tripService.updateTrip(tripId, updateReq, memberUser));

        // 2. Cannot delete trip
        assertThrows(ResourceNotFoundException.class, () -> tripService.deleteTrip(tripId, memberUser));

        // 3. Cannot set budget
        assertThrows(ResourceNotFoundException.class, () -> budgetService.setTripBudget(tripId, new SetBudgetRequest(new BigDecimal("100.00")), memberUser));

        // 4. Cannot add contributor
        AddTripMemberRequest addReq = new AddTripMemberRequest(null, "Unapproved Person");
        assertThrows(AccessDeniedException.class, () -> tripMemberService.addTripMember(tripId, addReq, memberUser));

        // 5. Cannot remove contributor
        TripMemberResponse memberRes = tripMemberService.getTripMembers(tripId, ownerUser).stream()
                .filter(m -> !m.getRole().equals("OWNER"))
                .findFirst().orElseThrow();
        assertThrows(AccessDeniedException.class, () -> tripMemberService.deactivateMember(tripId, memberRes.getId(), memberUser));
    }

    @Test
    void test4_NonMemberHasZeroAccessToSharedTrip() {
        Long tripId = createdTrip.getId();

        assertThrows(ResourceNotFoundException.class, () -> tripService.getTripById(tripId, nonMemberUser));
        assertThrows(ResourceNotFoundException.class, () -> budgetService.getTripBudgetSummary(tripId, nonMemberUser));
        assertThrows(AccessDeniedException.class, () -> tripMemberService.getTripMembers(tripId, nonMemberUser));

        List<TripResponse> nonMemberTrips = tripService.getUserTrips(nonMemberUser);
        assertFalse(nonMemberTrips.stream().anyMatch(t -> t.getId().equals(tripId)));
    }

    @Test
    void test5_InactiveGtMemberLosesAccess() {
        Long tripId = createdTrip.getId();
        TripMemberResponse memberRes = tripMemberService.getTripMembers(tripId, ownerUser).stream()
                .filter(m -> m.getUserId() != null && m.getUserId().equals(memberUser.getId()))
                .findFirst().orElseThrow();

        // Owner deactivates member
        tripMemberService.deactivateMember(tripId, memberRes.getId(), ownerUser);

        // Deactivated member no longer sees trip in dashboard
        List<TripResponse> memberTrips = tripService.getUserTrips(memberUser);
        assertFalse(memberTrips.stream().anyMatch(t -> t.getId().equals(tripId)));

        // Deactivated member cannot view trip details
        assertThrows(ResourceNotFoundException.class, () -> tripService.getTripById(tripId, memberUser));
    }

    @Test
    void test6_NonGtContributorHasNoUserRecord() {
        Long tripId = createdTrip.getId();
        AddTripMemberRequest manualReq = new AddTripMemberRequest(null, "Guest Priya");
        TripMemberResponse res = tripMemberService.addTripMember(tripId, manualReq, ownerUser);

        assertNotNull(res);
        assertNull(res.getUserId());
        assertFalse(res.isGtUser());
        assertEquals("Guest Priya", res.getFullName());
    }

    @Test
    void test7_OwnerCannotBeDuplicatedOrDeactivated() {
        Long tripId = createdTrip.getId();

        // Re-adding owner throws IllegalArgumentException
        AddTripMemberRequest addOwnerReq = new AddTripMemberRequest(ownerUser.getId(), null);
        assertThrows(IllegalArgumentException.class, () -> tripMemberService.addTripMember(tripId, addOwnerReq, ownerUser));

        // Deactivating owner throws IllegalArgumentException
        TripMemberResponse ownerMemberRes = tripMemberService.getTripMembers(tripId, ownerUser).stream()
                .filter(m -> "OWNER".equals(m.getRole()))
                .findFirst().orElseThrow();

        assertThrows(IllegalArgumentException.class, () -> tripMemberService.deactivateMember(tripId, ownerMemberRes.getId(), ownerUser));
    }
}
