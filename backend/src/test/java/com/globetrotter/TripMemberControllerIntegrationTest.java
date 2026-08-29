package com.globetrotter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetrotter.dto.AddTripMemberRequest;
import com.globetrotter.dto.CreateTripRequest;
import com.globetrotter.dto.TripResponse;
import com.globetrotter.entity.User;
import com.globetrotter.repository.UserRepository;
import com.globetrotter.security.JwtTokenProvider;
import com.globetrotter.service.TripMemberService;
import com.globetrotter.service.TripService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class TripMemberControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripService tripService;

    @Autowired
    private TripMemberService tripMemberService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User ownerUser;
    private User memberUser;
    private User unrelatedUser;
    private TripResponse trip;
    private String ownerToken;
    private String memberToken;
    private String unrelatedToken;

    @BeforeEach
    void setUp() {
        ownerUser = userRepository.save(User.builder()
                .name("Owner Aditya")
                .email("owner_http_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .build());

        memberUser = userRepository.save(User.builder()
                .name("Member Rahul")
                .email("member_http_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .build());

        unrelatedUser = userRepository.save(User.builder()
                .name("Unrelated Sneha")
                .email("unrelated_http_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .build());

        CreateTripRequest tripReq = new CreateTripRequest(
                "Goa Beach Vacation",
                "Trip to Goa",
                LocalDate.now(),
                LocalDate.now().plusDays(5),
                null,
                new BigDecimal("40000.00")
        );
        trip = tripService.createTrip(tripReq, ownerUser);

        // Add memberUser to trip
        tripMemberService.addTripMember(trip.getId(), new AddTripMemberRequest(memberUser.getId(), null), ownerUser);

        // Generate JWT tokens
        ownerToken = jwtTokenProvider.generateToken(ownerUser.getEmail());
        memberToken = jwtTokenProvider.generateToken(memberUser.getEmail());
        unrelatedToken = jwtTokenProvider.generateToken(unrelatedUser.getEmail());
    }

    @Test
    void test1_AuthenticatedTripOwner_GetMembersSucceeds() throws Exception {
        mockMvc.perform(get("/api/trips/{tripId}/members", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].fullName").exists());
    }

    @Test
    void test2_AuthenticatedActiveGtMember_GetMembersSucceeds() throws Exception {
        mockMvc.perform(get("/api/trips/{tripId}/members", trip.getId())
                        .header("Authorization", "Bearer " + memberToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void test3_UnauthenticatedRequest_Returns401() throws Exception {
        mockMvc.perform(get("/api/trips/{tripId}/members", trip.getId()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void test4_AuthenticatedUnrelatedGtUser_Returns403() throws Exception {
        mockMvc.perform(get("/api/trips/{tripId}/members", trip.getId())
                        .header("Authorization", "Bearer " + unrelatedToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void test5_OwnerCanPostMember() throws Exception {
        AddTripMemberRequest addReq = new AddTripMemberRequest(null, "Guest Anjali");

        mockMvc.perform(post("/api/trips/{tripId}/members", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.fullName").value("Guest Anjali"))
                .andExpect(jsonPath("$.isGtUser").value(false));
    }

    @Test
    void test6_NonOwnerMemberCannotPostMember_Returns403() throws Exception {
        AddTripMemberRequest addReq = new AddTripMemberRequest(null, "Guest Anjali");

        mockMvc.perform(post("/api/trips/{tripId}/members", trip.getId())
                        .header("Authorization", "Bearer " + memberToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isForbidden());
    }

    @Test
    void test7_OwnerCanDeleteMember() throws Exception {
        // Add a contributor to remove
        var res = tripMemberService.addTripMember(trip.getId(), new AddTripMemberRequest(null, "Guest Temp"), ownerUser);

        mockMvc.perform(delete("/api/trips/{tripId}/members/{memberId}", trip.getId(), res.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isNoContent());
    }

    @Test
    void test8_NonOwnerCannotDeleteMember_Returns403() throws Exception {
        var res = tripMemberService.addTripMember(trip.getId(), new AddTripMemberRequest(null, "Guest Temp"), ownerUser);

        mockMvc.perform(delete("/api/trips/{tripId}/members/{memberId}", trip.getId(), res.getId())
                        .header("Authorization", "Bearer " + memberToken))
                .andExpect(status().isForbidden());
    }
}
