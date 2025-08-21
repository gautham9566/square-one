package com.oracle.service_management.exception;

/**
 * Exception thrown when a requested service is not available for a flight
 */
public class ServiceNotAvailableException extends RuntimeException {
    
    private final Long flightId;
    private final String serviceType;
    
    public ServiceNotAvailableException(Long flightId, String serviceType) {
        super(String.format("Service '%s' is not available for flight %d", serviceType, flightId));
        this.flightId = flightId;
        this.serviceType = serviceType;
    }
    
    public ServiceNotAvailableException(Long flightId, String serviceType, String message) {
        super(message);
        this.flightId = flightId;
        this.serviceType = serviceType;
    }
    
    public Long getFlightId() {
        return flightId;
    }
    
    public String getServiceType() {
        return serviceType;
    }
}
