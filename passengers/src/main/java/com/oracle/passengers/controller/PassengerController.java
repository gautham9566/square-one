package com.oracle.passengers.controller;

import com.oracle.passengers.dto.*;
import com.oracle.passengers.service.PassengerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Passenger operations
 */
@RestController
@RequestMapping("/passengers")
@CrossOrigin(origins = "*") // Allow CORS for frontend integration
public class PassengerController {
    
    private final PassengerService passengerService;
    
    @Autowired
    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }
    
    /**
     * GET /passengers - Get all passengers
     * @return list of all passengers
     */
    @GetMapping
    public ResponseEntity<List<PassengerDto>> getAllPassengers() {
        List<PassengerDto> passengers = passengerService.getAllPassengers();
        return ResponseEntity.ok(passengers);
    }
    
    /**
     * GET /passengers/{id} - Get passenger by ID
     * @param id the passenger ID
     * @return passenger details
     */
    @GetMapping("/{id}")
    public ResponseEntity<PassengerDto> getPassengerById(@PathVariable Long id) {
        PassengerDto passenger = passengerService.getPassengerById(id);
        return ResponseEntity.ok(passenger);
    }
    
    /**
     * POST /passengers - Create a new passenger
     * @param createDto the passenger creation data
     * @return the created passenger
     */
    @PostMapping
    public ResponseEntity<PassengerDto> createPassenger(@Valid @RequestBody PassengerCreateDto createDto) {
        PassengerDto createdPassenger = passengerService.createPassenger(createDto);
        return new ResponseEntity<>(createdPassenger, HttpStatus.CREATED);
    }
    
    /**
     * PUT /passengers/{id} - Update passenger information
     * @param id the passenger ID
     * @param updateDto the update data
     * @return the updated passenger
     */
    @PutMapping("/{id}")
    public ResponseEntity<PassengerDto> updatePassenger(
            @PathVariable Long id, 
            @Valid @RequestBody PassengerUpdateDto updateDto) {
        PassengerDto updatedPassenger = passengerService.updatePassenger(id, updateDto);
        return ResponseEntity.ok(updatedPassenger);
    }
    
    /**
     * DELETE /passengers/{id} - Delete a passenger
     * @param id the passenger ID
     * @return no content response
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassenger(@PathVariable Long id) {
        passengerService.deletePassenger(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * GET /passengers/flight/{flightId} - Get all passengers for a flight
     * @param flightId the flight ID
     * @param checkedIn optional filter for check-in status
     * @param specialNeeds optional filter for special needs
     * @param missingInfo optional filter for missing mandatory information
     * @return list of passengers for the specified flight
     */
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<List<PassengerDto>> getPassengersByFlight(
            @PathVariable Long flightId,
            @RequestParam(required = false) Boolean checkedIn,
            @RequestParam(required = false) Boolean specialNeeds,
            @RequestParam(required = false) Boolean missingInfo) {
        
        List<PassengerDto> passengers;
        
        if (Boolean.TRUE.equals(checkedIn)) {
            passengers = passengerService.getCheckedInPassengers(flightId);
        } else if (Boolean.FALSE.equals(checkedIn)) {
            passengers = passengerService.getNotCheckedInPassengers(flightId);
        } else if (Boolean.TRUE.equals(specialNeeds)) {
            passengers = passengerService.getPassengersWithSpecialNeeds(flightId);
        } else if (Boolean.TRUE.equals(missingInfo)) {
            passengers = passengerService.getPassengersWithMissingInfo(flightId);
        } else {
            passengers = passengerService.getPassengersByFlightId(flightId);
        }
        
        return ResponseEntity.ok(passengers);
    }
    
    /**
     * POST /passengers/checkin/{passengerId} - Check in a passenger
     * @param passengerId the passenger ID
     * @param checkInDto the check-in data (optional)
     * @return the updated passenger
     */
    @PostMapping("/checkin/{passengerId}")
    public ResponseEntity<PassengerDto> checkInPassenger(
            @PathVariable Long passengerId,
            @RequestBody(required = false) CheckInDto checkInDto) {
        
        if (checkInDto == null) {
            checkInDto = new CheckInDto();
        }
        
        PassengerDto checkedInPassenger = passengerService.checkInPassenger(passengerId, checkInDto);
        return ResponseEntity.ok(checkedInPassenger);
    }
    
    /**
     * PUT /passengers/seat/{flightId} - Assign seat to passenger
     * @param flightId the flight ID
     * @param seatAssignmentDto the seat assignment data
     * @return the updated passenger
     */
    @PutMapping("/seat/{flightId}")
    public ResponseEntity<PassengerDto> assignSeat(
            @PathVariable Long flightId,
            @Valid @RequestBody SeatAssignmentDto seatAssignmentDto) {
        
        PassengerDto updatedPassenger = passengerService.assignSeat(flightId, seatAssignmentDto);
        return ResponseEntity.ok(updatedPassenger);
    }
    
    /**
     * GET /passengers/search - Search passengers by name
     * @param name the name to search for
     * @return list of passengers with matching names
     */
    @GetMapping("/search")
    public ResponseEntity<List<PassengerDto>> searchPassengers(@RequestParam String name) {
        List<PassengerDto> passengers = passengerService.searchPassengersByName(name);
        return ResponseEntity.ok(passengers);
    }
    
    /**
     * GET /passengers/flight/{flightId}/checkedin - Get checked-in passengers for a flight
     * @param flightId the flight ID
     * @return list of checked-in passengers
     */
    @GetMapping("/flight/{flightId}/checkedin")
    public ResponseEntity<List<PassengerDto>> getCheckedInPassengers(@PathVariable Long flightId) {
        List<PassengerDto> passengers = passengerService.getCheckedInPassengers(flightId);
        return ResponseEntity.ok(passengers);
    }
    
    /**
     * GET /passengers/flight/{flightId}/not-checkedin - Get passengers who haven't checked in
     * @param flightId the flight ID
     * @return list of passengers who haven't checked in
     */
    @GetMapping("/flight/{flightId}/not-checkedin")
    public ResponseEntity<List<PassengerDto>> getNotCheckedInPassengers(@PathVariable Long flightId) {
        List<PassengerDto> passengers = passengerService.getNotCheckedInPassengers(flightId);
        return ResponseEntity.ok(passengers);
    }
    
    /**
     * GET /passengers/flight/{flightId}/special-needs - Get passengers with special needs
     * @param flightId the flight ID
     * @return list of passengers with special needs
     */
    @GetMapping("/flight/{flightId}/special-needs")
    public ResponseEntity<List<PassengerDto>> getPassengersWithSpecialNeeds(@PathVariable Long flightId) {
        List<PassengerDto> passengers = passengerService.getPassengersWithSpecialNeeds(flightId);
        return ResponseEntity.ok(passengers);
    }
    
    /**
     * GET /passengers/flight/{flightId}/missing-info - Get passengers with missing mandatory information
     * @param flightId the flight ID
     * @return list of passengers with missing information
     */
    @GetMapping("/flight/{flightId}/missing-info")
    public ResponseEntity<List<PassengerDto>> getPassengersWithMissingInfo(@PathVariable Long flightId) {
        List<PassengerDto> passengers = passengerService.getPassengersWithMissingInfo(flightId);
        return ResponseEntity.ok(passengers);
    }
}
