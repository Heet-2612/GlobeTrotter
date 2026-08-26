package com.globetrotter.dto;

import com.globetrotter.entity.TripStop;
import java.time.LocalDate;

public class TripStopResponse {

    private Long id;
    private Long tripId;
    private DestinationResponse destination;
    private CityResponse city;
    private Integer stopOrder;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;

    public TripStopResponse() {
    }

    public TripStopResponse(Long id, Long tripId, DestinationResponse destination, CityResponse city, Integer stopOrder, LocalDate startDate, LocalDate endDate, String notes) {
        this.id = id;
        this.tripId = tripId;
        this.destination = destination;
        this.city = city;
        this.stopOrder = stopOrder;
        this.startDate = startDate;
        this.endDate = endDate;
        this.notes = notes;
    }

    public static TripStopResponse fromEntity(TripStop stop) {
        if (stop == null) return null;
        DestinationResponse destResponse = DestinationResponse.fromEntity(stop.getDestination());
        CityResponse cityResp = (stop.getDestination() != null) ? CityResponse.fromDestination(stop.getDestination()) : null;

        return new TripStopResponse(
                stop.getId(),
                stop.getTrip() != null ? stop.getTrip().getId() : null,
                destResponse,
                cityResp,
                stop.getStopOrder(),
                stop.getStartDate(),
                stop.getEndDate(),
                stop.getNotes()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

    public DestinationResponse getDestination() { return destination; }
    public void setDestination(DestinationResponse destination) { this.destination = destination; }

    public CityResponse getCity() { return city; }
    public void setCity(CityResponse city) { this.city = city; }

    public Integer getStopOrder() { return stopOrder; }
    public void setStopOrder(Integer stopOrder) { this.stopOrder = stopOrder; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
