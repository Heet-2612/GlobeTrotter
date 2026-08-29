package com.globetrotter.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TimelineAnalytics {

    private LocalDate date;
    private BigDecimal totalAmount;
    private int expenseCount;

    public TimelineAnalytics() {}

    public TimelineAnalytics(LocalDate date, BigDecimal totalAmount, int expenseCount) {
        this.date = date;
        this.totalAmount = totalAmount;
        this.expenseCount = expenseCount;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public int getExpenseCount() { return expenseCount; }
    public void setExpenseCount(int expenseCount) { this.expenseCount = expenseCount; }
}
