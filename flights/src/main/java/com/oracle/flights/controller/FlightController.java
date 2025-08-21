package com.oracle.flights.controller;

import com.oracle.flights.dto.SeatAvailabilityDto;
import com.oracle.flights.entity.Flight;
import com.oracle.flights.exception.FlightNotFoundException;
import com.oracle.flights.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Flight operations
 */
@RestController
@RequestMapping("/flights")
@CrossOrigin(origins = "*") // Allow CORS for frontend integration
public class FlightController {
    
    private final FlightService flightService;
    
    @Autowired
    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }
    
    /**
     * GET /flights - Get all flights
     * @return list of all flights
     */
    @GetMapping
    public ResponseEntity<List<Flight>> getAllFlights() {
        List<Flight> flights = flightService.getAllFlights();
        return ResponseEntity.ok(flights);
    }
    
    /**
     * GET /flights/{id} - Get flight by ID
     * @param id the flight ID
     * @return the flight if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Long id) {
        Flight flight = flightService.getFlightById(id)
                .orElseThrow(() -> new FlightNotFoundException(id));
        return ResponseEntity.ok(flight);
    }
    
    /**
     * POST /flights - Create a new flight
     * @param flight the flight to create
     * @return the created flight
     */
    @PostMapping
    public ResponseEntity<Flight> createFlight(@Valid @RequestBody Flight flight) {
        Flight createdFlight = flightService.createFlight(flight);
        return new ResponseEntity<>(createdFlight, HttpStatus.CREATED);
    }
    
    /**
     * PUT /flights/{id} - Update an existing flight
     * @param id the flight ID
     * @param flight the updated flight details
     * @return the updated flight
     */
    @PutMapping("/{id}")
    public ResponseEntity<Flight> updateFlight(@PathVariable Long id, 
                                             @Valid @RequestBody Flight flight) {
        Flight updatedFlight = flightService.updateFlight(id, flight)
                .orElseThrow(() -> new FlightNotFoundException(id));
        return ResponseEntity.ok(updatedFlight);
    }
    
    /**
     * DELETE /flights/{id} - Delete a flight
     * @param id the flight ID
     * @return no content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Long id) {
        boolean deleted = flightService.deleteFlight(id);
        if (!deleted) {
            throw new FlightNotFoundException(id);
        }
        return ResponseEntity.noContent().build();
    }
    
    /**
     * GET /flights/route/{route} - Get flights by route
     * @param route the route (e.g., "NYC-LON")
     * @return list of flights for the specified route
     */
    @GetMapping("/route/{route}")
    public ResponseEntity<List<Flight>> getFlightsByRoute(@PathVariable String route) {
        List<Flight> flights = flightService.getFlightsByRoute(route);
        return ResponseEntity.ok(flights);
    }
    
    /**
     * GET /flights/date/{date} - Get flights by date
     * @param date the flight date in yyyy-MM-dd format
     * @return list of flights for the specified date
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Flight>> getFlightsByDate(@PathVariable String date) {
        List<Flight> flights = flightService.getFlightsByDate(date);
        return ResponseEntity.ok(flights);
    }
    
    /**
     * GET /flights/{flightId}/seats - Get seat map and availability for a flight
     * @param flightId the flight ID
     * @return seat availability information
     */
    @GetMapping("/{flightId}/seats")
    public ResponseEntity<SeatAvailabilityDto> getFlightSeatAvailability(@PathVariable Long flightId) {
        SeatAvailabilityDto seatAvailability = flightService.getFlightSeatAvailability(flightId)
                .orElseThrow(() -> new FlightNotFoundException(flightId));
        return ResponseEntity.ok(seatAvailability);
    }
    
    /**
     * GET /flights/available - Get flights with available seats
     * @return list of flights that have available seats
     */
    @GetMapping("/available")
    public ResponseEntity<List<Flight>> getFlightsWithAvailableSeats() {
        List<Flight> flights = flightService.getFlightsWithAvailableSeats();
        return ResponseEntity.ok(flights);
    }
    
    /**
     * GET /flights/route/{route}/available - Get flights by route with available seats
     * @param route the route
     * @return list of flights for the route with available seats
     */
    @GetMapping("/route/{route}/available")
    public ResponseEntity<List<Flight>> getFlightsByRouteWithAvailableSeats(@PathVariable String route) {
        List<Flight> flights = flightService.getFlightsByRouteWithAvailableSeats(route);
        return ResponseEntity.ok(flights);
    }
    
    /**
     * GET /flights/date/{date}/available - Get flights by date with available seats
     * @param date the flight date in yyyy-MM-dd format
     * @return list of flights for the date with available seats
     */
    @GetMapping("/date/{date}/available")
    public ResponseEntity<List<Flight>> getFlightsByDateWithAvailableSeats(@PathVariable String date) {
        List<Flight> flights = flightService.getFlightsByDateWithAvailableSeats(date);
        return ResponseEntity.ok(flights);
    }
}
