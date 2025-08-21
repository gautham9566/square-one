package com.oracle.backend1.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleResponse {
    private String username;
    private String role;
    private String name;
    private Long flightId;
    private boolean success;
    private String message;

    // Constructor for successful role retrieval
    public RoleResponse(String username, String role, String name, Long flightId) {
        this.username = username;
        this.role = role;
        this.name = name;
        this.flightId = flightId;
        this.success = true;
        this.message = "Role information retrieved successfully";
    }

    // Constructor for error response
    public RoleResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
        this.username = null;
        this.role = null;
        this.name = null;
        this.flightId = null;
    }
}
