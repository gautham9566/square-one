package com.oracle.passengers.exception;

/**
 * Exception thrown when a passenger is not found
 */
public class PassengerNotFoundException extends RuntimeException {
    
    public PassengerNotFoundException(String message) {
        super(message);
    }
    
    public PassengerNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public PassengerNotFoundException(Long passengerId) {
        super("Passenger not found with ID: " + passengerId);
    }
}
