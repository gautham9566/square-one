package com.oracle.service_management.exception;

/**
 * Exception thrown when a passenger is not found
 */
public class PassengerNotFoundException extends RuntimeException {
    
    private final Long passengerId;
    
    public PassengerNotFoundException(Long passengerId) {
        super(String.format("Passenger with ID %d not found", passengerId));
        this.passengerId = passengerId;
    }
    
    public PassengerNotFoundException(Long passengerId, String message) {
        super(message);
        this.passengerId = passengerId;
    }
    
    public Long getPassengerId() {
        return passengerId;
    }
}
