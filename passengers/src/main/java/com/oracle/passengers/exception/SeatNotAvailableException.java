package com.oracle.passengers.exception;

/**
 * Exception thrown when a seat is not available for assignment
 */
public class SeatNotAvailableException extends RuntimeException {
    
    public SeatNotAvailableException(String message) {
        super(message);
    }
    
    public SeatNotAvailableException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public SeatNotAvailableException(Long flightId, String seat) {
        super("Seat " + seat + " is not available for flight " + flightId);
    }
}
