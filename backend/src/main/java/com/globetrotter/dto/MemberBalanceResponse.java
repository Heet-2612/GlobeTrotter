package com.globetrotter.dto;

import com.globetrotter.entity.BalanceStatus;

import java.math.BigDecimal;

public class MemberBalanceResponse {

    private Long memberId;
    private String fullName;
    private boolean isGtUser;
    private Long gtUserId;
    private String role;
    private String memberStatus;
    private BigDecimal totalPaid;
    private BigDecimal totalOwed;
    private BigDecimal netBalance;
    private BalanceStatus balanceStatus;

    public MemberBalanceResponse() {
    }

    public MemberBalanceResponse(Long memberId, String fullName, boolean isGtUser, Long gtUserId, String role, String memberStatus, BigDecimal totalPaid, BigDecimal totalOwed, BigDecimal netBalance, BalanceStatus balanceStatus) {
        this.memberId = memberId;
        this.fullName = fullName;
        this.isGtUser = isGtUser;
        this.gtUserId = gtUserId;
        this.role = role;
        this.memberStatus = memberStatus;
        this.totalPaid = totalPaid;
        this.totalOwed = totalOwed;
        this.netBalance = netBalance;
        this.balanceStatus = balanceStatus;
    }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public boolean isGtUser() { return isGtUser; }
    public void setGtUser(boolean isGtUser) { this.isGtUser = isGtUser; }

    public Long getGtUserId() { return gtUserId; }
    public void setGtUserId(Long gtUserId) { this.gtUserId = gtUserId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMemberStatus() { return memberStatus; }
    public void setMemberStatus(String memberStatus) { this.memberStatus = memberStatus; }

    public BigDecimal getTotalPaid() { return totalPaid; }
    public void setTotalPaid(BigDecimal totalPaid) { this.totalPaid = totalPaid; }

    public BigDecimal getTotalOwed() { return totalOwed; }
    public void setTotalOwed(BigDecimal totalOwed) { this.totalOwed = totalOwed; }

    public BigDecimal getNetBalance() { return netBalance; }
    public void setNetBalance(BigDecimal netBalance) { this.netBalance = netBalance; }

    public BalanceStatus getBalanceStatus() { return balanceStatus; }
    public void setBalanceStatus(BalanceStatus balanceStatus) { this.balanceStatus = balanceStatus; }
}
