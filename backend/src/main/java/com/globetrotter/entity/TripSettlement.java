package com.globetrotter.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_settlements")
public class TripSettlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payer_member_id", nullable = false)
    private TripMember payerMember;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receiver_member_id", nullable = false)
    private TripMember receiverMember;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(name = "settlement_date", nullable = false)
    private LocalDate settlementDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdByUser;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public TripSettlement() {}

    public TripSettlement(Long id, Trip trip, TripMember payerMember, TripMember receiverMember, BigDecimal amount, String currency, LocalDate settlementDate, String notes, User createdByUser, LocalDateTime createdAt) {
        this.id = id;
        this.trip = trip;
        this.payerMember = payerMember;
        this.receiverMember = receiverMember;
        this.amount = amount;
        this.currency = currency;
        this.settlementDate = settlementDate;
        this.notes = notes;
        this.createdByUser = createdByUser;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Trip trip;
        private TripMember payerMember;
        private TripMember receiverMember;
        private BigDecimal amount;
        private String currency;
        private LocalDate settlementDate;
        private String notes;
        private User createdByUser;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder trip(Trip trip) { this.trip = trip; return this; }
        public Builder payerMember(TripMember payerMember) { this.payerMember = payerMember; return this; }
        public Builder receiverMember(TripMember receiverMember) { this.receiverMember = receiverMember; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder currency(String currency) { this.currency = currency; return this; }
        public Builder settlementDate(LocalDate settlementDate) { this.settlementDate = settlementDate; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder createdByUser(User createdByUser) { this.createdByUser = createdByUser; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public TripSettlement build() {
            return new TripSettlement(id, trip, payerMember, receiverMember, amount, currency, settlementDate, notes, createdByUser, createdAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }
    public TripMember getPayerMember() { return payerMember; }
    public void setPayerMember(TripMember payerMember) { this.payerMember = payerMember; }
    public TripMember getReceiverMember() { return receiverMember; }
    public void setReceiverMember(TripMember receiverMember) { this.receiverMember = receiverMember; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public LocalDate getSettlementDate() { return settlementDate; }
    public void setSettlementDate(LocalDate settlementDate) { this.settlementDate = settlementDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public User getCreatedByUser() { return createdByUser; }
    public void setCreatedByUser(User createdByUser) { this.createdByUser = createdByUser; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
