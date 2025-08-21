package com.oracle.usermanagement.repository;

import com.oracle.usermanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for User entity
 * Provides CRUD operations and custom queries for user management
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by username
     * @param username the username to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByUsername(String username);

    /**
     * Find users by role
     * @param role the role to search for (admin, inflightStaff, checkinStaff, passenger)
     * @return List of users with the specified role
     */
    List<User> findByRole(String role);

    /**
     * Find staff members assigned to a specific flight
     * @param flightId the flight ID to search for
     * @return List of staff members assigned to the flight
     */
    @Query("SELECT u FROM User u WHERE u.flightId = :flightId AND u.role IN ('inflightStaff', 'checkinStaff')")
    List<User> findStaffByFlightId(@Param("flightId") Long flightId);

    /**
     * Find users by role and flight ID
     * @param role the role to search for
     * @param flightId the flight ID to search for
     * @return List of users with the specified role and flight assignment
     */
    List<User> findByRoleAndFlightId(String role, Long flightId);

    /**
     * Check if username exists
     * @param username the username to check
     * @return true if username exists, false otherwise
     */
    boolean existsByUsername(String username);

    /**
     * Find all staff members (inflight and checkin staff)
     * @return List of all staff members
     */
    @Query("SELECT u FROM User u WHERE u.role IN ('inflightStaff', 'checkinStaff')")
    List<User> findAllStaff();

    /**
     * Find users by email
     * @param email the email to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Count users by role
     * @param role the role to count
     * @return number of users with the specified role
     */
    long countByRole(String role);
}
