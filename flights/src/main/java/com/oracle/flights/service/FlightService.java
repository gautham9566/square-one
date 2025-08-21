package com.oracle.flights.service;

import com.oracle.flights.dto.SeatAvailabilityDto;
import com.oracle.flights.dto.SeatDto;
import com.oracle.flights.entity.Flight;
import com.oracle.flights.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * Service layer for Flight operations
 */
@Service
@Transactional
public class FlightService {
    
    private final FlightRepository flightRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    @Autowired
    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }
    
    /**
     * Get all flights
     * @return list of all flights
     */
    @Transactional(readOnly = true)
    public List<Flight> getAllFlights() {
        return flightRepository.findAllOrderByDepartureTime();
    }
    
    /**
     * Get flight by ID
     * @param flightId the flight ID
     * @return flight if found
     */
    @Transactional(readOnly = true)
    public Optional<Flight> getFlightById(Long flightId) {
        return flightRepository.findById(flightId);
    }
    
    /**
     * Create a new flight
     * @param flight the flight to create
     * @return the created flight
     */
    public Flight createFlight(Flight flight) {
        // Ensure available seats doesn't exceed total seats
        if (flight.getAvailableSeats() > flight.getTotalSeats()) {
            flight.setAvailableSeats(flight.getTotalSeats());
        }
        return flightRepository.save(flight);
    }
    
    /**
     * Update an existing flight
     * @param flightId the flight ID
     * @param flightDetails the updated flight details
     * @return the updated flight
     */
    public Optional<Flight> updateFlight(Long flightId, Flight flightDetails) {
        return flightRepository.findById(flightId)
                .map(existingFlight -> {
                    existingFlight.setFlightName(flightDetails.getFlightName());
                    existingFlight.setFlightDate(flightDetails.getFlightDate());
                    existingFlight.setRoute(flightDetails.getRoute());
                    existingFlight.setDepartureTime(flightDetails.getDepartureTime());
                    existingFlight.setArrivalTime(flightDetails.getArrivalTime());
                    existingFlight.setAircraftType(flightDetails.getAircraftType());
                    existingFlight.setTotalSeats(flightDetails.getTotalSeats());
                    existingFlight.setAvailableSeats(flightDetails.getAvailableSeats());
                    existingFlight.setServicesJson(flightDetails.getServicesJson());
                    existingFlight.setServiceSubtypesJson(flightDetails.getServiceSubtypesJson());
                    existingFlight.setSeatMapJson(flightDetails.getSeatMapJson());
                    
                    // Ensure available seats doesn't exceed total seats
                    if (existingFlight.getAvailableSeats() > existingFlight.getTotalSeats()) {
                        existingFlight.setAvailableSeats(existingFlight.getTotalSeats());
                    }
                    
                    return flightRepository.save(existingFlight);
                });
    }
    
    /**
     * Delete a flight
     * @param flightId the flight ID
     * @return true if deleted, false if not found
     */
    public boolean deleteFlight(Long flightId) {
        if (flightRepository.existsById(flightId)) {
            flightRepository.deleteById(flightId);
            return true;
        }
        return false;
    }
    
    /**
     * Get flights by route
     * @param route the route (e.g., "NYC-LON")
     * @return list of flights for the specified route
     */
    @Transactional(readOnly = true)
    public List<Flight> getFlightsByRoute(String route) {
        return flightRepository.findByRouteOrderByDepartureTime(route);
    }
    
    /**
     * Get flights by date
     * @param date the flight date in yyyy-MM-dd format
     * @return list of flights for the specified date
     */
    @Transactional(readOnly = true)
    public List<Flight> getFlightsByDate(String date) {
        LocalDate flightDate = LocalDate.parse(date, DATE_FORMATTER);
        return flightRepository.findByFlightDateOrderByDepartureTime(flightDate);
    }
    
    /**
     * Get seat availability for a specific flight
     * @param flightId the flight ID
     * @return seat availability information
     */
    @Transactional(readOnly = true)
    public Optional<SeatAvailabilityDto> getFlightSeatAvailability(Long flightId) {
        return flightRepository.findById(flightId)
                .map(flight -> {
                    List<SeatDto> seatMap = flight.getSeatMap();
                    return new SeatAvailabilityDto(
                            flight.getFlightId(),
                            flight.getFlightName(),
                            flight.getRoute(),
                            flight.getFlightDate().format(DATE_FORMATTER),
                            flight.getTotalSeats(),
                            flight.getAvailableSeats(),
                            seatMap
                    );
                });
    }
    
    /**
     * Get flights with available seats
     * @return list of flights that have available seats
     */
    @Transactional(readOnly = true)
    public List<Flight> getFlightsWithAvailableSeats() {
        return flightRepository.findFlightsWithAvailableSeats();
    }
    
    /**
     * Get flights by route with available seats
     * @param route the route
     * @return list of flights for the route with available seats
     */
    @Transactional(readOnly = true)
    public List<Flight> getFlightsByRouteWithAvailableSeats(String route) {
        return flightRepository.findByRouteWithAvailableSeats(route);
    }
    
    /**
     * Get flights by date with available seats
     * @param date the flight date in yyyy-MM-dd format
     * @return list of flights for the date with available seats
     */
    @Transactional(readOnly = true)
    public List<Flight> getFlightsByDateWithAvailableSeats(String date) {
        LocalDate flightDate = LocalDate.parse(date, DATE_FORMATTER);
        return flightRepository.findByFlightDateWithAvailableSeats(flightDate);
    }
}
