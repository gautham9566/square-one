package com.oracle.passengers.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO for creating a new passenger
 */
public class PassengerCreateDto {
    
    @NotNull(message = "Flight ID is required")
    private Long flightId;
    
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;
    
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;
    
    @Size(max = 300, message = "Address must not exceed 300 characters")
    private String address;
    
    @Size(max = 30, message = "Passport number must not exceed 30 characters")
    private String passportNumber;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    @NotBlank(message = "Origin is required")
    @Size(max = 10, message = "Origin must not exceed 10 characters")
    private String origin;
    
    @NotBlank(message = "Destination is required")
    @Size(max = 10, message = "Destination must not exceed 10 characters")
    private String destination;
    
    private List<String> services;
    
    @Size(max = 50, message = "Meal type must not exceed 50 characters")
    private String mealType;
    
    @Size(max = 100, message = "Meal name must not exceed 100 characters")
    private String mealName;
    
    private Integer extraBaggage = 0;
    
    private List<String> shoppingItems;
    
    @Size(max = 10, message = "Seat must not exceed 10 characters")
    private String seat;
    
    private boolean wheelchair = false;
    
    private boolean infant = false;
    
    // Default constructor
    public PassengerCreateDto() {}
    
    // Constructor with required fields
    public PassengerCreateDto(Long flightId, String name, String origin, String destination) {
        this.flightId = flightId;
        this.name = name;
        this.origin = origin;
        this.destination = destination;
    }
    
    // Getters and setters
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
    
    public List<String> getServices() {
        return services;
    }
    
    public void setServices(List<String> services) {
        this.services = services;
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
    
    public String getSeat() {
        return seat;
    }
    
    public void setSeat(String seat) {
        this.seat = seat;
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
    
    @Override
    public String toString() {
        return "PassengerCreateDto{" +
                "flightId=" + flightId +
                ", name='" + name + '\'' +
                ", origin='" + origin + '\'' +
                ", destination='" + destination + '\'' +
                ", seat='" + seat + '\'' +
                '}';
    }
}
