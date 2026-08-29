package com.globetrotter.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "expense_participants")
public class ExpenseParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private TripExpense expense;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private TripMember member;

    @Column(name = "share_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal shareAmount;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ExpenseParticipant() {
    }

    public ExpenseParticipant(Long id, TripExpense expense, TripMember member, BigDecimal shareAmount, LocalDateTime createdAt) {
        this.id = id;
        this.expense = expense;
        this.member = member;
        this.shareAmount = shareAmount;
        this.createdAt = createdAt;
    }

    public static ExpenseParticipantBuilder builder() {
        return new ExpenseParticipantBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TripExpense getExpense() { return expense; }
    public void setExpense(TripExpense expense) { this.expense = expense; }

    public TripMember getMember() { return member; }
    public void setMember(TripMember member) { this.member = member; }

    public BigDecimal getShareAmount() { return shareAmount; }
    public void setShareAmount(BigDecimal shareAmount) { this.shareAmount = shareAmount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class ExpenseParticipantBuilder {
        private Long id;
        private TripExpense expense;
        private TripMember member;
        private BigDecimal shareAmount;
        private LocalDateTime createdAt;

        public ExpenseParticipantBuilder id(Long id) { this.id = id; return this; }
        public ExpenseParticipantBuilder expense(TripExpense expense) { this.expense = expense; return this; }
        public ExpenseParticipantBuilder member(TripMember member) { this.member = member; return this; }
        public ExpenseParticipantBuilder shareAmount(BigDecimal shareAmount) { this.shareAmount = shareAmount; return this; }
        public ExpenseParticipantBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ExpenseParticipant build() {
            return new ExpenseParticipant(id, expense, member, shareAmount, createdAt);
        }
    }
}
