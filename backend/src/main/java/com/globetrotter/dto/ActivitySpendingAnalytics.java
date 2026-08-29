package com.globetrotter.dto;

import java.math.BigDecimal;

public class ActivitySpendingAnalytics {

    private Long tripActivityId;
    private String activityName;
    private String category;
    private BigDecimal plannedCost;
    private BigDecimal actualSpent;
    private int expenseCount;
    private BigDecimal variance;

    public ActivitySpendingAnalytics() {}

    public ActivitySpendingAnalytics(Long tripActivityId, String activityName, String category, BigDecimal plannedCost, BigDecimal actualSpent, int expenseCount, BigDecimal variance) {
        this.tripActivityId = tripActivityId;
        this.activityName = activityName;
        this.category = category;
        this.plannedCost = plannedCost;
        this.actualSpent = actualSpent;
        this.expenseCount = expenseCount;
        this.variance = variance;
    }

    public Long getTripActivityId() { return tripActivityId; }
    public void setTripActivityId(Long tripActivityId) { this.tripActivityId = tripActivityId; }
    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public BigDecimal getPlannedCost() { return plannedCost; }
    public void setPlannedCost(BigDecimal plannedCost) { this.plannedCost = plannedCost; }
    public BigDecimal getActualSpent() { return actualSpent; }
    public void setActualSpent(BigDecimal actualSpent) { this.actualSpent = actualSpent; }
    public int getExpenseCount() { return expenseCount; }
    public void setExpenseCount(int expenseCount) { this.expenseCount = expenseCount; }
    public BigDecimal getVariance() { return variance; }
    public void setVariance(BigDecimal variance) { this.variance = variance; }
}
