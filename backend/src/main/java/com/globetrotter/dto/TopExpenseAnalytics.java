package com.globetrotter.dto;

import com.globetrotter.entity.ExpenseCategory;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TopExpenseAnalytics {

    private Long id;
    private String title;
    private ExpenseCategory category;
    private String payerName;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private String activityName;

    public TopExpenseAnalytics() {}

    public TopExpenseAnalytics(Long id, String title, ExpenseCategory category, String payerName, BigDecimal amount, LocalDate expenseDate, String activityName) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.payerName = payerName;
        this.amount = amount;
        this.expenseDate = expenseDate;
        this.activityName = activityName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public ExpenseCategory getCategory() { return category; }
    public void setCategory(ExpenseCategory category) { this.category = category; }
    public String getPayerName() { return payerName; }
    public void setPayerName(String payerName) { this.payerName = payerName; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }
    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }
}
