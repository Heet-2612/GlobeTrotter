package com.globetrotter.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class MemberAnalytics {

    private Long memberId;
    private String fullName;
    @JsonProperty("isGtUser")
    private boolean isGtUser;
    private Long gtUserId;
    private String memberStatus;
    private BigDecimal totalPaid;
    private BigDecimal totalOwed;
    private BigDecimal expenseNetBalance;
    private BigDecimal finalNetBalance;
    private BigDecimal fundingPercentage;

    public MemberAnalytics() {}

    public MemberAnalytics(Long memberId, String fullName, boolean isGtUser, Long gtUserId, String memberStatus, BigDecimal totalPaid, BigDecimal totalOwed, BigDecimal expenseNetBalance, BigDecimal finalNetBalance, BigDecimal fundingPercentage) {
        this.memberId = memberId;
        this.fullName = fullName;
        this.isGtUser = isGtUser;
        this.gtUserId = gtUserId;
        this.memberStatus = memberStatus;
        this.totalPaid = totalPaid;
        this.totalOwed = totalOwed;
        this.expenseNetBalance = expenseNetBalance;
        this.finalNetBalance = finalNetBalance;
        this.fundingPercentage = fundingPercentage;
    }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public boolean isGtUser() { return isGtUser; }
    public void setGtUser(boolean gtUser) { isGtUser = gtUser; }
    public Long getGtUserId() { return gtUserId; }
    public void setGtUserId(Long gtUserId) { this.gtUserId = gtUserId; }
    public String getMemberStatus() { return memberStatus; }
    public void setMemberStatus(String memberStatus) { this.memberStatus = memberStatus; }
    public BigDecimal getTotalPaid() { return totalPaid; }
    public void setTotalPaid(BigDecimal totalPaid) { this.totalPaid = totalPaid; }
    public BigDecimal getTotalOwed() { return totalOwed; }
    public void setTotalOwed(BigDecimal totalOwed) { this.totalOwed = totalOwed; }
    public BigDecimal getExpenseNetBalance() { return expenseNetBalance; }
    public void setExpenseNetBalance(BigDecimal expenseNetBalance) { this.expenseNetBalance = expenseNetBalance; }
    public BigDecimal getFinalNetBalance() { return finalNetBalance; }
    public void setFinalNetBalance(BigDecimal finalNetBalance) { this.finalNetBalance = finalNetBalance; }
    public BigDecimal getFundingPercentage() { return fundingPercentage; }
    public void setFundingPercentage(BigDecimal fundingPercentage) { this.fundingPercentage = fundingPercentage; }
}
