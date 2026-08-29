package com.globetrotter.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class SettlementResponse {

    private Long id;
    private Long tripId;

    private Long payerMemberId;
    private String payerMemberName;

    private Long receiverMemberId;
    private String receiverMemberName;

    private BigDecimal amount;
    private String currency;
    private LocalDate settlementDate;
    private String notes;

    private Long createdByUserId;
    private String createdByName;
    private LocalDateTime createdAt;

    public SettlementResponse() {}

    public SettlementResponse(Long id, Long tripId, Long payerMemberId, String payerMemberName, Long receiverMemberId, String receiverMemberName, BigDecimal amount, String currency, LocalDate settlementDate, String notes, Long createdByUserId, String createdByName, LocalDateTime createdAt) {
        this.id = id;
        this.tripId = tripId;
        this.payerMemberId = payerMemberId;
        this.payerMemberName = payerMemberName;
        this.receiverMemberId = receiverMemberId;
        this.receiverMemberName = receiverMemberName;
        this.amount = amount;
        this.currency = currency;
        this.settlementDate = settlementDate;
        this.notes = notes;
        this.createdByUserId = createdByUserId;
        this.createdByName = createdByName;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long tripId;
        private Long payerMemberId;
        private String payerMemberName;
        private Long receiverMemberId;
        private String receiverMemberName;
        private BigDecimal amount;
        private String currency;
        private LocalDate settlementDate;
        private String notes;
        private Long createdByUserId;
        private String createdByName;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder tripId(Long tripId) { this.tripId = tripId; return this; }
        public Builder payerMemberId(Long payerMemberId) { this.payerMemberId = payerMemberId; return this; }
        public Builder payerMemberName(String payerMemberName) { this.payerMemberName = payerMemberName; return this; }
        public Builder receiverMemberId(Long receiverMemberId) { this.receiverMemberId = receiverMemberId; return this; }
        public Builder receiverMemberName(String receiverMemberName) { this.receiverMemberName = receiverMemberName; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder currency(String currency) { this.currency = currency; return this; }
        public Builder settlementDate(LocalDate settlementDate) { this.settlementDate = settlementDate; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder createdByUserId(Long createdByUserId) { this.createdByUserId = createdByUserId; return this; }
        public Builder createdByName(String createdByName) { this.createdByName = createdByName; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public SettlementResponse build() {
            return new SettlementResponse(id, tripId, payerMemberId, payerMemberName, receiverMemberId, receiverMemberName, amount, currency, settlementDate, notes, createdByUserId, createdByName, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }
    public Long getPayerMemberId() { return payerMemberId; }
    public void setPayerMemberId(Long payerMemberId) { this.payerMemberId = payerMemberId; }
    public String getPayerMemberName() { return payerMemberName; }
    public void setPayerMemberName(String payerMemberName) { this.payerMemberName = payerMemberName; }
    public Long getReceiverMemberId() { return receiverMemberId; }
    public void setReceiverMemberId(Long receiverMemberId) { this.receiverMemberId = receiverMemberId; }
    public String getReceiverMemberName() { return receiverMemberName; }
    public void setReceiverMemberName(String receiverMemberName) { this.receiverMemberName = receiverMemberName; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public LocalDate getSettlementDate() { return settlementDate; }
    public void setSettlementDate(LocalDate settlementDate) { this.settlementDate = settlementDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Long getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(Long createdByUserId) { this.createdByUserId = createdByUserId; }
    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
