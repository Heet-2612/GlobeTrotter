package com.globetrotter.dto;

import java.time.LocalDate;

public class CreateTripStopRequest {

    private Long destinationId;
    private Long cityId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;

    public CreateTripStopRequest() {
    }

    public CreateTripStopRequest(Long destinationId, LocalDate startDate, LocalDate endDate, String notes) {
        this.destinationId = destinationId;
        this.cityId = destinationId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.notes = notes;
    }

    public Long getDestinationId() {
        return destinationId != null ? destinationId : cityId;
    }
    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
        if (this.cityId == null) this.cityId = destinationId;
    }

    public Long getCityId() {
        return cityId != null ? cityId : destinationId;
    }
    public void setCityId(Long cityId) {
        this.cityId = cityId;
        if (this.destinationId == null) this.destinationId = cityId;
    }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
