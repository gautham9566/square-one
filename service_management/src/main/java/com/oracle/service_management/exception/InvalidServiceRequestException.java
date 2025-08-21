package com.oracle.service_management.exception;

/**
 * Exception thrown when a service request is invalid
 */
public class InvalidServiceRequestException extends RuntimeException {
    
    private final String requestType;
    private final String reason;
    
    public InvalidServiceRequestException(String requestType, String reason) {
        super(String.format("Invalid %s request: %s", requestType, reason));
        this.requestType = requestType;
        this.reason = reason;
    }
    
    public InvalidServiceRequestException(String requestType, String reason, String message) {
        super(message);
        this.requestType = requestType;
        this.reason = reason;
    }
    
    public String getRequestType() {
        return requestType;
    }
    
    public String getReason() {
        return reason;
    }
}
