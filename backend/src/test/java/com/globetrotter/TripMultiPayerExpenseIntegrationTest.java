package com.globetrotter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetrotter.dto.*;
import com.globetrotter.entity.ExpenseCategory;
import com.globetrotter.entity.SplitType;
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
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class TripMultiPayerExpenseIntegrationTest {

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
    private User memberUser1;
    private User memberUser2;
    private User foreignUser;

    private TripResponse trip;
    private TripResponse foreignTrip;

    private TripMemberResponse ownerMember;
    private TripMemberResponse member1;
    private TripMemberResponse member2;
    private TripMemberResponse foreignMember;

    private String ownerToken;
    private String member1Token;
    private String foreignToken;

    @BeforeEach
    void setUp() {
        ownerUser = userRepository.save(User.builder()
                .name("Alice Owner")
                .email("alice_test_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .build());

        memberUser1 = userRepository.save(User.builder()
                .name("Bob Traveler")
                .email("bob_test_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .build());

        memberUser2 = userRepository.save(User.builder()
                .name("Charlie Explorer")
                .email("charlie_test_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .build());

        foreignUser = userRepository.save(User.builder()
                .name("Diana Stranger")
                .email("diana_test_" + System.currentTimeMillis() + "@example.com")
                .passwordHash("password")
                .build());

        ownerToken = jwtTokenProvider.generateToken(ownerUser.getEmail());
        member1Token = jwtTokenProvider.generateToken(memberUser1.getEmail());
        foreignToken = jwtTokenProvider.generateToken(foreignUser.getEmail());

        CreateTripRequest tripReq = new CreateTripRequest();
        tripReq.setName("Goa Beach Trip");
        tripReq.setStartDate(LocalDate.now());
        tripReq.setEndDate(LocalDate.now().plusDays(5));
        trip = tripService.createTrip(tripReq, ownerUser);

        CreateTripRequest foreignReq = new CreateTripRequest();
        foreignReq.setName("Himalayas Trip");
        foreignReq.setStartDate(LocalDate.now());
        foreignReq.setEndDate(LocalDate.now().plusDays(7));
        foreignTrip = tripService.createTrip(foreignReq, foreignUser);

        ownerMember = tripMemberService.getTripMembers(trip.getId(), ownerUser.getId()).stream()
                .filter(m -> "OWNER".equals(m.getRole()))
                .findFirst().orElseThrow();

        member1 = tripMemberService.addTripMember(trip.getId(), new AddTripMemberRequest(memberUser1.getId(), null), ownerUser);
        member2 = tripMemberService.addTripMember(trip.getId(), new AddTripMemberRequest(memberUser2.getId(), null), ownerUser);

        foreignMember = tripMemberService.getTripMembers(foreignTrip.getId(), foreignUser.getId()).stream()
                .filter(m -> "OWNER".equals(m.getRole()))
                .findFirst().orElseThrow();
    }

    @Test
    void test1_CreateSinglePayerExpenseViaApi_Success() throws Exception {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Welcome Drinks",
                new BigDecimal("900.00"),
                "INR",
                ExpenseCategory.FOOD,
                LocalDate.now(),
                SplitType.EQUAL,
                ownerMember.getId(),
                null,
                "Drinks at beach shack",
                List.of(
                        new ExpenseParticipantRequest(ownerMember.getId(), null, null),
                        new ExpenseParticipantRequest(member1.getId(), null, null),
                        new ExpenseParticipantRequest(member2.getId(), null, null)
                )
        );

        mockMvc.perform(post("/api/trips/{tripId}/expenses", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title", is("Welcome Drinks")))
                .andExpect(jsonPath("$.amount", is(900.0)))
                .andExpect(jsonPath("$.multiplePayers", is(false)))
                .andExpect(jsonPath("$.payer.id", is(ownerMember.getId().intValue())))
                .andExpect(jsonPath("$.payers", hasSize(1)))
                .andExpect(jsonPath("$.payers[0].memberId", is(ownerMember.getId().intValue())))
                .andExpect(jsonPath("$.payers[0].paidAmount", is(900.0)))
                .andExpect(jsonPath("$.participants", hasSize(3)));
    }

    @Test
    void test2_CreateTwoPayerExpenseViaApi_Success() throws Exception {
        List<ExpensePayerRequest> payers = List.of(
                new ExpensePayerRequest(ownerMember.getId(), new BigDecimal("600.00")),
                new ExpensePayerRequest(member1.getId(), new BigDecimal("400.00"))
        );
        List<ExpenseParticipantRequest> participants = List.of(
                new ExpenseParticipantRequest(ownerMember.getId(), null, null),
                new ExpenseParticipantRequest(member1.getId(), null, null),
                new ExpenseParticipantRequest(member2.getId(), null, null)
        );
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Resort Villa Booking",
                new BigDecimal("1000.00"),
                "INR",
                ExpenseCategory.ACCOMMODATION,
                LocalDate.now(),
                SplitType.EQUAL,
                null,
                payers,
                null,
                "Shared payment villa",
                participants
        );

        mockMvc.perform(post("/api/trips/{tripId}/expenses", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title", is("Resort Villa Booking")))
                .andExpect(jsonPath("$.amount", is(1000.0)))
                .andExpect(jsonPath("$.multiplePayers", is(true)))
                .andExpect(jsonPath("$.payers", hasSize(2)))
                .andExpect(jsonPath("$.payers[0].memberId", is(ownerMember.getId().intValue())))
                .andExpect(jsonPath("$.payers[0].paidAmount", is(600.0)))
                .andExpect(jsonPath("$.payers[1].memberId", is(member1.getId().intValue())))
                .andExpect(jsonPath("$.payers[1].paidAmount", is(400.0)));
    }

    @Test
    void test3_CreateThreePayerExpenseViaApi_Success() throws Exception {
        List<ExpensePayerRequest> payers = List.of(
                new ExpensePayerRequest(ownerMember.getId(), new BigDecimal("500.00")),
                new ExpensePayerRequest(member1.getId(), new BigDecimal("300.00")),
                new ExpensePayerRequest(member2.getId(), new BigDecimal("200.00"))
        );
        List<ExpenseParticipantRequest> participants = List.of(
                new ExpenseParticipantRequest(ownerMember.getId(), null, null),
                new ExpenseParticipantRequest(member1.getId(), null, null),
                new ExpenseParticipantRequest(member2.getId(), null, null)
        );
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Charter Boat Rental",
                new BigDecimal("1000.00"),
                "INR",
                ExpenseCategory.TRANSPORT,
                LocalDate.now(),
                SplitType.EQUAL,
                null,
                payers,
                null,
                "Boat cruise split",
                participants
        );

        mockMvc.perform(post("/api/trips/{tripId}/expenses", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.multiplePayers", is(true)))
                .andExpect(jsonPath("$.payers", hasSize(3)));
    }

    @Test
    void test4_MismatchedPayerSumRejectedViaApi() throws Exception {
        List<ExpensePayerRequest> payers = List.of(
                new ExpensePayerRequest(ownerMember.getId(), new BigDecimal("600.00")),
                new ExpensePayerRequest(member1.getId(), new BigDecimal("300.00")) // Sum 900 != 1000
        );
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Invalid Expense",
                new BigDecimal("1000.00"),
                "INR",
                ExpenseCategory.FOOD,
                LocalDate.now(),
                SplitType.EQUAL,
                null,
                payers,
                null,
                null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        mockMvc.perform(post("/api/trips/{tripId}/expenses", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("must exactly match expense total")));
    }

    @Test
    void test5_DuplicatePayerRejectedViaApi() throws Exception {
        List<ExpensePayerRequest> payers = List.of(
                new ExpensePayerRequest(ownerMember.getId(), new BigDecimal("500.00")),
                new ExpensePayerRequest(ownerMember.getId(), new BigDecimal("500.00"))
        );
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Duplicate Payer Expense",
                new BigDecimal("1000.00"),
                "INR",
                ExpenseCategory.FOOD,
                LocalDate.now(),
                SplitType.EQUAL,
                null,
                payers,
                null,
                null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        mockMvc.perform(post("/api/trips/{tripId}/expenses", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Duplicate payer member ID")));
    }

    @Test
    void test6_PayerFromAnotherTripRejectedViaApi() throws Exception {
        List<ExpensePayerRequest> payers = List.of(
                new ExpensePayerRequest(foreignMember.getId(), new BigDecimal("1000.00"))
        );
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Foreign Payer Expense",
                new BigDecimal("1000.00"),
                "INR",
                ExpenseCategory.FOOD,
                LocalDate.now(),
                SplitType.EQUAL,
                null,
                payers,
                null,
                null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        mockMvc.perform(post("/api/trips/{tripId}/expenses", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("does not belong to this trip")));
    }

    @Test
    void test7_NonPositivePayerAmountRejectedViaApi() throws Exception {
        List<ExpensePayerRequest> payers = List.of(
                new ExpensePayerRequest(ownerMember.getId(), new BigDecimal("1000.00")),
                new ExpensePayerRequest(member1.getId(), new BigDecimal("0.00"))
        );
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Zero Payer Expense",
                new BigDecimal("1000.00"),
                "INR",
                ExpenseCategory.FOOD,
                LocalDate.now(),
                SplitType.EQUAL,
                null,
                payers,
                null,
                null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        mockMvc.perform(post("/api/trips/{tripId}/expenses", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("must be greater than zero")));
    }

    @Test
    void test8_UpdateMultiPayerExpenseReplacesPayersCleanlyViaApi() throws Exception {
        List<ExpensePayerRequest> initialPayers = List.of(
                new ExpensePayerRequest(ownerMember.getId(), new BigDecimal("600.00")),
                new ExpensePayerRequest(member1.getId(), new BigDecimal("400.00"))
        );
        CreateExpenseRequest createReq = new CreateExpenseRequest(
                "Initial Tour",
                new BigDecimal("1000.00"),
                "INR",
                ExpenseCategory.ACTIVITY,
                LocalDate.now(),
                SplitType.EQUAL,
                null,
                initialPayers,
                null,
                null,
                List.of(
                        new ExpenseParticipantRequest(ownerMember.getId(), null, null),
                        new ExpenseParticipantRequest(member1.getId(), null, null)
                )
        );

        String createResponseJson = mockMvc.perform(post("/api/trips/{tripId}/expenses", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        ExpenseResponse created = objectMapper.readValue(createResponseJson, ExpenseResponse.class);

        List<ExpensePayerRequest> updatedPayers = List.of(
                new ExpensePayerRequest(ownerMember.getId(), new BigDecimal("250.00")),
                new ExpensePayerRequest(member1.getId(), new BigDecimal("750.00"))
        );
        UpdateExpenseRequest updateReq = new UpdateExpenseRequest(
                "Updated Tour Title",
                new BigDecimal("1000.00"),
                "INR",
                ExpenseCategory.ACTIVITY,
                LocalDate.now(),
                SplitType.EQUAL,
                null,
                updatedPayers,
                null,
                "Reallocated payers",
                List.of(
                        new ExpenseParticipantRequest(ownerMember.getId(), null, null),
                        new ExpenseParticipantRequest(member1.getId(), null, null)
                )
        );

        mockMvc.perform(put("/api/trips/{tripId}/expenses/{expenseId}", trip.getId(), created.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Updated Tour Title")))
                .andExpect(jsonPath("$.multiplePayers", is(true)))
                .andExpect(jsonPath("$.payers", hasSize(2)))
                .andExpect(jsonPath("$.payers[0].paidAmount", is(250.0)))
                .andExpect(jsonPath("$.payers[1].paidAmount", is(750.0)));
    }

    @Test
    void test9_DeleteMultiPayerExpenseViaApi_Success() throws Exception {
        List<ExpensePayerRequest> payers = List.of(
                new ExpensePayerRequest(ownerMember.getId(), new BigDecimal("500.00")),
                new ExpensePayerRequest(member1.getId(), new BigDecimal("500.00"))
        );
        CreateExpenseRequest createReq = new CreateExpenseRequest(
                "Temporary Expense",
                new BigDecimal("1000.00"),
                "INR",
                ExpenseCategory.SHOPPING,
                LocalDate.now(),
                SplitType.EQUAL,
                null,
                payers,
                null,
                null,
                List.of(new ExpenseParticipantRequest(ownerMember.getId(), null, null))
        );

        String createResponseJson = mockMvc.perform(post("/api/trips/{tripId}/expenses", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        ExpenseResponse created = objectMapper.readValue(createResponseJson, ExpenseResponse.class);

        mockMvc.perform(delete("/api/trips/{tripId}/expenses/{expenseId}", trip.getId(), created.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/trips/{tripId}/expenses/{expenseId}", trip.getId(), created.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void test10_BalancesAndDebtSimplificationAfterMultiPayerExpense() throws Exception {
        List<ExpensePayerRequest> payers = List.of(
                new ExpensePayerRequest(ownerMember.getId(), new BigDecimal("800.00")),
                new ExpensePayerRequest(member1.getId(), new BigDecimal("400.00"))
        );
        List<ExpenseParticipantRequest> participants = List.of(
                new ExpenseParticipantRequest(ownerMember.getId(), null, null),
                new ExpenseParticipantRequest(member1.getId(), null, null),
                new ExpenseParticipantRequest(member2.getId(), null, null)
        );

        CreateExpenseRequest req = new CreateExpenseRequest(
                "Shared Villa",
                new BigDecimal("1200.00"),
                "INR",
                ExpenseCategory.ACCOMMODATION,
                LocalDate.now(),
                SplitType.EQUAL,
                null,
                payers,
                null,
                null,
                participants
        );

        mockMvc.perform(post("/api/trips/{tripId}/expenses", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        String balancesJson = mockMvc.perform(get("/api/trips/{tripId}/balances", trip.getId())
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTripExpenses", is(1200.0)))
                .andExpect(jsonPath("$.simplifiedTransfers", hasSize(1)))
                .andExpect(jsonPath("$.simplifiedTransfers[0].fromMemberId", is(member2.getId().intValue())))
                .andExpect(jsonPath("$.simplifiedTransfers[0].toMemberId", is(ownerMember.getId().intValue())))
                .andExpect(jsonPath("$.simplifiedTransfers[0].amount", is(400.0)))
                .andReturn().getResponse().getContentAsString();

        TripBalanceResponse balanceResponse = objectMapper.readValue(balancesJson, TripBalanceResponse.class);
        BigDecimal sumNet = balanceResponse.getMemberBalances().stream()
                .map(MemberBalanceResponse::getNetBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        assertEquals(new BigDecimal("0.00"), sumNet);
    }
}
