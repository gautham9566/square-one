package com.oracle.travel_history_service.controller;

import com.oracle.travel_history_service.dto.TravelHistoryResponseDto;
import com.oracle.travel_history_service.service.TravelHistoryService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for travel history operations
 */
@RestController
@RequestMapping("/history")
@Validated
@CrossOrigin(origins = "*") // Configure as needed for your frontend
public class TravelHistoryController {

    private static final Logger logger = LoggerFactory.getLogger(TravelHistoryController.class);

    private final TravelHistoryService travelHistoryService;

    @Autowired
    public TravelHistoryController(TravelHistoryService travelHistoryService) {
        this.travelHistoryService = travelHistoryService;
    }

    /**
     * Get travel history by passenger ID
     * @param passengerId the passenger ID
     * @return travel history response
     */
    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<TravelHistoryResponseDto> getTravelHistoryByPassenger(
            @PathVariable @NotNull @Positive Long passengerId) {
        
        logger.info("REST request to get travel history for passenger ID: {}", passengerId);

        try {
            TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByPassenger(passengerId);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                // Check if it's a not found case
                if (response.getMessage().contains("not found")) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (Exception e) {
            logger.error("Error in getTravelHistoryByPassenger for passenger ID: {}", passengerId, e);
            TravelHistoryResponseDto errorResponse = TravelHistoryResponseDto.error(
                    "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get travel history by booking reference
     * @param reference the booking reference
     * @return travel history response
     */
    @GetMapping("/booking/{reference}")
    public ResponseEntity<TravelHistoryResponseDto> getTravelHistoryByBookingReference(
            @PathVariable @NotBlank String reference) {
        
        logger.info("REST request to get travel history for booking reference: {}", reference);

        try {
            TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByBookingReference(reference);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                // Check if it's a not found case
                if (response.getMessage().contains("not found")) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (Exception e) {
            logger.error("Error in getTravelHistoryByBookingReference for reference: {}", reference, e);
            TravelHistoryResponseDto errorResponse = TravelHistoryResponseDto.error(
                    "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get travel history by flight ID
     * @param flightId the flight ID
     * @return travel history response
     */
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<TravelHistoryResponseDto> getTravelHistoryByFlight(
            @PathVariable @NotNull @Positive Long flightId) {
        
        logger.info("REST request to get travel history for flight ID: {}", flightId);

        try {
            TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByFlight(flightId);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                // Check if it's a not found case
                if (response.getMessage().contains("not found")) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (Exception e) {
            logger.error("Error in getTravelHistoryByFlight for flight ID: {}", flightId, e);
            TravelHistoryResponseDto errorResponse = TravelHistoryResponseDto.error(
                    "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get recent travel history by passenger ID (last 30 days)
     * @param passengerId the passenger ID
     * @return travel history response
     */
    @GetMapping("/passenger/{passengerId}/recent")
    public ResponseEntity<TravelHistoryResponseDto> getRecentTravelHistory(
            @PathVariable @NotNull @Positive Long passengerId) {
        
        logger.info("REST request to get recent travel history for passenger ID: {}", passengerId);

        try {
            TravelHistoryResponseDto response = travelHistoryService.getRecentTravelHistory(passengerId);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (Exception e) {
            logger.error("Error in getRecentTravelHistory for passenger ID: {}", passengerId, e);
            TravelHistoryResponseDto errorResponse = TravelHistoryResponseDto.error(
                    "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Get travel history by passenger ID and status
     * @param passengerId the passenger ID
     * @param status the status filter
     * @return travel history response
     */
    @GetMapping("/passenger/{passengerId}/status/{status}")
    public ResponseEntity<TravelHistoryResponseDto> getTravelHistoryByStatus(
            @PathVariable @NotNull @Positive Long passengerId,
            @PathVariable @NotBlank String status) {
        
        logger.info("REST request to get travel history for passenger ID: {} with status: {}", 
                passengerId, status);

        try {
            TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByStatus(passengerId, status);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (Exception e) {
            logger.error("Error in getTravelHistoryByStatus for passenger ID: {} and status: {}", 
                    passengerId, status, e);
            TravelHistoryResponseDto errorResponse = TravelHistoryResponseDto.error(
                    "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * Health check endpoint
     * @return simple health status
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Travel History Service is running");
    }

    /**
     * Get API information
     * @return API information
     */
    @GetMapping("/info")
    public ResponseEntity<Object> getApiInfo() {
        return ResponseEntity.ok(new Object() {
            public final String service = "Travel History Service";
            public final String version = "1.0.0";
            public final String description = "Manage passenger travel records and booking history";
            public final String[] endpoints = {
                "GET /history/passenger/{passengerId} - Get passenger travel history",
                "GET /history/booking/{reference} - Get booking by reference",
                "GET /history/flight/{flightId} - Get history for specific flight",
                "GET /history/passenger/{passengerId}/recent - Get recent travel history",
                "GET /history/passenger/{passengerId}/status/{status} - Get travel history by status"
            };
        });
    }
}
