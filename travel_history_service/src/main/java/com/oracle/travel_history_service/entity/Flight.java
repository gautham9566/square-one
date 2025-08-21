package com.oracle.travel_history_service.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Minimal Flight entity for travel history relationships
 */
@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_id")
    private Long flightId;

    @NotNull
    @Size(max = 50)
    @Column(name = "flight_name", nullable = false, length = 50)
    private String flightName;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "flight_date", nullable = false)
    private LocalDate flightDate;

    @NotNull
    @Size(max = 20)
    @Column(name = "route", nullable = false, length = 20)
    private String route;

    @NotNull
    @Size(max = 20)
    @Column(name = "departure_time", nullable = false, length = 20)
    private String departureTime;

    @NotNull
    @Size(max = 20)
    @Column(name = "arrival_time", nullable = false, length = 20)
    private String arrivalTime;

    @Size(max = 50)
    @Column(name = "aircraft_type", length = 50)
    private String aircraftType;

    @NotNull
    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @NotNull
    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Flight() {}

    public Flight(String flightName, LocalDate flightDate, String route, 
                  String departureTime, String arrivalTime, Integer totalSeats, Integer availableSeats) {
        this.flightName = flightName;
        this.flightDate = flightDate;
        this.route = route;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Flight{" +
                "flightId=" + flightId +
                ", flightName='" + flightName + '\'' +
                ", flightDate=" + flightDate +
                ", route='" + route + '\'' +
                ", departureTime='" + departureTime + '\'' +
                ", arrivalTime='" + arrivalTime + '\'' +
                ", aircraftType='" + aircraftType + '\'' +
                '}';
    }
}
