package com.globetrotter.dto;

import java.math.BigDecimal;

public class ExpenseParticipantRequest {

    private Long memberId;
    private BigDecimal shareAmount;
    private BigDecimal percentage;

    public ExpenseParticipantRequest() {
    }

    public ExpenseParticipantRequest(Long memberId, BigDecimal shareAmount, BigDecimal percentage) {
        this.memberId = memberId;
        this.shareAmount = shareAmount;
        this.percentage = percentage;
    }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public BigDecimal getShareAmount() { return shareAmount; }
    public void setShareAmount(BigDecimal shareAmount) { this.shareAmount = shareAmount; }

    public BigDecimal getPercentage() { return percentage; }
    public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
}
