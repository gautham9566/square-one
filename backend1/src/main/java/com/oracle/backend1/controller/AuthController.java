package com.oracle.backend1.controller;

import com.oracle.backend1.entity.User;
import com.oracle.backend1.service.UserService;
import com.oracle.backend1.security.JwtUtil;
import com.oracle.backend1.dto.LoginRequest;
import com.oracle.backend1.dto.AuthResponse;
import com.oracle.backend1.dto.TokenValidationResponse;
import com.oracle.backend1.dto.RoleResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * POST /api/auth/login - Authenticate user and return JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Optional<User> userOpt = userService.authenticateUser(request.getUsername(), request.getPassword());

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                String token = jwtUtil.generateToken(user.getUsername());

                AuthResponse response = new AuthResponse(token, user.getUsername(), user.getRole(), user.getName());
                return ResponseEntity.ok(response);
            } else {
                AuthResponse response = new AuthResponse("Invalid username or password", false);
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            AuthResponse response = new AuthResponse("Authentication failed: " + e.getMessage(), false);
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * POST /api/auth/validate-token - Validate JWT token
     */
    @PostMapping("/validate-token")
    public ResponseEntity<TokenValidationResponse> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                TokenValidationResponse response = new TokenValidationResponse(false, "Invalid authorization header format");
                return ResponseEntity.status(400).body(response);
            }

            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);
                Optional<String> roleOpt = userService.getUserRole(username);

                if (roleOpt.isPresent()) {
                    TokenValidationResponse response = new TokenValidationResponse(true, username, roleOpt.get());
                    return ResponseEntity.ok(response);
                } else {
                    TokenValidationResponse response = new TokenValidationResponse(false, "User not found");
                    return ResponseEntity.status(404).body(response);
                }
            } else {
                TokenValidationResponse response = new TokenValidationResponse(false, "Invalid or expired token");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            TokenValidationResponse response = new TokenValidationResponse(false, "Token validation failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * GET /api/auth/roles - Get current user's role information
     */
    @GetMapping("/roles")
    public ResponseEntity<RoleResponse> getUserRoles() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                RoleResponse response = new RoleResponse("User not authenticated", false);
                return ResponseEntity.status(401).body(response);
            }

            String username = authentication.getName();
            Optional<User> userOpt = userService.findByUsername(username);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                RoleResponse response = new RoleResponse(user.getUsername(), user.getRole(), user.getName(), user.getFlightId());
                return ResponseEntity.ok(response);
            } else {
                RoleResponse response = new RoleResponse("User not found", false);
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            RoleResponse response = new RoleResponse("Failed to retrieve user roles: " + e.getMessage(), false);
            return ResponseEntity.status(500).body(response);
        }
    }
}
