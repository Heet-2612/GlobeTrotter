package com.globetrotter.dto;

import java.math.BigDecimal;

public class ExpenseSourceAnalytics {

    private String source; // "ACTIVITY" or "CUSTOM"
    private BigDecimal totalAmount;
    private int expenseCount;
    private BigDecimal percentage;

    public ExpenseSourceAnalytics() {}

    public ExpenseSourceAnalytics(String source, BigDecimal totalAmount, int expenseCount, BigDecimal percentage) {
        this.source = source;
        this.totalAmount = totalAmount;
        this.expenseCount = expenseCount;
        this.percentage = percentage;
    }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public int getExpenseCount() { return expenseCount; }
    public void setExpenseCount(int expenseCount) { this.expenseCount = expenseCount; }
    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
}
