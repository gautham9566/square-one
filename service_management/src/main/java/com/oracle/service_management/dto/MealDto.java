package com.oracle.service_management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for meal service requests and responses
 */
public class MealDto {
    
    @NotNull(message = "Passenger ID is required")
    private Long passengerId;
    
    @NotNull(message = "Flight ID is required")
    private Long flightId;
    
    @NotBlank(message = "Meal type is required")
    @Size(max = 50, message = "Meal type must not exceed 50 characters")
    private String mealType;
    
    @Size(max = 100, message = "Meal name must not exceed 100 characters")
    private String mealName;
    
    private String specialRequests;
    
    // Default constructor
    public MealDto() {}
    
    // Constructor with required fields
    public MealDto(Long passengerId, Long flightId, String mealType) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.mealType = mealType;
    }
    
    // Constructor with all fields
    public MealDto(Long passengerId, Long flightId, String mealType, 
                   String mealName, String specialRequests) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.mealType = mealType;
        this.mealName = mealName;
        this.specialRequests = specialRequests;
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
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
    
    // Convenience methods
    public boolean isVegetarian() {
        return "Veg".equalsIgnoreCase(mealType) || "Vegan".equalsIgnoreCase(mealType);
    }
    
    public boolean isVegan() {
        return "Vegan".equalsIgnoreCase(mealType);
    }
    
    public boolean isNonVegetarian() {
        return "Non-Veg".equalsIgnoreCase(mealType);
    }
    
    public boolean isGlutenFree() {
        return "Gluten-Free".equalsIgnoreCase(mealType);
    }
    
    public boolean isKosher() {
        return "Kosher".equalsIgnoreCase(mealType);
    }
    
    public boolean hasSpecialRequests() {
        return specialRequests != null && !specialRequests.trim().isEmpty();
    }
}
