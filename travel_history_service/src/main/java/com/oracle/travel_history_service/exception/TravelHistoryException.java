package com.oracle.travel_history_service.exception;

/**
 * Custom exception for travel history operations
 */
public class TravelHistoryException extends RuntimeException {

    private final ErrorType errorType;

    public TravelHistoryException(String message, ErrorType errorType) {
        super(message);
        this.errorType = errorType;
    }

    public TravelHistoryException(String message, ErrorType errorType, Throwable cause) {
        super(message, cause);
        this.errorType = errorType;
    }

    public ErrorType getErrorType() {
        return errorType;
    }

    /**
     * Enum for different types of travel history errors
     */
    public enum ErrorType {
        NOT_FOUND,
        VALIDATION_ERROR,
        BUSINESS_RULE_VIOLATION,
        DATA_ACCESS_ERROR,
        INTERNAL_ERROR
    }

    // Static factory methods for common exceptions
    public static TravelHistoryException notFound(String message) {
        return new TravelHistoryException(message, ErrorType.NOT_FOUND);
    }

    public static TravelHistoryException validationError(String message) {
        return new TravelHistoryException(message, ErrorType.VALIDATION_ERROR);
    }

    public static TravelHistoryException businessRuleViolation(String message) {
        return new TravelHistoryException(message, ErrorType.BUSINESS_RULE_VIOLATION);
    }

    public static TravelHistoryException dataAccessError(String message, Throwable cause) {
        return new TravelHistoryException(message, ErrorType.DATA_ACCESS_ERROR, cause);
    }

    public static TravelHistoryException internalError(String message, Throwable cause) {
        return new TravelHistoryException(message, ErrorType.INTERNAL_ERROR, cause);
    }
}
