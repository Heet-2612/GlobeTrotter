package com.globetrotter.dto;

import com.globetrotter.entity.BalanceStatus;

import java.math.BigDecimal;

public class MyBalanceSummaryResponse {

    private Long memberId;
    private BigDecimal netBalance;
    private BalanceStatus balanceStatus;
    private String summaryMessage;

    public MyBalanceSummaryResponse() {
    }

    public MyBalanceSummaryResponse(Long memberId, BigDecimal netBalance, BalanceStatus balanceStatus, String summaryMessage) {
        this.memberId = memberId;
        this.netBalance = netBalance;
        this.balanceStatus = balanceStatus;
        this.summaryMessage = summaryMessage;
    }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public BigDecimal getNetBalance() { return netBalance; }
    public void setNetBalance(BigDecimal netBalance) { this.netBalance = netBalance; }

    public BalanceStatus getBalanceStatus() { return balanceStatus; }
    public void setBalanceStatus(BalanceStatus balanceStatus) { this.balanceStatus = balanceStatus; }

    public String getSummaryMessage() { return summaryMessage; }
    public void setSummaryMessage(String summaryMessage) { this.summaryMessage = summaryMessage; }
}
