package com.globetrotter;

import com.globetrotter.dto.*;
import com.globetrotter.entity.*;
import com.globetrotter.exception.ResourceNotFoundException;
import com.globetrotter.repository.*;
import com.globetrotter.service.TripExpenseService;
import com.globetrotter.service.TripMemberService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class Phase2SecurityAndDataIntegrityAuditTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private TripMemberRepository tripMemberRepository;

    @Autowired
    private TripStopRepository tripStopRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private TripActivityRepository tripActivityRepository;

    @Autowired
    private TripExpenseRepository tripExpenseRepository;

    @Autowired
    private ExpenseParticipantRepository expenseParticipantRepository;

    @Autowired
    private TripExpenseService tripExpenseService;

    @Autowired
    private TripMemberService tripMemberService;

    private User ownerA;
    private User memberA1;
    private User ownerB;
    private Trip tripA;
    private Trip tripB;

    private TripMember mOwnerA;
    private TripMember mMemberA1;
    private TripMember mGuestA;
    private TripMember mInactiveA;
    private TripMember mOwnerB;

    private TripActivity activityA;
    private TripActivity activityB;

    @BeforeEach
    void setUp() {
        long ts = System.currentTimeMillis();
        ownerA = userRepository.save(User.builder().name("Owner A").email("ownerA_" + ts + "@test.com").passwordHash("pwd").build());
        memberA1 = userRepository.save(User.builder().name("Member A1").email("memberA1_" + ts + "@test.com").passwordHash("pwd").build());
        ownerB = userRepository.save(User.builder().name("Owner B").email("ownerB_" + ts + "@test.com").passwordHash("pwd").build());

        tripA = tripRepository.save(Trip.builder().user(ownerA).name("Trip A").startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(5)).build());
        tripB = tripRepository.save(Trip.builder().user(ownerB).name("Trip B").startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(5)).build());

        mOwnerA = tripMemberService.ensureOwnerIsMember(tripA);
        mMemberA1 = tripMemberRepository.save(TripMember.builder().trip(tripA).user(memberA1).fullName("Member A1").role("MEMBER").status("ACTIVE").build());
        mGuestA = tripMemberRepository.save(TripMember.builder().trip(tripA).user(null).fullName("Guest Contributor A").role("MEMBER").status("ACTIVE").build());
        mInactiveA = tripMemberRepository.save(TripMember.builder().trip(tripA).user(null).fullName("Inactive Guest A").role("MEMBER").status("INACTIVE").build());

        mOwnerB = tripMemberService.ensureOwnerIsMember(tripB);

        Destination destA = destinationRepository.save(Destination.builder().name("Jaipur_" + ts).build());
        TripStop stopA = tripStopRepository.save(TripStop.builder().trip(tripA).destination(destA).stopOrder(1).startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(2)).build());
        Activity actA = activityRepository.save(Activity.builder().destination(destA).name("Amber Fort").category("HISTORIC").estimatedDurationMinutes(60).estimatedCost(100.0).currency("INR").build());
        activityA = tripActivityRepository.save(TripActivity.builder().tripStop(stopA).activity(actA).activityOrder(1).scheduledDate(LocalDate.now()).build());

        Destination destB = destinationRepository.save(Destination.builder().name("Munnar_" + ts).build());
        TripStop stopB = tripStopRepository.save(TripStop.builder().trip(tripB).destination(destB).stopOrder(1).startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(2)).build());
        Activity actB = activityRepository.save(Activity.builder().destination(destB).name("Tea Plantation").category("SIGHTSEEING").estimatedDurationMinutes(60).estimatedCost(100.0).currency("INR").build());
        activityB = tripActivityRepository.save(TripActivity.builder().tripStop(stopB).activity(actB).activityOrder(1).scheduledDate(LocalDate.now()).build());
    }

    // -------------------------------------------------------------
    // SECTION 3: MONEY & SPLIT PRECISION AUDIT
    // -------------------------------------------------------------

    @Test
    void testEqualSplitDifficultCases() {
        // Case 1: ₹100 / 3
        CreateExpenseRequest req1 = new CreateExpenseRequest(
                "Dinner 100", new BigDecimal("100.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null),
                        new ExpenseParticipantRequest(mMemberA1.getId(), null, null),
                        new ExpenseParticipantRequest(mGuestA.getId(), null, null))
        );
        ExpenseResponse res1 = tripExpenseService.createExpense(tripA.getId(), req1, ownerA);
        assertEquals(new BigDecimal("33.34"), res1.getParticipants().get(0).getShareAmount());
        assertEquals(new BigDecimal("33.33"), res1.getParticipants().get(1).getShareAmount());
        assertEquals(new BigDecimal("33.33"), res1.getParticipants().get(2).getShareAmount());
        assertEquals(new BigDecimal("100.00"), res1.getParticipants().stream().map(ExpenseParticipantResponse::getShareAmount).reduce(BigDecimal.ZERO, BigDecimal::add));

        // Case 2: ₹10 / 3
        CreateExpenseRequest req2 = new CreateExpenseRequest(
                "Tea 10", new BigDecimal("10.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null),
                        new ExpenseParticipantRequest(mMemberA1.getId(), null, null),
                        new ExpenseParticipantRequest(mGuestA.getId(), null, null))
        );
        ExpenseResponse res2 = tripExpenseService.createExpense(tripA.getId(), req2, ownerA);
        assertEquals(new BigDecimal("3.34"), res2.getParticipants().get(0).getShareAmount());
        assertEquals(new BigDecimal("3.33"), res2.getParticipants().get(1).getShareAmount());
        assertEquals(new BigDecimal("3.33"), res2.getParticipants().get(2).getShareAmount());
        assertEquals(new BigDecimal("10.00"), res2.getParticipants().stream().map(ExpenseParticipantResponse::getShareAmount).reduce(BigDecimal.ZERO, BigDecimal::add));

        // Case 3: ₹1 / 6
        List<ExpenseParticipantRequest> p6 = new ArrayList<>();
        p6.add(new ExpenseParticipantRequest(mOwnerA.getId(), null, null));
        p6.add(new ExpenseParticipantRequest(mMemberA1.getId(), null, null));
        p6.add(new ExpenseParticipantRequest(mGuestA.getId(), null, null));
        for (int i = 0; i < 3; i++) {
            TripMember extra = tripMemberRepository.save(TripMember.builder().trip(tripA).user(null).fullName("Extra " + i).role("MEMBER").status("ACTIVE").build());
            p6.add(new ExpenseParticipantRequest(extra.getId(), null, null));
        }
        CreateExpenseRequest req3 = new CreateExpenseRequest(
                "Matchbox 1", new BigDecimal("1.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null, p6
        );
        ExpenseResponse res3 = tripExpenseService.createExpense(tripA.getId(), req3, ownerA);
        assertEquals(6, res3.getParticipants().size());
        assertEquals(new BigDecimal("0.20"), res3.getParticipants().get(0).getShareAmount());
        for (int i = 1; i < 6; i++) {
            assertEquals(new BigDecimal("0.16"), res3.getParticipants().get(i).getShareAmount());
        }
        assertEquals(new BigDecimal("1.00"), res3.getParticipants().stream().map(ExpenseParticipantResponse::getShareAmount).reduce(BigDecimal.ZERO, BigDecimal::add));

        // Case 4: ₹999.99 / 7
        List<ExpenseParticipantRequest> p7 = new ArrayList<>(p6);
        TripMember extra7 = tripMemberRepository.save(TripMember.builder().trip(tripA).user(null).fullName("Extra 7").role("MEMBER").status("ACTIVE").build());
        p7.add(new ExpenseParticipantRequest(extra7.getId(), null, null));

        CreateExpenseRequest req4 = new CreateExpenseRequest(
                "Resort Fee", new BigDecimal("999.99"), "INR", ExpenseCategory.ACCOMMODATION,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null, p7
        );
        ExpenseResponse res4 = tripExpenseService.createExpense(tripA.getId(), req4, ownerA);
        assertEquals(new BigDecimal("999.99"), res4.getParticipants().stream().map(ExpenseParticipantResponse::getShareAmount).reduce(BigDecimal.ZERO, BigDecimal::add));

        // Case 5: ₹10,000 / 6
        CreateExpenseRequest req5 = new CreateExpenseRequest(
                "Flight Booking", new BigDecimal("10000.00"), "INR", ExpenseCategory.TRANSPORT,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null, p6
        );
        ExpenseResponse res5 = tripExpenseService.createExpense(tripA.getId(), req5, ownerA);
        assertEquals(new BigDecimal("10000.00"), res5.getParticipants().stream().map(ExpenseParticipantResponse::getShareAmount).reduce(BigDecimal.ZERO, BigDecimal::add));
    }

    @Test
    void testExactAndPercentageSplitValidations() {
        // Exact mismatch rejected
        CreateExpenseRequest badExact = new CreateExpenseRequest(
                "Bad Exact", new BigDecimal("500.00"), "INR", ExpenseCategory.SHOPPING,
                LocalDate.now(), SplitType.EXACT, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), new BigDecimal("300.00"), null),
                        new ExpenseParticipantRequest(mMemberA1.getId(), new BigDecimal("150.00"), null))
        );
        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(tripA.getId(), badExact, ownerA));

        // Negative exact share rejected
        CreateExpenseRequest negExact = new CreateExpenseRequest(
                "Neg Exact", new BigDecimal("500.00"), "INR", ExpenseCategory.SHOPPING,
                LocalDate.now(), SplitType.EXACT, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), new BigDecimal("600.00"), null),
                        new ExpenseParticipantRequest(mMemberA1.getId(), new BigDecimal("-100.00"), null))
        );
        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(tripA.getId(), negExact, ownerA));

        // Percentage total != 100% rejected
        CreateExpenseRequest badPct = new CreateExpenseRequest(
                "Bad Pct", new BigDecimal("1000.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.PERCENTAGE, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, new BigDecimal("50.00")),
                        new ExpenseParticipantRequest(mMemberA1.getId(), null, new BigDecimal("40.00")))
        );
        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(tripA.getId(), badPct, ownerA));
    }

    // -------------------------------------------------------------
    // SECTION 4: CROSS-TRIP SECURITY & MEMBER INTEGRITY
    // -------------------------------------------------------------

    @Test
    void testCrossTripPayerRejected() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Cross Payer", new BigDecimal("500.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, mOwnerB.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null))
        );
        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(tripA.getId(), req, ownerA));
    }

    @Test
    void testCrossTripParticipantRejected() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Cross Participant", new BigDecimal("500.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerB.getId(), null, null))
        );
        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(tripA.getId(), req, ownerA));
    }

    @Test
    void testCrossTripActivityLinkRejected() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Cross Activity", new BigDecimal("500.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), activityB.getId(), null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null))
        );
        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(tripA.getId(), req, ownerA));
    }

    @Test
    void testInactiveMemberRejectedForNewExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Inactive Test", new BigDecimal("500.00"), "INR", ExpenseCategory.OTHER,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mInactiveA.getId(), null, null))
        );
        assertThrows(IllegalArgumentException.class, () -> tripExpenseService.createExpense(tripA.getId(), req, ownerA));
    }

    // -------------------------------------------------------------
    // SECTION 5: PERMISSIONS & AUTHORIZATION
    // -------------------------------------------------------------

    @Test
    void testMemberCannotEditOrDeleteAnotherMembersExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Owner Expense", new BigDecimal("1000.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null))
        );
        ExpenseResponse exp = tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        UpdateExpenseRequest updateReq = new UpdateExpenseRequest(
                "Hacked Title", new BigDecimal("2000.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null))
        );

        // Member A1 attempts edit
        assertThrows(AccessDeniedException.class, () -> tripExpenseService.updateExpense(tripA.getId(), exp.getId(), updateReq, memberA1));

        // Member A1 attempts delete
        assertThrows(AccessDeniedException.class, () -> tripExpenseService.deleteExpense(tripA.getId(), exp.getId(), memberA1));
    }

    @Test
    void testUserCannotAccessUnassociatedTripExpenses() {
        assertThrows(AccessDeniedException.class, () -> tripExpenseService.getTripExpenses(tripA.getId(), ownerB));
    }

    // -------------------------------------------------------------
    // SECTION 6: ACTIVITY BILL INTEGRATION & MULTIPLE BILLS
    // -------------------------------------------------------------

    @Test
    void testMultipleBillsForSingleActivity() {
        CreateExpenseRequest bill1 = new CreateExpenseRequest("Amber Fort Tickets", new BigDecimal("800.00"), "INR", ExpenseCategory.TICKETS, LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), activityA.getId(), null, List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null)));
        CreateExpenseRequest bill2 = new CreateExpenseRequest("Guide Fee", new BigDecimal("500.00"), "INR", ExpenseCategory.ACTIVITY, LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), activityA.getId(), null, List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null)));
        CreateExpenseRequest bill3 = new CreateExpenseRequest("Parking Fee", new BigDecimal("200.00"), "INR", ExpenseCategory.TRANSPORT, LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), activityA.getId(), null, List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null)));

        ExpenseResponse r1 = tripExpenseService.createExpense(tripA.getId(), bill1, ownerA);
        ExpenseResponse r2 = tripExpenseService.createExpense(tripA.getId(), bill2, ownerA);
        ExpenseResponse r3 = tripExpenseService.createExpense(tripA.getId(), bill3, ownerA);

        assertEquals(activityA.getId(), r1.getTripActivityId());
        assertEquals(activityA.getId(), r2.getTripActivityId());
        assertEquals(activityA.getId(), r3.getTripActivityId());

        long count = tripExpenseRepository.countByTripActivityId(activityA.getId());
        assertEquals(3, count);
    }

    // -------------------------------------------------------------
    // SECTION 10: PHASE 3 MATHEMATICAL BALANCE READINESS AUDIT
    // -------------------------------------------------------------

    @Test
    void testPhase3MathematicalBalanceReadiness() {
        // Expense 1: Owner A pays ₹1200 for Owner A, Member A1, Guest A (₹400 each)
        CreateExpenseRequest exp1 = new CreateExpenseRequest(
                "Hotel Stay", new BigDecimal("1200.00"), "INR", ExpenseCategory.ACCOMMODATION,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null),
                        new ExpenseParticipantRequest(mMemberA1.getId(), null, null),
                        new ExpenseParticipantRequest(mGuestA.getId(), null, null))
        );
        tripExpenseService.createExpense(tripA.getId(), exp1, ownerA);

        // Expense 2: Member A1 pays ₹900 for Member A1, Guest A (₹450 each)
        CreateExpenseRequest exp2 = new CreateExpenseRequest(
                "Dinner Party", new BigDecimal("900.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, mMemberA1.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mMemberA1.getId(), null, null),
                        new ExpenseParticipantRequest(mGuestA.getId(), null, null))
        );
        tripExpenseService.createExpense(tripA.getId(), exp2, memberA1);

        // Calculate balances using TripExpense + ExpenseParticipant
        List<TripExpense> expenses = tripExpenseRepository.findByTripIdOrderByExpenseDateDescCreatedAtDesc(tripA.getId());
        List<TripMember> members = tripMemberRepository.findByTripId(tripA.getId());

        BigDecimal totalTripVolume = BigDecimal.ZERO;
        BigDecimal sumNetBalances = BigDecimal.ZERO;

        for (TripMember m : members) {
            BigDecimal totalPaid = BigDecimal.ZERO;
            BigDecimal totalOwed = BigDecimal.ZERO;

            for (TripExpense e : expenses) {
                if (e.getPayerMember().getId().equals(m.getId())) {
                    totalPaid = totalPaid.add(e.getAmount());
                }
                for (ExpenseParticipant p : e.getParticipants()) {
                    if (p.getMember().getId().equals(m.getId())) {
                        totalOwed = totalOwed.add(p.getShareAmount());
                    }
                }
            }

            BigDecimal netBalance = totalPaid.subtract(totalOwed);
            sumNetBalances = sumNetBalances.add(netBalance);
            totalTripVolume = totalTripVolume.add(totalPaid);

            if (m.getId().equals(mOwnerA.getId())) {
                // Paid ₹1200, Owed ₹400 -> Net Balance = +₹800
                assertEquals(new BigDecimal("1200.00"), totalPaid);
                assertEquals(new BigDecimal("400.00"), totalOwed);
                assertEquals(new BigDecimal("800.00"), netBalance);
            } else if (m.getId().equals(mMemberA1.getId())) {
                // Paid ₹900, Owed ₹850 (400+450) -> Net Balance = +₹50
                assertEquals(new BigDecimal("900.00"), totalPaid);
                assertEquals(new BigDecimal("850.00"), totalOwed);
                assertEquals(new BigDecimal("50.00"), netBalance);
            } else if (m.getId().equals(mGuestA.getId())) {
                // Paid ₹0, Owed ₹850 (400+450) -> Net Balance = -₹850
                assertEquals(BigDecimal.ZERO, totalPaid);
                assertEquals(new BigDecimal("850.00"), totalOwed);
                assertEquals(new BigDecimal("-850.00"), netBalance);
            }
        }

        // Verify zero-sum financial balance conservation
        assertEquals(new BigDecimal("0.00"), sumNetBalances.setScale(2));
        assertEquals(new BigDecimal("2100.00"), totalTripVolume);
    }
}
