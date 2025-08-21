package com.oracle.passengers.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for passenger information
 */
public class PassengerDto {
    
    private Long passengerId;
    private Long flightId;
    private String name;
    private String phoneNumber;
    private String address;
    private String passportNumber;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;
    
    private String origin;
    private String destination;
    private List<String> services;
    private String mealType;
    private String mealName;
    private Integer extraBaggage;
    private List<String> shoppingItems;
    private String seat;
    
    @JsonProperty("checkedIn")
    private boolean checkedIn;
    
    @JsonProperty("wheelchair")
    private boolean wheelchair;
    
    @JsonProperty("infant")
    private boolean infant;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    // Default constructor
    public PassengerDto() {}
    
    // Constructor with all fields
    public PassengerDto(Long passengerId, Long flightId, String name, String phoneNumber, 
                       String address, String passportNumber, LocalDate dateOfBirth, 
                       String origin, String destination, List<String> services, 
                       String mealType, String mealName, Integer extraBaggage, 
                       List<String> shoppingItems, String seat, boolean checkedIn, 
                       boolean wheelchair, boolean infant, LocalDateTime createdAt, 
                       LocalDateTime updatedAt) {
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.passportNumber = passportNumber;
        this.dateOfBirth = dateOfBirth;
        this.origin = origin;
        this.destination = destination;
        this.services = services;
        this.mealType = mealType;
        this.mealName = mealName;
        this.extraBaggage = extraBaggage;
        this.shoppingItems = shoppingItems;
        this.seat = seat;
        this.checkedIn = checkedIn;
        this.wheelchair = wheelchair;
        this.infant = infant;
        this.createdAt = createdAt;
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
    
    @Override
    public String toString() {
        return "PassengerDto{" +
                "passengerId=" + passengerId +
                ", flightId=" + flightId +
                ", name='" + name + '\'' +
                ", origin='" + origin + '\'' +
                ", destination='" + destination + '\'' +
                ", seat='" + seat + '\'' +
                ", checkedIn=" + checkedIn +
                '}';
    }
}
