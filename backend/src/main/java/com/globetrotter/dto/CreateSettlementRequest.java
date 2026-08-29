package com.globetrotter.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateSettlementRequest {

    @NotNull(message = "Payer member ID is required")
    private Long payerMemberId;

    @NotNull(message = "Receiver member ID is required")
    private Long receiverMemberId;

    @NotNull(message = "Settlement amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    private String currency;

    @NotNull(message = "Settlement date is required")
    private LocalDate settlementDate;

    private String notes;

    public CreateSettlementRequest() {}

    public CreateSettlementRequest(Long payerMemberId, Long receiverMemberId, BigDecimal amount, String currency, LocalDate settlementDate, String notes) {
        this.payerMemberId = payerMemberId;
        this.receiverMemberId = receiverMemberId;
        this.amount = amount;
        this.currency = currency;
        this.settlementDate = settlementDate;
        this.notes = notes;
    }

    public Long getPayerMemberId() { return payerMemberId; }
    public void setPayerMemberId(Long payerMemberId) { this.payerMemberId = payerMemberId; }
    public Long getReceiverMemberId() { return receiverMemberId; }
    public void setReceiverMemberId(Long receiverMemberId) { this.receiverMemberId = receiverMemberId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public LocalDate getSettlementDate() { return settlementDate; }
    public void setSettlementDate(LocalDate settlementDate) { this.settlementDate = settlementDate; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
