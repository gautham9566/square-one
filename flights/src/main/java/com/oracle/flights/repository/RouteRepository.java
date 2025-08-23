package com.oracle.flights.repository;

import com.oracle.flights.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Route entity
 */
@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    
    /**
     * Find route by route code
     * @param routeCode the route code (e.g., "NYC-LON")
     * @return Optional route
     */
    Optional<Route> findByRouteCode(String routeCode);
    
    /**
     * Find routes by status
     * @param status the route status
     * @return list of routes with the specified status
     */
    List<Route> findByStatus(Route.RouteStatus status);
    
    /**
     * Find routes by departure airport
     * @param departureAirport the departure airport code
     * @return list of routes departing from the specified airport
     */
    List<Route> findByDepartureAirport(String departureAirport);
    
    /**
     * Find routes by arrival airport
     * @param arrivalAirport the arrival airport code
     * @return list of routes arriving at the specified airport
     */
    List<Route> findByArrivalAirport(String arrivalAirport);
    
    /**
     * Find routes by departure city
     * @param departureCity the departure city
     * @return list of routes departing from the specified city
     */
    List<Route> findByDepartureCity(String departureCity);
    
    /**
     * Find routes by arrival city
     * @param arrivalCity the arrival city
     * @return list of routes arriving at the specified city
     */
    List<Route> findByArrivalCity(String arrivalCity);
    
    /**
     * Find active routes only
     * @return list of active routes
     */
    @Query("SELECT r FROM Route r WHERE r.status = 'ACTIVE'")
    List<Route> findActiveRoutes();
    
    /**
     * Search routes by departure and arrival locations
     * @param departure departure city or airport code
     * @param arrival arrival city or airport code
     * @return list of matching routes
     */
    @Query("SELECT r FROM Route r WHERE " +
           "(r.departureCity LIKE %:departure% OR r.departureAirport LIKE %:departure%) AND " +
           "(r.arrivalCity LIKE %:arrival% OR r.arrivalAirport LIKE %:arrival%) AND " +
           "r.status = 'ACTIVE'")
    List<Route> searchRoutes(@Param("departure") String departure, @Param("arrival") String arrival);
    
    /**
     * Check if route code exists
     * @param routeCode the route code
     * @return true if exists, false otherwise
     */
    boolean existsByRouteCode(String routeCode);
}
