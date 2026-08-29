package com.globetrotter.service;

import com.globetrotter.dto.*;
import com.globetrotter.entity.*;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.*;
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
class TripSettlementServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripMemberRepository tripMemberRepository;

    @Autowired
    private TripExpenseService tripExpenseService;

    @Autowired
    private TripBalanceService tripBalanceService;

    @Autowired
    private TripSettlementService tripSettlementService;

    @Autowired
    private TripMemberService tripMemberService;

    @Autowired
    private TripExpenseRepository tripExpenseRepository;

    @Autowired
    private TripSettlementRepository tripSettlementRepository;

    private User ownerA;
    private User memberA1;
    private User memberA2;
    private User ownerB;
    private Trip tripA;
    private Trip tripB;

    private TripMember mOwnerA;
    private TripMember mMemberA1;
    private TripMember mMemberA2;
    private TripMember mGuestA;
    private TripMember mInactiveA;

    private TripMember mOwnerB;

    @BeforeEach
    void setUp() {
        long ts = System.currentTimeMillis();
        ownerA = userRepository.save(User.builder().name("Aditya Owner").email("ownerA_" + ts + "@test.com").passwordHash("pwd").build());
        memberA1 = userRepository.save(User.builder().name("Rahul Member").email("rahul_" + ts + "@test.com").passwordHash("pwd").build());
        memberA2 = userRepository.save(User.builder().name("Vikram Member").email("vikram_" + ts + "@test.com").passwordHash("pwd").build());
        ownerB = userRepository.save(User.builder().name("Owner B").email("ownerB_" + ts + "@test.com").passwordHash("pwd").build());

        tripA = tripRepository.save(Trip.builder().user(ownerA).name("Goa Trip").startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(5)).build());
        tripB = tripRepository.save(Trip.builder().user(ownerB).name("Manali Trip").startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(5)).build());

        mOwnerA = tripMemberService.ensureOwnerIsMember(tripA);
        mMemberA1 = tripMemberRepository.save(TripMember.builder().trip(tripA).user(memberA1).fullName("Rahul Member").role("MEMBER").status("ACTIVE").build());
        mMemberA2 = tripMemberRepository.save(TripMember.builder().trip(tripA).user(memberA2).fullName("Vikram Member").role("MEMBER").status("ACTIVE").build());
        mGuestA = tripMemberRepository.save(TripMember.builder().trip(tripA).user(null).fullName("Priya Guest").role("MEMBER").status("ACTIVE").build());
        mInactiveA = tripMemberRepository.save(TripMember.builder().trip(tripA).user(null).fullName("Old Guest").role("MEMBER").status("INACTIVE").build());

        mOwnerB = tripMemberService.ensureOwnerIsMember(tripB);
    }

    private ExpenseResponse createTestExpense(BigDecimal amount, TripMember payer, List<TripMember> participants) {
        List<ExpenseParticipantRequest> partReqs = participants.stream()
                .map(p -> new ExpenseParticipantRequest(p.getId(), null, null))
                .toList();

        CreateExpenseRequest req = new CreateExpenseRequest(
                "Test Expense", amount, "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, payer.getId(), null, null, partReqs
        );
        return tripExpenseService.createExpense(tripA.getId(), req, ownerA);
    }

    @Test
    void test1_FullSettlementClearsDebt() {
        // Owner A pays 1000 for Owner A & Rahul (A1) -> Rahul owes 500
        createTestExpense(new BigDecimal("1000.00"), mOwnerA, List.of(mOwnerA, mMemberA1));

        TripBalanceResponse balBefore = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(1, balBefore.getSimplifiedTransfers().size());
        assertEquals(new BigDecimal("500.00"), balBefore.getSimplifiedTransfers().get(0).getAmount());

        // Rahul settles 500 to Owner A
        CreateSettlementRequest req = new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("500.00"), "INR", LocalDate.now(), "Full settlement");
        SettlementResponse res = tripSettlementService.createSettlement(tripA.getId(), req, memberA1);

        assertNotNull(res.getId());
        assertEquals(new BigDecimal("500.00"), res.getAmount());

        TripBalanceResponse balAfter = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertTrue(balAfter.getSimplifiedTransfers().isEmpty());
    }

    @Test
    void test2_PartialSettlementLeavesRemainingBalance() {
        // Owner A pays 1200 for Owner A & Rahul -> Rahul owes 600
        createTestExpense(new BigDecimal("1200.00"), mOwnerA, List.of(mOwnerA, mMemberA1));

        // Rahul settles 400 (partial)
        CreateSettlementRequest req = new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("400.00"), "INR", LocalDate.now(), "Partial");
        tripSettlementService.createSettlement(tripA.getId(), req, memberA1);

        TripBalanceResponse balAfter = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(1, balAfter.getSimplifiedTransfers().size());
        assertEquals(mMemberA1.getId(), balAfter.getSimplifiedTransfers().get(0).getFromMemberId());
        assertEquals(mOwnerA.getId(), balAfter.getSimplifiedTransfers().get(0).getToMemberId());
        assertEquals(new BigDecimal("200.00"), balAfter.getSimplifiedTransfers().get(0).getAmount());
    }

    @Test
    void test3_MultiplePartialSettlements() {
        createTestExpense(new BigDecimal("1000.00"), mOwnerA, List.of(mOwnerA, mMemberA1));

        // Payment 1: 200
        tripSettlementService.createSettlement(tripA.getId(), new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("200.00"), "INR", LocalDate.now(), "P1"), memberA1);
        // Payment 2: 200
        tripSettlementService.createSettlement(tripA.getId(), new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("200.00"), "INR", LocalDate.now(), "P2"), memberA1);
        // Payment 3: 100
        tripSettlementService.createSettlement(tripA.getId(), new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("100.00"), "INR", LocalDate.now(), "P3"), memberA1);

        TripBalanceResponse balAfter = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertTrue(balAfter.getSimplifiedTransfers().isEmpty());

        List<SettlementResponse> history = tripSettlementService.getTripSettlements(tripA.getId(), ownerA);
        assertEquals(3, history.size());
    }

    @Test
    void test4_OverpaymentRejection() {
        createTestExpense(new BigDecimal("1000.00"), mOwnerA, List.of(mOwnerA, mMemberA1)); // Rahul owes 500

        CreateSettlementRequest req = new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("600.00"), "INR", LocalDate.now(), "Overpay");
        assertThrows(IllegalArgumentException.class, () -> tripSettlementService.createSettlement(tripA.getId(), req, memberA1));
    }

    @Test
    void test5_GuestMemberSettlement() {
        createTestExpense(new BigDecimal("600.00"), mOwnerA, List.of(mOwnerA, mGuestA)); // Guest owes 300

        // Owner logs settlement for Guest -> Owner
        CreateSettlementRequest req = new CreateSettlementRequest(mGuestA.getId(), mOwnerA.getId(), new BigDecimal("300.00"), "INR", LocalDate.now(), "Guest paid cash");
        SettlementResponse res = tripSettlementService.createSettlement(tripA.getId(), req, ownerA);

        assertEquals(mGuestA.getId(), res.getPayerMemberId());
        assertEquals("Priya Guest", res.getPayerMemberName());

        TripBalanceResponse bal = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertTrue(bal.getSimplifiedTransfers().isEmpty());
    }

    @Test
    void test6_InactiveMemberSettlement() {
        mInactiveA.setStatus("ACTIVE");
        tripMemberRepository.save(mInactiveA);
        createTestExpense(new BigDecimal("800.00"), mOwnerA, List.of(mOwnerA, mInactiveA)); // Inactive owes 400
        mInactiveA.setStatus("INACTIVE");
        tripMemberRepository.save(mInactiveA);

        // Settle for inactive member
        CreateSettlementRequest req = new CreateSettlementRequest(mInactiveA.getId(), mOwnerA.getId(), new BigDecimal("400.00"), "INR", LocalDate.now(), "Inactive settled");
        tripSettlementService.createSettlement(tripA.getId(), req, ownerA);

        TripBalanceResponse bal = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertTrue(bal.getSimplifiedTransfers().isEmpty());
    }

    @Test
    void test7_CrossTripMemberRejection() {
        CreateSettlementRequest req = new CreateSettlementRequest(mOwnerB.getId(), mOwnerA.getId(), new BigDecimal("100.00"), "INR", LocalDate.now(), "Cross trip");
        assertThrows(IllegalArgumentException.class, () -> tripSettlementService.createSettlement(tripA.getId(), req, ownerA));
    }

    @Test
    void test8_SelfPaymentRejection() {
        CreateSettlementRequest req = new CreateSettlementRequest(mOwnerA.getId(), mOwnerA.getId(), new BigDecimal("100.00"), "INR", LocalDate.now(), "Self");
        assertThrows(IllegalArgumentException.class, () -> tripSettlementService.createSettlement(tripA.getId(), req, ownerA));
    }

    @Test
    void test9_UnauthorizedMemberCannotSettleThirdParty() {
        createTestExpense(new BigDecimal("1000.00"), mOwnerA, List.of(mOwnerA, mMemberA2)); // Vikram (A2) owes 500

        // Rahul (A1) tries to log settlement between Vikram (A2) & Owner (A)
        CreateSettlementRequest req = new CreateSettlementRequest(mMemberA2.getId(), mOwnerA.getId(), new BigDecimal("500.00"), "INR", LocalDate.now(), "Third party");
        assertThrows(AccessDeniedException.class, () -> tripSettlementService.createSettlement(tripA.getId(), req, memberA1));
    }

    @Test
    void test10_SettlementDeletionRecalculatesBalancesAndPreservesExpenses() {
        createTestExpense(new BigDecimal("1000.00"), mOwnerA, List.of(mOwnerA, mMemberA1)); // Rahul owes 500

        SettlementResponse res = tripSettlementService.createSettlement(tripA.getId(), new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("500.00"), "INR", LocalDate.now(), "Full"), memberA1);
        assertTrue(tripBalanceService.getTripBalances(tripA.getId(), ownerA).getSimplifiedTransfers().isEmpty());

        // Delete settlement
        tripSettlementService.deleteSettlement(tripA.getId(), res.getId(), memberA1);

        // Balances revert
        TripBalanceResponse balAfterDelete = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(1, balAfterDelete.getSimplifiedTransfers().size());
        assertEquals(new BigDecimal("500.00"), balAfterDelete.getSimplifiedTransfers().get(0).getAmount());

        // Expense remains completely intact
        assertEquals(1, tripExpenseRepository.findByTripIdOrderByExpenseDateDescCreatedAtDesc(tripA.getId()).size());
    }

    @Test
    void test11_SettlementBetweenNonDirectTransferPair() {
        // Owner A pays 3000 for A, Rahul (A1), Vikram (A2) -> Rahul owes 1000, Vikram owes 1000, Owner +2000
        createTestExpense(new BigDecimal("3000.00"), mOwnerA, List.of(mOwnerA, mMemberA1, mMemberA2));

        // Vikram (A2) owes 1000. Vikram pays Rahul (A1) 500 directly (even though simplified graph said Vikram -> Owner).
        // Then Vikram net balance becomes -500, Rahul net balance becomes -500, Owner net balance becomes +1000.
        CreateSettlementRequest req = new CreateSettlementRequest(mMemberA2.getId(), mMemberA1.getId(), new BigDecimal("500.00"), "INR", LocalDate.now(), "Bilateral payment");
        tripSettlementService.createSettlement(tripA.getId(), req, memberA2);

        TripBalanceResponse bal = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        // Zero-sum holds!
        BigDecimal sum = bal.getMemberBalances().stream().map(MemberBalanceResponse::getNetBalance).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertEquals(new BigDecimal("0.00"), sum);
    }

    @Test
    void test12_ZeroAndNegativeAmountRejection() {
        createTestExpense(new BigDecimal("1000.00"), mOwnerA, List.of(mOwnerA, mMemberA1));

        CreateSettlementRequest reqZero = new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), BigDecimal.ZERO, "INR", LocalDate.now(), "Zero");
        assertThrows(IllegalArgumentException.class, () -> tripSettlementService.createSettlement(tripA.getId(), reqZero, memberA1));

        CreateSettlementRequest reqNeg = new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("-50.00"), "INR", LocalDate.now(), "Negative");
        assertThrows(IllegalArgumentException.class, () -> tripSettlementService.createSettlement(tripA.getId(), reqNeg, memberA1));
    }

    @Test
    void test13_UnauthorizedDeletionRejection() {
        createTestExpense(new BigDecimal("1000.00"), mOwnerA, List.of(mOwnerA, mMemberA1));
        SettlementResponse res = tripSettlementService.createSettlement(tripA.getId(), new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("500.00"), "INR", LocalDate.now(), "Full"), memberA1);

        // Member A2 (not owner, not creator) tries to delete settlement
        assertThrows(AccessDeniedException.class, () -> tripSettlementService.deleteSettlement(tripA.getId(), res.getId(), memberA2));
    }
}
