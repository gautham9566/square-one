package com.oracle.passengers.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oracle.passengers.dto.*;
import com.oracle.passengers.entity.Passenger;
import com.oracle.passengers.repository.PassengerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class PassengerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private ObjectMapper objectMapper;
    
    private Passenger testPassenger;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        passengerRepository.deleteAll();
        
        testPassenger = new Passenger();
        testPassenger.setFlightId(1L);
        testPassenger.setName("John Doe");
        testPassenger.setPhoneNumber("123-456-7890");
        testPassenger.setAddress("123 Main St");
        testPassenger.setPassportNumber("P123456");
        testPassenger.setDateOfBirth(LocalDate.of(1990, 1, 1));
        testPassenger.setOrigin("NYC");
        testPassenger.setDestination("LON");
        testPassenger.setServices(List.of("Meal"));
        testPassenger.setMealType("Veg");
        testPassenger.setMealName("Pasta");
        testPassenger.setSeat("12A");
        testPassenger.setCheckedIn(false);
        testPassenger.setWheelchair(false);
        testPassenger.setInfant(false);
        
        testPassenger = passengerRepository.save(testPassenger);
    }
    
    @Test
    void getAllPassengers_ShouldReturnAllPassengers() throws Exception {
        mockMvc.perform(get("/passengers"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("John Doe")))
                .andExpect(jsonPath("$[0].flightId", is(1)));
    }
    
    @Test
    void getPassengerById_ShouldReturnSpecificPassenger() throws Exception {
        mockMvc.perform(get("/passengers/" + testPassenger.getPassengerId()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.passengerId", is(testPassenger.getPassengerId().intValue())))
                .andExpect(jsonPath("$.name", is("John Doe")))
                .andExpect(jsonPath("$.flightId", is(1)));
    }
    
    @Test
    void getPassengerById_WhenNotFound_ShouldReturn404() throws Exception {
        mockMvc.perform(get("/passengers/999"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")));
    }
    
    @Test
    void createPassenger_WithValidData_ShouldCreatePassenger() throws Exception {
        PassengerCreateDto createDto = new PassengerCreateDto(2L, "Jane Smith", "LON", "NYC");
        createDto.setPhoneNumber("987-654-3210");
        createDto.setAddress("456 Oak St");
        createDto.setPassportNumber("P654321");
        createDto.setDateOfBirth(LocalDate.of(1985, 5, 15));
        createDto.setServices(List.of("Shopping"));
        createDto.setSeat("14B");
        
        mockMvc.perform(post("/passengers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Jane Smith")))
                .andExpect(jsonPath("$.flightId", is(2)))
                .andExpect(jsonPath("$.seat", is("14B")))
                .andExpect(jsonPath("$.checkedIn", is(false)));
    }
    
    @Test
    void createPassenger_WithInvalidData_ShouldReturn400() throws Exception {
        PassengerCreateDto invalidDto = new PassengerCreateDto();
        // Missing required fields
        
        mockMvc.perform(post("/passengers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.error", is("Validation Failed")));
    }
    
    @Test
    void updatePassenger_WithValidData_ShouldUpdatePassenger() throws Exception {
        PassengerUpdateDto updateDto = new PassengerUpdateDto();
        updateDto.setName("John Smith");
        updateDto.setPhoneNumber("555-123-4567");
        updateDto.setAddress("789 Pine St");
        
        mockMvc.perform(put("/passengers/" + testPassenger.getPassengerId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("John Smith")))
                .andExpect(jsonPath("$.phoneNumber", is("555-123-4567")))
                .andExpect(jsonPath("$.address", is("789 Pine St")));
    }
    
    @Test
    void deletePassenger_ShouldRemovePassenger() throws Exception {
        mockMvc.perform(delete("/passengers/" + testPassenger.getPassengerId()))
                .andExpect(status().isNoContent());
        
        // Verify passenger was deleted
        mockMvc.perform(get("/passengers/" + testPassenger.getPassengerId()))
                .andExpect(status().isNotFound());
    }
    
    @Test
    void getPassengersByFlight_ShouldReturnFlightPassengers() throws Exception {
        mockMvc.perform(get("/passengers/flight/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].flightId", is(1)))
                .andExpect(jsonPath("$[0].name", is("John Doe")));
    }
    
    @Test
    void checkInPassenger_ShouldCheckInPassenger() throws Exception {
        CheckInDto checkInDto = new CheckInDto("12A", false, false, null);
        
        mockMvc.perform(post("/passengers/checkin/" + testPassenger.getPassengerId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(checkInDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.checkedIn", is(true)))
                .andExpect(jsonPath("$.seat", is("12A")));
    }
    
    @Test
    void checkInPassenger_WhenAlreadyCheckedIn_ShouldReturn409() throws Exception {
        // First check-in
        testPassenger.setCheckedIn(true);
        passengerRepository.save(testPassenger);
        
        CheckInDto checkInDto = new CheckInDto("12A", false, false, null);
        
        mockMvc.perform(post("/passengers/checkin/" + testPassenger.getPassengerId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(checkInDto)))
                .andExpect(status().isConflict())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("Conflict")));
    }
    
    @Test
    void assignSeat_WithValidSeat_ShouldAssignSeat() throws Exception {
        SeatAssignmentDto seatDto = new SeatAssignmentDto(testPassenger.getPassengerId(), "15C");
        
        mockMvc.perform(put("/passengers/seat/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(seatDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.seat", is("15C")));
    }
    
    @Test
    void assignSeat_WithOccupiedSeat_ShouldReturn409() throws Exception {
        // Create another passenger with the same seat
        Passenger anotherPassenger = new Passenger();
        anotherPassenger.setFlightId(1L);
        anotherPassenger.setName("Jane Doe");
        anotherPassenger.setOrigin("NYC");
        anotherPassenger.setDestination("LON");
        anotherPassenger.setSeat("15C");
        passengerRepository.save(anotherPassenger);
        
        SeatAssignmentDto seatDto = new SeatAssignmentDto(testPassenger.getPassengerId(), "15C");
        
        mockMvc.perform(put("/passengers/seat/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(seatDto)))
                .andExpect(status().isConflict())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("Conflict")));
    }
    
    @Test
    void searchPassengers_ShouldReturnMatchingPassengers() throws Exception {
        mockMvc.perform(get("/passengers/search")
                .param("name", "John"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", containsString("John")));
    }
    
    @Test
    void getCheckedInPassengers_ShouldReturnOnlyCheckedInPassengers() throws Exception {
        // Check in the test passenger
        testPassenger.setCheckedIn(true);
        passengerRepository.save(testPassenger);
        
        // Create another passenger who is not checked in
        Passenger notCheckedIn = new Passenger();
        notCheckedIn.setFlightId(1L);
        notCheckedIn.setName("Jane Doe");
        notCheckedIn.setOrigin("NYC");
        notCheckedIn.setDestination("LON");
        notCheckedIn.setCheckedIn(false);
        passengerRepository.save(notCheckedIn);
        
        mockMvc.perform(get("/passengers/flight/1/checkedin"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].checkedIn", is(true)))
                .andExpect(jsonPath("$[0].name", is("John Doe")));
    }
}
