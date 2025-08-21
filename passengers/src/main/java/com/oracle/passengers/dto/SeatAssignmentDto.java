package com.oracle.passengers.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for seat assignment operations
 */
public class SeatAssignmentDto {
    
    @NotNull(message = "Passenger ID is required")
    private Long passengerId;
    
    @NotBlank(message = "Seat is required")
    @Size(max = 10, message = "Seat must not exceed 10 characters")
    private String seat;
    
    // Default constructor
    public SeatAssignmentDto() {}
    
    // Constructor with all fields
    public SeatAssignmentDto(Long passengerId, String seat) {
        this.passengerId = passengerId;
        this.seat = seat;
    }
    
    // Getters and setters
    public Long getPassengerId() {
        return passengerId;
    }
    
    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }
    
    public String getSeat() {
        return seat;
    }
    
    public void setSeat(String seat) {
        this.seat = seat;
    }
    
    @Override
    public String toString() {
        return "SeatAssignmentDto{" +
                "passengerId=" + passengerId +
                ", seat='" + seat + '\'' +
                '}';
    }
}
