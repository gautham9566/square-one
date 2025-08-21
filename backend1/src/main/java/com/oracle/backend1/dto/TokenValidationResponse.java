package com.oracle.backend1.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenValidationResponse {
    private boolean valid;
    private String username;
    private String role;
    private String message;

    // Constructor for valid token
    public TokenValidationResponse(boolean valid, String username, String role) {
        this.valid = valid;
        this.username = username;
        this.role = role;
        this.message = valid ? "Token is valid" : "Token is invalid";
    }

    // Constructor for invalid token
    public TokenValidationResponse(boolean valid, String message) {
        this.valid = valid;
        this.message = message;
        this.username = null;
        this.role = null;
    }
}
