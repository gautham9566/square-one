package com.oracle.travel_history_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for travel history data
 */
public class TravelHistoryDto {

    private Long historyId;
    private Long passengerId;
    private Long flightId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate travelDate;

    private String origin;
    private String destination;
    private String seat;
    private String bookingReference;
    private String fareClass;
    private String status;
    private Integer distanceKm;
    private Integer durationMin;
    private String notes;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // Nested objects for related data
    @JsonProperty("passengerDetails")
    private PassengerSummaryDto passenger;

    @JsonProperty("flightDetails")
    private FlightSummaryDto flight;

    // Constructors
    public TravelHistoryDto() {}

    public TravelHistoryDto(Long historyId, Long passengerId, Long flightId, LocalDate travelDate,
                           String origin, String destination, String bookingReference, String status) {
        this.historyId = historyId;
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.travelDate = travelDate;
        this.origin = origin;
        this.destination = destination;
        this.bookingReference = bookingReference;
        this.status = status;
    }

    // Getters and Setters
    public Long getHistoryId() {
        return historyId;
    }

    public void setHistoryId(Long historyId) {
        this.historyId = historyId;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public LocalDate getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(LocalDate travelDate) {
        this.travelDate = travelDate;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getSeat() {
        return seat;
    }

    public void setSeat(String seat) {
        this.seat = seat;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }

    public String getFareClass() {
        return fareClass;
    }

    public void setFareClass(String fareClass) {
        this.fareClass = fareClass;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Integer distanceKm) {
        this.distanceKm = distanceKm;
    }

    public Integer getDurationMin() {
        return durationMin;
    }

    public void setDurationMin(Integer durationMin) {
        this.durationMin = durationMin;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public PassengerSummaryDto getPassenger() {
        return passenger;
    }

    public void setPassenger(PassengerSummaryDto passenger) {
        this.passenger = passenger;
    }

    public FlightSummaryDto getFlight() {
        return flight;
    }

    public void setFlight(FlightSummaryDto flight) {
        this.flight = flight;
    }

    @Override
    public String toString() {
        return "TravelHistoryDto{" +
                "historyId=" + historyId +
                ", passengerId=" + passengerId +
                ", flightId=" + flightId +
                ", travelDate=" + travelDate +
                ", origin='" + origin + '\'' +
                ", destination='" + destination + '\'' +
                ", bookingReference='" + bookingReference + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
