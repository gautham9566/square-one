package com.oracle.flights.dto;

import java.util.List;

/**
 * DTO for seat availability response
 */
public class SeatAvailabilityDto {
    
    private Long flightId;
    private String flightName;
    private String route;
    private String flightDate;
    private Integer totalSeats;
    private Integer availableSeats;
    private List<SeatDto> seatMap;
    
    public SeatAvailabilityDto() {}
    
    public SeatAvailabilityDto(Long flightId, String flightName, String route, 
                              String flightDate, Integer totalSeats, Integer availableSeats, 
                              List<SeatDto> seatMap) {
        this.flightId = flightId;
        this.flightName = flightName;
        this.route = route;
        this.flightDate = flightDate;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.seatMap = seatMap;
    }
    
    // Getters and setters
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
    
    public String getRoute() {
        return route;
    }
    
    public void setRoute(String route) {
        this.route = route;
    }
    
    public String getFlightDate() {
        return flightDate;
    }
    
    public void setFlightDate(String flightDate) {
        this.flightDate = flightDate;
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
    
    public List<SeatDto> getSeatMap() {
        return seatMap;
    }
    
    public void setSeatMap(List<SeatDto> seatMap) {
        this.seatMap = seatMap;
    }
}
