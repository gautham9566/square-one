package com.oracle.flights.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * DTO for seat information in the seat map
 */
public class SeatDto {
    
    @JsonProperty("number")
    private Integer number;
    
    @JsonProperty("isBooked")
    private Boolean isBooked;
    
    public SeatDto() {}
    
    public SeatDto(Integer number, Boolean isBooked) {
        this.number = number;
        this.isBooked = isBooked;
    }
    
    public Integer getNumber() {
        return number;
    }
    
    public void setNumber(Integer number) {
        this.number = number;
    }
    
    public Boolean getIsBooked() {
        return isBooked;
    }
    
    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
    }
    
    @Override
    public String toString() {
        return "SeatDto{" +
                "number=" + number +
                ", isBooked=" + isBooked +
                '}';
    }
}
