package com.globetrotter.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "expense_payers")
public class TripExpensePayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private TripExpense expense;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private TripMember member;

    @Column(name = "paid_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal paidAmount;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public TripExpensePayer() {
    }

    public TripExpensePayer(Long id, TripExpense expense, TripMember member, BigDecimal paidAmount, LocalDateTime createdAt) {
        this.id = id;
        this.expense = expense;
        this.member = member;
        this.paidAmount = paidAmount;
        this.createdAt = createdAt;
    }

    public static TripExpensePayerBuilder builder() {
        return new TripExpensePayerBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TripExpense getExpense() { return expense; }
    public void setExpense(TripExpense expense) { this.expense = expense; }

    public TripMember getMember() { return member; }
    public void setMember(TripMember member) { this.member = member; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class TripExpensePayerBuilder {
        private Long id;
        private TripExpense expense;
        private TripMember member;
        private BigDecimal paidAmount;
        private LocalDateTime createdAt;

        public TripExpensePayerBuilder id(Long id) { this.id = id; return this; }
        public TripExpensePayerBuilder expense(TripExpense expense) { this.expense = expense; return this; }
        public TripExpensePayerBuilder member(TripMember member) { this.member = member; return this; }
        public TripExpensePayerBuilder paidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; return this; }
        public TripExpensePayerBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public TripExpensePayer build() {
            return new TripExpensePayer(id, expense, member, paidAmount, createdAt);
        }
    }
}
