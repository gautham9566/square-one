package com.oracle.passengers.dto;

import jakarta.validation.constraints.Size;

/**
 * DTO for passenger check-in operations
 */
public class CheckInDto {
    
    @Size(max = 10, message = "Seat must not exceed 10 characters")
    private String seat;
    
    private Boolean wheelchair;
    
    private Boolean infant;
    
    private String specialRequests;
    
    // Default constructor
    public CheckInDto() {}
    
    // Constructor with seat
    public CheckInDto(String seat) {
        this.seat = seat;
    }
    
    // Constructor with all fields
    public CheckInDto(String seat, Boolean wheelchair, Boolean infant, String specialRequests) {
        this.seat = seat;
        this.wheelchair = wheelchair;
        this.infant = infant;
        this.specialRequests = specialRequests;
    }
    
    // Getters and setters
    public String getSeat() {
        return seat;
    }
    
    public void setSeat(String seat) {
        this.seat = seat;
    }
    
    public Boolean getWheelchair() {
        return wheelchair;
    }
    
    public void setWheelchair(Boolean wheelchair) {
        this.wheelchair = wheelchair;
    }
    
    public Boolean getInfant() {
        return infant;
    }
    
    public void setInfant(Boolean infant) {
        this.infant = infant;
    }
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
    
    @Override
    public String toString() {
        return "CheckInDto{" +
                "seat='" + seat + '\'' +
                ", wheelchair=" + wheelchair +
                ", infant=" + infant +
                ", specialRequests='" + specialRequests + '\'' +
                '}';
    }
}
