package com.oracle.service_management.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for passenger services information
 */
public class PassengerServicesDto {
    
    private Long passengerId;
    private Long flightId;
    private String name;
    private String phoneNumber;
    private String origin;
    private String destination;
    private String seat;
    
    @JsonProperty("checkedIn")
    private boolean checkedIn;
    
    @JsonProperty("wheelchair")
    private boolean wheelchair;
    
    @JsonProperty("infant")
    private boolean infant;
    
    @JsonProperty("services")
    private List<String> requestedServices;
    
    // Meal information
    private String mealType;
    private String mealName;
    
    // Baggage information
    private Integer extraBaggage;
    
    // Shopping information
    @JsonProperty("shoppingItems")
    private List<String> shoppingItems;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // Default constructor
    public PassengerServicesDto() {}
    
    // Constructor with essential fields
    public PassengerServicesDto(Long passengerId, Long flightId, String name, 
                              String origin, String destination) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.name = name;
        this.origin = origin;
        this.destination = destination;
    }
    
    // Full constructor
    public PassengerServicesDto(Long passengerId, Long flightId, String name, String phoneNumber,
                              String origin, String destination, String seat, boolean checkedIn,
                              boolean wheelchair, boolean infant, List<String> requestedServices,
                              String mealType, String mealName, Integer extraBaggage,
                              List<String> shoppingItems, LocalDateTime updatedAt) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.origin = origin;
        this.destination = destination;
        this.seat = seat;
        this.checkedIn = checkedIn;
        this.wheelchair = wheelchair;
        this.infant = infant;
        this.requestedServices = requestedServices;
        this.mealType = mealType;
        this.mealName = mealName;
        this.extraBaggage = extraBaggage;
        this.shoppingItems = shoppingItems;
        this.updatedAt = updatedAt;
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
    
    public boolean isCheckedIn() {
        return checkedIn;
    }
    
    public void setCheckedIn(boolean checkedIn) {
        this.checkedIn = checkedIn;
    }
    
    public boolean isWheelchair() {
        return wheelchair;
    }
    
    public void setWheelchair(boolean wheelchair) {
        this.wheelchair = wheelchair;
    }
    
    public boolean isInfant() {
        return infant;
    }
    
    public void setInfant(boolean infant) {
        this.infant = infant;
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
    
    public Integer getExtraBaggage() {
        return extraBaggage;
    }
    
    public void setExtraBaggage(Integer extraBaggage) {
        this.extraBaggage = extraBaggage;
    }
    
    public List<String> getShoppingItems() {
        return shoppingItems;
    }
    
    public void setShoppingItems(List<String> shoppingItems) {
        this.shoppingItems = shoppingItems;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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
    
    public boolean hasSpecialNeeds() {
        return wheelchair || infant;
    }
    
    public boolean hasExtraBaggage() {
        return extraBaggage != null && extraBaggage > 0;
    }
    
    public boolean hasShoppingItems() {
        return shoppingItems != null && !shoppingItems.isEmpty();
    }
}
