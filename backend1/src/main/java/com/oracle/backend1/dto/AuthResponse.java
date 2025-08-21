package com.oracle.backend1.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String role;
    private String name;
    private String message;
    private boolean success;

    // Constructor for successful login
    public AuthResponse(String token, String username, String role, String name) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.name = name;
        this.success = true;
        this.message = "Authentication successful";
    }

    // Constructor for error response
    public AuthResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
        this.token = null;
        this.username = null;
        this.role = null;
        this.name = null;
    }
}
