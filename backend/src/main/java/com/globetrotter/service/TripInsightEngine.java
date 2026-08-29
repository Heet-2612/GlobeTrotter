package com.globetrotter.service;

import com.globetrotter.dto.*;
import com.globetrotter.entity.ExpenseCategory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class TripInsightEngine {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMMM d");

    public List<String> generateInsights(
            OverviewAnalytics overview,
            List<CategoryAnalytics> categoryBreakdown,
            List<MemberAnalytics> memberBreakdown,
            BudgetComparisonAnalytics budgetComparison,
            List<TimelineAnalytics> timeline,
            List<TopExpenseAnalytics> topExpenses,
            List<ExpenseSourceAnalytics> expenseSourceBreakdown,
            List<ActivitySpendingAnalytics> activitySpending) {

        List<String> insights = new ArrayList<>();

        if (overview == null || overview.getExpenseCount() == 0 || overview.getTotalTripExpenses().compareTo(BigDecimal.ZERO) <= 0) {
            return insights;
        }

        // 1. Largest Spending Category
        if (categoryBreakdown != null && !categoryBreakdown.isEmpty()) {
            CategoryAnalytics topCat = categoryBreakdown.get(0);
            if (topCat.getTotalAmount().compareTo(BigDecimal.ZERO) > 0) {
                String catName = formatCategoryName(topCat.getCategory());
                insights.add(String.format("%s is your largest spending category at %s%% of total expenses.", catName, topCat.getPercentage()));
            }
        }

        // 2. Largest Expense
        if (topExpenses != null && !topExpenses.isEmpty()) {
            TopExpenseAnalytics largest = topExpenses.get(0);
            insights.add(String.format("\"%s\" was your largest expense at ₹%s.", largest.getTitle(), largest.getAmount()));
        }

        // 3. Activity Overrun
        if (activitySpending != null && !activitySpending.isEmpty()) {
            activitySpending.stream()
                    .filter(a -> a.getVariance().compareTo(BigDecimal.ZERO) > 0)
                    .max(Comparator.comparing(ActivitySpendingAnalytics::getVariance))
                    .ifPresent(overrunAct -> {
                        insights.add(String.format("\"%s\" is ₹%s over its planned cost.", overrunAct.getActivityName(), overrunAct.getVariance()));
                    });
        }

        // 4. Overall Planned vs Actual Itinerary Spending
        if (budgetComparison != null && budgetComparison.getPlannedItineraryCost() != null && budgetComparison.getPlannedItineraryCost().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal var = budgetComparison.getVariance();
            if (var.compareTo(BigDecimal.ZERO) > 0) {
                insights.add(String.format("You are ₹%s over your planned itinerary spending.", var));
            } else if (var.compareTo(BigDecimal.ZERO) < 0) {
                insights.add(String.format("You are ₹%s under your planned itinerary spending.", var.abs()));
            }
        }

        // 5. Highest-Spending Day (only when multiple days exist)
        if (timeline != null && timeline.size() > 1) {
            TimelineAnalytics maxDay = timeline.stream()
                    .max(Comparator.comparing(TimelineAnalytics::getTotalAmount).thenComparing(TimelineAnalytics::getDate))
                    .orElse(null);

            if (maxDay != null && maxDay.getTotalAmount().compareTo(BigDecimal.ZERO) > 0) {
                String formattedDate = maxDay.getDate().format(DATE_FORMATTER);
                insights.add(String.format("%s was your highest-spending day at ₹%s.", formattedDate, maxDay.getTotalAmount()));
            }
        }

        // 6. Highest Upfront Contributor
        if (memberBreakdown != null && !memberBreakdown.isEmpty()) {
            MemberAnalytics topFunder = memberBreakdown.stream()
                    .max(Comparator.comparing(MemberAnalytics::getTotalPaid).thenComparing(Comparator.comparing(MemberAnalytics::getMemberId).reversed()))
                    .orElse(null);

            if (topFunder != null && topFunder.getTotalPaid().compareTo(BigDecimal.ZERO) > 0) {
                insights.add(String.format("%s paid ₹%s upfront, covering %s%% of trip expenses.", topFunder.getFullName(), topFunder.getTotalPaid(), topFunder.getFundingPercentage()));
            }
        }

        // 7. Outstanding Debt / Settled Balance
        if (overview.getTotalOutstandingBalance().compareTo(BigDecimal.ZERO) > 0) {
            insights.add(String.format("₹%s remains outstanding across the group.", overview.getTotalOutstandingBalance()));
        } else if (overview.getTotalTripExpenses().compareTo(BigDecimal.ZERO) > 0) {
            insights.add("You've settled all outstanding group balances.");
        }

        // 8. Settlement Activity
        if (overview.getSettlementCount() > 0) {
            insights.add(String.format("The group has recorded ₹%s in settlements across %d payment%s.",
                    overview.getTotalSettlementVolume(),
                    overview.getSettlementCount(),
                    overview.getSettlementCount() != 1 ? "s" : ""));
        }

        // 9. Activity vs Custom Spending Dominance (>= 60%)
        if (expenseSourceBreakdown != null) {
            for (ExpenseSourceAnalytics src : expenseSourceBreakdown) {
                if (src.getPercentage().compareTo(BigDecimal.valueOf(60.0)) >= 0) {
                    if ("ACTIVITY".equalsIgnoreCase(src.getSource())) {
                        insights.add(String.format("%s%% of your spending came from planned activities.", src.getPercentage()));
                    } else if ("CUSTOM".equalsIgnoreCase(src.getSource())) {
                        insights.add(String.format("%s%% of your spending came from custom expenses outside the itinerary.", src.getPercentage()));
                    }
                    break;
                }
            }
        }

        // Limit to top 6 deterministic insights
        if (insights.size() > 6) {
            return insights.subList(0, 6);
        }

        return insights;
    }

    private String formatCategoryName(ExpenseCategory cat) {
        if (cat == null) return "Other";
        return switch (cat) {
            case FOOD -> "Food & Dining";
            case ACCOMMODATION -> "Lodging & Hotels";
            case TRANSPORT -> "Transit & Rides";
            case ACTIVITY -> "Activities & Tours";
            case TICKETS -> "Tickets & Entry";
            case SHOPPING -> "Shopping & Souvenirs";
            case OTHER -> "Other expenses";
        };
    }
}
