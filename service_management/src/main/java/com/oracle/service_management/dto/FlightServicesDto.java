package com.oracle.service_management.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * DTO for flight services information
 */
public class FlightServicesDto {
    
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
    
    @JsonProperty("services")
    private List<String> availableServices;
    
    @JsonProperty("serviceSubtypes")
    private Map<String, List<String>> serviceSubtypes;
    
    // Default constructor
    public FlightServicesDto() {}
    
    // Constructor with essential fields
    public FlightServicesDto(Long flightId, String flightName, LocalDate flightDate, 
                           String route, String departureTime, String arrivalTime) {
        this.flightId = flightId;
        this.flightName = flightName;
        this.flightDate = flightDate;
        this.route = route;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
    }
    
    // Full constructor
    public FlightServicesDto(Long flightId, String flightName, LocalDate flightDate, 
                           String route, String departureTime, String arrivalTime,
                           String aircraftType, Integer totalSeats, Integer availableSeats,
                           List<String> availableServices, Map<String, List<String>> serviceSubtypes) {
        this.flightId = flightId;
        this.flightName = flightName;
        this.flightDate = flightDate;
        this.route = route;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.aircraftType = aircraftType;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.availableServices = availableServices;
        this.serviceSubtypes = serviceSubtypes;
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
    
    public List<String> getAvailableServices() {
        return availableServices;
    }
    
    public void setAvailableServices(List<String> availableServices) {
        this.availableServices = availableServices;
    }
    
    public Map<String, List<String>> getServiceSubtypes() {
        return serviceSubtypes;
    }
    
    public void setServiceSubtypes(Map<String, List<String>> serviceSubtypes) {
        this.serviceSubtypes = serviceSubtypes;
    }
    
    // Convenience methods
    public boolean hasService(String serviceType) {
        return availableServices != null && availableServices.contains(serviceType);
    }
    
    public boolean hasMealService() {
        return hasService("Meal");
    }
    
    public boolean hasShoppingService() {
        return hasService("Shopping");
    }
    
    public boolean hasAncillaryService() {
        return hasService("Ancillary");
    }
    
    public List<String> getMealOptions() {
        return serviceSubtypes != null ? serviceSubtypes.get("Meal") : List.of();
    }
    
    public List<String> getShoppingOptions() {
        return serviceSubtypes != null ? serviceSubtypes.get("Shopping") : List.of();
    }
    
    public List<String> getAncillaryOptions() {
        return serviceSubtypes != null ? serviceSubtypes.get("Ancillary") : List.of();
    }
}
