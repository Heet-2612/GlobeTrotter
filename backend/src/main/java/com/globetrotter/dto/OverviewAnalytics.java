package com.globetrotter.dto;

import java.math.BigDecimal;

public class OverviewAnalytics {

    private BigDecimal totalTripExpenses;
    private int expenseCount;
    private BigDecimal averageExpenseAmount;
    private BigDecimal totalSettlementVolume;
    private int settlementCount;
    private BigDecimal totalOutstandingBalance;

    public OverviewAnalytics() {}

    public OverviewAnalytics(BigDecimal totalTripExpenses, int expenseCount, BigDecimal averageExpenseAmount, BigDecimal totalSettlementVolume, int settlementCount, BigDecimal totalOutstandingBalance) {
        this.totalTripExpenses = totalTripExpenses;
        this.expenseCount = expenseCount;
        this.averageExpenseAmount = averageExpenseAmount;
        this.totalSettlementVolume = totalSettlementVolume;
        this.settlementCount = settlementCount;
        this.totalOutstandingBalance = totalOutstandingBalance;
    }

    public BigDecimal getTotalTripExpenses() { return totalTripExpenses; }
    public void setTotalTripExpenses(BigDecimal totalTripExpenses) { this.totalTripExpenses = totalTripExpenses; }
    public int getExpenseCount() { return expenseCount; }
    public void setExpenseCount(int expenseCount) { this.expenseCount = expenseCount; }
    public BigDecimal getAverageExpenseAmount() { return averageExpenseAmount; }
    public void setAverageExpenseAmount(BigDecimal averageExpenseAmount) { this.averageExpenseAmount = averageExpenseAmount; }
    public BigDecimal getTotalSettlementVolume() { return totalSettlementVolume; }
    public void setTotalSettlementVolume(BigDecimal totalSettlementVolume) { this.totalSettlementVolume = totalSettlementVolume; }
    public int getSettlementCount() { return settlementCount; }
    public void setSettlementCount(int settlementCount) { this.settlementCount = settlementCount; }
    public BigDecimal getTotalOutstandingBalance() { return totalOutstandingBalance; }
    public void setTotalOutstandingBalance(BigDecimal totalOutstandingBalance) { this.totalOutstandingBalance = totalOutstandingBalance; }
}
