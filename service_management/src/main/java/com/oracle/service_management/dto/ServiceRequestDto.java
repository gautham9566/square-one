package com.oracle.service_management.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * DTO for general service requests
 */
public class ServiceRequestDto {
    
    @NotNull(message = "Passenger ID is required")
    private Long passengerId;
    
    @NotNull(message = "Flight ID is required")
    private Long flightId;
    
    @JsonProperty("requestedServices")
    private List<String> requestedServices;
    
    // Meal service details
    private String mealType;
    private String mealName;
    private String mealSpecialRequests;
    
    // Baggage service details
    private Integer extraBaggageWeight;
    private String baggageType;
    private String baggageSpecialInstructions;
    
    // Shopping service details
    @JsonProperty("shoppingItems")
    private List<String> shoppingItems;
    private String shoppingDeliveryInstructions;
    
    // General service notes
    private String serviceNotes;
    
    // Default constructor
    public ServiceRequestDto() {}
    
    // Constructor with required fields
    public ServiceRequestDto(Long passengerId, Long flightId, List<String> requestedServices) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.requestedServices = requestedServices;
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
    
    public List<String> getRequestedServices() {
        return requestedServices;
    }
    
    public void setRequestedServices(List<String> requestedServices) {
        this.requestedServices = requestedServices;
    }
    
    public String getMealType() {
        return mealType;
    }
    
    public void setMealType(String mealType) {
        this.mealType = mealType;
    }
    
    public String getMealName() {
        return mealName;
    }
    
    public void setMealName(String mealName) {
        this.mealName = mealName;
    }
    
    public String getMealSpecialRequests() {
        return mealSpecialRequests;
    }
    
    public void setMealSpecialRequests(String mealSpecialRequests) {
        this.mealSpecialRequests = mealSpecialRequests;
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
    
    public String getBaggageSpecialInstructions() {
        return baggageSpecialInstructions;
    }
    
    public void setBaggageSpecialInstructions(String baggageSpecialInstructions) {
        this.baggageSpecialInstructions = baggageSpecialInstructions;
    }
    
    public List<String> getShoppingItems() {
        return shoppingItems;
    }
    
    public void setShoppingItems(List<String> shoppingItems) {
        this.shoppingItems = shoppingItems;
    }
    
    public String getShoppingDeliveryInstructions() {
        return shoppingDeliveryInstructions;
    }
    
    public void setShoppingDeliveryInstructions(String shoppingDeliveryInstructions) {
        this.shoppingDeliveryInstructions = shoppingDeliveryInstructions;
    }
    
    public String getServiceNotes() {
        return serviceNotes;
    }
    
    public void setServiceNotes(String serviceNotes) {
        this.serviceNotes = serviceNotes;
    }
    
    // Convenience methods
    public boolean hasService(String serviceType) {
        return requestedServices != null && requestedServices.contains(serviceType);
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
    
    public boolean hasMealDetails() {
        return mealType != null && !mealType.trim().isEmpty();
    }
    
    public boolean hasBaggageDetails() {
        return extraBaggageWeight != null && extraBaggageWeight > 0;
    }
    
    public boolean hasShoppingDetails() {
        return shoppingItems != null && !shoppingItems.isEmpty();
    }
}
