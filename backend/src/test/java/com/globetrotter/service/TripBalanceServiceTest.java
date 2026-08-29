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
class TripBalanceServiceTest {

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
    private TripExpenseService tripExpenseService;

    @Autowired
    private TripBalanceService tripBalanceService;

    @Autowired
    private TripMemberService tripMemberService;

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

    private TripActivity activityA;

    @BeforeEach
    void setUp() {
        long ts = System.currentTimeMillis();
        ownerA = userRepository.save(User.builder().name("Aditya Owner").email("ownerA_" + ts + "@test.com").passwordHash("pwd").build());
        memberA1 = userRepository.save(User.builder().name("Rahul Member").email("rahul_" + ts + "@test.com").passwordHash("pwd").build());
        memberA2 = userRepository.save(User.builder().name("Vikram Member").email("vikram_" + ts + "@test.com").passwordHash("pwd").build());
        ownerB = userRepository.save(User.builder().name("Owner B").email("ownerB_" + ts + "@test.com").passwordHash("pwd").build());

        tripA = tripRepository.save(Trip.builder().user(ownerA).name("Rajasthan Trip").startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(5)).build());
        tripB = tripRepository.save(Trip.builder().user(ownerB).name("Kerala Trip").startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(5)).build());

        mOwnerA = tripMemberService.ensureOwnerIsMember(tripA);
        mMemberA1 = tripMemberRepository.save(TripMember.builder().trip(tripA).user(memberA1).fullName("Rahul Member").role("MEMBER").status("ACTIVE").build());
        mMemberA2 = tripMemberRepository.save(TripMember.builder().trip(tripA).user(memberA2).fullName("Vikram Member").role("MEMBER").status("ACTIVE").build());
        mGuestA = tripMemberRepository.save(TripMember.builder().trip(tripA).user(null).fullName("Priya Guest").role("MEMBER").status("ACTIVE").build());
        mInactiveA = tripMemberRepository.save(TripMember.builder().trip(tripA).user(null).fullName("Inactive Guest").role("MEMBER").status("INACTIVE").build());

        mOwnerB = tripMemberService.ensureOwnerIsMember(tripB);

        Destination destA = destinationRepository.save(Destination.builder().name("Jaipur_" + ts).build());
        TripStop stopA = tripStopRepository.save(TripStop.builder().trip(tripA).destination(destA).stopOrder(1).startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(2)).build());
        Activity actA = activityRepository.save(Activity.builder().destination(destA).name("Amber Fort").category("HISTORIC").estimatedDurationMinutes(60).estimatedCost(100.0).currency("INR").build());
        activityA = tripActivityRepository.save(TripActivity.builder().tripStop(stopA).activity(actA).activityOrder(1).scheduledDate(LocalDate.now()).build());
    }

    @Test
    void test1_NoExpensesZeroBalances() {
        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);

        assertEquals(new BigDecimal("0.00"), res.getTotalTripExpenses());
        assertTrue(res.getSimplifiedTransfers().isEmpty());
        assertEquals(BalanceStatus.SETTLED, res.getMyBalanceSummary().getBalanceStatus());
        assertEquals("You are all settled up!", res.getMyBalanceSummary().getSummaryMessage());
    }

    @Test
    void test2_OneExpenseOneParticipant() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Personal Snack", new BigDecimal("150.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null))
        );
        tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("150.00"), res.getTotalTripExpenses());
        assertTrue(res.getSimplifiedTransfers().isEmpty());
    }

    @Test
    void test3_EqualThreeWayExpense() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Dinner 300", new BigDecimal("300.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null),
                        new ExpenseParticipantRequest(mMemberA1.getId(), null, null),
                        new ExpenseParticipantRequest(mGuestA.getId(), null, null))
        );
        tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("300.00"), res.getTotalTripExpenses());
        assertEquals(2, res.getSimplifiedTransfers().size());

        assertEquals(mMemberA1.getId(), res.getSimplifiedTransfers().get(0).getFromMemberId());
        assertEquals(mOwnerA.getId(), res.getSimplifiedTransfers().get(0).getToMemberId());
        assertEquals(new BigDecimal("100.00"), res.getSimplifiedTransfers().get(0).getAmount());
    }

    @Test
    void test4_OnePayerMultipleParticipants() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Hotel 1200", new BigDecimal("1200.00"), "INR", ExpenseCategory.ACCOMMODATION,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null),
                        new ExpenseParticipantRequest(mMemberA1.getId(), null, null),
                        new ExpenseParticipantRequest(mMemberA2.getId(), null, null))
        );
        tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(2, res.getSimplifiedTransfers().size());
        assertEquals(new BigDecimal("400.00"), res.getSimplifiedTransfers().get(0).getAmount());
        assertEquals(new BigDecimal("400.00"), res.getSimplifiedTransfers().get(1).getAmount());
    }

    @Test
    void test5_MultiplePayers() {
        CreateExpenseRequest req1 = new CreateExpenseRequest("Expense 1", new BigDecimal("1200.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null, List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null), new ExpenseParticipantRequest(mMemberA1.getId(), null, null), new ExpenseParticipantRequest(mGuestA.getId(), null, null)));
        CreateExpenseRequest req2 = new CreateExpenseRequest("Expense 2", new BigDecimal("900.00"), "INR", ExpenseCategory.TRANSPORT, LocalDate.now(), SplitType.EQUAL, mMemberA1.getId(), null, null, List.of(new ExpenseParticipantRequest(mMemberA1.getId(), null, null), new ExpenseParticipantRequest(mGuestA.getId(), null, null)));

        tripExpenseService.createExpense(tripA.getId(), req1, ownerA);
        tripExpenseService.createExpense(tripA.getId(), req2, memberA1);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        // Owner A: +800, Rahul (A1): +50, Priya (Guest): -850
        assertEquals(2, res.getSimplifiedTransfers().size());
        assertEquals(mGuestA.getId(), res.getSimplifiedTransfers().get(0).getFromMemberId());
        assertEquals(mOwnerA.getId(), res.getSimplifiedTransfers().get(0).getToMemberId());
        assertEquals(new BigDecimal("800.00"), res.getSimplifiedTransfers().get(0).getAmount());

        assertEquals(mGuestA.getId(), res.getSimplifiedTransfers().get(1).getFromMemberId());
        assertEquals(mMemberA1.getId(), res.getSimplifiedTransfers().get(1).getToMemberId());
        assertEquals(new BigDecimal("50.00"), res.getSimplifiedTransfers().get(1).getAmount());
    }

    @Test
    void test6_GuestContributorParticipatesInBalances() {
        CreateExpenseRequest req = new CreateExpenseRequest(
                "Taxi", new BigDecimal("300.00"), "INR", ExpenseCategory.TRANSPORT,
                LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null),
                        new ExpenseParticipantRequest(mGuestA.getId(), null, null))
        );
        tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(1, res.getSimplifiedTransfers().size());
        assertEquals(mGuestA.getId(), res.getSimplifiedTransfers().get(0).getFromMemberId());
        assertEquals("Priya Guest", res.getSimplifiedTransfers().get(0).getFromMemberName());
    }

    @Test
    void test7_InactiveMemberWithHistoricalBalancePreserved() {
        // Activate inactive member temporarily to record historical expense
        mInactiveA.setStatus("ACTIVE");
        tripMemberRepository.save(mInactiveA);

        CreateExpenseRequest req = new CreateExpenseRequest(
                "Old Receipt", new BigDecimal("600.00"), "INR", ExpenseCategory.FOOD,
                LocalDate.now(), SplitType.EQUAL, mInactiveA.getId(), null, null,
                List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null),
                        new ExpenseParticipantRequest(mInactiveA.getId(), null, null))
        );
        tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        // Set status back to INACTIVE
        mInactiveA.setStatus("INACTIVE");
        tripMemberRepository.save(mInactiveA);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertTrue(res.getMemberBalances().stream().anyMatch(mb -> mb.getMemberId().equals(mInactiveA.getId()) && "INACTIVE".equals(mb.getMemberStatus())));

        assertEquals(1, res.getSimplifiedTransfers().size());
        assertEquals(mOwnerA.getId(), res.getSimplifiedTransfers().get(0).getFromMemberId());
        assertEquals(mInactiveA.getId(), res.getSimplifiedTransfers().get(0).getToMemberId());
        assertEquals(new BigDecimal("300.00"), res.getSimplifiedTransfers().get(0).getAmount());
    }

    @Test
    void test8_ActiveMemberWithZeroActivityShowsSettled() {
        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertTrue(res.getMemberBalances().stream().anyMatch(mb -> mb.getMemberId().equals(mMemberA2.getId()) && mb.getBalanceStatus() == BalanceStatus.SETTLED));
    }

    @Test
    void test9_ExactZeroSumInvariantValidation() {
        CreateExpenseRequest req = new CreateExpenseRequest("Test", new BigDecimal("100.00"), "INR", ExpenseCategory.OTHER, LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null, List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null), new ExpenseParticipantRequest(mMemberA1.getId(), null, null)));
        tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        BigDecimal sum = res.getMemberBalances().stream().map(MemberBalanceResponse::getNetBalance).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertEquals(new BigDecimal("0.00"), sum);
    }

    @Test
    void test10_ActivityLinkedAndCustomExpensesEquivalentInBalances() {
        CreateExpenseRequest actReq = new CreateExpenseRequest("Tickets", new BigDecimal("400.00"), "INR", ExpenseCategory.TICKETS, LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), activityA.getId(), null, List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null), new ExpenseParticipantRequest(mMemberA1.getId(), null, null)));
        CreateExpenseRequest custReq = new CreateExpenseRequest("Dinner", new BigDecimal("400.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null, List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null), new ExpenseParticipantRequest(mMemberA1.getId(), null, null)));

        tripExpenseService.createExpense(tripA.getId(), actReq, ownerA);
        tripExpenseService.createExpense(tripA.getId(), custReq, ownerA);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("800.00"), res.getTotalTripExpenses());
        assertEquals(new BigDecimal("400.00"), res.getSimplifiedTransfers().get(0).getAmount());
    }

    @Test
    void test11_ExpenseEditReflectedImmediatelyInBalances() {
        CreateExpenseRequest req = new CreateExpenseRequest("Dinner", new BigDecimal("300.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null, List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null), new ExpenseParticipantRequest(mMemberA1.getId(), null, null)));
        ExpenseResponse created = tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        TripBalanceResponse res1 = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("150.00"), res1.getSimplifiedTransfers().get(0).getAmount());

        UpdateExpenseRequest updateReq = new UpdateExpenseRequest("Dinner Edit", new BigDecimal("600.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null, List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null), new ExpenseParticipantRequest(mMemberA1.getId(), null, null)));
        tripExpenseService.updateExpense(tripA.getId(), created.getId(), updateReq, ownerA);

        TripBalanceResponse res2 = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("300.00"), res2.getSimplifiedTransfers().get(0).getAmount());
    }

    @Test
    void test12_ExpenseDeletionReflectedImmediatelyInBalances() {
        CreateExpenseRequest req = new CreateExpenseRequest("Dinner", new BigDecimal("300.00"), "INR", ExpenseCategory.FOOD, LocalDate.now(), SplitType.EQUAL, mOwnerA.getId(), null, null, List.of(new ExpenseParticipantRequest(mOwnerA.getId(), null, null), new ExpenseParticipantRequest(mMemberA1.getId(), null, null)));
        ExpenseResponse created = tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        tripExpenseService.deleteExpense(tripA.getId(), created.getId(), ownerA);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertTrue(res.getSimplifiedTransfers().isEmpty());
    }

    @Test
    void test13_CrossTripAccessRejected() {
        assertThrows(AccessDeniedException.class, () -> tripBalanceService.getTripBalances(tripA.getId(), ownerB));
    }

    @Test
    void test14_TwoPayerExpenseCalculatesBalancesAndDebtSimplificationCorrectly() {
        List<ExpensePayerRequest> payers = List.of(
                new ExpensePayerRequest(mOwnerA.getId(), new BigDecimal("800.00")),
                new ExpensePayerRequest(mMemberA1.getId(), new BigDecimal("400.00"))
        );
        List<ExpenseParticipantRequest> participants = List.of(
                new ExpenseParticipantRequest(mOwnerA.getId(), null, null),
                new ExpenseParticipantRequest(mMemberA1.getId(), null, null),
                new ExpenseParticipantRequest(mMemberA2.getId(), null, null)
        );

        CreateExpenseRequest req = new CreateExpenseRequest("Co-paid Villa", new BigDecimal("1200.00"), "INR", ExpenseCategory.ACCOMMODATION, LocalDate.now(), SplitType.EQUAL, null, payers, null, null, participants);
        tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("1200.00"), res.getTotalTripExpenses());

        MemberBalanceResponse ownerBal = res.getMemberBalances().stream().filter(mb -> mb.getMemberId().equals(mOwnerA.getId())).findFirst().get();
        MemberBalanceResponse m1Bal = res.getMemberBalances().stream().filter(mb -> mb.getMemberId().equals(mMemberA1.getId())).findFirst().get();
        MemberBalanceResponse m2Bal = res.getMemberBalances().stream().filter(mb -> mb.getMemberId().equals(mMemberA2.getId())).findFirst().get();

        assertEquals(new BigDecimal("800.00"), ownerBal.getTotalPaid());
        assertEquals(new BigDecimal("400.00"), ownerBal.getTotalOwed());
        assertEquals(new BigDecimal("400.00"), ownerBal.getNetBalance());
        assertEquals(BalanceStatus.GETS_BACK, ownerBal.getBalanceStatus());

        assertEquals(new BigDecimal("400.00"), m1Bal.getTotalPaid());
        assertEquals(new BigDecimal("400.00"), m1Bal.getTotalOwed());
        assertEquals(new BigDecimal("0.00"), m1Bal.getNetBalance());
        assertEquals(BalanceStatus.SETTLED, m1Bal.getBalanceStatus());

        assertEquals(new BigDecimal("0.00"), m2Bal.getTotalPaid());
        assertEquals(new BigDecimal("400.00"), m2Bal.getTotalOwed());
        assertEquals(new BigDecimal("-400.00"), m2Bal.getNetBalance());
        assertEquals(BalanceStatus.OWES, m2Bal.getBalanceStatus());

        assertEquals(1, res.getSimplifiedTransfers().size());
        DebtTransferResponse transfer = res.getSimplifiedTransfers().get(0);
        assertEquals(mMemberA2.getId(), transfer.getFromMemberId());
        assertEquals(mOwnerA.getId(), transfer.getToMemberId());
        assertEquals(new BigDecimal("400.00"), transfer.getAmount());

        BigDecimal sumNet = res.getMemberBalances().stream().map(MemberBalanceResponse::getNetBalance).reduce(BigDecimal.ZERO, BigDecimal::add);
        assertEquals(new BigDecimal("0.00"), sumNet);
    }

    @Test
    void test15_ThreePayerComplexExpenseCalculatesCorrectly() {
        List<ExpensePayerRequest> payers = List.of(
                new ExpensePayerRequest(mOwnerA.getId(), new BigDecimal("1500.00")),
                new ExpensePayerRequest(mMemberA1.getId(), new BigDecimal("1000.00")),
                new ExpensePayerRequest(mMemberA2.getId(), new BigDecimal("500.00"))
        );
        List<ExpenseParticipantRequest> participants = List.of(
                new ExpenseParticipantRequest(mOwnerA.getId(), null, null),
                new ExpenseParticipantRequest(mMemberA1.getId(), null, null),
                new ExpenseParticipantRequest(mMemberA2.getId(), null, null)
        );

        CreateExpenseRequest req = new CreateExpenseRequest("Large Activity", new BigDecimal("3000.00"), "INR", ExpenseCategory.ACTIVITY, LocalDate.now(), SplitType.EQUAL, null, payers, null, null, participants);
        tripExpenseService.createExpense(tripA.getId(), req, ownerA);

        TripBalanceResponse res = tripBalanceService.getTripBalances(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("3000.00"), res.getTotalTripExpenses());

        MemberBalanceResponse ownerBal = res.getMemberBalances().stream().filter(mb -> mb.getMemberId().equals(mOwnerA.getId())).findFirst().get();
        MemberBalanceResponse m1Bal = res.getMemberBalances().stream().filter(mb -> mb.getMemberId().equals(mMemberA1.getId())).findFirst().get();
        MemberBalanceResponse m2Bal = res.getMemberBalances().stream().filter(mb -> mb.getMemberId().equals(mMemberA2.getId())).findFirst().get();

        assertEquals(new BigDecimal("500.00"), ownerBal.getNetBalance());
        assertEquals(new BigDecimal("0.00"), m1Bal.getNetBalance());
        assertEquals(new BigDecimal("-500.00"), m2Bal.getNetBalance());

        assertEquals(1, res.getSimplifiedTransfers().size());
        assertEquals(mMemberA2.getId(), res.getSimplifiedTransfers().get(0).getFromMemberId());
        assertEquals(mOwnerA.getId(), res.getSimplifiedTransfers().get(0).getToMemberId());
        assertEquals(new BigDecimal("500.00"), res.getSimplifiedTransfers().get(0).getAmount());
    }
}
