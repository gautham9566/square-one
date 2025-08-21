package com.oracle.travel_history_service.repository;

import com.oracle.travel_history_service.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository interface for Flight entity
 */
@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {

    /**
     * Find flights by route
     * @param route the route (e.g., "NYC-LON")
     * @return list of flights for the specified route
     */
    List<Flight> findByRoute(String route);

    /**
     * Find flights by date
     * @param flightDate the flight date
     * @return list of flights for the specified date
     */
    List<Flight> findByFlightDate(LocalDate flightDate);

    /**
     * Find flights by route and date
     * @param route the route
     * @param flightDate the flight date
     * @return list of flights matching both criteria
     */
    List<Flight> findByRouteAndFlightDate(String route, LocalDate flightDate);
}
