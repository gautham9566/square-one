package com.oracle.passengers.repository;

import com.oracle.passengers.entity.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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
     * Find passengers by flight ID ordered by name
     * @param flightId the flight ID
     * @return list of passengers for the specified flight ordered by name
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId ORDER BY p.name")
    List<Passenger> findByFlightIdOrderByName(@Param("flightId") Long flightId);
    
    /**
     * Find passengers by name (case-insensitive)
     * @param name the passenger name
     * @return list of passengers with matching name
     */
    @Query("SELECT p FROM Passenger p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Passenger> findByNameContainingIgnoreCase(@Param("name") String name);
    
    /**
     * Find passengers by check-in status
     * @param checkedIn the check-in status ('Y' or 'N')
     * @return list of passengers with the specified check-in status
     */
    @Query("SELECT p FROM Passenger p WHERE p.checkedIn = :checkedIn")
    List<Passenger> findByCheckedInStatus(@Param("checkedIn") String checkedIn);
    
    /**
     * Find checked-in passengers for a flight
     * @param flightId the flight ID
     * @return list of checked-in passengers for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND p.checkedIn = 'Y'")
    List<Passenger> findCheckedInPassengersByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passengers who haven't checked in for a flight
     * @param flightId the flight ID
     * @return list of passengers who haven't checked in for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND p.checkedIn = 'N'")
    List<Passenger> findNotCheckedInPassengersByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passengers with special needs (wheelchair or infant)
     * @param flightId the flight ID
     * @return list of passengers with special needs for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND (p.wheelchair = 'Y' OR p.infant = 'Y')")
    List<Passenger> findPassengersWithSpecialNeedsByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passengers requiring wheelchair assistance
     * @param flightId the flight ID
     * @return list of passengers requiring wheelchair assistance for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND p.wheelchair = 'Y'")
    List<Passenger> findWheelchairPassengersByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passengers traveling with infants
     * @param flightId the flight ID
     * @return list of passengers traveling with infants for the specified flight
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND p.infant = 'Y'")
    List<Passenger> findInfantPassengersByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passenger by seat number for a specific flight
     * @param flightId the flight ID
     * @param seat the seat number
     * @return passenger occupying the specified seat
     */
    Optional<Passenger> findByFlightIdAndSeat(Long flightId, String seat);
    
    /**
     * Check if a seat is available for a specific flight
     * @param flightId the flight ID
     * @param seat the seat number
     * @return true if seat is available, false otherwise
     */
    @Query("SELECT CASE WHEN COUNT(p) = 0 THEN true ELSE false END FROM Passenger p WHERE p.flightId = :flightId AND p.seat = :seat")
    boolean isSeatAvailable(@Param("flightId") Long flightId, @Param("seat") String seat);
    
    /**
     * Count passengers for a specific flight
     * @param flightId the flight ID
     * @return number of passengers for the specified flight
     */
    long countByFlightId(Long flightId);
    
    /**
     * Count checked-in passengers for a specific flight
     * @param flightId the flight ID
     * @return number of checked-in passengers for the specified flight
     */
    @Query("SELECT COUNT(p) FROM Passenger p WHERE p.flightId = :flightId AND p.checkedIn = 'Y'")
    long countCheckedInPassengersByFlightId(@Param("flightId") Long flightId);
    
    /**
     * Find passengers by passport number
     * @param passportNumber the passport number
     * @return passenger with the specified passport number
     */
    Optional<Passenger> findByPassportNumber(String passportNumber);
    
    /**
     * Find passengers by phone number
     * @param phoneNumber the phone number
     * @return list of passengers with the specified phone number
     */
    List<Passenger> findByPhoneNumber(String phoneNumber);
    
    /**
     * Find passengers with missing mandatory information
     * @param flightId the flight ID
     * @return list of passengers missing passport, address, or date of birth
     */
    @Query("SELECT p FROM Passenger p WHERE p.flightId = :flightId AND " +
           "(p.passportNumber IS NULL OR p.passportNumber = '' OR " +
           "p.address IS NULL OR p.address = '' OR " +
           "p.dateOfBirth IS NULL)")
    List<Passenger> findPassengersWithMissingInfoByFlightId(@Param("flightId") Long flightId);
}
