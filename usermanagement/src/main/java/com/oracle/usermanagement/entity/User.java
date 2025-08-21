package com.oracle.usermanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * User entity representing the users table in the database
 * Manages user profiles and staff assignments
 */
@Entity
@Table(name = "USERS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private Long userId;

    @NotBlank(message = "Username is required")
    @Size(max = 50, message = "Username must not exceed 50 characters")
    @Column(name = "USERNAME", nullable = false, unique = true, length = 50)
    private String username;

    @NotBlank(message = "Password is required")
    @Size(max = 255, message = "Password must not exceed 255 characters")
    @Column(name = "PASSWORD", nullable = false, length = 255)
    private String password;

    @NotBlank(message = "Role is required")
    @Size(max = 30, message = "Role must not exceed 30 characters")
    @Column(name = "ROLE", nullable = false, length = 30)
    private String role;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(name = "NAME", nullable = false, length = 100)
    private String name;

    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Column(name = "EMAIL", length = 100)
    private String email;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Column(name = "PHONE_NUMBER", length = 20)
    private String phoneNumber;

    @Column(name = "FLIGHT_ID")
    private Long flightId;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "LAST_LOGIN")
    private LocalDateTime lastLogin;

    /**
     * Set creation timestamp before persisting
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    /**
     * Check if user is staff (inflight or checkin staff)
     */
    public boolean isStaff() {
        return "inflightStaff".equals(role) || "checkinStaff".equals(role);
    }

    /**
     * Check if user is admin
     */
    public boolean isAdmin() {
        return "admin".equals(role);
    }

    /**
     * Check if user is passenger
     */
    public boolean isPassenger() {
        return "passenger".equals(role);
    }
}
