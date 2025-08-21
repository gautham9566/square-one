package com.oracle.travel_history_service.service;

import com.oracle.travel_history_service.dto.TravelHistoryResponseDto;
import com.oracle.travel_history_service.entity.Flight;
import com.oracle.travel_history_service.entity.Passenger;
import com.oracle.travel_history_service.entity.TravelHistory;
import com.oracle.travel_history_service.repository.FlightRepository;
import com.oracle.travel_history_service.repository.PassengerRepository;
import com.oracle.travel_history_service.repository.TravelHistoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for TravelHistoryService
 */
@ExtendWith(MockitoExtension.class)
class TravelHistoryServiceTest {

    @Mock
    private TravelHistoryRepository travelHistoryRepository;

    @Mock
    private PassengerRepository passengerRepository;

    @Mock
    private FlightRepository flightRepository;

    @InjectMocks
    private TravelHistoryService travelHistoryService;

    private TravelHistory sampleTravelHistory;
    private Passenger samplePassenger;
    private Flight sampleFlight;

    @BeforeEach
    void setUp() {
        // Sample TravelHistory
        sampleTravelHistory = new TravelHistory();
        sampleTravelHistory.setHistoryId(1L);
        sampleTravelHistory.setPassengerId(1L);
        sampleTravelHistory.setFlightId(1L);
        sampleTravelHistory.setTravelDate(LocalDate.of(2024, 12, 15));
        sampleTravelHistory.setOrigin("NYC");
        sampleTravelHistory.setDestination("LON");
        sampleTravelHistory.setSeat("12A");
        sampleTravelHistory.setBookingReference("ABC123");
        sampleTravelHistory.setFareClass("Economy");
        sampleTravelHistory.setStatus("Completed");
        sampleTravelHistory.setDistanceKm(5567);
        sampleTravelHistory.setDurationMin(420);
        sampleTravelHistory.setNotes("On-time arrival");
        sampleTravelHistory.setCreatedAt(LocalDateTime.now());

        // Sample Passenger
        samplePassenger = new Passenger();
        samplePassenger.setPassengerId(1L);
        samplePassenger.setFlightId(1L);
        samplePassenger.setName("Alice Johnson");
        samplePassenger.setPhoneNumber("123-456-7890");
        samplePassenger.setOrigin("NYC");
        samplePassenger.setDestination("LON");
        samplePassenger.setSeat("12A");
        samplePassenger.setCheckedIn("Y");

        // Sample Flight
        sampleFlight = new Flight();
        sampleFlight.setFlightId(1L);
        sampleFlight.setFlightName("Flight 101");
        sampleFlight.setFlightDate(LocalDate.of(2025, 8, 20));
        sampleFlight.setRoute("NYC-LON");
        sampleFlight.setDepartureTime("08:00 AM");
        sampleFlight.setArrivalTime("04:00 PM");
        sampleFlight.setAircraftType("Boeing 747");
        sampleFlight.setTotalSeats(20);
        sampleFlight.setAvailableSeats(17);
    }

    @Test
    void testGetTravelHistoryByPassenger_Success() {
        Long passengerId = 1L;
        List<TravelHistory> travelHistoryList = Arrays.asList(sampleTravelHistory);

        when(passengerRepository.findById(passengerId)).thenReturn(Optional.of(samplePassenger));
        when(travelHistoryRepository.findByPassengerIdOrderByTravelDateDesc(passengerId))
                .thenReturn(travelHistoryList);
        when(flightRepository.findById(anyLong())).thenReturn(Optional.of(sampleFlight));

        TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByPassenger(passengerId);

        assertTrue(response.isSuccess());
        assertEquals("Travel history retrieved successfully", response.getMessage());
        assertEquals(1, response.getTotalRecords());
        assertEquals("passenger", response.getFilterType());
        assertEquals(passengerId.toString(), response.getFilterValue());
        assertNotNull(response.getTravelHistoryList());
        assertEquals(1, response.getTravelHistoryList().size());

        verify(passengerRepository, times(2)).findById(passengerId); // called twice due to convertToDto
        verify(travelHistoryRepository).findByPassengerIdOrderByTravelDateDesc(passengerId);
    }

    @Test
    void testGetTravelHistoryByPassenger_PassengerNotFound() {
        Long passengerId = 999L;
        when(passengerRepository.findById(passengerId)).thenReturn(Optional.empty());

        TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByPassenger(passengerId);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Passenger not found"));
        assertEquals(0, response.getTotalRecords());

        verify(passengerRepository).findById(passengerId);
        verify(travelHistoryRepository, never()).findByPassengerIdOrderByTravelDateDesc(any());
    }

    @Test
    void testGetTravelHistoryByBookingReference_Success() {
        String bookingReference = "ABC123";
        when(travelHistoryRepository.findByBookingReference(bookingReference))
                .thenReturn(Optional.of(sampleTravelHistory));
        when(passengerRepository.findById(anyLong())).thenReturn(Optional.of(samplePassenger));
        when(flightRepository.findById(anyLong())).thenReturn(Optional.of(sampleFlight));

        TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByBookingReference(bookingReference);

        assertTrue(response.isSuccess());
        assertEquals("Travel history retrieved successfully", response.getMessage());
        assertEquals(1, response.getTotalRecords());
        assertEquals("booking", response.getFilterType());
        assertEquals(bookingReference, response.getFilterValue());
        assertNotNull(response.getTravelHistoryList());
        assertEquals(1, response.getTravelHistoryList().size());

        verify(travelHistoryRepository).findByBookingReference(bookingReference);
    }

    @Test
    void testGetTravelHistoryByBookingReference_NotFound() {
        String bookingReference = "INVALID123";
        when(travelHistoryRepository.findByBookingReference(bookingReference))
                .thenReturn(Optional.empty());

        TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByBookingReference(bookingReference);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Travel history not found"));
        assertEquals(0, response.getTotalRecords());

        verify(travelHistoryRepository).findByBookingReference(bookingReference);
    }

    @Test
    void testGetTravelHistoryByFlight_Success() {
        Long flightId = 1L;
        List<TravelHistory> travelHistoryList = Arrays.asList(sampleTravelHistory);

        when(flightRepository.findById(flightId)).thenReturn(Optional.of(sampleFlight));
        when(travelHistoryRepository.findByFlightIdOrderByTravelDateDesc(flightId))
                .thenReturn(travelHistoryList);
        when(passengerRepository.findById(anyLong())).thenReturn(Optional.of(samplePassenger));

        TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByFlight(flightId);

        assertTrue(response.isSuccess());
        assertEquals("Travel history retrieved successfully", response.getMessage());
        assertEquals(1, response.getTotalRecords());
        assertEquals("flight", response.getFilterType());
        assertEquals(flightId.toString(), response.getFilterValue());
        assertNotNull(response.getTravelHistoryList());
        assertEquals(1, response.getTravelHistoryList().size());

        verify(flightRepository, times(2)).findById(flightId); // called twice due to convertToDto
        verify(travelHistoryRepository).findByFlightIdOrderByTravelDateDesc(flightId);
    }

    @Test
    void testGetTravelHistoryByFlight_FlightNotFound() {
        Long flightId = 999L;
        when(flightRepository.findById(flightId)).thenReturn(Optional.empty());

        TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByFlight(flightId);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Flight not found"));
        assertEquals(0, response.getTotalRecords());

        verify(flightRepository).findById(flightId);
        verify(travelHistoryRepository, never()).findByFlightIdOrderByTravelDateDesc(any());
    }

    @Test
    void testGetRecentTravelHistory_Success() {
        Long passengerId = 1L;
        List<TravelHistory> travelHistoryList = Arrays.asList(sampleTravelHistory);

        when(travelHistoryRepository.findRecentTravelHistory(eq(passengerId), any(LocalDate.class)))
                .thenReturn(travelHistoryList);
        when(passengerRepository.findById(anyLong())).thenReturn(Optional.of(samplePassenger));
        when(flightRepository.findById(anyLong())).thenReturn(Optional.of(sampleFlight));

        TravelHistoryResponseDto response = travelHistoryService.getRecentTravelHistory(passengerId);

        assertTrue(response.isSuccess());
        assertEquals("Recent travel history retrieved successfully", response.getMessage());
        assertEquals(1, response.getTotalRecords());
        assertEquals("passenger", response.getFilterType());
        assertEquals(passengerId.toString(), response.getFilterValue());

        verify(travelHistoryRepository).findRecentTravelHistory(eq(passengerId), any(LocalDate.class));
    }

    @Test
    void testGetTravelHistoryByStatus_Success() {
        Long passengerId = 1L;
        String status = "Completed";
        List<TravelHistory> travelHistoryList = Arrays.asList(sampleTravelHistory);

        when(travelHistoryRepository.findByPassengerIdAndStatusOrderByTravelDateDesc(passengerId, status))
                .thenReturn(travelHistoryList);
        when(passengerRepository.findById(anyLong())).thenReturn(Optional.of(samplePassenger));
        when(flightRepository.findById(anyLong())).thenReturn(Optional.of(sampleFlight));

        TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByStatus(passengerId, status);

        assertTrue(response.isSuccess());
        assertEquals("Travel history retrieved successfully", response.getMessage());
        assertEquals(1, response.getTotalRecords());
        assertEquals("passenger", response.getFilterType());
        assertEquals(passengerId.toString(), response.getFilterValue());
        assertEquals(status, response.getStatus());

        verify(travelHistoryRepository).findByPassengerIdAndStatusOrderByTravelDateDesc(passengerId, status);
    }

    @Test
    void testGetTravelHistoryByPassenger_ExceptionHandling() {
        Long passengerId = 1L;
        when(passengerRepository.findById(passengerId)).thenThrow(new RuntimeException("Database error"));

        TravelHistoryResponseDto response = travelHistoryService.getTravelHistoryByPassenger(passengerId);

        assertFalse(response.isSuccess());
        assertTrue(response.getMessage().contains("Error retrieving travel history"));

        verify(passengerRepository).findById(passengerId);
    }
}
