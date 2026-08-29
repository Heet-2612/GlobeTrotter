package com.globetrotter.dto;

import com.globetrotter.entity.ExpenseParticipant;

import java.math.BigDecimal;

public class ExpenseParticipantResponse {

    private Long id;
    private Long memberId;
    private String fullName;
    private boolean isGtUser;
    private Long userId;
    private BigDecimal shareAmount;

    public ExpenseParticipantResponse() {
    }

    public ExpenseParticipantResponse(Long id, Long memberId, String fullName, boolean isGtUser, Long userId, BigDecimal shareAmount) {
        this.id = id;
        this.memberId = memberId;
        this.fullName = fullName;
        this.isGtUser = isGtUser;
        this.userId = userId;
        this.shareAmount = shareAmount;
    }

    public static ExpenseParticipantResponse fromEntity(ExpenseParticipant ep) {
        if (ep == null) {
            return null;
        }
        Long uId = (ep.getMember() != null && ep.getMember().getUser() != null) ? ep.getMember().getUser().getId() : null;
        String name = ep.getMember() != null ? ep.getMember().getFullName() : "Unknown Member";
        boolean isGt = ep.getMember() != null && ep.getMember().isGtUser();
        Long mId = ep.getMember() != null ? ep.getMember().getId() : null;

        return new ExpenseParticipantResponse(
                ep.getId(),
                mId,
                name,
                isGt,
                uId,
                ep.getShareAmount()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public boolean isGtUser() { return isGtUser; }
    public void setGtUser(boolean isGtUser) { this.isGtUser = isGtUser; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public BigDecimal getShareAmount() { return shareAmount; }
    public void setShareAmount(BigDecimal shareAmount) { this.shareAmount = shareAmount; }
}
