package com.oracle.travel_history_service.repository;

import com.oracle.travel_history_service.entity.TravelHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for TravelHistory entity
 */
@Repository
public interface TravelHistoryRepository extends JpaRepository<TravelHistory, Long> {

    /**
     * Find travel history by passenger ID
     * @param passengerId the passenger ID
     * @return list of travel history records for the passenger
     */
    List<TravelHistory> findByPassengerIdOrderByTravelDateDesc(Long passengerId);

    /**
     * Find travel history by booking reference
     * @param bookingReference the booking reference
     * @return optional travel history record
     */
    Optional<TravelHistory> findByBookingReference(String bookingReference);

    /**
     * Find travel history by flight ID
     * @param flightId the flight ID
     * @return list of travel history records for the flight
     */
    List<TravelHistory> findByFlightIdOrderByTravelDateDesc(Long flightId);

    /**
     * Find travel history by passenger ID and status
     * @param passengerId the passenger ID
     * @param status the status
     * @return list of travel history records
     */
    List<TravelHistory> findByPassengerIdAndStatusOrderByTravelDateDesc(Long passengerId, String status);

    /**
     * Find travel history by flight ID and status
     * @param flightId the flight ID
     * @param status the status
     * @return list of travel history records
     */
    List<TravelHistory> findByFlightIdAndStatusOrderByTravelDateDesc(Long flightId, String status);

    /**
     * Find travel history by passenger ID within date range
     * @param passengerId the passenger ID
     * @param startDate the start date
     * @param endDate the end date
     * @return list of travel history records
     */
    @Query("SELECT th FROM TravelHistory th WHERE th.passengerId = :passengerId " +
           "AND th.travelDate BETWEEN :startDate AND :endDate " +
           "ORDER BY th.travelDate DESC")
    List<TravelHistory> findByPassengerIdAndDateRange(@Param("passengerId") Long passengerId,
                                                      @Param("startDate") LocalDate startDate,
                                                      @Param("endDate") LocalDate endDate);

    /**
     * Find travel history by route
     * @param origin the origin
     * @param destination the destination
     * @return list of travel history records
     */
    List<TravelHistory> findByOriginAndDestinationOrderByTravelDateDesc(String origin, String destination);

    /**
     * Count travel history records by passenger ID
     * @param passengerId the passenger ID
     * @return count of travel history records
     */
    long countByPassengerId(Long passengerId);

    /**
     * Count travel history records by flight ID
     * @param flightId the flight ID
     * @return count of travel history records
     */
    long countByFlightId(Long flightId);

    /**
     * Find travel history with passenger and flight details
     * @param passengerId the passenger ID
     * @return list of travel history with joined data
     */
    @Query("SELECT th FROM TravelHistory th " +
           "WHERE th.passengerId = :passengerId " +
           "ORDER BY th.travelDate DESC")
    List<TravelHistory> findTravelHistoryWithDetails(@Param("passengerId") Long passengerId);

    /**
     * Find recent travel history (last 30 days) by passenger ID
     * @param passengerId the passenger ID
     * @param cutoffDate the cutoff date (30 days ago)
     * @return list of recent travel history records
     */
    @Query("SELECT th FROM TravelHistory th WHERE th.passengerId = :passengerId " +
           "AND th.travelDate >= :cutoffDate " +
           "ORDER BY th.travelDate DESC")
    List<TravelHistory> findRecentTravelHistory(@Param("passengerId") Long passengerId,
                                               @Param("cutoffDate") LocalDate cutoffDate);

    /**
     * Find travel history by multiple statuses
     * @param passengerId the passenger ID
     * @param statuses list of statuses
     * @return list of travel history records
     */
    @Query("SELECT th FROM TravelHistory th WHERE th.passengerId = :passengerId " +
           "AND th.status IN :statuses " +
           "ORDER BY th.travelDate DESC")
    List<TravelHistory> findByPassengerIdAndStatusIn(@Param("passengerId") Long passengerId,
                                                     @Param("statuses") List<String> statuses);

    /**
     * Check if booking reference exists
     * @param bookingReference the booking reference
     * @return true if exists, false otherwise
     */
    boolean existsByBookingReference(String bookingReference);

    /**
     * Find travel history by passenger ID with pagination support
     * @param passengerId the passenger ID
     * @param limit the maximum number of records to return
     * @return list of travel history records
     */
    @Query(value = "SELECT * FROM travel_history WHERE passenger_id = :passengerId " +
                   "ORDER BY travel_date DESC FETCH FIRST :limit ROWS ONLY", 
           nativeQuery = true)
    List<TravelHistory> findTopNByPassengerId(@Param("passengerId") Long passengerId, 
                                             @Param("limit") int limit);
}
