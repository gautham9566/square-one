package com.oracle.passengers.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO for updating passenger information
 */
public class PassengerUpdateDto {
    
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
    
    private List<String> services;
    
    @Size(max = 50, message = "Meal type must not exceed 50 characters")
    private String mealType;
    
    @Size(max = 100, message = "Meal name must not exceed 100 characters")
    private String mealName;
    
    private Integer extraBaggage;
    
    private List<String> shoppingItems;
    
    @Size(max = 10, message = "Seat must not exceed 10 characters")
    private String seat;
    
    private Boolean wheelchair;
    
    private Boolean infant;
    
    // Default constructor
    public PassengerUpdateDto() {}
    
    // Getters and setters
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
    
    public Boolean getWheelchair() {
        return wheelchair;
    }
    
    public void setWheelchair(Boolean wheelchair) {
        this.wheelchair = wheelchair;
    }
    
    public Boolean getInfant() {
        return infant;
    }
    
    public void setInfant(Boolean infant) {
        this.infant = infant;
    }
    
    @Override
    public String toString() {
        return "PassengerUpdateDto{" +
                "name='" + name + '\'' +
                ", seat='" + seat + '\'' +
                ", wheelchair=" + wheelchair +
                ", infant=" + infant +
                '}';
    }
}
