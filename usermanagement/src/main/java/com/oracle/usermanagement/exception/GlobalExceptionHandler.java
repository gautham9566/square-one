package com.oracle.usermanagement.exception;

import com.oracle.usermanagement.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handle UserNotFoundException
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserNotFoundException(
            UserNotFoundException ex, WebRequest request) {
        log.error("User not found: {}", ex.getMessage());
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle UserAlreadyExistsException
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserAlreadyExistsException(
            UserAlreadyExistsException ex, WebRequest request) {
        log.error("User already exists: {}", ex.getMessage());
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    /**
     * Handle IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        log.error("Invalid argument: {}", ex.getMessage());
        ApiResponse<Object> response = ApiResponse.error(ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle validation errors
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        log.error("Validation error: {}", ex.getMessage());
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ApiResponse<Map<String, String>> response = ApiResponse.error("Validation failed", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle generic exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(
            Exception ex, WebRequest request) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        ApiResponse<Object> response = ApiResponse.error("An unexpected error occurred");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
