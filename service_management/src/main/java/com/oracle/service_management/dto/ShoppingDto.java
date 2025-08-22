package com.oracle.service_management.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * DTO for shopping service requests and responses
 */
public class ShoppingDto {
    
    @NotNull(message = "Passenger ID is required")
    private Long passengerId;
    
    @NotNull(message = "Flight ID is required")
    private Long flightId;
    
    @JsonProperty("items")
    private List<String> items;
    
    private Double totalCost;
    
    private String deliveryInstructions;
    
    // Default constructor
    public ShoppingDto() {}
    
    // Constructor with required fields
    public ShoppingDto(Long passengerId, Long flightId, List<String> items) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.items = items;
    }
    
    // Constructor with all fields
    public ShoppingDto(Long passengerId, Long flightId, List<String> items,
                       Double totalCost, String deliveryInstructions) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.items = items;
        this.totalCost = totalCost;
        this.deliveryInstructions = deliveryInstructions;
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
    
    public List<String> getItems() {
        return items;
    }
    
    public void setItems(List<String> items) {
        this.items = items;
    }
    
    public Double getTotalCost() {
        return totalCost;
    }
    
    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }
    
    public String getDeliveryInstructions() {
        return deliveryInstructions;
    }
    
    public void setDeliveryInstructions(String deliveryInstructions) {
        this.deliveryInstructions = deliveryInstructions;
    }
    
    // Convenience methods
    public boolean hasItems() {
        return items != null && !items.isEmpty();
    }
    
    public int getItemCount() {
        return items != null ? items.size() : 0;
    }
    
    public boolean hasCost() {
        return totalCost != null && totalCost > 0;
    }
    
    public boolean hasDeliveryInstructions() {
        return deliveryInstructions != null && !deliveryInstructions.trim().isEmpty();
    }
    
    public void addItem(String item) {
        if (items != null && !items.contains(item)) {
            items.add(item);
        }
    }
    
    public void removeItem(String item) {
        if (items != null) {
            items.remove(item);
        }
    }
    
    public boolean containsItem(String item) {
        return items != null && items.contains(item);
    }
    
    public String getItemsSummary() {
        if (!hasItems()) {
            return "No items selected";
        }
        return String.format("%d item(s): %s", getItemCount(), String.join(", ", items));
    }
}
