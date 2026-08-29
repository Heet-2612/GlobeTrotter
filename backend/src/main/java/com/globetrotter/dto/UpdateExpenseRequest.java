package com.globetrotter.dto;

import com.globetrotter.entity.ExpenseCategory;
import com.globetrotter.entity.SplitType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class UpdateExpenseRequest {

    private String title;
    private BigDecimal amount;
    private String currency = "INR";
    private ExpenseCategory category = ExpenseCategory.OTHER;
    private LocalDate expenseDate;
    private SplitType splitType = SplitType.EQUAL;
    private Long payerMemberId;
    private Long tripActivityId;
    private String notes;
    private List<ExpenseParticipantRequest> participants;

    public UpdateExpenseRequest() {
    }

    public UpdateExpenseRequest(String title, BigDecimal amount, String currency, ExpenseCategory category, LocalDate expenseDate, SplitType splitType, Long payerMemberId, Long tripActivityId, String notes, List<ExpenseParticipantRequest> participants) {
        this.title = title;
        this.amount = amount;
        this.currency = currency != null ? currency : "INR";
        this.category = category != null ? category : ExpenseCategory.OTHER;
        this.expenseDate = expenseDate;
        this.splitType = splitType != null ? splitType : SplitType.EQUAL;
        this.payerMemberId = payerMemberId;
        this.tripActivityId = tripActivityId;
        this.notes = notes;
        this.participants = participants;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public ExpenseCategory getCategory() { return category; }
    public void setCategory(ExpenseCategory category) { this.category = category; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public SplitType getSplitType() { return splitType; }
    public void setSplitType(SplitType splitType) { this.splitType = splitType; }

    public Long getPayerMemberId() { return payerMemberId; }
    public void setPayerMemberId(Long payerMemberId) { this.payerMemberId = payerMemberId; }

    public Long getTripActivityId() { return tripActivityId; }
    public void setTripActivityId(Long tripActivityId) { this.tripActivityId = tripActivityId; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<ExpenseParticipantRequest> getParticipants() { return participants; }
    public void setParticipants(List<ExpenseParticipantRequest> participants) { this.participants = participants; }
}
