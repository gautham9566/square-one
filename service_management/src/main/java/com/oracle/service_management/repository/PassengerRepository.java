package com.oracle.service_management.repository;

import com.oracle.service_management.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Passenger entity
 * Provides data access methods for services management operations
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
     * Find passengers by flight ID ordered by name
     * @param flightId the flight ID
     * @return list of passengers for the specified flight ordered by name
     */
    List<Passenger> findByFlightIdOrderByName(Long flightId);
    
    /**
     * Find passenger by ID with services information
     * @param passengerId the passenger ID
     * @return optional passenger with services data
     */
    @Query("SELECT p FROM Passenger p WHERE p.passengerId = :passengerId")
    Optional<Passenger> findByIdWithServices(@Param("passengerId") Long passengerId);
    
    /**
     * Find passengers with specific service type
     * @param serviceType the service type (e.g., "Meal", "Shopping", "Ancillary")
     * @return list of passengers who have requested the specified service
     */
    @Query("SELECT p FROM Passenger p WHERE p.servicesJson LIKE %:serviceType%")
    List<Passenger> findPassengersByServiceType(@Param("serviceType") String serviceType);
    
    /**
     * Find passengers with meal services by flight
     * @param flightId the flight ID
     * @return list of passengers with meal services for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND p.servicesJson LIKE '%Meal%'")
    List<Passenger> findPassengersWithMealServicesByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passengers with shopping services by flight
     * @param flightId the flight ID
     * @return list of passengers with shopping services for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND p.servicesJson LIKE '%Shopping%'")
    List<Passenger> findPassengersWithShoppingServicesByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passengers with ancillary services by flight
     * @param flightId the flight ID
     * @return list of passengers with ancillary services for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND p.servicesJson LIKE '%Ancillary%'")
    List<Passenger> findPassengersWithAncillaryServicesByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passengers with extra baggage by flight
     * @param flightId the flight ID
     * @return list of passengers with extra baggage for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND p.extraBaggage > 0")
    List<Passenger> findPassengersWithExtraBaggageByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passengers with shopping items by flight
     * @param flightId the flight ID
     * @return list of passengers with shopping items for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND p.shoppingItemsJson IS NOT NULL AND p.shoppingItemsJson != '[]' AND p.shoppingItemsJson != ''")
    List<Passenger> findPassengersWithShoppingItemsByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passengers with specific meal type by flight
     * @param flightId the flight ID
     * @param mealType the meal type (e.g., "Veg", "Non-Veg", "Vegan")
     * @return list of passengers with the specified meal type for the flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND p.mealType = :mealType")
    List<Passenger> findPassengersByFlightIdAndMealType(@Param("flightId") Long flightId, @Param("mealType") String mealType);
    
    /**
     * Find passengers with special needs by flight
     * @param flightId the flight ID
     * @return list of passengers with special needs (wheelchair or infant) for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND (p.wheelchair = 'Y' OR p.infant = 'Y')")
    List<Passenger> findPassengersWithSpecialNeedsByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Count passengers with specific service type by flight
     * @param flightId the flight ID
     * @param serviceType the service type
     * @return count of passengers with the specified service type
     */
    @Query("SELECT COUNT(p) FROM Passenger p WHERE p.flightId = :flightId AND p.servicesJson LIKE %:serviceType%")
    Long countPassengersByFlightIdAndServiceType(@Param("flightId") Long flightId, @Param("serviceType") String serviceType);
    
    /**
     * Count passengers with meal services by flight
     * @param flightId the flight ID
     * @return count of passengers with meal services
     */
    @Query("SELECT COUNT(p) FROM Passenger p WHERE p.flightId = :flightId AND p.servicesJson LIKE '%Meal%'")
    Long countPassengersWithMealServicesByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Count passengers with shopping services by flight
     * @param flightId the flight ID
     * @return count of passengers with shopping services
     */
    @Query("SELECT COUNT(p) FROM Passenger p WHERE p.flightId = :flightId AND p.servicesJson LIKE '%Shopping%'")
    Long countPassengersWithShoppingServicesByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Update passenger services
     * @param passengerId the passenger ID
     * @param servicesJson the new services JSON
     * @return number of updated records
     */
    @Modifying
    @Query("UPDATE Passenger p SET p.servicesJson = :servicesJson WHERE p.passengerId = :passengerId")
    int updatePassengerServices(@Param("passengerId") Long passengerId, @Param("servicesJson") String servicesJson);
    
    /**
     * Update passenger meal information
     * @param passengerId the passenger ID
     * @param mealType the meal type
     * @param mealName the meal name
     * @return number of updated records
     */
    @Modifying
    @Query("UPDATE Passenger p SET p.mealType = :mealType, p.mealName = :mealName WHERE p.passengerId = :passengerId")
    int updatePassengerMeal(@Param("passengerId") Long passengerId, @Param("mealType") String mealType, @Param("mealName") String mealName);
    
    /**
     * Update passenger extra baggage
     * @param passengerId the passenger ID
     * @param extraBaggage the extra baggage amount
     * @return number of updated records
     */
    @Modifying
    @Query("UPDATE Passenger p SET p.extraBaggage = :extraBaggage WHERE p.passengerId = :passengerId")
    int updatePassengerExtraBaggage(@Param("passengerId") Long passengerId, @Param("extraBaggage") Integer extraBaggage);
    
    /**
     * Update passenger shopping items
     * @param passengerId the passenger ID
     * @param shoppingItemsJson the new shopping items JSON
     * @return number of updated records
     */
    @Modifying
    @Query("UPDATE Passenger p SET p.shoppingItemsJson = :shoppingItemsJson WHERE p.passengerId = :passengerId")
    int updatePassengerShoppingItems(@Param("passengerId") Long passengerId, @Param("shoppingItemsJson") String shoppingItemsJson);
    
    /**
     * Check if passenger exists and belongs to flight
     * @param passengerId the passenger ID
     * @param flightId the flight ID
     * @return true if passenger exists and belongs to the flight
     */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Passenger p WHERE p.passengerId = :passengerId AND p.flightId = :flightId")
    boolean existsByIdAndFlightId(@Param("passengerId") Long passengerId, @Param("flightId") Long flightId);
}
