package com.globetrotter.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trip_expenses")
public class TripExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payer_member_id")
    private TripMember payerMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdByUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_activity_id")
    private TripActivity tripActivity;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 10)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 50)
    private ExpenseCategory category = ExpenseCategory.OTHER;

    @Column(name = "expense_date", nullable = false)
    private LocalDate expenseDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "split_type", nullable = false, length = 20)
    private SplitType splitType = SplitType.EQUAL;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripExpensePayer> payers = new ArrayList<>();

    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExpenseParticipant> participants = new ArrayList<>();

    public TripExpense() {
    }

    public TripExpense(Long id, Trip trip, TripMember payerMember, User createdByUser, TripActivity tripActivity, String title, BigDecimal amount, String currency, ExpenseCategory category, LocalDate expenseDate, SplitType splitType, String notes, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.trip = trip;
        this.payerMember = payerMember;
        this.createdByUser = createdByUser;
        this.tripActivity = tripActivity;
        this.title = title;
        this.amount = amount;
        this.currency = currency != null ? currency : "INR";
        this.category = category != null ? category : ExpenseCategory.OTHER;
        this.expenseDate = expenseDate;
        this.splitType = splitType != null ? splitType : SplitType.EQUAL;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static TripExpenseBuilder builder() {
        return new TripExpenseBuilder();
    }

    public boolean isActivityLinked() {
        return tripActivity != null;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public TripMember getPayerMember() { return payerMember; }
    public void setPayerMember(TripMember payerMember) { this.payerMember = payerMember; }

    public User getCreatedByUser() { return createdByUser; }
    public void setCreatedByUser(User createdByUser) { this.createdByUser = createdByUser; }

    public TripActivity getTripActivity() { return tripActivity; }
    public void setTripActivity(TripActivity tripActivity) { this.tripActivity = tripActivity; }

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

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<TripExpensePayer> getPayers() { return payers; }
    public void setPayers(List<TripExpensePayer> payers) { this.payers = payers; }

    public List<ExpenseParticipant> getParticipants() { return participants; }
    public void setParticipants(List<ExpenseParticipant> participants) { this.participants = participants; }

    public static class TripExpenseBuilder {
        private Long id;
        private Trip trip;
        private TripMember payerMember;
        private User createdByUser;
        private TripActivity tripActivity;
        private String title;
        private BigDecimal amount;
        private String currency = "INR";
        private ExpenseCategory category = ExpenseCategory.OTHER;
        private LocalDate expenseDate;
        private SplitType splitType = SplitType.EQUAL;
        private String notes;
        private List<TripExpensePayer> payers = new ArrayList<>();
        private List<ExpenseParticipant> participants = new ArrayList<>();
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public TripExpenseBuilder id(Long id) { this.id = id; return this; }
        public TripExpenseBuilder trip(Trip trip) { this.trip = trip; return this; }
        public TripExpenseBuilder payerMember(TripMember payerMember) { this.payerMember = payerMember; return this; }
        public TripExpenseBuilder createdByUser(User createdByUser) { this.createdByUser = createdByUser; return this; }
        public TripExpenseBuilder tripActivity(TripActivity tripActivity) { this.tripActivity = tripActivity; return this; }
        public TripExpenseBuilder title(String title) { this.title = title; return this; }
        public TripExpenseBuilder amount(BigDecimal amount) { this.amount = amount; return this; }
        public TripExpenseBuilder currency(String currency) { this.currency = currency; return this; }
        public TripExpenseBuilder category(ExpenseCategory category) { this.category = category; return this; }
        public TripExpenseBuilder expenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; return this; }
        public TripExpenseBuilder splitType(SplitType splitType) { this.splitType = splitType; return this; }
        public TripExpenseBuilder notes(String notes) { this.notes = notes; return this; }
        public TripExpenseBuilder payers(List<TripExpensePayer> payers) { this.payers = payers; return this; }
        public TripExpenseBuilder participants(List<ExpenseParticipant> participants) { this.participants = participants; return this; }
        public TripExpenseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public TripExpenseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public TripExpense build() {
            TripExpense expense = new TripExpense(id, trip, payerMember, createdByUser, tripActivity, title, amount, currency, category, expenseDate, splitType, notes, createdAt, updatedAt);
            if (this.payers != null) {
                expense.setPayers(this.payers);
            }
            if (this.participants != null) {
                expense.setParticipants(this.participants);
            }
            return expense;
        }
    }
}
