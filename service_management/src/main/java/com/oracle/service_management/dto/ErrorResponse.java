package com.oracle.service_management.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * DTO for error responses
 */
public class ErrorResponse {
    
    private int status;
    private String error;
    private String message;
    private String path;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    // Default constructor
    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }
    
    // Constructor with all fields
    public ErrorResponse(int status, String error, String message, String path) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
    
    // Static factory methods
    public static ErrorResponse badRequest(String message, String path) {
        return new ErrorResponse(400, "Bad Request", message, path);
    }
    
    public static ErrorResponse notFound(String message, String path) {
        return new ErrorResponse(404, "Not Found", message, path);
    }
    
    public static ErrorResponse internalServerError(String message, String path) {
        return new ErrorResponse(500, "Internal Server Error", message, path);
    }
    
    public static ErrorResponse conflict(String message, String path) {
        return new ErrorResponse(409, "Conflict", message, path);
    }
    
    public static ErrorResponse unprocessableEntity(String message, String path) {
        return new ErrorResponse(422, "Unprocessable Entity", message, path);
    }
    
    // Getters and setters
    public int getStatus() {
        return status;
    }
    
    public void setStatus(int status) {
        this.status = status;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getPath() {
        return path;
    }
    
    public void setPath(String path) {
        this.path = path;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
