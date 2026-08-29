package com.globetrotter.dto;

import java.math.BigDecimal;

public class ExpensePayerRequest {

    private Long memberId;
    private BigDecimal paidAmount;

    public ExpensePayerRequest() {
    }

    public ExpensePayerRequest(Long memberId, BigDecimal paidAmount) {
        this.memberId = memberId;
        this.paidAmount = paidAmount;
    }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
}
