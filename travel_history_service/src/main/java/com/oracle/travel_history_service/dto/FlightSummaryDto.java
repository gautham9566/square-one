package com.oracle.travel_history_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

/**
 * DTO for flight summary information
 */
public class FlightSummaryDto {

    private Long flightId;
    private String flightName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate flightDate;

    private String route;
    private String departureTime;
    private String arrivalTime;
    private String aircraftType;
    private Integer totalSeats;
    private Integer availableSeats;

    // Constructors
    public FlightSummaryDto() {}

    public FlightSummaryDto(Long flightId, String flightName, LocalDate flightDate, String route,
                           String departureTime, String arrivalTime) {
        this.flightId = flightId;
        this.flightName = flightName;
        this.flightDate = flightDate;
        this.route = route;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
    }

    // Getters and Setters
    public Long getFlightId() {
        return flightId;
    }

    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }

    public String getFlightName() {
        return flightName;
    }

    public void setFlightName(String flightName) {
        this.flightName = flightName;
    }

    public LocalDate getFlightDate() {
        return flightDate;
    }

    public void setFlightDate(LocalDate flightDate) {
        this.flightDate = flightDate;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getAircraftType() {
        return aircraftType;
    }

    public void setAircraftType(String aircraftType) {
        this.aircraftType = aircraftType;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    @Override
    public String toString() {
        return "FlightSummaryDto{" +
                "flightId=" + flightId +
                ", flightName='" + flightName + '\'' +
                ", flightDate=" + flightDate +
                ", route='" + route + '\'' +
                ", departureTime='" + departureTime + '\'' +
                ", arrivalTime='" + arrivalTime + '\'' +
                '}';
    }
}
