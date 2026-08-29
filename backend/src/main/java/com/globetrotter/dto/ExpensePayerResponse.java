package com.globetrotter.dto;

import com.globetrotter.entity.TripExpensePayer;

import java.math.BigDecimal;

public class ExpensePayerResponse {

    private Long id;
    private Long memberId;
    private String memberFullName;
    private BigDecimal paidAmount;

    public ExpensePayerResponse() {
    }

    public ExpensePayerResponse(Long id, Long memberId, String memberFullName, BigDecimal paidAmount) {
        this.id = id;
        this.memberId = memberId;
        this.memberFullName = memberFullName;
        this.paidAmount = paidAmount;
    }

    public static ExpensePayerResponse fromEntity(TripExpensePayer entity) {
        if (entity == null) {
            return null;
        }
        Long memId = entity.getMember() != null ? entity.getMember().getId() : null;
        String memName = entity.getMember() != null ? entity.getMember().getFullName() : "Unknown Member";
        return new ExpensePayerResponse(entity.getId(), memId, memName, entity.getPaidAmount());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public String getMemberFullName() { return memberFullName; }
    public void setMemberFullName(String memberFullName) { this.memberFullName = memberFullName; }

    public BigDecimal getPaidAmount() { return paidAmount; }
    public void setPaidAmount(BigDecimal paidAmount) { this.paidAmount = paidAmount; }
}
