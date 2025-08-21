package com.oracle.service_management.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

/**
 * DTO for service operation responses
 */
public class ServiceResponseDto {
    
    private boolean success;
    private String message;
    private String operation;
    
    private Long passengerId;
    private Long flightId;
    
    @JsonProperty("updatedServices")
    private PassengerServicesDto passengerServices;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    // Default constructor
    public ServiceResponseDto() {
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructor for success response
    public ServiceResponseDto(boolean success, String message, String operation) {
        this.success = success;
        this.message = message;
        this.operation = operation;
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructor with passenger and flight info
    public ServiceResponseDto(boolean success, String message, String operation,
                             Long passengerId, Long flightId) {
        this.success = success;
        this.message = message;
        this.operation = operation;
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.timestamp = LocalDateTime.now();
    }
    
    // Full constructor
    public ServiceResponseDto(boolean success, String message, String operation,
                             Long passengerId, Long flightId, 
                             PassengerServicesDto passengerServices) {
        this.success = success;
        this.message = message;
        this.operation = operation;
        this.passengerId = passengerId;
        this.flightId = flightId;
        this.passengerServices = passengerServices;
        this.timestamp = LocalDateTime.now();
    }
    
    // Static factory methods
    public static ServiceResponseDto success(String message, String operation) {
        return new ServiceResponseDto(true, message, operation);
    }
    
    public static ServiceResponseDto success(String message, String operation, 
                                           Long passengerId, Long flightId) {
        return new ServiceResponseDto(true, message, operation, passengerId, flightId);
    }
    
    public static ServiceResponseDto success(String message, String operation,
                                           Long passengerId, Long flightId,
                                           PassengerServicesDto passengerServices) {
        return new ServiceResponseDto(true, message, operation, passengerId, flightId, passengerServices);
    }
    
    public static ServiceResponseDto error(String message, String operation) {
        return new ServiceResponseDto(false, message, operation);
    }
    
    public static ServiceResponseDto error(String message, String operation,
                                         Long passengerId, Long flightId) {
        return new ServiceResponseDto(false, message, operation, passengerId, flightId);
    }
    
    // Getters and setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getOperation() {
        return operation;
    }
    
    public void setOperation(String operation) {
        this.operation = operation;
    }
    
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
    
    public PassengerServicesDto getPassengerServices() {
        return passengerServices;
    }
    
    public void setPassengerServices(PassengerServicesDto passengerServices) {
        this.passengerServices = passengerServices;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
