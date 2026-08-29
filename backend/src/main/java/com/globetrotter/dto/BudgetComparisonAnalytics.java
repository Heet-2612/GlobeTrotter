package com.globetrotter.dto;

import java.math.BigDecimal;

public class BudgetComparisonAnalytics {

    private BigDecimal targetBudget;
    private BigDecimal plannedItineraryCost;
    private BigDecimal actualSpent;
    private BigDecimal variance;

    public BudgetComparisonAnalytics() {}

    public BudgetComparisonAnalytics(BigDecimal targetBudget, BigDecimal plannedItineraryCost, BigDecimal actualSpent, BigDecimal variance) {
        this.targetBudget = targetBudget;
        this.plannedItineraryCost = plannedItineraryCost;
        this.actualSpent = actualSpent;
        this.variance = variance;
    }

    public BigDecimal getTargetBudget() { return targetBudget; }
    public void setTargetBudget(BigDecimal targetBudget) { this.targetBudget = targetBudget; }
    public BigDecimal getPlannedItineraryCost() { return plannedItineraryCost; }
    public void setPlannedItineraryCost(BigDecimal plannedItineraryCost) { this.plannedItineraryCost = plannedItineraryCost; }
    public BigDecimal getActualSpent() { return actualSpent; }
    public void setActualSpent(BigDecimal actualSpent) { this.actualSpent = actualSpent; }
    public BigDecimal getVariance() { return variance; }
    public void setVariance(BigDecimal variance) { this.variance = variance; }
}
