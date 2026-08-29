package com.globetrotter.dto;

import com.globetrotter.entity.ExpenseCategory;
import com.globetrotter.entity.SplitType;
import com.globetrotter.entity.TripExpense;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ExpenseResponse {

    private Long id;
    private Long tripId;
    private String title;
    private BigDecimal amount;
    private String currency;
    private ExpenseCategory category;
    private LocalDate expenseDate;
    private SplitType splitType;
    private TripMemberResponse payer;
    private boolean isMultiplePayers;
    private List<ExpensePayerResponse> payers;
    private Long createdByUserId;
    private String createdByName;
    private boolean isActivityLinked;
    private Long tripActivityId;
    private String activityName;
    private String notes;
    private List<ExpenseParticipantResponse> participants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ExpenseResponse() {
    }

    public ExpenseResponse(Long id, Long tripId, String title, BigDecimal amount, String currency, ExpenseCategory category, LocalDate expenseDate, SplitType splitType, TripMemberResponse payer, boolean isMultiplePayers, List<ExpensePayerResponse> payers, Long createdByUserId, String createdByName, boolean isActivityLinked, Long tripActivityId, String activityName, String notes, List<ExpenseParticipantResponse> participants, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.tripId = tripId;
        this.title = title;
        this.amount = amount;
        this.currency = currency;
        this.category = category;
        this.expenseDate = expenseDate;
        this.splitType = splitType;
        this.payer = payer;
        this.isMultiplePayers = isMultiplePayers;
        this.payers = payers;
        this.createdByUserId = createdByUserId;
        this.createdByName = createdByName;
        this.isActivityLinked = isActivityLinked;
        this.tripActivityId = tripActivityId;
        this.activityName = activityName;
        this.notes = notes;
        this.participants = participants;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ExpenseResponse fromEntity(TripExpense expense) {
        if (expense == null) {
            return null;
        }

        List<ExpensePayerResponse> payerResps = expense.getPayers() != null
                ? expense.getPayers().stream().map(ExpensePayerResponse::fromEntity).collect(Collectors.toList())
                : List.of();

        boolean isMulti = payerResps.size() > 1;

        TripMemberResponse payerResp = null;
        if (expense.getPayerMember() != null) {
            payerResp = TripMemberResponse.fromEntity(expense.getPayerMember());
        } else if (!payerResps.isEmpty() && expense.getPayers().get(0).getMember() != null) {
            payerResp = TripMemberResponse.fromEntity(expense.getPayers().get(0).getMember());
        }

        Long creatorId = expense.getCreatedByUser() != null ? expense.getCreatedByUser().getId() : null;
        String creatorName = expense.getCreatedByUser() != null ? expense.getCreatedByUser().getName() : "Unknown User";

        boolean linked = expense.isActivityLinked();
        Long actId = linked ? expense.getTripActivity().getId() : null;
        String actName = linked && expense.getTripActivity().getActivity() != null ? expense.getTripActivity().getActivity().getName() : null;

        List<ExpenseParticipantResponse> partResps = expense.getParticipants() != null
                ? expense.getParticipants().stream().map(ExpenseParticipantResponse::fromEntity).collect(Collectors.toList())
                : List.of();

        return new ExpenseResponse(
                expense.getId(),
                expense.getTrip() != null ? expense.getTrip().getId() : null,
                expense.getTitle(),
                expense.getAmount(),
                expense.getCurrency(),
                expense.getCategory(),
                expense.getExpenseDate(),
                expense.getSplitType(),
                payerResp,
                isMulti,
                payerResps,
                creatorId,
                creatorName,
                linked,
                actId,
                actName,
                expense.getNotes(),
                partResps,
                expense.getCreatedAt(),
                expense.getUpdatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

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

    public TripMemberResponse getPayer() { return payer; }
    public void setPayer(TripMemberResponse payer) { this.payer = payer; }

    public boolean isMultiplePayers() { return isMultiplePayers; }
    public void setMultiplePayers(boolean multiplePayers) { isMultiplePayers = multiplePayers; }

    public List<ExpensePayerResponse> getPayers() { return payers; }
    public void setPayers(List<ExpensePayerResponse> payers) { this.payers = payers; }

    public Long getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(Long createdByUserId) { this.createdByUserId = createdByUserId; }

    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }

    public boolean isActivityLinked() { return isActivityLinked; }
    public void setActivityLinked(boolean activityLinked) { isActivityLinked = activityLinked; }

    public Long getTripActivityId() { return tripActivityId; }
    public void setTripActivityId(Long tripActivityId) { this.tripActivityId = tripActivityId; }

    public String getActivityName() { return activityName; }
    public void setActivityName(String activityName) { this.activityName = activityName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<ExpenseParticipantResponse> getParticipants() { return participants; }
    public void setParticipants(List<ExpenseParticipantResponse> participants) { this.participants = participants; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
