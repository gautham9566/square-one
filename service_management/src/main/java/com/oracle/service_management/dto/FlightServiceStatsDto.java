package com.oracle.service_management.dto;

/**
 * DTO for flight service statistics
 */
public class FlightServiceStatsDto {
    
    private Long flightId;
    private Long mealServiceCount;
    private Long shoppingServiceCount;
    private Long ancillaryServiceCount;
    private Long totalPassengersWithServices;
    
    // Default constructor
    public FlightServiceStatsDto() {}
    
    // Constructor with essential fields
    public FlightServiceStatsDto(Long flightId, Long mealServiceCount, 
                               Long shoppingServiceCount, Long ancillaryServiceCount) {
        this.flightId = flightId;
        this.mealServiceCount = mealServiceCount;
        this.shoppingServiceCount = shoppingServiceCount;
        this.ancillaryServiceCount = ancillaryServiceCount;
        this.totalPassengersWithServices = mealServiceCount + shoppingServiceCount + ancillaryServiceCount;
    }
    
    // Getters and setters
    public Long getFlightId() {
        return flightId;
    }
    
    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }
    
    public Long getMealServiceCount() {
        return mealServiceCount;
    }
    
    public void setMealServiceCount(Long mealServiceCount) {
        this.mealServiceCount = mealServiceCount;
    }
    
    public Long getShoppingServiceCount() {
        return shoppingServiceCount;
    }
    
    public void setShoppingServiceCount(Long shoppingServiceCount) {
        this.shoppingServiceCount = shoppingServiceCount;
    }
    
    public Long getAncillaryServiceCount() {
        return ancillaryServiceCount;
    }
    
    public void setAncillaryServiceCount(Long ancillaryServiceCount) {
        this.ancillaryServiceCount = ancillaryServiceCount;
    }
    
    public Long getTotalPassengersWithServices() {
        return totalPassengersWithServices;
    }
    
    public void setTotalPassengersWithServices(Long totalPassengersWithServices) {
        this.totalPassengersWithServices = totalPassengersWithServices;
    }
    
    // Convenience methods
    public boolean hasMealServices() {
        return mealServiceCount != null && mealServiceCount > 0;
    }
    
    public boolean hasShoppingServices() {
        return shoppingServiceCount != null && shoppingServiceCount > 0;
    }
    
    public boolean hasAncillaryServices() {
        return ancillaryServiceCount != null && ancillaryServiceCount > 0;
    }
    
    public boolean hasAnyServices() {
        return hasMealServices() || hasShoppingServices() || hasAncillaryServices();
    }
}
