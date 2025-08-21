package com.oracle.service_management.exception;

/**
 * Exception thrown when a flight is not found
 */
public class FlightNotFoundException extends RuntimeException {
    
    private final Long flightId;
    
    public FlightNotFoundException(Long flightId) {
        super(String.format("Flight with ID %d not found", flightId));
        this.flightId = flightId;
    }
    
    public FlightNotFoundException(Long flightId, String message) {
        super(message);
        this.flightId = flightId;
    }
    
    public Long getFlightId() {
        return flightId;
    }
}
