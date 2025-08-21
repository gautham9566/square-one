package com.oracle.flights.repository;

import com.oracle.flights.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    
    /**
     * Find flights with available seats
     * @return list of flights that have available seats
     */
    @Query("SELECT f FROM Flight f WHERE f.availableSeats > 0")
    List<Flight> findFlightsWithAvailableSeats();
    
    /**
     * Find flights by route with available seats
     * @param route the route
     * @return list of flights for the route with available seats
     */
    @Query("SELECT f FROM Flight f WHERE f.route = :route AND f.availableSeats > 0")
    List<Flight> findByRouteWithAvailableSeats(@Param("route") String route);
    
    /**
     * Find flights by date with available seats
     * @param flightDate the flight date
     * @return list of flights for the date with available seats
     */
    @Query("SELECT f FROM Flight f WHERE f.flightDate = :flightDate AND f.availableSeats > 0")
    List<Flight> findByFlightDateWithAvailableSeats(@Param("flightDate") LocalDate flightDate);
    
    /**
     * Find flights ordered by departure time
     * @return list of all flights ordered by departure time
     */
    @Query("SELECT f FROM Flight f ORDER BY f.departureTime")
    List<Flight> findAllOrderByDepartureTime();
    
    /**
     * Find flights by route ordered by departure time
     * @param route the route
     * @return list of flights for the route ordered by departure time
     */
    @Query("SELECT f FROM Flight f WHERE f.route = :route ORDER BY f.departureTime")
    List<Flight> findByRouteOrderByDepartureTime(@Param("route") String route);
    
    /**
     * Find flights by date ordered by departure time
     * @param flightDate the flight date
     * @return list of flights for the date ordered by departure time
     */
    @Query("SELECT f FROM Flight f WHERE f.flightDate = :flightDate ORDER BY f.departureTime")
    List<Flight> findByFlightDateOrderByDepartureTime(@Param("flightDate") LocalDate flightDate);
}
