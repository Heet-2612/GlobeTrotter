package com.globetrotter.dto;

import java.util.List;

public class TripAnalyticsResponse {

    private Long tripId;
    private String currency;
    private OverviewAnalytics overview;
    private List<CategoryAnalytics> categoryBreakdown;
    private List<MemberAnalytics> memberBreakdown;
    private BudgetComparisonAnalytics budgetComparison;
    private List<TimelineAnalytics> timeline;
    private List<TopExpenseAnalytics> topExpenses;
    private List<ExpenseSourceAnalytics> expenseSourceBreakdown;
    private List<ActivitySpendingAnalytics> activitySpending;
    private List<String> insights;

    public TripAnalyticsResponse() {}

    public TripAnalyticsResponse(Long tripId,
                                 String currency,
                                 OverviewAnalytics overview,
                                 List<CategoryAnalytics> categoryBreakdown,
                                 List<MemberAnalytics> memberBreakdown,
                                 BudgetComparisonAnalytics budgetComparison,
                                 List<TimelineAnalytics> timeline,
                                 List<TopExpenseAnalytics> topExpenses,
                                 List<ExpenseSourceAnalytics> expenseSourceBreakdown,
                                 List<ActivitySpendingAnalytics> activitySpending,
                                 List<String> insights) {
        this.tripId = tripId;
        this.currency = currency;
        this.overview = overview;
        this.categoryBreakdown = categoryBreakdown;
        this.memberBreakdown = memberBreakdown;
        this.budgetComparison = budgetComparison;
        this.timeline = timeline;
        this.topExpenses = topExpenses;
        this.expenseSourceBreakdown = expenseSourceBreakdown;
        this.activitySpending = activitySpending;
        this.insights = insights;
    }

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public OverviewAnalytics getOverview() { return overview; }
    public void setOverview(OverviewAnalytics overview) { this.overview = overview; }
    public List<CategoryAnalytics> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<CategoryAnalytics> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }
    public List<MemberAnalytics> getMemberBreakdown() { return memberBreakdown; }
    public void setMemberBreakdown(List<MemberAnalytics> memberBreakdown) { this.memberBreakdown = memberBreakdown; }
    public BudgetComparisonAnalytics getBudgetComparison() { return budgetComparison; }
    public void setBudgetComparison(BudgetComparisonAnalytics budgetComparison) { this.budgetComparison = budgetComparison; }
    public List<TimelineAnalytics> getTimeline() { return timeline; }
    public void setTimeline(List<TimelineAnalytics> timeline) { this.timeline = timeline; }
    public List<TopExpenseAnalytics> getTopExpenses() { return topExpenses; }
    public void setTopExpenses(List<TopExpenseAnalytics> topExpenses) { this.topExpenses = topExpenses; }
    public List<ExpenseSourceAnalytics> getExpenseSourceBreakdown() { return expenseSourceBreakdown; }
    public void setExpenseSourceBreakdown(List<ExpenseSourceAnalytics> expenseSourceBreakdown) { this.expenseSourceBreakdown = expenseSourceBreakdown; }
    public List<ActivitySpendingAnalytics> getActivitySpending() { return activitySpending; }
    public void setActivitySpending(List<ActivitySpendingAnalytics> activitySpending) { this.activitySpending = activitySpending; }
    public List<String> getInsights() { return insights; }
    public void setInsights(List<String> insights) { this.insights = insights; }
}
