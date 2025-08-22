package com.oracle.usermanagement.controller;

import com.oracle.usermanagement.dto.ApiResponse;
import com.oracle.usermanagement.dto.UserRequestDto;
import com.oracle.usermanagement.dto.UserResponseDto;
import com.oracle.usermanagement.entity.User;
import com.oracle.usermanagement.exception.UserNotFoundException;
import com.oracle.usermanagement.mapper.UserMapper;
import com.oracle.usermanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for User Management Service
 * Provides endpoints for user CRUD operations and specialized queries
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    /**
     * Get all users
     * GET /users
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllUsers() {
        log.info("GET /users - Fetching all users");
        
        List<User> users = userService.getAllUsers();
        List<UserResponseDto> userDtos = userMapper.toResponseDtoList(users);
        
        ApiResponse<List<UserResponseDto>> response = ApiResponse.success(
            "Users retrieved successfully", userDtos);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get user by ID
     * GET /users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserById(@PathVariable Long id) {
        log.info("GET /users/{} - Fetching user by ID", id);
        
        User user = userService.getUserById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
        
        UserResponseDto userDto = userMapper.toResponseDto(user);
        ApiResponse<UserResponseDto> response = ApiResponse.success(
            "User retrieved successfully", userDto);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get users by role
     * GET /users/role/{role}
     */
    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getUsersByRole(@PathVariable String role) {
        log.info("GET /users/role/{} - Fetching users by role", role);
        
        List<User> users = userService.getUsersByRole(role);
        List<UserResponseDto> userDtos = userMapper.toResponseDtoList(users);
        
        ApiResponse<List<UserResponseDto>> response = ApiResponse.success(
            "Users with role '" + role + "' retrieved successfully", userDtos);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get staff assigned to a specific flight
     * GET /users/flight/{flightId}
     */
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getStaffByFlightId(@PathVariable Long flightId) {
        log.info("GET /users/flight/{} - Fetching staff assigned to flight", flightId);
        
        List<User> staff = userService.getStaffByFlightId(flightId);
        List<UserResponseDto> staffDtos = userMapper.toResponseDtoList(staff);
        
        ApiResponse<List<UserResponseDto>> response = ApiResponse.success(
            "Staff assigned to flight " + flightId + " retrieved successfully", staffDtos);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Create a new user
     * POST /users
     */
    @PostMapping
    public ResponseEntity<ApiResponse<UserResponseDto>> createUser(@Valid @RequestBody UserRequestDto userRequestDto) {
        log.info("POST /users - Creating new user with username: {}", userRequestDto.getUsername());
        
        User user = userMapper.toEntity(userRequestDto);
        User createdUser = userService.createUser(user);
        UserResponseDto userDto = userMapper.toResponseDto(createdUser);
        
        ApiResponse<UserResponseDto> response = ApiResponse.success(
            "User created successfully", userDto);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Update an existing user
     * PUT /users/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> updateUser(
            @PathVariable Long id, 
            @Valid @RequestBody UserRequestDto userRequestDto) {
        log.info("PUT /users/{} - Updating user", id);
        
        User userDetails = userMapper.toEntity(userRequestDto);
        User updatedUser = userService.updateUser(id, userDetails);
        UserResponseDto userDto = userMapper.toResponseDto(updatedUser);
        
        ApiResponse<UserResponseDto> response = ApiResponse.success(
            "User updated successfully", userDto);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Delete a user
     * DELETE /users/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(@PathVariable Long id) {
        log.info("DELETE /users/{} - Deleting user", id);
        
        userService.deleteUser(id);
        
        ApiResponse<Object> response = ApiResponse.success(
            "User deleted successfully", null);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get user by username
     * GET /users/username/{username}
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUserByUsername(@PathVariable String username) {
        log.info("GET /users/username/{} - Fetching user by username", username);
        
        User user = userService.getUserByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("username", username));
        
        UserResponseDto userDto = userMapper.toResponseDto(user);
        ApiResponse<UserResponseDto> response = ApiResponse.success(
            "User retrieved successfully", userDto);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get all staff members
     * GET /users/staff
     */
    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<List<UserResponseDto>>> getAllStaff() {
        log.info("GET /users/staff - Fetching all staff members");
        
        List<User> staff = userService.getAllStaff();
        List<UserResponseDto> staffDtos = userMapper.toResponseDtoList(staff);
        
        ApiResponse<List<UserResponseDto>> response = ApiResponse.success(
            "Staff members retrieved successfully", staffDtos);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Check if user exists by username
     * GET /users/exists/{username}
     */
    @GetMapping("/exists/{username}")
    public ResponseEntity<ApiResponse<Boolean>> userExists(@PathVariable String username) {
        log.info("GET /users/exists/{} - Checking if user exists", username);
        
        boolean exists = userService.userExists(username);
        
        ApiResponse<Boolean> response = ApiResponse.success(
            "User existence check completed", exists);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Count users by role
     * GET /users/count/role/{role}
     */
    @GetMapping("/count/role/{role}")
    public ResponseEntity<ApiResponse<Long>> countUsersByRole(@PathVariable String role) {
        log.info("GET /users/count/role/{} - Counting users by role", role);
        
        long count = userService.countUsersByRole(role);
        
        ApiResponse<Long> response = ApiResponse.success(
            "User count for role '" + role + "' retrieved successfully", count);
        
        return ResponseEntity.ok(response);
    }
}
