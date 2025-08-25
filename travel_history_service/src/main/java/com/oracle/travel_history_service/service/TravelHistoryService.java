package com.oracle.travel_history_service.service;

import com.oracle.travel_history_service.dto.*;
import com.oracle.travel_history_service.entity.Flight;
import com.oracle.travel_history_service.entity.Passenger;
import com.oracle.travel_history_service.entity.TravelHistory;
import com.oracle.travel_history_service.repository.FlightRepository;
import com.oracle.travel_history_service.repository.PassengerRepository;
import com.oracle.travel_history_service.repository.TravelHistoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class for travel history operations
 */
@Service
@Transactional(readOnly = true)
public class TravelHistoryService {

    private static final Logger logger = LoggerFactory.getLogger(TravelHistoryService.class);

    private final TravelHistoryRepository travelHistoryRepository;
    private final PassengerRepository passengerRepository;
    private final FlightRepository flightRepository;

    @Autowired
    public TravelHistoryService(TravelHistoryRepository travelHistoryRepository,
                               PassengerRepository passengerRepository,
                               FlightRepository flightRepository) {
        this.travelHistoryRepository = travelHistoryRepository;
        this.passengerRepository = passengerRepository;
        this.flightRepository = flightRepository;
    }

    /**
     * Get travel history by passenger ID
     * @param passengerId the passenger ID
     * @return travel history response
     */
    public TravelHistoryResponseDto getTravelHistoryByPassenger(Long passengerId) {
        logger.info("Fetching travel history for passenger ID: {}", passengerId);

        try {
            // Check if passenger exists
            Optional<Passenger> passengerOpt = passengerRepository.findById(passengerId);
            if (passengerOpt.isEmpty()) {
                logger.warn("Passenger not found with ID: {}", passengerId);
                return TravelHistoryResponseDto.notFound("Passenger not found with ID: " + passengerId);
            }

            List<TravelHistory> travelHistoryList = travelHistoryRepository
                    .findByPassengerIdOrderByTravelDateDesc(passengerId);

            if (travelHistoryList.isEmpty()) {
                logger.info("No travel history found for passenger ID: {}", passengerId);
                return TravelHistoryResponseDto.success("No travel history found for passenger", 
                        List.of(), "passenger", passengerId.toString());
            }

            List<TravelHistoryDto> travelHistoryDtos = travelHistoryList.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            logger.info("Found {} travel history records for passenger ID: {}", 
                    travelHistoryDtos.size(), passengerId);

            return TravelHistoryResponseDto.success(
                    "Travel history retrieved successfully", 
                    travelHistoryDtos, 
                    "passenger", 
                    passengerId.toString()
            );

        } catch (Exception e) {
            logger.error("Error fetching travel history for passenger ID: {}", passengerId, e);
            return TravelHistoryResponseDto.error("Error retrieving travel history: " + e.getMessage());
        }
    }

    /**
     * Get travel history by booking reference
     * @param bookingReference the booking reference
     * @return travel history response
     */
    public TravelHistoryResponseDto getTravelHistoryByBookingReference(String bookingReference) {
        logger.info("Fetching travel history for booking reference: {}", bookingReference);

        try {
            Optional<TravelHistory> travelHistoryOpt = travelHistoryRepository
                    .findByBookingReference(bookingReference);

            if (travelHistoryOpt.isEmpty()) {
                logger.warn("Travel history not found for booking reference: {}", bookingReference);
                return TravelHistoryResponseDto.notFound("Travel history not found for booking reference: " + bookingReference);
            }

            TravelHistoryDto travelHistoryDto = convertToDto(travelHistoryOpt.get());

            logger.info("Found travel history for booking reference: {}", bookingReference);

            return TravelHistoryResponseDto.success(
                    "Travel history retrieved successfully", 
                    List.of(travelHistoryDto), 
                    "booking", 
                    bookingReference
            );

        } catch (Exception e) {
            logger.error("Error fetching travel history for booking reference: {}", bookingReference, e);
            return TravelHistoryResponseDto.error("Error retrieving travel history: " + e.getMessage());
        }
    }

    /**
     * Get travel history by flight ID
     * @param flightId the flight ID
     * @return travel history response
     */
    public TravelHistoryResponseDto getTravelHistoryByFlight(Long flightId) {
        logger.info("Fetching travel history for flight ID: {}", flightId);

        try {
            // Check if flight exists
            Optional<Flight> flightOpt = flightRepository.findById(flightId);
            if (flightOpt.isEmpty()) {
                logger.warn("Flight not found with ID: {}", flightId);
                return TravelHistoryResponseDto.notFound("Flight not found with ID: " + flightId);
            }

            List<TravelHistory> travelHistoryList = travelHistoryRepository
                    .findByFlightIdOrderByTravelDateDesc(flightId);

            if (travelHistoryList.isEmpty()) {
                logger.info("No travel history found for flight ID: {}", flightId);
                return TravelHistoryResponseDto.success("No travel history found for flight", 
                        List.of(), "flight", flightId.toString());
            }

            List<TravelHistoryDto> travelHistoryDtos = travelHistoryList.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            logger.info("Found {} travel history records for flight ID: {}", 
                    travelHistoryDtos.size(), flightId);

            return TravelHistoryResponseDto.success(
                    "Travel history retrieved successfully", 
                    travelHistoryDtos, 
                    "flight", 
                    flightId.toString()
            );

        } catch (Exception e) {
            logger.error("Error fetching travel history for flight ID: {}", flightId, e);
            return TravelHistoryResponseDto.error("Error retrieving travel history: " + e.getMessage());
        }
    }

    /**
     * Get recent travel history for a passenger (last 30 days)
     * @param passengerId the passenger ID
     * @return travel history response
     */
    public TravelHistoryResponseDto getRecentTravelHistory(Long passengerId) {
        logger.info("Fetching recent travel history for passenger ID: {}", passengerId);

        try {
            LocalDate cutoffDate = LocalDate.now().minusDays(30);
            List<TravelHistory> travelHistoryList = travelHistoryRepository
                    .findRecentTravelHistory(passengerId, cutoffDate);

            List<TravelHistoryDto> travelHistoryDtos = travelHistoryList.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return TravelHistoryResponseDto.success(
                    "Recent travel history retrieved successfully", 
                    travelHistoryDtos, 
                    "passenger", 
                    passengerId.toString()
            );

        } catch (Exception e) {
            logger.error("Error fetching recent travel history for passenger ID: {}", passengerId, e);
            return TravelHistoryResponseDto.error("Error retrieving recent travel history: " + e.getMessage());
        }
    }

    /**
     * Get travel history by passenger ID and status
     * @param passengerId the passenger ID
     * @param status the status
     * @return travel history response
     */
    public TravelHistoryResponseDto getTravelHistoryByStatus(Long passengerId, String status) {
        logger.info("Fetching travel history for passenger ID: {} with status: {}", passengerId, status);

        try {
            List<TravelHistory> travelHistoryList = travelHistoryRepository
                    .findByPassengerIdAndStatusOrderByTravelDateDesc(passengerId, status);

            List<TravelHistoryDto> travelHistoryDtos = travelHistoryList.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            TravelHistoryResponseDto response = TravelHistoryResponseDto.success(
                    "Travel history retrieved successfully", 
                    travelHistoryDtos, 
                    "passenger", 
                    passengerId.toString()
            );
            response.setStatus(status);

            return response;

        } catch (Exception e) {
            logger.error("Error fetching travel history for passenger ID: {} with status: {}",
                    passengerId, status, e);
            return TravelHistoryResponseDto.error("Error retrieving travel history: " + e.getMessage());
        }
    }

    /**
     * Get all travel history records (for admin dashboard)
     * @return travel history response with all records
     */
    public TravelHistoryResponseDto getAllTravelHistory() {
        logger.info("Fetching all travel history records");

        try {
            List<TravelHistory> travelHistoryList = travelHistoryRepository.findAll();
            logger.info("Retrieved {} travel history records from database", travelHistoryList.size());

            if (travelHistoryList.isEmpty()) {
                logger.info("No travel history records found");
                return TravelHistoryResponseDto.success("No travel history records found",
                        List.of(), "all", null);
            }

            // Sort by travel date descending, handling null values
            travelHistoryList.sort((a, b) -> {
                if (a.getTravelDate() == null && b.getTravelDate() == null) return 0;
                if (a.getTravelDate() == null) return 1;
                if (b.getTravelDate() == null) return -1;
                return b.getTravelDate().compareTo(a.getTravelDate());
            });

            logger.info("Converting {} records to DTOs", travelHistoryList.size());
            List<TravelHistoryDto> travelHistoryDtos = travelHistoryList.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            logger.info("Successfully converted {} travel history records to DTOs", travelHistoryDtos.size());

            return TravelHistoryResponseDto.success(
                    "All travel history retrieved successfully",
                    travelHistoryDtos,
                    "all",
                    null
            );

        } catch (Exception e) {
            logger.error("Error fetching all travel history", e);
            return TravelHistoryResponseDto.error("Error retrieving travel history: " + e.getMessage());
        }
    }

    /**
     * Convert TravelHistory entity to DTO
     * @param travelHistory the travel history entity
     * @return travel history DTO
     */
    private TravelHistoryDto convertToDto(TravelHistory travelHistory) {
        TravelHistoryDto dto = new TravelHistoryDto();
        dto.setHistoryId(travelHistory.getHistoryId());
        dto.setPassengerId(travelHistory.getPassengerId());
        dto.setFlightId(travelHistory.getFlightId());
        dto.setTravelDate(travelHistory.getTravelDate());
        dto.setOrigin(travelHistory.getOrigin());
        dto.setDestination(travelHistory.getDestination());
        dto.setSeat(travelHistory.getSeat());
        dto.setBookingReference(travelHistory.getBookingReference());
        dto.setFareClass(travelHistory.getFareClass());
        dto.setStatus(travelHistory.getStatus());
        dto.setDistanceKm(travelHistory.getDistanceKm());
        dto.setDurationMin(travelHistory.getDurationMin());
        dto.setNotes(travelHistory.getNotes());
        dto.setCreatedAt(travelHistory.getCreatedAt());

        // Add passenger details if available
        passengerRepository.findById(travelHistory.getPassengerId())
                .ifPresent(passenger -> dto.setPassenger(convertToPassengerSummary(passenger)));

        // Add flight details if available
        flightRepository.findById(travelHistory.getFlightId())
                .ifPresent(flight -> dto.setFlight(convertToFlightSummary(flight)));

        return dto;
    }

    /**
     * Convert Passenger entity to summary DTO
     * @param passenger the passenger entity
     * @return passenger summary DTO
     */
    private PassengerSummaryDto convertToPassengerSummary(Passenger passenger) {
        PassengerSummaryDto dto = new PassengerSummaryDto();
        dto.setPassengerId(passenger.getPassengerId());
        dto.setName(passenger.getName());
        dto.setPhoneNumber(passenger.getPhoneNumber());
        dto.setPassportNumber(passenger.getPassportNumber());
        dto.setDateOfBirth(passenger.getDateOfBirth());
        dto.setSeat(passenger.getSeat());
        dto.setCheckedIn(passenger.getCheckedIn());
        return dto;
    }

    /**
     * Convert Flight entity to summary DTO
     * @param flight the flight entity
     * @return flight summary DTO
     */
    private FlightSummaryDto convertToFlightSummary(Flight flight) {
        FlightSummaryDto dto = new FlightSummaryDto();
        dto.setFlightId(flight.getFlightId());
        dto.setFlightName(flight.getFlightName());
        dto.setFlightDate(flight.getFlightDate());
        dto.setRoute(flight.getRoute());
        dto.setDepartureTime(flight.getDepartureTime());
        dto.setArrivalTime(flight.getArrivalTime());
        dto.setAircraftType(flight.getAircraftType());
        dto.setTotalSeats(flight.getTotalSeats());
        dto.setAvailableSeats(flight.getAvailableSeats());
        return dto;
    }
}
