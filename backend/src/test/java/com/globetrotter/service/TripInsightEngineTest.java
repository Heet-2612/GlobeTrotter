package com.globetrotter.service;

import com.globetrotter.dto.*;
import com.globetrotter.entity.ExpenseCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class TripInsightEngineTest {

    private TripInsightEngine engine;

    @BeforeEach
    void setUp() {
        engine = new TripInsightEngine();
    }

    @Test
    void test01_NoExpensesNoInsights() {
        OverviewAnalytics overview = new OverviewAnalytics(BigDecimal.ZERO, 0, BigDecimal.ZERO, BigDecimal.ZERO, 0, BigDecimal.ZERO);
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), null, List.of(), List.of(), List.of(), List.of());
        assertTrue(insights.isEmpty());
    }

    @Test
    void test02_LargestCategoryInsight() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("1000.00"), 1, new BigDecimal("1000.00"), BigDecimal.ZERO, 0, new BigDecimal("1000.00"));
        CategoryAnalytics cat = new CategoryAnalytics(ExpenseCategory.FOOD, new BigDecimal("600.00"), 1, new BigDecimal("60.00"));
        List<String> insights = engine.generateInsights(overview, List.of(cat), List.of(), null, List.of(), List.of(), List.of(), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("Food & Dining is your largest spending category at 60.00%")));
    }

    @Test
    void test03_LargestExpenseInsight() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("2500.00"), 1, new BigDecimal("2500.00"), BigDecimal.ZERO, 0, new BigDecimal("2500.00"));
        TopExpenseAnalytics top = new TopExpenseAnalytics(1L, "Grand Hotel", ExpenseCategory.ACCOMMODATION, "Aditya", new BigDecimal("2500.00"), LocalDate.now(), null);
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), null, List.of(), List.of(top), List.of(), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("\"Grand Hotel\" was your largest expense at ₹2500.00")));
    }

    @Test
    void test04_HighestSpendingDay() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("5000.00"), 2, new BigDecimal("2500.00"), BigDecimal.ZERO, 0, new BigDecimal("5000.00"));
        TimelineAnalytics day1 = new TimelineAnalytics(LocalDate.of(2026, 8, 22), new BigDecimal("3500.00"), 1);
        TimelineAnalytics day2 = new TimelineAnalytics(LocalDate.of(2026, 8, 20), new BigDecimal("1500.00"), 1);
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), null, List.of(day1, day2), List.of(), List.of(), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("August 22 was your highest-spending day at ₹3500.00")));
    }

    @Test
    void test05_HighestUpfrontContributor() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("10000.00"), 2, new BigDecimal("5000.00"), BigDecimal.ZERO, 0, new BigDecimal("10000.00"));
        MemberAnalytics m1 = new MemberAnalytics(1L, "Aditya", true, 101L, "ACTIVE", new BigDecimal("8000.00"), new BigDecimal("5000.00"), new BigDecimal("3000.00"), new BigDecimal("3000.00"), new BigDecimal("80.00"));
        MemberAnalytics m2 = new MemberAnalytics(2L, "Rahul", true, 102L, "ACTIVE", new BigDecimal("2000.00"), new BigDecimal("5000.00"), new BigDecimal("-3000.00"), new BigDecimal("-3000.00"), new BigDecimal("20.00"));
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(m1, m2), null, List.of(), List.of(), List.of(), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("Aditya paid ₹8000.00 upfront, covering 80.00% of trip expenses")));
    }

    @Test
    void test07_ActivityOverBudgetInsight() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("3000.00"), 1, new BigDecimal("3000.00"), BigDecimal.ZERO, 0, new BigDecimal("3000.00"));
        ActivitySpendingAnalytics act = new ActivitySpendingAnalytics(10L, "Amber Fort Tour", "ACTIVITY", new BigDecimal("2000.00"), new BigDecimal("2800.00"), 1, new BigDecimal("800.00"));
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), null, List.of(), List.of(), List.of(), List.of(act));
        assertTrue(insights.stream().anyMatch(i -> i.contains("\"Amber Fort Tour\" is ₹800.00 over its planned cost")));
    }

    @Test
    void test08_OverallPlannedVsActualUnderBudget() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("3000.00"), 1, new BigDecimal("3000.00"), BigDecimal.ZERO, 0, new BigDecimal("3000.00"));
        BudgetComparisonAnalytics budget = new BudgetComparisonAnalytics(new BigDecimal("6000.00"), new BigDecimal("5000.00"), new BigDecimal("3000.00"), new BigDecimal("-2000.00"));
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), budget, List.of(), List.of(), List.of(), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("You are ₹2000.00 under your planned itinerary spending")));
    }

    @Test
    void test09_OverallPlannedVsActualOverBudget() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("7000.00"), 1, new BigDecimal("7000.00"), BigDecimal.ZERO, 0, new BigDecimal("7000.00"));
        BudgetComparisonAnalytics budget = new BudgetComparisonAnalytics(new BigDecimal("6000.00"), new BigDecimal("5000.00"), new BigDecimal("7000.00"), new BigDecimal("2000.00"));
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), budget, List.of(), List.of(), List.of(), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("You are ₹2000.00 over your planned itinerary spending")));
    }

    @Test
    void test10_OutstandingBalance() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("5000.00"), 1, new BigDecimal("5000.00"), BigDecimal.ZERO, 0, new BigDecimal("2500.00"));
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), null, List.of(), List.of(), List.of(), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("₹2500.00 remains outstanding across the group")));
    }

    @Test
    void test11_FullySettledTrip() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("5000.00"), 1, new BigDecimal("5000.00"), new BigDecimal("2500.00"), 1, BigDecimal.ZERO);
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), null, List.of(), List.of(), List.of(), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("You've settled all outstanding group balances")));
    }

    @Test
    void test12_SettlementActivity() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("5000.00"), 1, new BigDecimal("5000.00"), new BigDecimal("2500.00"), 2, BigDecimal.ZERO);
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), null, List.of(), List.of(), List.of(), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("The group has recorded ₹2500.00 in settlements across 2 payments")));
    }

    @Test
    void test13_ActivityDominantSpending() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("5000.00"), 1, new BigDecimal("5000.00"), BigDecimal.ZERO, 0, BigDecimal.ZERO);
        ExpenseSourceAnalytics act = new ExpenseSourceAnalytics("ACTIVITY", new BigDecimal("4000.00"), 2, new BigDecimal("80.00"));
        ExpenseSourceAnalytics cust = new ExpenseSourceAnalytics("CUSTOM", new BigDecimal("1000.00"), 1, new BigDecimal("20.00"));
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), null, List.of(), List.of(), List.of(act, cust), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("80.00% of your spending came from planned activities")));
    }

    @Test
    void test14_CustomDominantSpending() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("5000.00"), 1, new BigDecimal("5000.00"), BigDecimal.ZERO, 0, BigDecimal.ZERO);
        ExpenseSourceAnalytics act = new ExpenseSourceAnalytics("ACTIVITY", new BigDecimal("1000.00"), 1, new BigDecimal("20.00"));
        ExpenseSourceAnalytics cust = new ExpenseSourceAnalytics("CUSTOM", new BigDecimal("4000.00"), 2, new BigDecimal("80.00"));
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), null, List.of(), List.of(), List.of(act, cust), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("80.00% of your spending came from custom expenses outside the itinerary")));
    }

    @Test
    void test15_MixedSpendingWithoutDominance() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("5000.00"), 1, new BigDecimal("5000.00"), BigDecimal.ZERO, 0, BigDecimal.ZERO);
        ExpenseSourceAnalytics act = new ExpenseSourceAnalytics("ACTIVITY", new BigDecimal("2750.00"), 1, new BigDecimal("55.00"));
        ExpenseSourceAnalytics cust = new ExpenseSourceAnalytics("CUSTOM", new BigDecimal("2250.00"), 1, new BigDecimal("45.00"));
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(), null, List.of(), List.of(), List.of(act, cust), List.of());
        assertFalse(insights.stream().anyMatch(i -> i.contains("outside the itinerary") || i.contains("planned activities")));
    }

    @Test
    void test16_TieBreakingAndDeterministicOrdering() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("10000.00"), 2, new BigDecimal("5000.00"), BigDecimal.ZERO, 0, new BigDecimal("10000.00"));
        // Member 1 vs Member 2 same paid amount, tie breaker should pick deterministic member
        MemberAnalytics m1 = new MemberAnalytics(1L, "Alice", true, 101L, "ACTIVE", new BigDecimal("5000.00"), new BigDecimal("5000.00"), BigDecimal.ZERO, BigDecimal.ZERO, new BigDecimal("50.00"));
        MemberAnalytics m2 = new MemberAnalytics(2L, "Bob", true, 102L, "ACTIVE", new BigDecimal("5000.00"), new BigDecimal("5000.00"), BigDecimal.ZERO, BigDecimal.ZERO, new BigDecimal("50.00"));
        List<String> insights = engine.generateInsights(overview, List.of(), List.of(m1, m2), null, List.of(), List.of(), List.of(), List.of());
        assertTrue(insights.stream().anyMatch(i -> i.contains("Alice paid ₹5000.00 upfront")));
    }

    @Test
    void test17_MaxInsightCountCappedAt6() {
        OverviewAnalytics overview = new OverviewAnalytics(new BigDecimal("10000.00"), 5, new BigDecimal("2000.00"), new BigDecimal("2000.00"), 2, new BigDecimal("3000.00"));
        CategoryAnalytics cat = new CategoryAnalytics(ExpenseCategory.FOOD, new BigDecimal("6000.00"), 3, new BigDecimal("60.00"));
        MemberAnalytics m = new MemberAnalytics(1L, "Aditya", true, 101L, "ACTIVE", new BigDecimal("10000.00"), new BigDecimal("5000.00"), new BigDecimal("5000.00"), new BigDecimal("5000.00"), new BigDecimal("100.00"));
        BudgetComparisonAnalytics budget = new BudgetComparisonAnalytics(new BigDecimal("15000.00"), new BigDecimal("8000.00"), new BigDecimal("10000.00"), new BigDecimal("2000.00"));
        TimelineAnalytics time = new TimelineAnalytics(LocalDate.of(2026, 8, 20), new BigDecimal("10000.00"), 5);
        TopExpenseAnalytics top = new TopExpenseAnalytics(1L, "Feast", ExpenseCategory.FOOD, "Aditya", new BigDecimal("5000.00"), LocalDate.now(), null);
        ExpenseSourceAnalytics act = new ExpenseSourceAnalytics("ACTIVITY", new BigDecimal("8000.00"), 4, new BigDecimal("80.00"));
        ActivitySpendingAnalytics actSpend = new ActivitySpendingAnalytics(1L, "Sightseeing", "ACTIVITY", new BigDecimal("5000.00"), new BigDecimal("8000.00"), 4, new BigDecimal("3000.00"));

        List<String> insights = engine.generateInsights(overview, List.of(cat), List.of(m), budget, List.of(time), List.of(top), List.of(act), List.of(actSpend));
        assertTrue(insights.size() <= 6);
    }
}
