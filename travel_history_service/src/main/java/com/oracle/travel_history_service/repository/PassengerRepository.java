package com.oracle.travel_history_service.repository;

import com.oracle.travel_history_service.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Passenger entity
 */
@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Long> {

    /**
     * Find passengers by flight ID
     * @param flightId the flight ID
     * @return list of passengers for the specified flight
     */
    List<Passenger> findByFlightId(Long flightId);

    /**
     * Find passengers by name (case-insensitive)
     * @param name the passenger name
     * @return list of passengers with matching name
     */
    List<Passenger> findByNameContainingIgnoreCase(String name);
}
