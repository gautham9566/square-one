package com.oracle.usermanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for user response data
 * Excludes sensitive information like password
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {

    private Long userId;
    private String username;
    private String role;
    private String name;
    private String email;
    private String phoneNumber;
    private Long flightId;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private boolean isStaff;
    private boolean isAdmin;
    private boolean isPassenger;
}
