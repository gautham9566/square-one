package com.oracle.service_management.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Passenger entity representing the passengers table
 * Used for services management operations
 */
@Entity
@Table(name = "passengers")
public class Passenger {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "passenger_id")
    private Long passengerId;
    
    @NotNull
    @Column(name = "flight_id", nullable = false)
    private Long flightId;
    
    @NotNull
    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Size(max = 20)
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    
    @Size(max = 300)
    @Column(name = "address", length = 300)
    private String address;
    
    @Size(max = 30)
    @Column(name = "passport_number", length = 30)
    private String passportNumber;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @NotNull
    @Size(max = 10)
    @Column(name = "origin", nullable = false, length = 10)
    private String origin;
    
    @NotNull
    @Size(max = 10)
    @Column(name = "destination", nullable = false, length = 10)
    private String destination;
    
    @Lob
    @Column(name = "services")
    private String servicesJson;
    
    @Size(max = 50)
    @Column(name = "meal_type", length = 50)
    private String mealType;
    
    @Size(max = 100)
    @Column(name = "meal_name", length = 100)
    private String mealName;
    
    @Column(name = "extra_baggage")
    private Integer extraBaggage = 0;
    
    @Lob
    @Column(name = "shopping_items")
    private String shoppingItemsJson;
    
    @Size(max = 10)
    @Column(name = "seat", length = 10)
    private String seat;
    
    @Column(name = "checked_in", length = 1)
    private String checkedIn = "N";
    
    @Column(name = "wheelchair", length = 1)
    private String wheelchair = "N";
    
    @Column(name = "infant", length = 1)
    private String infant = "N";
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Transient fields for JSON conversion
    @Transient
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    // Default constructor
    public Passenger() {}
    
    // Constructor with essential fields
    public Passenger(Long flightId, String name, String origin, String destination) {
        this.flightId = flightId;
        this.name = name;
        this.origin = origin;
        this.destination = destination;
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
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getPassportNumber() {
        return passportNumber;
    }
    
    public void setPassportNumber(String passportNumber) {
        this.passportNumber = passportNumber;
    }
    
    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }
    
    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
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
    
    public String getServicesJson() {
        return servicesJson;
    }
    
    public void setServicesJson(String servicesJson) {
        this.servicesJson = servicesJson;
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
    
    public String getShoppingItemsJson() {
        return shoppingItemsJson;
    }
    
    public void setShoppingItemsJson(String shoppingItemsJson) {
        this.shoppingItemsJson = shoppingItemsJson;
    }
    
    public String getSeat() {
        return seat;
    }
    
    public void setSeat(String seat) {
        this.seat = seat;
    }
    
    public String getCheckedIn() {
        return checkedIn;
    }
    
    public void setCheckedIn(String checkedIn) {
        this.checkedIn = checkedIn;
    }
    
    public String getWheelchair() {
        return wheelchair;
    }
    
    public void setWheelchair(String wheelchair) {
        this.wheelchair = wheelchair;
    }
    
    public String getInfant() {
        return infant;
    }
    
    public void setInfant(String infant) {
        this.infant = infant;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // Convenience methods for boolean fields
    public boolean isCheckedIn() {
        return "Y".equals(checkedIn);
    }
    
    public void setCheckedIn(boolean checkedIn) {
        this.checkedIn = checkedIn ? "Y" : "N";
    }
    
    public boolean needsWheelchair() {
        return "Y".equals(wheelchair);
    }
    
    public void setWheelchair(boolean wheelchair) {
        this.wheelchair = wheelchair ? "Y" : "N";
    }
    
    public boolean hasInfant() {
        return "Y".equals(infant);
    }
    
    public void setInfant(boolean infant) {
        this.infant = infant ? "Y" : "N";
    }

    // JSON conversion methods for services
    public List<String> getServices() {
        if (servicesJson == null || servicesJson.trim().isEmpty()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(servicesJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return List.of();
        }
    }

    public void setServices(List<String> services) {
        try {
            this.servicesJson = objectMapper.writeValueAsString(services);
        } catch (JsonProcessingException e) {
            this.servicesJson = "[]";
        }
    }

    // JSON conversion methods for shopping items
    public List<String> getShoppingItems() {
        if (shoppingItemsJson == null || shoppingItemsJson.trim().isEmpty()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(shoppingItemsJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return List.of();
        }
    }

    public void setShoppingItems(List<String> shoppingItems) {
        try {
            this.shoppingItemsJson = objectMapper.writeValueAsString(shoppingItems);
        } catch (JsonProcessingException e) {
            this.shoppingItemsJson = "[]";
        }
    }
}
