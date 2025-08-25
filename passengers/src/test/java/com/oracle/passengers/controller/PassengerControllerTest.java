package com.oracle.passengers.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oracle.passengers.dto.*;
import com.oracle.passengers.exception.PassengerNotFoundException;
import com.oracle.passengers.exception.SeatNotAvailableException;
import com.oracle.passengers.service.PassengerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PassengerController.class)
class PassengerControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private PassengerService passengerService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private PassengerDto testPassenger;
    private PassengerCreateDto testCreateDto;
    private PassengerUpdateDto testUpdateDto;
    private CheckInDto testCheckInDto;
    private SeatAssignmentDto testSeatAssignmentDto;
    
    @BeforeEach
    void setUp() {
        testPassenger = new PassengerDto(
                1L, 1L, "John Doe", "123-456-7890", "123 Main St",
                "P123456", LocalDate.of(1990, 1, 1), "NYC", "LON",
                List.of("Meal"), "Veg", "Pasta", 0, List.of(),
                "12A", true, false, false,
                LocalDateTime.now(), LocalDateTime.now()
        );
        
        testCreateDto = new PassengerCreateDto(1L, "John Doe", "NYC", "LON");
        testCreateDto.setPhoneNumber("123-456-7890");
        testCreateDto.setAddress("123 Main St");
        testCreateDto.setPassportNumber("P123456");
        testCreateDto.setDateOfBirth(LocalDate.of(1990, 1, 1));
        testCreateDto.setServices(List.of("Meal"));
        testCreateDto.setMealType("Veg");
        testCreateDto.setMealName("Pasta");
        testCreateDto.setSeat("1");

        testUpdateDto = new PassengerUpdateDto();
        testUpdateDto.setName("John Smith");
        testUpdateDto.setPhoneNumber("987-654-3210");

        testCheckInDto = new CheckInDto("1", false, false, null);

        testSeatAssignmentDto = new SeatAssignmentDto(1L, "2");
    }
    
    @Test
    void getAllPassengers_ShouldReturnPassengerList() throws Exception {
        List<PassengerDto> passengers = Arrays.asList(testPassenger);
        when(passengerService.getAllPassengers()).thenReturn(passengers);
        
        mockMvc.perform(get("/passengers"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].passengerId").value(1))
                .andExpect(jsonPath("$[0].name").value("John Doe"));
        
        verify(passengerService).getAllPassengers();
    }
    
    @Test
    void getPassengerById_ShouldReturnPassenger() throws Exception {
        when(passengerService.getPassengerById(1L)).thenReturn(testPassenger);
        
        mockMvc.perform(get("/passengers/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.passengerId").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"));
        
        verify(passengerService).getPassengerById(1L);
    }
    
    @Test
    void getPassengerById_WhenNotFound_ShouldReturn404() throws Exception {
        when(passengerService.getPassengerById(999L))
                .thenThrow(new PassengerNotFoundException(999L));
        
        mockMvc.perform(get("/passengers/999"))
                .andExpect(status().isNotFound());
        
        verify(passengerService).getPassengerById(999L);
    }
    
    @Test
    void createPassenger_ShouldReturnCreatedPassenger() throws Exception {
        when(passengerService.createPassenger(any(PassengerCreateDto.class)))
                .thenReturn(testPassenger);
        
        mockMvc.perform(post("/passengers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testCreateDto)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.passengerId").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"));
        
        verify(passengerService).createPassenger(any(PassengerCreateDto.class));
    }
    
    @Test
    void createPassenger_WithInvalidData_ShouldReturn400() throws Exception {
        PassengerCreateDto invalidDto = new PassengerCreateDto();
        // Missing required fields
        
        mockMvc.perform(post("/passengers")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }
    
    @Test
    void updatePassenger_ShouldReturnUpdatedPassenger() throws Exception {
        when(passengerService.updatePassenger(eq(1L), any(PassengerUpdateDto.class)))
                .thenReturn(testPassenger);
        
        mockMvc.perform(put("/passengers/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUpdateDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.passengerId").value(1));
        
        verify(passengerService).updatePassenger(eq(1L), any(PassengerUpdateDto.class));
    }
    
    @Test
    void deletePassenger_ShouldReturnNoContent() throws Exception {
        doNothing().when(passengerService).deletePassenger(1L);
        
        mockMvc.perform(delete("/passengers/1"))
                .andExpect(status().isNoContent());
        
        verify(passengerService).deletePassenger(1L);
    }
    
    @Test
    void getPassengersByFlight_ShouldReturnPassengerList() throws Exception {
        List<PassengerDto> passengers = Arrays.asList(testPassenger);
        when(passengerService.getPassengersByFlightId(1L)).thenReturn(passengers);
        
        mockMvc.perform(get("/passengers/flight/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].flightId").value(1));
        
        verify(passengerService).getPassengersByFlightId(1L);
    }
    
    @Test
    void checkInPassenger_ShouldReturnCheckedInPassenger() throws Exception {
        when(passengerService.checkInPassenger(eq(1L), any(CheckInDto.class)))
                .thenReturn(testPassenger);
        
        mockMvc.perform(post("/passengers/checkin/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testCheckInDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.passengerId").value(1))
                .andExpect(jsonPath("$.checkedIn").value(true));
        
        verify(passengerService).checkInPassenger(eq(1L), any(CheckInDto.class));
    }
    
    @Test
    void assignSeat_ShouldReturnUpdatedPassenger() throws Exception {
        when(passengerService.assignSeat(eq(1L), any(SeatAssignmentDto.class)))
                .thenReturn(testPassenger);
        
        mockMvc.perform(put("/passengers/seat/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSeatAssignmentDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.passengerId").value(1));
        
        verify(passengerService).assignSeat(eq(1L), any(SeatAssignmentDto.class));
    }
    
    @Test
    void assignSeat_WhenSeatNotAvailable_ShouldReturn409() throws Exception {
        when(passengerService.assignSeat(eq(1L), any(SeatAssignmentDto.class)))
                .thenThrow(new SeatNotAvailableException(1L, "12B"));
        
        mockMvc.perform(put("/passengers/seat/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testSeatAssignmentDto)))
                .andExpect(status().isConflict());
        
        verify(passengerService).assignSeat(eq(1L), any(SeatAssignmentDto.class));
    }
    
    @Test
    void searchPassengers_ShouldReturnMatchingPassengers() throws Exception {
        List<PassengerDto> passengers = Arrays.asList(testPassenger);
        when(passengerService.searchPassengersByName("John")).thenReturn(passengers);
        
        mockMvc.perform(get("/passengers/search")
                .param("name", "John"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("John Doe"));
        
        verify(passengerService).searchPassengersByName("John");
    }
}
