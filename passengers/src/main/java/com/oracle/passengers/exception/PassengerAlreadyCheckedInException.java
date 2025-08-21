package com.oracle.passengers.exception;

/**
 * Exception thrown when trying to check in a passenger who is already checked in
 */
public class PassengerAlreadyCheckedInException extends RuntimeException {
    
    public PassengerAlreadyCheckedInException(String message) {
        super(message);
    }
    
    public PassengerAlreadyCheckedInException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public PassengerAlreadyCheckedInException(Long passengerId) {
        super("Passenger with ID " + passengerId + " is already checked in");
    }
}
