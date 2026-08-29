package com.globetrotter.service;

import com.globetrotter.dto.*;
import com.globetrotter.entity.*;
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
class TripAnalyticsServiceTest {

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
    private TripSettlementService tripSettlementService;

    @Autowired
    private TripAnalyticsService tripAnalyticsService;

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

    private TripActivity activityA;

    @BeforeEach
    void setUp() {
        long ts = System.currentTimeMillis();
        ownerA = userRepository.save(User.builder().name("Aditya Owner").email("ownerA_" + ts + "@test.com").passwordHash("pwd").build());
        memberA1 = userRepository.save(User.builder().name("Rahul Member").email("rahul_" + ts + "@test.com").passwordHash("pwd").build());
        memberA2 = userRepository.save(User.builder().name("Vikram Member").email("vikram_" + ts + "@test.com").passwordHash("pwd").build());
        ownerB = userRepository.save(User.builder().name("Owner B").email("ownerB_" + ts + "@test.com").passwordHash("pwd").build());

        tripA = tripRepository.save(Trip.builder().user(ownerA).name("Analytics Trip").budget(new BigDecimal("10000.00")).startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(5)).build());
        tripB = tripRepository.save(Trip.builder().user(ownerB).name("Other Trip").startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(5)).build());

        mOwnerA = tripMemberService.ensureOwnerIsMember(tripA);
        mMemberA1 = tripMemberRepository.save(TripMember.builder().trip(tripA).user(memberA1).fullName("Rahul Member").role("MEMBER").status("ACTIVE").build());
        mMemberA2 = tripMemberRepository.save(TripMember.builder().trip(tripA).user(memberA2).fullName("Vikram Member").role("MEMBER").status("ACTIVE").build());
        mGuestA = tripMemberRepository.save(TripMember.builder().trip(tripA).user(null).fullName("Priya Guest").role("MEMBER").status("ACTIVE").build());
        mInactiveA = tripMemberRepository.save(TripMember.builder().trip(tripA).user(null).fullName("Old Guest").role("MEMBER").status("INACTIVE").build());

        tripMemberService.ensureOwnerIsMember(tripB);

        Destination dest = destinationRepository.save(Destination.builder().name("Jaipur_" + ts).build());
        TripStop stop = tripStopRepository.save(TripStop.builder().trip(tripA).destination(dest).stopOrder(1).startDate(LocalDate.now()).endDate(LocalDate.now().plusDays(2)).build());
        Activity act = activityRepository.save(Activity.builder().destination(dest).name("Fort Sightseeing").category("HISTORIC").estimatedDurationMinutes(60).estimatedCost(1500.0).currency("INR").build());
        activityA = tripActivityRepository.save(TripActivity.builder().tripStop(stop).activity(act).activityOrder(1).scheduledDate(LocalDate.now()).build());
    }

    private ExpenseResponse createExpense(String title, BigDecimal amount, ExpenseCategory category, TripMember payer, List<TripMember> participants, Long activityId, LocalDate date) {
        List<ExpenseParticipantRequest> partReqs = participants.stream()
                .map(p -> new ExpenseParticipantRequest(p.getId(), null, null))
                .toList();

        CreateExpenseRequest req = new CreateExpenseRequest(
                title, amount, "INR", category,
                date != null ? date : LocalDate.now(), SplitType.EQUAL, payer.getId(), activityId, null, partReqs
        );
        return tripExpenseService.createExpense(tripA.getId(), req, ownerA);
    }

    @Test
    void test1_NoExpensesZeroStateSafety() {
        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);

        assertEquals(new BigDecimal("0.00"), res.getOverview().getTotalTripExpenses());
        assertEquals(0, res.getOverview().getExpenseCount());
        assertEquals(new BigDecimal("0.00"), res.getOverview().getAverageExpenseAmount());
        assertEquals(new BigDecimal("0.00"), res.getOverview().getTotalSettlementVolume());
        assertEquals(0, res.getOverview().getSettlementCount());
        assertEquals(new BigDecimal("0.00"), res.getOverview().getTotalOutstandingBalance());

        assertTrue(res.getCategoryBreakdown().isEmpty());
        assertTrue(res.getTimeline().isEmpty());
        assertTrue(res.getTopExpenses().isEmpty());

        assertNotNull(res.getBudgetComparison());
        assertEquals(new BigDecimal("10000.00"), res.getBudgetComparison().getTargetBudget());
        assertEquals(new BigDecimal("1500.00"), res.getBudgetComparison().getPlannedItineraryCost());
        assertEquals(new BigDecimal("0.00"), res.getBudgetComparison().getActualSpent());
        assertEquals(new BigDecimal("-1500.00"), res.getBudgetComparison().getVariance());
    }

    @Test
    void test2_SingleExpenseAndCategoryAggregation() {
        createExpense("Dinner", new BigDecimal("1200.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA, mMemberA1), null, LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);

        assertEquals(new BigDecimal("1200.00"), res.getOverview().getTotalTripExpenses());
        assertEquals(1, res.getOverview().getExpenseCount());
        assertEquals(new BigDecimal("1200.00"), res.getOverview().getAverageExpenseAmount());
        assertEquals(new BigDecimal("600.00"), res.getOverview().getTotalOutstandingBalance());

        assertEquals(1, res.getCategoryBreakdown().size());
        assertEquals(ExpenseCategory.FOOD, res.getCategoryBreakdown().get(0).getCategory());
        assertEquals(new BigDecimal("1200.00"), res.getCategoryBreakdown().get(0).getTotalAmount());
        assertEquals(new BigDecimal("100.00"), res.getCategoryBreakdown().get(0).getPercentage());
    }

    @Test
    void test3_MultipleExpensesAverageAndCategoryPercentages() {
        createExpense("Dinner", new BigDecimal("1000.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA, mMemberA1), null, LocalDate.now());
        createExpense("Taxi", new BigDecimal("300.00"), ExpenseCategory.TRANSPORT, mOwnerA, List.of(mOwnerA, mMemberA1), null, LocalDate.now());
        createExpense("Hotel", new BigDecimal("2700.00"), ExpenseCategory.ACCOMMODATION, mOwnerA, List.of(mOwnerA, mMemberA1), null, LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);

        assertEquals(new BigDecimal("4000.00"), res.getOverview().getTotalTripExpenses());
        assertEquals(3, res.getOverview().getExpenseCount());
        assertEquals(new BigDecimal("1333.33"), res.getOverview().getAverageExpenseAmount());

        assertEquals(3, res.getCategoryBreakdown().size());
        assertEquals(ExpenseCategory.ACCOMMODATION, res.getCategoryBreakdown().get(0).getCategory()); // 2700
        assertEquals(new BigDecimal("67.50"), res.getCategoryBreakdown().get(0).getPercentage());

        assertEquals(ExpenseCategory.FOOD, res.getCategoryBreakdown().get(1).getCategory()); // 1000
        assertEquals(new BigDecimal("25.00"), res.getCategoryBreakdown().get(1).getPercentage());

        assertEquals(ExpenseCategory.TRANSPORT, res.getCategoryBreakdown().get(2).getCategory()); // 300
        assertEquals(new BigDecimal("7.50"), res.getCategoryBreakdown().get(2).getPercentage());
    }

    @Test
    void test4_MemberAnalyticsAndFundingPercentage() {
        createExpense("Hotel 3000", new BigDecimal("3000.00"), ExpenseCategory.ACCOMMODATION, mOwnerA, List.of(mOwnerA, mMemberA1, mGuestA), null, LocalDate.now()); // Owner pays 3000, each owes 1000
        createExpense("Food 1000", new BigDecimal("1000.00"), ExpenseCategory.FOOD, mMemberA1, List.of(mOwnerA, mMemberA1, mGuestA), null, LocalDate.now()); // Rahul (A1) pays 1000, each owes 333.33/333.33/333.34

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);

        assertEquals(4, res.getMemberBreakdown().size());

        MemberAnalytics ownerAnalytics = res.getMemberBreakdown().stream().filter(m -> m.getMemberId().equals(mOwnerA.getId())).findFirst().orElseThrow();
        assertEquals(new BigDecimal("3000.00"), ownerAnalytics.getTotalPaid());
        assertEquals(new BigDecimal("75.00"), ownerAnalytics.getFundingPercentage()); // 3000/4000 = 75.00%

        MemberAnalytics rahulAnalytics = res.getMemberBreakdown().stream().filter(m -> m.getMemberId().equals(mMemberA1.getId())).findFirst().orElseThrow();
        assertEquals(new BigDecimal("1000.00"), rahulAnalytics.getTotalPaid());
        assertEquals(new BigDecimal("25.00"), rahulAnalytics.getFundingPercentage()); // 1000/4000 = 25.00%

        MemberAnalytics guestAnalytics = res.getMemberBreakdown().stream().filter(m -> m.getMemberId().equals(mGuestA.getId())).findFirst().orElseThrow();
        assertEquals(new BigDecimal("0.00"), guestAnalytics.getTotalPaid());
        assertFalse(guestAnalytics.isGtUser());
    }

    @Test
    void test5_SettlementVolumeAndFinalNetBalanceIntegration() {
        createExpense("Dinner", new BigDecimal("1000.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA, mMemberA1), null, LocalDate.now()); // Rahul owes 500

        // Settle 300 (partial)
        tripSettlementService.createSettlement(tripA.getId(), new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("300.00"), "INR", LocalDate.now(), "Partial"), memberA1);

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);

        assertEquals(new BigDecimal("300.00"), res.getOverview().getTotalSettlementVolume());
        assertEquals(1, res.getOverview().getSettlementCount());
        assertEquals(new BigDecimal("200.00"), res.getOverview().getTotalOutstandingBalance());

        MemberAnalytics rahulAnalytics = res.getMemberBreakdown().stream().filter(m -> m.getMemberId().equals(mMemberA1.getId())).findFirst().orElseThrow();
        assertEquals(new BigDecimal("-500.00"), rahulAnalytics.getExpenseNetBalance());
        assertEquals(new BigDecimal("-200.00"), rahulAnalytics.getFinalNetBalance());
    }

    @Test
    void test6_BudgetComparisonWithAndWithoutTargetBudget() {
        createExpense("Sightseeing", new BigDecimal("2000.00"), ExpenseCategory.ACTIVITY, mOwnerA, List.of(mOwnerA), activityA.getId(), LocalDate.now());

        TripAnalyticsResponse res1 = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("10000.00"), res1.getBudgetComparison().getTargetBudget());
        assertEquals(new BigDecimal("1500.00"), res1.getBudgetComparison().getPlannedItineraryCost());
        assertEquals(new BigDecimal("2000.00"), res1.getBudgetComparison().getActualSpent());
        assertEquals(new BigDecimal("500.00"), res1.getBudgetComparison().getVariance()); // 2000 - 1500 = +500

        // Set budget to null
        tripA.setBudget(null);
        tripRepository.save(tripA);

        TripAnalyticsResponse res2 = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertNull(res2.getBudgetComparison().getTargetBudget());
        assertEquals(new BigDecimal("1500.00"), res2.getBudgetComparison().getPlannedItineraryCost());
    }

    @Test
    void test7_TimelineAggregationAndAscendingDateOrder() {
        LocalDate date1 = LocalDate.now().minusDays(2);
        LocalDate date2 = LocalDate.now().minusDays(1);
        LocalDate date3 = LocalDate.now();

        createExpense("E3", new BigDecimal("300.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, date3);
        createExpense("E1", new BigDecimal("100.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, date1);
        createExpense("E2", new BigDecimal("200.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, date2);

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);

        assertEquals(3, res.getTimeline().size());
        assertEquals(date1, res.getTimeline().get(0).getDate());
        assertEquals(new BigDecimal("100.00"), res.getTimeline().get(0).getTotalAmount());

        assertEquals(date2, res.getTimeline().get(1).getDate());
        assertEquals(new BigDecimal("200.00"), res.getTimeline().get(1).getTotalAmount());

        assertEquals(date3, res.getTimeline().get(2).getDate());
        assertEquals(new BigDecimal("300.00"), res.getTimeline().get(2).getTotalAmount());
    }

    @Test
    void test8_TopFiveExpensesSortingAndActivityLinkage() {
        createExpense("E1 100", new BigDecimal("100.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("E2 500", new BigDecimal("500.00"), ExpenseCategory.TRANSPORT, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("E3 3000", new BigDecimal("3000.00"), ExpenseCategory.ACCOMMODATION, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("E4 1500", new BigDecimal("1500.00"), ExpenseCategory.ACTIVITY, mOwnerA, List.of(mOwnerA), activityA.getId(), LocalDate.now());
        createExpense("E5 200", new BigDecimal("200.00"), ExpenseCategory.SHOPPING, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("E6 800", new BigDecimal("800.00"), ExpenseCategory.OTHER, mOwnerA, List.of(mOwnerA), null, LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);

        assertEquals(5, res.getTopExpenses().size());
        assertEquals(new BigDecimal("3000.00"), res.getTopExpenses().get(0).getAmount()); // E3
        assertEquals(new BigDecimal("1500.00"), res.getTopExpenses().get(1).getAmount()); // E4
        assertEquals("Fort Sightseeing", res.getTopExpenses().get(1).getActivityName()); // Linked activity name!
        assertEquals(new BigDecimal("800.00"), res.getTopExpenses().get(2).getAmount());  // E6
        assertEquals(new BigDecimal("500.00"), res.getTopExpenses().get(3).getAmount());  // E2
        assertEquals(new BigDecimal("200.00"), res.getTopExpenses().get(4).getAmount());  // E5
    }

    @Test
    void test9_CrossTripAccessRejection() {
        assertThrows(AccessDeniedException.class, () -> tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerB));
    }

    @Test
    void test10_FinancialZeroSumConsistencyInAnalytics() {
        createExpense("Expense 1", new BigDecimal("1500.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA, mMemberA1, mMemberA2), null, LocalDate.now());
        createExpense("Expense 2", new BigDecimal("900.00"), ExpenseCategory.TRANSPORT, mMemberA1, List.of(mOwnerA, mMemberA1, mMemberA2), null, LocalDate.now());
        tripSettlementService.createSettlement(tripA.getId(), new CreateSettlementRequest(mMemberA2.getId(), mOwnerA.getId(), new BigDecimal("400.00"), "INR", LocalDate.now(), "Settlement"), memberA2);

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);

        BigDecimal sumFinalNet = res.getMemberBreakdown().stream()
                .map(MemberAnalytics::getFinalNetBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        assertEquals(new BigDecimal("0.00"), sumFinalNet);
    }

    @Test
    void test11_MutationRegressionVerification() {
        ExpenseResponse exp = createExpense("Expense 1", new BigDecimal("1000.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA, mMemberA1), null, LocalDate.now());
        TripAnalyticsResponse res1 = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("1000.00"), res1.getOverview().getTotalTripExpenses());

        // Create settlement
        SettlementResponse setRes = tripSettlementService.createSettlement(tripA.getId(), new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("300.00"), "INR", LocalDate.now(), "Notes"), memberA1);
        TripAnalyticsResponse res2 = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("300.00"), res2.getOverview().getTotalSettlementVolume());
        assertEquals(new BigDecimal("200.00"), res2.getOverview().getTotalOutstandingBalance());

        // Delete settlement
        tripSettlementService.deleteSettlement(tripA.getId(), setRes.getId(), ownerA);
        TripAnalyticsResponse res3 = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("0.00"), res3.getOverview().getTotalSettlementVolume());
        assertEquals(new BigDecimal("500.00"), res3.getOverview().getTotalOutstandingBalance());
        assertEquals(new BigDecimal("1000.00"), res3.getOverview().getTotalTripExpenses()); // Expenses remain untouched!

        // Delete expense
        tripExpenseService.deleteExpense(tripA.getId(), exp.getId(), ownerA);
        TripAnalyticsResponse res4 = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("0.00"), res4.getOverview().getTotalTripExpenses());
    }

    @Test
    void test12_MultipleExpensesLinkedToSameActivity() {
        createExpense("Tickets", new BigDecimal("800.00"), ExpenseCategory.TICKETS, mOwnerA, List.of(mOwnerA), activityA.getId(), LocalDate.now());
        createExpense("Guide", new BigDecimal("500.00"), ExpenseCategory.OTHER, mOwnerA, List.of(mOwnerA), activityA.getId(), LocalDate.now());
        createExpense("Parking", new BigDecimal("200.00"), ExpenseCategory.TRANSPORT, mOwnerA, List.of(mOwnerA), activityA.getId(), LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertEquals(new BigDecimal("1500.00"), res.getOverview().getTotalTripExpenses());
        assertEquals(3, res.getOverview().getExpenseCount());
    }

    @Test
    void test13_ExpenseSourceBreakdownActivityVsCustom() {
        // Activity-linked: 1500 (Tickets 1000 + Tour 500)
        createExpense("Tickets", new BigDecimal("1000.00"), ExpenseCategory.TICKETS, mOwnerA, List.of(mOwnerA), activityA.getId(), LocalDate.now());
        createExpense("Tour", new BigDecimal("500.00"), ExpenseCategory.ACTIVITY, mOwnerA, List.of(mOwnerA), activityA.getId(), LocalDate.now());

        // Custom: 500 (Snacks)
        createExpense("Snacks", new BigDecimal("500.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertEquals(2, res.getExpenseSourceBreakdown().size());

        ExpenseSourceAnalytics actSrc = res.getExpenseSourceBreakdown().stream()
                .filter(s -> "ACTIVITY".equals(s.getSource()))
                .findFirst().orElseThrow();
        assertEquals(new BigDecimal("1500.00"), actSrc.getTotalAmount());
        assertEquals(2, actSrc.getExpenseCount());
        assertEquals(new BigDecimal("75.00"), actSrc.getPercentage());

        ExpenseSourceAnalytics custSrc = res.getExpenseSourceBreakdown().stream()
                .filter(s -> "CUSTOM".equals(s.getSource()))
                .findFirst().orElseThrow();
        assertEquals(new BigDecimal("500.00"), custSrc.getTotalAmount());
        assertEquals(1, custSrc.getExpenseCount());
        assertEquals(new BigDecimal("25.00"), custSrc.getPercentage());
    }

    @Test
    void test14_ActivityLevelSpendingAndVariance() {
        // activityA planned cost is 1500.00
        createExpense("Tickets", new BigDecimal("1200.00"), ExpenseCategory.TICKETS, mOwnerA, List.of(mOwnerA), activityA.getId(), LocalDate.now());
        createExpense("Guide", new BigDecimal("600.00"), ExpenseCategory.OTHER, mOwnerA, List.of(mOwnerA), activityA.getId(), LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertEquals(1, res.getActivitySpending().size());

        ActivitySpendingAnalytics actSpend = res.getActivitySpending().get(0);
        assertEquals(activityA.getId(), actSpend.getTripActivityId());
        assertEquals("Fort Sightseeing", actSpend.getActivityName());
        assertEquals(new BigDecimal("1500.00"), actSpend.getPlannedCost());
        assertEquals(new BigDecimal("1800.00"), actSpend.getActualSpent());
        assertEquals(2, actSpend.getExpenseCount());
        assertEquals(new BigDecimal("300.00"), actSpend.getVariance()); // 1800 - 1500 = +300 (over plan)
    }

    @Test
    void test15_TopFiveExpensesSortingDeterministicTieBreaking() {
        createExpense("A 100", new BigDecimal("100.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("B 500", new BigDecimal("500.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("C 500", new BigDecimal("500.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("D 2000", new BigDecimal("2000.00"), ExpenseCategory.ACCOMMODATION, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("E 1000", new BigDecimal("1000.00"), ExpenseCategory.TRANSPORT, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("F 300", new BigDecimal("300.00"), ExpenseCategory.SHOPPING, mOwnerA, List.of(mOwnerA), null, LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertEquals(5, res.getTopExpenses().size());
        assertEquals(new BigDecimal("2000.00"), res.getTopExpenses().get(0).getAmount()); // D 2000
        assertEquals(new BigDecimal("1000.00"), res.getTopExpenses().get(1).getAmount()); // E 1000
        assertEquals(new BigDecimal("500.00"), res.getTopExpenses().get(2).getAmount());  // B 500
        assertEquals(new BigDecimal("500.00"), res.getTopExpenses().get(3).getAmount());  // C 500
        assertEquals(new BigDecimal("300.00"), res.getTopExpenses().get(4).getAmount());  // F 300
    }

    @Test
    void test16_TimelineChronologicalDailyAggregation() {
        LocalDate day1 = LocalDate.now().minusDays(3);
        LocalDate day2 = LocalDate.now().minusDays(1);

        createExpense("E1", new BigDecimal("400.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, day1);
        createExpense("E2", new BigDecimal("600.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, day1);
        createExpense("E3", new BigDecimal("800.00"), ExpenseCategory.TRANSPORT, mOwnerA, List.of(mOwnerA), null, day2);

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertEquals(2, res.getTimeline().size());

        assertEquals(day1, res.getTimeline().get(0).getDate());
        assertEquals(new BigDecimal("1000.00"), res.getTimeline().get(0).getTotalAmount());
        assertEquals(2, res.getTimeline().get(0).getExpenseCount());

        assertEquals(day2, res.getTimeline().get(1).getDate());
        assertEquals(new BigDecimal("800.00"), res.getTimeline().get(1).getTotalAmount());
        assertEquals(1, res.getTimeline().get(1).getExpenseCount());
    }

    @Test
    void test17_DeterministicInsightsComprehensive() {
        // Planned activity cost for activityA = 1500
        // Activity-linked: 2500 (overrun 1000)
        createExpense("Amber Fort Ticket", new BigDecimal("2500.00"), ExpenseCategory.TICKETS, mOwnerA, List.of(mOwnerA, mMemberA1), activityA.getId(), LocalDate.of(2026, 8, 22));
        // Custom: 500
        createExpense("Taxi to Hotel", new BigDecimal("500.00"), ExpenseCategory.TRANSPORT, mOwnerA, List.of(mOwnerA, mMemberA1), null, LocalDate.of(2026, 8, 20));

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertNotNull(res.getInsights());
        assertFalse(res.getInsights().isEmpty());

        // Check expected top priority insights
        assertTrue(res.getInsights().stream().anyMatch(i -> i.contains("Tickets & Entry is your largest spending category")));
        assertTrue(res.getInsights().stream().anyMatch(i -> i.contains("\"Amber Fort Ticket\" was your largest expense at ₹2500.00")));
        assertTrue(res.getInsights().stream().anyMatch(i -> i.contains("\"Fort Sightseeing\" is ₹1000.00 over its planned cost")));
        assertTrue(res.getInsights().stream().anyMatch(i -> i.contains("Aditya Owner paid ₹3000.00 upfront")));
    }

    @Test
    void test18_DeterministicInsightsFullySettledTrip() {
        createExpense("Dinner", new BigDecimal("1000.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA, mMemberA1), null, LocalDate.now());
        // Rahul settles 500 in full
        tripSettlementService.createSettlement(tripA.getId(), new CreateSettlementRequest(mMemberA1.getId(), mOwnerA.getId(), new BigDecimal("500.00"), "INR", LocalDate.now(), "Full"), memberA1);

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertTrue(res.getInsights().stream().anyMatch(i -> i.contains("settled all outstanding group balances")));
    }

    @Test
    void test19_DeterministicInsightsCustomDominance() {
        // 100% custom expenses
        createExpense("Dinner", new BigDecimal("3000.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertTrue(res.getInsights().stream().anyMatch(i -> i.contains("100.00% of your spending came from custom expenses outside the itinerary")));
    }

    @Test
    void test20_DeterministicInsightsZeroExpensesEmptyList() {
        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        assertTrue(res.getInsights().isEmpty());
    }

    @Test
    void test21_FilterNoParams_SameAsDefault() {
        createExpense("Dinner", new BigDecimal("1000.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA, mMemberA1), null, LocalDate.now());
        createExpense("Taxi", new BigDecimal("500.00"), ExpenseCategory.TRANSPORT, mMemberA1, List.of(mOwnerA, mMemberA1), null, LocalDate.now());

        TripAnalyticsResponse resDefault = tripAnalyticsService.getTripAnalytics(tripA.getId(), ownerA);
        TripAnalyticsResponse resFiltered = tripAnalyticsService.getTripAnalytics(tripA.getId(), null, null, null, null, null, ownerA);

        assertEquals(resDefault.getOverview().getTotalTripExpenses(), resFiltered.getOverview().getTotalTripExpenses());
        assertEquals(resDefault.getOverview().getExpenseCount(), resFiltered.getOverview().getExpenseCount());
    }

    @Test
    void test22_FilterDateRange() {
        LocalDate d1 = LocalDate.of(2026, 8, 20);
        LocalDate d2 = LocalDate.of(2026, 8, 25);
        LocalDate d3 = LocalDate.of(2026, 8, 30);

        createExpense("Early Lunch", new BigDecimal("400.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, d1);
        createExpense("Mid Trip Taxi", new BigDecimal("600.00"), ExpenseCategory.TRANSPORT, mOwnerA, List.of(mOwnerA), null, d2);
        createExpense("Late Dinner", new BigDecimal("800.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, d3);

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), LocalDate.of(2026, 8, 22), LocalDate.of(2026, 8, 28), null, null, null, ownerA);

        assertEquals(1, res.getOverview().getExpenseCount());
        assertEquals(new BigDecimal("600.00"), res.getOverview().getTotalTripExpenses());
        assertEquals(1, res.getCategoryBreakdown().size());
        assertEquals(ExpenseCategory.TRANSPORT, res.getCategoryBreakdown().get(0).getCategory());
    }

    @Test
    void test23_FilterCategory() {
        createExpense("Food 1", new BigDecimal("500.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("Hotel", new BigDecimal("2000.00"), ExpenseCategory.ACCOMMODATION, mOwnerA, List.of(mOwnerA), null, LocalDate.now());
        createExpense("Food 2", new BigDecimal("700.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), null, null, ExpenseCategory.FOOD, null, null, ownerA);

        assertEquals(2, res.getOverview().getExpenseCount());
        assertEquals(new BigDecimal("1200.00"), res.getOverview().getTotalTripExpenses());
        assertEquals(1, res.getCategoryBreakdown().size());
        assertEquals(ExpenseCategory.FOOD, res.getCategoryBreakdown().get(0).getCategory());
    }

    @Test
    void test24_FilterMember() {
        // Expense 1 involving mOwnerA and mMemberA1
        createExpense("Split Meal", new BigDecimal("1000.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA, mMemberA1), null, LocalDate.now());
        // Expense 2 involving only mMemberA2
        createExpense("Solo Ride", new BigDecimal("300.00"), ExpenseCategory.TRANSPORT, mMemberA2, List.of(mMemberA2), null, LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), null, null, null, mMemberA1.getId(), null, ownerA);

        assertEquals(1, res.getOverview().getExpenseCount());
        assertEquals(new BigDecimal("1000.00"), res.getOverview().getTotalTripExpenses());
    }

    @Test
    void test25_FilterSourceActivityAndCustom() {
        createExpense("Fort Entry", new BigDecimal("1500.00"), ExpenseCategory.TICKETS, mOwnerA, List.of(mOwnerA), activityA.getId(), LocalDate.now());
        createExpense("Snacks", new BigDecimal("300.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, LocalDate.now());

        TripAnalyticsResponse resAct = tripAnalyticsService.getTripAnalytics(tripA.getId(), null, null, null, null, "ACTIVITY_LINKED", ownerA);
        assertEquals(1, resAct.getOverview().getExpenseCount());
        assertEquals(new BigDecimal("1500.00"), resAct.getOverview().getTotalTripExpenses());

        TripAnalyticsResponse resCustom = tripAnalyticsService.getTripAnalytics(tripA.getId(), null, null, null, null, "CUSTOM", ownerA);
        assertEquals(1, resCustom.getOverview().getExpenseCount());
        assertEquals(new BigDecimal("300.00"), resCustom.getOverview().getTotalTripExpenses());
    }

    @Test
    void test26_FilterMultipleCombined() {
        LocalDate d1 = LocalDate.of(2026, 8, 20);
        LocalDate d2 = LocalDate.of(2026, 8, 25);

        createExpense("Fort Ticket", new BigDecimal("1000.00"), ExpenseCategory.TICKETS, mOwnerA, List.of(mOwnerA), activityA.getId(), d1);
        createExpense("Late Fort Ticket", new BigDecimal("1200.00"), ExpenseCategory.TICKETS, mOwnerA, List.of(mOwnerA), activityA.getId(), d2);
        createExpense("Dinner", new BigDecimal("800.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, d2);

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(
                tripA.getId(),
                LocalDate.of(2026, 8, 24),
                LocalDate.of(2026, 8, 26),
                ExpenseCategory.TICKETS,
                mOwnerA.getId(),
                "ACTIVITY",
                ownerA
        );

        assertEquals(1, res.getOverview().getExpenseCount());
        assertEquals(new BigDecimal("1200.00"), res.getOverview().getTotalTripExpenses());
    }

    @Test
    void test27_FilterInvalidDateRangeThrows() {
        assertThrows(IllegalArgumentException.class, () ->
                tripAnalyticsService.getTripAnalytics(tripA.getId(), LocalDate.of(2026, 9, 1), LocalDate.of(2026, 8, 1), null, null, null, ownerA)
        );
    }

    @Test
    void test28_FilterUnknownMemberThrows() {
        assertThrows(com.globetrotter.exception.ResourceNotFoundException.class, () ->
                tripAnalyticsService.getTripAnalytics(tripA.getId(), null, null, null, 999999L, null, ownerA)
        );
    }

    @Test
    void test29_FilterZeroResults_GracefulEmptyMetrics() {
        createExpense("Dinner", new BigDecimal("1000.00"), ExpenseCategory.FOOD, mOwnerA, List.of(mOwnerA), null, LocalDate.now());

        TripAnalyticsResponse res = tripAnalyticsService.getTripAnalytics(tripA.getId(), null, null, ExpenseCategory.SHOPPING, null, null, ownerA);

        assertEquals(0, res.getOverview().getExpenseCount());
        assertEquals(new BigDecimal("0.00"), res.getOverview().getTotalTripExpenses());
        assertEquals(new BigDecimal("0.00"), res.getOverview().getAverageExpenseAmount());
        assertTrue(res.getCategoryBreakdown().isEmpty());
        assertTrue(res.getTimeline().isEmpty());
        assertEquals(0, res.getTopExpenses().size());
    }
}



