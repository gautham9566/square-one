package com.oracle.travel_history_service.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entity representing travel history records
 */
@Entity
@Table(name = "travel_history")
public class TravelHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    @NotNull
    @Column(name = "passenger_id", nullable = false)
    private Long passengerId;

    @NotNull
    @Column(name = "flight_id", nullable = false)
    private Long flightId;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "travel_date", nullable = false)
    private LocalDate travelDate;

    @NotNull
    @Size(max = 10)
    @Column(name = "origin", nullable = false, length = 10)
    private String origin;

    @NotNull
    @Size(max = 10)
    @Column(name = "destination", nullable = false, length = 10)
    private String destination;

    @Size(max = 10)
    @Column(name = "seat", length = 10)
    private String seat;

    @NotNull
    @Size(max = 20)
    @Column(name = "booking_reference", nullable = false, unique = true, length = 20)
    private String bookingReference;

    @Size(max = 30)
    @Column(name = "fare_class", length = 30)
    private String fareClass;

    @Size(max = 20)
    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "distance_km")
    private Integer distanceKm;

    @Column(name = "duration_min")
    private Integer durationMin;

    @Size(max = 500)
    @Column(name = "notes", length = 500)
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public TravelHistory() {}

    public TravelHistory(Long passengerId, Long flightId, LocalDate travelDate, 
                        String origin, String destination, String bookingReference) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.travelDate = travelDate;
        this.origin = origin;
        this.destination = destination;
        this.bookingReference = bookingReference;
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

    @Override
    public String toString() {
        return "TravelHistory{" +
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
