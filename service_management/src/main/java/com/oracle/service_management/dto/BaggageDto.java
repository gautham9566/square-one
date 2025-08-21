package com.oracle.service_management.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for baggage service requests and responses
 */
public class BaggageDto {
    
    @NotNull(message = "Passenger ID is required")
    private Long passengerId;
    
    @NotNull(message = "Flight ID is required")
    private Long flightId;
    
    @Min(value = 0, message = "Extra baggage weight must be non-negative")
    private Integer extraBaggageWeight;
    
    private String baggageType; // e.g., "Extra Baggage 5kg", "Extra Baggage 10kg"
    
    private Double cost;
    
    private String specialInstructions;
    
    // Default constructor
    public BaggageDto() {}
    
    // Constructor with required fields
    public BaggageDto(Long passengerId, Long flightId, Integer extraBaggageWeight) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.extraBaggageWeight = extraBaggageWeight;
    }
    
    // Constructor with all fields
    public BaggageDto(Long passengerId, Long flightId, Integer extraBaggageWeight,
                      String baggageType, Double cost, String specialInstructions) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.extraBaggageWeight = extraBaggageWeight;
        this.baggageType = baggageType;
        this.cost = cost;
        this.specialInstructions = specialInstructions;
    }
    
    // Getters and setters
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
    
    public Integer getExtraBaggageWeight() {
        return extraBaggageWeight;
    }
    
    public void setExtraBaggageWeight(Integer extraBaggageWeight) {
        this.extraBaggageWeight = extraBaggageWeight;
    }
    
    public String getBaggageType() {
        return baggageType;
    }
    
    public void setBaggageType(String baggageType) {
        this.baggageType = baggageType;
    }
    
    public Double getCost() {
        return cost;
    }
    
    public void setCost(Double cost) {
        this.cost = cost;
    }
    
    public String getSpecialInstructions() {
        return specialInstructions;
    }
    
    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }
    
    // Convenience methods
    public boolean hasExtraBaggage() {
        return extraBaggageWeight != null && extraBaggageWeight > 0;
    }
    
    public boolean hasSpecialInstructions() {
        return specialInstructions != null && !specialInstructions.trim().isEmpty();
    }
    
    public boolean hasCost() {
        return cost != null && cost > 0;
    }
    
    public String getBaggageDescription() {
        if (extraBaggageWeight == null || extraBaggageWeight <= 0) {
            return "No extra baggage";
        }
        return String.format("Extra baggage: %d kg", extraBaggageWeight);
    }
}
