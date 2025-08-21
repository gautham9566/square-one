package com.oracle.travel_history_service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

/**
 * DTO for passenger summary information
 */
public class PassengerSummaryDto {

    private Long passengerId;
    private String name;
    private String phoneNumber;
    private String passportNumber;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private String seat;
    private String checkedIn;

    // Constructors
    public PassengerSummaryDto() {}

    public PassengerSummaryDto(Long passengerId, String name, String phoneNumber, String seat) {
        this.passengerId = passengerId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.seat = seat;
    }

    // Getters and Setters
    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
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

    @Override
    public String toString() {
        return "PassengerSummaryDto{" +
                "passengerId=" + passengerId +
                ", name='" + name + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", seat='" + seat + '\'' +
                '}';
    }
}
