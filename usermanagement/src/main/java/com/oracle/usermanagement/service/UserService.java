package com.oracle.usermanagement.service;

import com.oracle.usermanagement.entity.User;
import com.oracle.usermanagement.exception.UserAlreadyExistsException;
import com.oracle.usermanagement.exception.UserNotFoundException;
import com.oracle.usermanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service class for User management operations
 * Handles business logic for user CRUD operations and specialized queries
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {

    private final UserRepository userRepository;

    /**
     * Get all users
     * @return List of all users
     */
    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll();
    }

    /**
     * Get user by ID
     * @param userId the user ID
     * @return Optional containing the user if found
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserById(Long userId) {
        log.info("Fetching user with ID: {}", userId);
        return userRepository.findById(userId);
    }

    /**
     * Get user by username
     * @param username the username
     * @return Optional containing the user if found
     */
    @Transactional(readOnly = true)
    public Optional<User> getUserByUsername(String username) {
        log.info("Fetching user with username: {}", username);
        return userRepository.findByUsername(username);
    }

    /**
     * Get users by role
     * @param role the role to search for
     * @return List of users with the specified role
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByRole(String role) {
        log.info("Fetching users with role: {}", role);
        validateRole(role);
        return userRepository.findByRole(role);
    }

    /**
     * Get staff assigned to a specific flight
     * @param flightId the flight ID
     * @return List of staff members assigned to the flight
     */
    @Transactional(readOnly = true)
    public List<User> getStaffByFlightId(Long flightId) {
        log.info("Fetching staff assigned to flight ID: {}", flightId);
        return userRepository.findStaffByFlightId(flightId);
    }

    /**
     * Create a new user
     * @param user the user to create
     * @return the created user
     */
    public User createUser(User user) {
        log.info("Creating new user with username: {}", user.getUsername());
        
        // Validate username uniqueness
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UserAlreadyExistsException(user.getUsername());
        }
        
        // Validate role
        validateRole(user.getRole());
        
        // Set creation timestamp
        user.setCreatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        log.info("Successfully created user with ID: {}", savedUser.getUserId());
        return savedUser;
    }

    /**
     * Update an existing user
     * @param userId the user ID to update
     * @param userDetails the updated user details
     * @return the updated user
     */
    public User updateUser(Long userId, User userDetails) {
        log.info("Updating user with ID: {}", userId);
        
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        
        // Check if username is being changed and if it's unique
        if (!existingUser.getUsername().equals(userDetails.getUsername()) &&
            userRepository.existsByUsername(userDetails.getUsername())) {
            throw new UserAlreadyExistsException(userDetails.getUsername());
        }
        
        // Validate role
        if (userDetails.getRole() != null) {
            validateRole(userDetails.getRole());
        }
        
        // Update fields
        existingUser.setUsername(userDetails.getUsername());
        existingUser.setPassword(userDetails.getPassword());
        existingUser.setRole(userDetails.getRole());
        existingUser.setName(userDetails.getName());
        existingUser.setEmail(userDetails.getEmail());
        existingUser.setPhoneNumber(userDetails.getPhoneNumber());
        existingUser.setFlightId(userDetails.getFlightId());
        
        User updatedUser = userRepository.save(existingUser);
        log.info("Successfully updated user with ID: {}", updatedUser.getUserId());
        return updatedUser;
    }

    /**
     * Delete a user
     * @param userId the user ID to delete
     */
    public void deleteUser(Long userId) {
        log.info("Deleting user with ID: {}", userId);
        
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }
        
        userRepository.deleteById(userId);
        log.info("Successfully deleted user with ID: {}", userId);
    }

    /**
     * Check if user exists by username
     * @param username the username to check
     * @return true if user exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Get all staff members
     * @return List of all staff members
     */
    @Transactional(readOnly = true)
    public List<User> getAllStaff() {
        log.info("Fetching all staff members");
        return userRepository.findAllStaff();
    }

    /**
     * Count users by role
     * @param role the role to count
     * @return number of users with the specified role
     */
    @Transactional(readOnly = true)
    public long countUsersByRole(String role) {
        log.info("Counting users with role: {}", role);
        validateRole(role);
        return userRepository.countByRole(role);
    }

    /**
     * Validate role value
     * @param role the role to validate
     */
    private void validateRole(String role) {
        if (role == null || role.trim().isEmpty()) {
            throw new IllegalArgumentException("Role cannot be null or empty");
        }
        
        List<String> validRoles = List.of("admin", "inflightStaff", "checkinStaff", "passenger");
        if (!validRoles.contains(role)) {
            throw new IllegalArgumentException("Invalid role: " + role + ". Valid roles are: " + validRoles);
        }
    }
}
