package com.oracle.flights.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oracle.flights.dto.SeatAvailabilityDto;
import com.oracle.flights.dto.SeatDto;
import com.oracle.flights.entity.Flight;
import com.oracle.flights.exception.FlightNotFoundException;
import com.oracle.flights.service.FlightService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FlightController.class)
class FlightControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private FlightService flightService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private Flight testFlight;
    private SeatAvailabilityDto testSeatAvailability;
    
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
        testFlight.setServicesJson("[\"Ancillary\", \"Meal\", \"Shopping\"]");
        
        List<SeatDto> seatMap = Arrays.asList(
                new SeatDto(1, false),
                new SeatDto(2, false),
                new SeatDto(3, true)
        );
        
        testSeatAvailability = new SeatAvailabilityDto(
                1L, "Flight 101", "NYC-LON", "2025-08-20", 20, 17, seatMap
        );
    }
    
    @Test
    void getAllFlights_ShouldReturnFlightsList() throws Exception {
        List<Flight> flights = Arrays.asList(testFlight);
        when(flightService.getAllFlights()).thenReturn(flights);
        
        mockMvc.perform(get("/flights"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].flightId").value(1))
                .andExpect(jsonPath("$[0].flightName").value("Flight 101"))
                .andExpect(jsonPath("$[0].route").value("NYC-LON"));
    }
    
    @Test
    void getFlightById_ShouldReturnFlight_WhenFlightExists() throws Exception {
        when(flightService.getFlightById(1L)).thenReturn(Optional.of(testFlight));
        
        mockMvc.perform(get("/flights/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.flightId").value(1))
                .andExpect(jsonPath("$.flightName").value("Flight 101"));
    }
    
    @Test
    void getFlightById_ShouldReturn404_WhenFlightNotFound() throws Exception {
        when(flightService.getFlightById(999L)).thenReturn(Optional.empty());
        
        mockMvc.perform(get("/flights/999"))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void createFlight_ShouldReturnCreatedFlight() throws Exception {
        when(flightService.createFlight(any(Flight.class))).thenReturn(testFlight);
        
        mockMvc.perform(post("/flights")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testFlight)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.flightName").value("Flight 101"));
    }
    
    @Test
    void updateFlight_ShouldReturnUpdatedFlight() throws Exception {
        when(flightService.updateFlight(eq(1L), any(Flight.class))).thenReturn(Optional.of(testFlight));
        
        mockMvc.perform(put("/flights/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testFlight)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flightName").value("Flight 101"));
    }
    
    @Test
    void deleteFlight_ShouldReturnNoContent_WhenFlightExists() throws Exception {
        when(flightService.deleteFlight(1L)).thenReturn(true);
        
        mockMvc.perform(delete("/flights/1"))
                .andExpect(status().isNoContent());
    }
    
    @Test
    void getFlightsByRoute_ShouldReturnFlightsList() throws Exception {
        List<Flight> flights = Arrays.asList(testFlight);
        when(flightService.getFlightsByRoute("NYC-LON")).thenReturn(flights);
        
        mockMvc.perform(get("/flights/route/NYC-LON"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].route").value("NYC-LON"));
    }
    
    @Test
    void getFlightsByDate_ShouldReturnFlightsList() throws Exception {
        List<Flight> flights = Arrays.asList(testFlight);
        when(flightService.getFlightsByDate("2025-08-20")).thenReturn(flights);
        
        mockMvc.perform(get("/flights/date/2025-08-20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].flightDate").value("2025-08-20"));
    }
    
    @Test
    void getFlightSeatAvailability_ShouldReturnSeatInfo() throws Exception {
        when(flightService.getFlightSeatAvailability(1L)).thenReturn(Optional.of(testSeatAvailability));
        
        mockMvc.perform(get("/flights/1/seats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flightId").value(1))
                .andExpect(jsonPath("$.totalSeats").value(20))
                .andExpect(jsonPath("$.availableSeats").value(17))
                .andExpect(jsonPath("$.seatMap").isArray());
    }
}
