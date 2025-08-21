package com.oracle.flights.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oracle.flights.entity.Flight;
import com.oracle.flights.repository.FlightRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@ActiveProfiles("test")
@Transactional
class FlightIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private FlightRepository flightRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private Flight testFlight;
    
    @BeforeEach
    void setUp() {
        flightRepository.deleteAll();
        
        testFlight = new Flight();
        testFlight.setFlightName("Flight 101");
        testFlight.setFlightDate(LocalDate.of(2025, 8, 20));
        testFlight.setRoute("NYC-LON");
        testFlight.setDepartureTime("08:00 AM");
        testFlight.setArrivalTime("04:00 PM");
        testFlight.setAircraftType("Boeing 747");
        testFlight.setTotalSeats(20);
        testFlight.setAvailableSeats(17);
        testFlight.setServicesJson("[\"Ancillary\", \"Meal\", \"Shopping\"]");
        testFlight.setSeatMapJson("[{\"number\": 1, \"isBooked\": false}, {\"number\": 2, \"isBooked\": true}]");
        
        testFlight = flightRepository.save(testFlight);
    }
    
    @Test
    void getAllFlights_ShouldReturnAllFlights() throws Exception {
        mockMvc.perform(get("/flights"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].flightName").value("Flight 101"));
    }
    
    @Test
    void getFlightsByRoute_ShouldReturnCorrectFlights() throws Exception {
        mockMvc.perform(get("/flights/route/NYC-LON"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].route").value("NYC-LON"));
    }
    
    @Test
    void getFlightsByDate_ShouldReturnCorrectFlights() throws Exception {
        mockMvc.perform(get("/flights/date/2025-08-20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].flightDate").value("2025-08-20"));
    }
    
    @Test
    void getFlightSeatAvailability_ShouldReturnSeatMap() throws Exception {
        mockMvc.perform(get("/flights/" + testFlight.getFlightId() + "/seats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.flightId").value(testFlight.getFlightId()))
                .andExpect(jsonPath("$.seatMap").isArray());
    }
    
    @Test
    void createFlight_ShouldPersistFlight() throws Exception {
        Flight newFlight = new Flight();
        newFlight.setFlightName("Flight 202");
        newFlight.setFlightDate(LocalDate.of(2025, 8, 21));
        newFlight.setRoute("PAR-TOK");
        newFlight.setDepartureTime("09:00 AM");
        newFlight.setArrivalTime("11:00 PM");
        newFlight.setAircraftType("Airbus A380");
        newFlight.setTotalSeats(30);
        newFlight.setAvailableSeats(28);
        
        mockMvc.perform(post("/flights")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newFlight)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.flightName").value("Flight 202"))
                .andExpect(jsonPath("$.route").value("PAR-TOK"));
    }
}
