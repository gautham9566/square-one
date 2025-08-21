package com.oracle.flights.service;

import com.oracle.flights.dto.SeatAvailabilityDto;
import com.oracle.flights.entity.Flight;
import com.oracle.flights.repository.FlightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FlightServiceTest {
    
    @Mock
    private FlightRepository flightRepository;
    
    @InjectMocks
    private FlightService flightService;
    
    private Flight testFlight;
    
    @BeforeEach
    void setUp() {
        testFlight = new Flight();
        testFlight.setFlightId(1L);
        testFlight.setFlightName("Flight 101");
        testFlight.setFlightDate(LocalDate.of(2025, 8, 20));
        testFlight.setRoute("NYC-LON");
        testFlight.setDepartureTime("08:00 AM");
        testFlight.setArrivalTime("04:00 PM");
        testFlight.setAircraftType("Boeing 747");
        testFlight.setTotalSeats(20);
        testFlight.setAvailableSeats(17);
        testFlight.setSeatMapJson("[{\"number\": 1, \"isBooked\": false}, {\"number\": 2, \"isBooked\": true}]");
    }
    
    @Test
    void getAllFlights_ShouldReturnAllFlights() {
        List<Flight> expectedFlights = Arrays.asList(testFlight);
        when(flightRepository.findAllOrderByDepartureTime()).thenReturn(expectedFlights);
        
        List<Flight> actualFlights = flightService.getAllFlights();
        
        assertEquals(expectedFlights, actualFlights);
        verify(flightRepository).findAllOrderByDepartureTime();
    }
    
    @Test
    void getFlightById_ShouldReturnFlight_WhenExists() {
        when(flightRepository.findById(1L)).thenReturn(Optional.of(testFlight));
        
        Optional<Flight> result = flightService.getFlightById(1L);
        
        assertTrue(result.isPresent());
        assertEquals(testFlight, result.get());
    }
    
    @Test
    void getFlightById_ShouldReturnEmpty_WhenNotExists() {
        when(flightRepository.findById(999L)).thenReturn(Optional.empty());
        
        Optional<Flight> result = flightService.getFlightById(999L);
        
        assertFalse(result.isPresent());
    }
    
    @Test
    void createFlight_ShouldSaveAndReturnFlight() {
        when(flightRepository.save(any(Flight.class))).thenReturn(testFlight);
        
        Flight result = flightService.createFlight(testFlight);
        
        assertEquals(testFlight, result);
        verify(flightRepository).save(testFlight);
    }
    
    @Test
    void createFlight_ShouldAdjustAvailableSeats_WhenExceedsTotalSeats() {
        testFlight.setTotalSeats(10);
        testFlight.setAvailableSeats(15); // More than total
        
        when(flightRepository.save(any(Flight.class))).thenReturn(testFlight);
        
        Flight result = flightService.createFlight(testFlight);
        
        assertEquals(10, result.getAvailableSeats()); // Should be adjusted to total seats
    }
    
    @Test
    void getFlightsByRoute_ShouldReturnFlightsForRoute() {
        List<Flight> expectedFlights = Arrays.asList(testFlight);
        when(flightRepository.findByRouteOrderByDepartureTime("NYC-LON")).thenReturn(expectedFlights);
        
        List<Flight> result = flightService.getFlightsByRoute("NYC-LON");
        
        assertEquals(expectedFlights, result);
    }
    
    @Test
    void getFlightsByDate_ShouldReturnFlightsForDate() {
        List<Flight> expectedFlights = Arrays.asList(testFlight);
        when(flightRepository.findByFlightDateOrderByDepartureTime(LocalDate.of(2025, 8, 20)))
                .thenReturn(expectedFlights);
        
        List<Flight> result = flightService.getFlightsByDate("2025-08-20");
        
        assertEquals(expectedFlights, result);
    }
    
    @Test
    void getFlightSeatAvailability_ShouldReturnSeatInfo_WhenFlightExists() {
        when(flightRepository.findById(1L)).thenReturn(Optional.of(testFlight));
        
        Optional<SeatAvailabilityDto> result = flightService.getFlightSeatAvailability(1L);
        
        assertTrue(result.isPresent());
        SeatAvailabilityDto seatInfo = result.get();
        assertEquals(1L, seatInfo.getFlightId());
        assertEquals("Flight 101", seatInfo.getFlightName());
        assertEquals("NYC-LON", seatInfo.getRoute());
        assertEquals(20, seatInfo.getTotalSeats());
        assertEquals(17, seatInfo.getAvailableSeats());
        assertNotNull(seatInfo.getSeatMap());
    }
    
    @Test
    void deleteFlight_ShouldReturnTrue_WhenFlightExists() {
        when(flightRepository.existsById(1L)).thenReturn(true);
        
        boolean result = flightService.deleteFlight(1L);
        
        assertTrue(result);
        verify(flightRepository).deleteById(1L);
    }
    
    @Test
    void deleteFlight_ShouldReturnFalse_WhenFlightNotExists() {
        when(flightRepository.existsById(999L)).thenReturn(false);
        
        boolean result = flightService.deleteFlight(999L);
        
        assertFalse(result);
        verify(flightRepository, never()).deleteById(999L);
    }
}
