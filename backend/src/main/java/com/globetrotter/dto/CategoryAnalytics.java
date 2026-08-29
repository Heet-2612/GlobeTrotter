package com.globetrotter.dto;

import com.globetrotter.entity.ExpenseCategory;

import java.math.BigDecimal;

public class CategoryAnalytics {

    private ExpenseCategory category;
    private BigDecimal totalAmount;
    private int expenseCount;
    private BigDecimal percentage;

    public CategoryAnalytics() {}

    public CategoryAnalytics(ExpenseCategory category, BigDecimal totalAmount, int expenseCount, BigDecimal percentage) {
        this.category = category;
        this.totalAmount = totalAmount;
        this.expenseCount = expenseCount;
        this.percentage = percentage;
    }

    public ExpenseCategory getCategory() { return category; }
    public void setCategory(ExpenseCategory category) { this.category = category; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public int getExpenseCount() { return expenseCount; }
    public void setExpenseCount(int expenseCount) { this.expenseCount = expenseCount; }
    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
}
