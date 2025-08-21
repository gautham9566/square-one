package com.oracle.travel_history_service.exception;

import com.oracle.travel_history_service.dto.TravelHistoryResponseDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.stream.Collectors;

/**
 * Global exception handler for the travel history service
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handle validation errors for request parameters
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<TravelHistoryResponseDto> handleConstraintViolationException(
            ConstraintViolationException ex) {
        
        logger.warn("Constraint violation: {}", ex.getMessage());
        
        String errorMessage = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining(", "));
        
        TravelHistoryResponseDto response = TravelHistoryResponseDto.error(
                "Validation error: " + errorMessage);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle validation errors for request body
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<TravelHistoryResponseDto> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex) {
        
        logger.warn("Method argument validation error: {}", ex.getMessage());
        
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        
        TravelHistoryResponseDto response = TravelHistoryResponseDto.error(
                "Validation error: " + errorMessage);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle type mismatch errors (e.g., invalid path variable types)
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<TravelHistoryResponseDto> handleMethodArgumentTypeMismatchException(
            MethodArgumentTypeMismatchException ex) {
        
        logger.warn("Method argument type mismatch: {}", ex.getMessage());
        
        String errorMessage = String.format("Invalid value '%s' for parameter '%s'. Expected type: %s",
                ex.getValue(), ex.getName(), ex.getRequiredType().getSimpleName());
        
        TravelHistoryResponseDto response = TravelHistoryResponseDto.error(
                "Invalid parameter: " + errorMessage);
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle JSON parsing errors
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<TravelHistoryResponseDto> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException ex) {
        
        logger.warn("HTTP message not readable: {}", ex.getMessage());
        
        TravelHistoryResponseDto response = TravelHistoryResponseDto.error(
                "Invalid JSON format in request body");
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle database access errors
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<TravelHistoryResponseDto> handleDataAccessException(
            DataAccessException ex) {
        
        logger.error("Database access error: {}", ex.getMessage(), ex);
        
        TravelHistoryResponseDto response = TravelHistoryResponseDto.error(
                "Database error occurred. Please try again later.");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Handle custom travel history exceptions
     */
    @ExceptionHandler(TravelHistoryException.class)
    public ResponseEntity<TravelHistoryResponseDto> handleTravelHistoryException(
            TravelHistoryException ex) {
        
        logger.warn("Travel history exception: {}", ex.getMessage());
        
        TravelHistoryResponseDto response = TravelHistoryResponseDto.error(ex.getMessage());
        
        HttpStatus status = switch (ex.getErrorType()) {
            case NOT_FOUND -> HttpStatus.NOT_FOUND;
            case VALIDATION_ERROR -> HttpStatus.BAD_REQUEST;
            case BUSINESS_RULE_VIOLATION -> HttpStatus.CONFLICT;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
        
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Handle illegal argument exceptions
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<TravelHistoryResponseDto> handleIllegalArgumentException(
            IllegalArgumentException ex) {
        
        logger.warn("Illegal argument: {}", ex.getMessage());
        
        TravelHistoryResponseDto response = TravelHistoryResponseDto.error(
                "Invalid argument: " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle null pointer exceptions
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<TravelHistoryResponseDto> handleNullPointerException(
            NullPointerException ex) {
        
        logger.error("Null pointer exception: {}", ex.getMessage(), ex);
        
        TravelHistoryResponseDto response = TravelHistoryResponseDto.error(
                "Internal server error: Null value encountered");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<TravelHistoryResponseDto> handleGenericException(Exception ex) {
        
        logger.error("Unexpected error: {}", ex.getMessage(), ex);
        
        TravelHistoryResponseDto response = TravelHistoryResponseDto.error(
                "An unexpected error occurred. Please try again later.");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
