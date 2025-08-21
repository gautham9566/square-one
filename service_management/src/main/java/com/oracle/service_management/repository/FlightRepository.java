package com.oracle.service_management.repository;

import com.oracle.service_management.entity.Flight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Flight entity
 * Provides data access methods for services management operations
 */
@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    
    /**
     * Find flight by ID with services information
     * @param flightId the flight ID
     * @return optional flight with services data
     */
    @Query("SELECT f FROM Flight f WHERE f.flightId = :flightId")
    Optional<Flight> findByIdWithServices(@Param("flightId") Long flightId);
    
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
     * Find flights with available services
     * @return list of flights that have services available
     */
    @Query("SELECT f FROM Flight f WHERE f.servicesJson IS NOT NULL AND f.servicesJson != '[]' AND f.servicesJson != ''")
    List<Flight> findFlightsWithServices();
    
    /**
     * Find flights by specific service type
     * @param serviceType the service type (e.g., "Meal", "Shopping", "Ancillary")
     * @return list of flights offering the specified service
     */
    @Query("SELECT f FROM Flight f WHERE f.servicesJson LIKE %:serviceType%")
    List<Flight> findFlightsByServiceType(@Param("serviceType") String serviceType);
    
    /**
     * Find flights with meal services
     * @return list of flights offering meal services
     */
    @Query("SELECT f FROM Flight f WHERE f.servicesJson LIKE '%Meal%'")
    List<Flight> findFlightsWithMealServices();
    
    /**
     * Find flights with shopping services
     * @return list of flights offering shopping services
     */
    @Query("SELECT f FROM Flight f WHERE f.servicesJson LIKE '%Shopping%'")
    List<Flight> findFlightsWithShoppingServices();
    
    /**
     * Find flights with ancillary services (baggage, etc.)
     * @return list of flights offering ancillary services
     */
    @Query("SELECT f FROM Flight f WHERE f.servicesJson LIKE '%Ancillary%'")
    List<Flight> findFlightsWithAncillaryServices();
    
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
    
    /**
     * Check if a flight exists and has services
     * @param flightId the flight ID
     * @return true if flight exists and has services
     */
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM Flight f " +
           "WHERE f.flightId = :flightId AND f.servicesJson IS NOT NULL AND f.servicesJson != '[]' AND f.servicesJson != ''")
    boolean existsByIdAndHasServices(@Param("flightId") Long flightId);
    
    /**
     * Get service subtypes for a specific flight
     * @param flightId the flight ID
     * @return the service subtypes JSON string
     */
    @Query("SELECT f.serviceSubtypesJson FROM Flight f WHERE f.flightId = :flightId")
    Optional<String> findServiceSubtypesByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Get available services for a specific flight
     * @param flightId the flight ID
     * @return the services JSON string
     */
    @Query("SELECT f.servicesJson FROM Flight f WHERE f.flightId = :flightId")
    Optional<String> findServicesByFlightId(@Param("flightId") Long flightId);
}
