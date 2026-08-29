package com.globetrotter.dto;

public class AddTripMemberRequest {

    private Long gtUserId;
    private String fullName;

    public AddTripMemberRequest() {
    }

    public AddTripMemberRequest(Long gtUserId, String fullName) {
        this.gtUserId = gtUserId;
        this.fullName = fullName;
    }

    public Long getGtUserId() { return gtUserId; }
    public void setGtUserId(Long gtUserId) { this.gtUserId = gtUserId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}
