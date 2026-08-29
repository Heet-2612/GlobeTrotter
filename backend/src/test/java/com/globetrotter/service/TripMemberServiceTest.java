package com.globetrotter.service;

import com.globetrotter.dto.AddTripMemberRequest;
import com.globetrotter.dto.TripMemberResponse;
import com.globetrotter.entity.Trip;
import com.globetrotter.entity.TripMember;
import com.globetrotter.entity.User;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.TripMemberRepository;
import com.globetrotter.repository.TripRepository;
import com.globetrotter.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class TripMemberServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private TripMemberRepository tripMemberRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TripMemberService tripMemberService;

    private User owner;
    private User regularUser;
    private Trip trip;

    @BeforeEach
    void setUp() {
        owner = User.builder()
                .id(1L)
                .name("Aditya Owner")
                .email("owner@example.com")
                .build();

        regularUser = User.builder()
                .id(17L)
                .name("Rahul Member")
                .email("rahul@example.com")
                .build();

        trip = Trip.builder()
                .id(100L)
                .user(owner)
                .name("Himalayan Adventure")
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(5))
                .build();
    }

    @Test
    void test1_TripCreatorAutomaticallyBecomesOwnerMember() {
        when(tripMemberRepository.findByTripIdAndUserId(100L, 1L)).thenReturn(Optional.empty());
        when(tripMemberRepository.save(any(TripMember.class))).thenAnswer(i -> i.getArgument(0));

        TripMember result = tripMemberService.ensureOwnerIsMember(trip);

        assertNotNull(result);
        assertEquals(owner, result.getUser());
        assertEquals("Aditya Owner", result.getFullName());
        assertEquals("OWNER", result.getRole());
        assertEquals("ACTIVE", result.getStatus());
        assertTrue(result.isGtUser());
    }

    @Test
    void test2_AddExistingGtUser() {
        AddTripMemberRequest req = new AddTripMemberRequest(17L, null);
        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(tripRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(trip));
        when(userRepository.findById(17L)).thenReturn(Optional.of(regularUser));
        when(tripMemberRepository.findByTripIdAndUserId(100L, 17L)).thenReturn(Optional.empty());
        when(tripMemberRepository.save(any(TripMember.class))).thenAnswer(i -> {
            TripMember m = i.getArgument(0);
            m.setId(200L);
            return m;
        });

        TripMemberResponse res = tripMemberService.addTripMember(100L, req, owner);

        assertNotNull(res);
        assertEquals(17L, res.getUserId());
        assertEquals("Rahul Member", res.getFullName());
        assertTrue(res.isGtUser());
        assertEquals("MEMBER", res.getRole());
        assertEquals("ACTIVE", res.getStatus());
    }

    @Test
    void test3_AddNonGtContributor() {
        AddTripMemberRequest req = new AddTripMemberRequest(null, "Priya Patel");
        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(tripRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(trip));
        when(tripMemberRepository.save(any(TripMember.class))).thenAnswer(i -> {
            TripMember m = i.getArgument(0);
            m.setId(300L);
            return m;
        });

        TripMemberResponse res = tripMemberService.addTripMember(100L, req, owner);

        assertNotNull(res);
        assertNull(res.getUserId());
        assertEquals("Priya Patel", res.getFullName());
        assertFalse(res.isGtUser());
        assertEquals("MEMBER", res.getRole());
        assertEquals("ACTIVE", res.getStatus());
    }

    @Test
    void test4_GtUserNotFound_ThrowsException() {
        AddTripMemberRequest req = new AddTripMemberRequest(999L, null);
        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(tripRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(trip));
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> tripMemberService.addTripMember(100L, req, owner));
    }

    @Test
    void test5_DuplicateGtUser_Rejected() {
        AddTripMemberRequest req = new AddTripMemberRequest(17L, null);
        TripMember existingMember = TripMember.builder()
                .id(200L)
                .trip(trip)
                .user(regularUser)
                .fullName("Rahul Member")
                .role("MEMBER")
                .status("ACTIVE")
                .build();

        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(tripRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(trip));
        when(userRepository.findById(17L)).thenReturn(Optional.of(regularUser));
        when(tripMemberRepository.findByTripIdAndUserId(100L, 17L)).thenReturn(Optional.of(existingMember));

        assertThrows(IllegalArgumentException.class, () -> tripMemberService.addTripMember(100L, req, owner));
    }

    @Test
    void test6_OwnerCannotBeDuplicated() {
        AddTripMemberRequest req = new AddTripMemberRequest(1L, null);
        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(tripRepository.findByIdAndUserId(100L, 1L)).thenReturn(Optional.of(trip));
        when(userRepository.findById(1L)).thenReturn(Optional.of(owner));

        assertThrows(IllegalArgumentException.class, () -> tripMemberService.addTripMember(100L, req, owner));
    }

    @Test
    void test7_NonOwnerCannotManageContributors() {
        AddTripMemberRequest req = new AddTripMemberRequest(null, "Test Member");
        when(tripRepository.findById(100L)).thenReturn(Optional.of(trip));
        when(tripRepository.findByIdAndUserId(100L, 17L)).thenReturn(Optional.empty());

        assertThrows(AccessDeniedException.class, () -> tripMemberService.addTripMember(100L, req, regularUser));
    }

    @Test
    void test8_ActiveGtMemberCanViewSharedTrip() {
        when(tripRepository.findByIdAndUserId(100L, 17L)).thenReturn(Optional.empty());
        when(tripMemberRepository.existsByTripIdAndUserIdAndStatus(100L, 17L, "ACTIVE")).thenReturn(true);

        assertTrue(tripMemberService.isActiveTripMember(100L, 17L));
    }

    @Test
    void test9_NonMemberCannotAccessProtectedTrip() {
        when(tripRepository.findByIdAndUserId(100L, 999L)).thenReturn(Optional.empty());
        when(tripMemberRepository.existsByTripIdAndUserIdAndStatus(100L, 999L, "ACTIVE")).thenReturn(false);

        assertFalse(tripMemberService.isActiveTripMember(100L, 999L));
    }

    @Test
    void test10_DeactivatedMemberLosesAccess() {
        when(tripRepository.findByIdAndUserId(100L, 17L)).thenReturn(Optional.empty());
        when(tripMemberRepository.existsByTripIdAndUserIdAndStatus(100L, 17L, "ACTIVE")).thenReturn(false);

        assertFalse(tripMemberService.isActiveTripMember(100L, 17L));
    }

    @Test
    void test11_ManualContributorDoesNotReceiveAccountAccess() {
        TripMember manual = TripMember.builder()
                .id(300L)
                .trip(trip)
                .user(null)
                .fullName("Priya Patel")
                .role("MEMBER")
                .status("ACTIVE")
                .build();

        assertNull(manual.getUser());
        assertFalse(manual.isGtUser());
    }

    @Test
    void test12_MemberDtoDoesNotExposeSensitiveUserInfo() {
        TripMember member = TripMember.builder()
                .id(200L)
                .trip(trip)
                .user(regularUser)
                .fullName("Rahul Member")
                .role("MEMBER")
                .status("ACTIVE")
                .build();

        TripMemberResponse res = TripMemberResponse.fromEntity(member);
        assertEquals(200L, res.getId());
        assertEquals(100L, res.getTripId());
        assertEquals(17L, res.getUserId());
        assertEquals("Rahul Member", res.getFullName());
        assertTrue(res.isGtUser());
        assertEquals("MEMBER", res.getRole());
        assertEquals("ACTIVE", res.getStatus());
    }
}
