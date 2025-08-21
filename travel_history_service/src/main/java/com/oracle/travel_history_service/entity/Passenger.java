package com.oracle.travel_history_service.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Minimal Passenger entity for travel history relationships
 */
@Entity
@Table(name = "passengers")
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passenger_id")
    private Long passengerId;

    @NotNull
    @Column(name = "flight_id", nullable = false)
    private Long flightId;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Size(max = 20)
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Size(max = 300)
    @Column(name = "address", length = 300)
    private String address;

    @Size(max = 30)
    @Column(name = "passport_number", length = 30)
    private String passportNumber;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

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

    @Column(name = "checked_in", length = 1)
    private String checkedIn = "N";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Passenger() {}

    public Passenger(Long flightId, String name, String origin, String destination) {
        this.flightId = flightId;
        this.name = name;
        this.origin = origin;
        this.destination = destination;
    }

    // Getters and Setters
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPassportNumber() {
        return passportNumber;
    }

    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
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

    public String getCheckedIn() {
        return checkedIn;
    }

    public void setCheckedIn(String checkedIn) {
        this.checkedIn = checkedIn;
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
        return "Passenger{" +
                "passengerId=" + passengerId +
                ", flightId=" + flightId +
                ", name='" + name + '\'' +
                ", origin='" + origin + '\'' +
                ", destination='" + destination + '\'' +
                ", seat='" + seat + '\'' +
                '}';
    }
}
