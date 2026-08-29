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
    private com.globetrotter.service.TripExpenseService tripExpenseService;

    @Autowired
    private com.globetrotter.service.TripSettlementService tripSettlementService;

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

    @Test
    void test9_DeactivateMember_WhoOwesMoney_Returns400() throws Exception {
        var members = tripMemberService.getTripMembers(trip.getId(), ownerUser.getId());
        var ownerMem = members.stream().filter(m -> "OWNER".equals(m.getRole())).findFirst().orElseThrow();
        var guestMem = members.stream().filter(m -> !"OWNER".equals(m.getRole())).findFirst().orElseThrow();

        // Create an expense paid by owner, split equally with guest
        com.globetrotter.dto.CreateExpenseRequest expReq = new com.globetrotter.dto.CreateExpenseRequest(
                "Dinner at Fisherman's Wharf",
                new BigDecimal("2000.00"),
                "INR",
                com.globetrotter.entity.ExpenseCategory.FOOD,
                LocalDate.now(),
                com.globetrotter.entity.SplitType.EQUAL,
                ownerMem.getId(),
                null,
                null,
                java.util.List.of(
                        new com.globetrotter.dto.ExpenseParticipantRequest(ownerMem.getId(), null, null),
                        new com.globetrotter.dto.ExpenseParticipantRequest(guestMem.getId(), null, null)
                )
        );
        tripExpenseService.createExpense(trip.getId(), expReq, ownerUser);

        // Attempt to remove guestMem who owes ₹1,000.00
        mockMvc.perform(delete("/api/trips/{tripId}/members/{memberId}", trip.getId(), guestMem.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("unsettled balance of ₹1000.00. Please settle the balance first.")));
    }

    @Test
    void test10_DeactivateMember_WhoIsOwedMoney_Returns400() throws Exception {
        var members = tripMemberService.getTripMembers(trip.getId(), ownerUser.getId());
        var ownerMem = members.stream().filter(m -> "OWNER".equals(m.getRole())).findFirst().orElseThrow();
        var guestMem = members.stream().filter(m -> !"OWNER".equals(m.getRole())).findFirst().orElseThrow();

        // Create an expense paid by guest, split equally
        com.globetrotter.dto.CreateExpenseRequest expReq = new com.globetrotter.dto.CreateExpenseRequest(
                "Beach Scuba Diving",
                new BigDecimal("3000.00"),
                "INR",
                com.globetrotter.entity.ExpenseCategory.ACTIVITY,
                LocalDate.now(),
                com.globetrotter.entity.SplitType.EQUAL,
                guestMem.getId(),
                null,
                null,
                java.util.List.of(
                        new com.globetrotter.dto.ExpenseParticipantRequest(ownerMem.getId(), null, null),
                        new com.globetrotter.dto.ExpenseParticipantRequest(guestMem.getId(), null, null)
                )
        );
        tripExpenseService.createExpense(trip.getId(), expReq, ownerUser);

        // Attempt to remove guestMem who is owed ₹1,500.00
        mockMvc.perform(delete("/api/trips/{tripId}/members/{memberId}", trip.getId(), guestMem.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("are owed ₹1500.00. Please settle the balance first.")));
    }

    @Test
    void test11_DeactivateMember_AfterSettlingBalanceToZero_Succeeds() throws Exception {
        var members = tripMemberService.getTripMembers(trip.getId(), ownerUser.getId());
        var ownerMem = members.stream().filter(m -> "OWNER".equals(m.getRole())).findFirst().orElseThrow();
        var guestMem = members.stream().filter(m -> !"OWNER".equals(m.getRole())).findFirst().orElseThrow();

        // Create an expense: owner pays ₹2,000, split equally (guest owes ₹1,000)
        com.globetrotter.dto.CreateExpenseRequest expReq = new com.globetrotter.dto.CreateExpenseRequest(
                "Scooter Rental",
                new BigDecimal("2000.00"),
                "INR",
                com.globetrotter.entity.ExpenseCategory.TRANSPORT,
                LocalDate.now(),
                com.globetrotter.entity.SplitType.EQUAL,
                ownerMem.getId(),
                null,
                null,
                java.util.List.of(
                        new com.globetrotter.dto.ExpenseParticipantRequest(ownerMem.getId(), null, null),
                        new com.globetrotter.dto.ExpenseParticipantRequest(guestMem.getId(), null, null)
                )
        );
        tripExpenseService.createExpense(trip.getId(), expReq, ownerUser);

        // Record settlement: guest pays owner ₹1,000
        com.globetrotter.dto.CreateSettlementRequest settleReq = new com.globetrotter.dto.CreateSettlementRequest(
                guestMem.getId(),
                ownerMem.getId(),
                new BigDecimal("1000.00"),
                "INR",
                LocalDate.now(),
                "UPI Transfer"
        );
        tripSettlementService.createSettlement(trip.getId(), settleReq, ownerUser);

        // Now guest balance is ₹0.00 -> Deactivation succeeds with 204 No Content
        mockMvc.perform(delete("/api/trips/{tripId}/members/{memberId}", trip.getId(), guestMem.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isNoContent());
    }

    @Test
    void test12_DeactivateMember_MultiPayerExpenseBalanceCheck() throws Exception {
        // Add third contributor
        var thirdMem = tripMemberService.addTripMember(trip.getId(), new AddTripMemberRequest(null, "Charlie Third"), ownerUser);
        var members = tripMemberService.getTripMembers(trip.getId(), ownerUser.getId());
        var ownerMem = members.stream().filter(m -> "OWNER".equals(m.getRole())).findFirst().orElseThrow();
        var guestMem = members.stream().filter(m -> m.getUserId() != null && m.getUserId().equals(memberUser.getId())).findFirst().orElseThrow();

        // Multi-payer expense: ₹1,200 total
        // Owner pays ₹800, Guest pays ₹400
        // Split equally between Owner (₹400), Guest (₹400), Charlie (₹400)
        // Owner net: +₹400
        // Guest net: ₹0.00
        // Charlie net: -₹400
        com.globetrotter.dto.CreateExpenseRequest multiReq = new com.globetrotter.dto.CreateExpenseRequest(
                "Group Kayaking Tour",
                new BigDecimal("1200.00"),
                "INR",
                com.globetrotter.entity.ExpenseCategory.ACTIVITY,
                LocalDate.now(),
                com.globetrotter.entity.SplitType.EQUAL,
                null,
                java.util.List.of(
                        new com.globetrotter.dto.ExpensePayerRequest(ownerMem.getId(), new BigDecimal("800.00")),
                        new com.globetrotter.dto.ExpensePayerRequest(guestMem.getId(), new BigDecimal("400.00"))
                ),
                null,
                null,
                java.util.List.of(
                        new com.globetrotter.dto.ExpenseParticipantRequest(ownerMem.getId(), null, null),
                        new com.globetrotter.dto.ExpenseParticipantRequest(guestMem.getId(), null, null),
                        new com.globetrotter.dto.ExpenseParticipantRequest(thirdMem.getId(), null, null)
                )
        );
        tripExpenseService.createExpense(trip.getId(), multiReq, ownerUser);

        // Charlie owes ₹400 -> removal blocked
        mockMvc.perform(delete("/api/trips/{tripId}/members/{memberId}", trip.getId(), thirdMem.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("unsettled balance of ₹400.00")));

        // Guest balance is ₹0.00 -> removal succeeds!
        mockMvc.perform(delete("/api/trips/{tripId}/members/{memberId}", trip.getId(), guestMem.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isNoContent());
    }
}
