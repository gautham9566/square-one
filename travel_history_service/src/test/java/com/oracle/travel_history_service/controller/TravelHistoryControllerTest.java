package com.oracle.travel_history_service.controller;

import com.oracle.travel_history_service.dto.TravelHistoryDto;
import com.oracle.travel_history_service.dto.TravelHistoryResponseDto;
import com.oracle.travel_history_service.service.TravelHistoryService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.containsString;

/**
 * Integration tests for TravelHistoryController
 */
@WebMvcTest(TravelHistoryController.class)
class TravelHistoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TravelHistoryService travelHistoryService;

    private TravelHistoryDto sampleTravelHistoryDto;
    private TravelHistoryResponseDto successResponse;
    private TravelHistoryResponseDto notFoundResponse;

    @BeforeEach
    void setUp() {
        // Create sample DTO
        sampleTravelHistoryDto = new TravelHistoryDto();
        sampleTravelHistoryDto.setHistoryId(1L);
        sampleTravelHistoryDto.setPassengerId(1L);
        sampleTravelHistoryDto.setFlightId(1L);
        sampleTravelHistoryDto.setTravelDate(LocalDate.of(2024, 12, 15));
        sampleTravelHistoryDto.setOrigin("NYC");
        sampleTravelHistoryDto.setDestination("LON");
        sampleTravelHistoryDto.setSeat("12A");
        sampleTravelHistoryDto.setBookingReference("ABC123");
        sampleTravelHistoryDto.setFareClass("Economy");
        sampleTravelHistoryDto.setStatus("Completed");

        // Create sample responses
        List<TravelHistoryDto> travelHistoryList = Arrays.asList(sampleTravelHistoryDto);
        successResponse = TravelHistoryResponseDto.success("Travel history retrieved successfully", 
                travelHistoryList, "passenger", "1");

        notFoundResponse = TravelHistoryResponseDto.notFound("Passenger not found with ID: 999");
    }

    @Test
    void testGetTravelHistoryByPassenger_Success() throws Exception {
        when(travelHistoryService.getTravelHistoryByPassenger(1L)).thenReturn(successResponse);

        mockMvc.perform(get("/history/passenger/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Travel history retrieved successfully"))
                .andExpect(jsonPath("$.totalRecords").value(1))
                .andExpect(jsonPath("$.filterType").value("passenger"))
                .andExpect(jsonPath("$.filterValue").value("1"))
                .andExpect(jsonPath("$.travelHistory").isArray())
                .andExpect(jsonPath("$.travelHistory[0].historyId").value(1))
                .andExpect(jsonPath("$.travelHistory[0].passengerId").value(1))
                .andExpect(jsonPath("$.travelHistory[0].flightId").value(1))
                .andExpect(jsonPath("$.travelHistory[0].origin").value("NYC"))
                .andExpect(jsonPath("$.travelHistory[0].destination").value("LON"))
                .andExpect(jsonPath("$.travelHistory[0].bookingReference").value("ABC123"))
                .andExpect(jsonPath("$.travelHistory[0].status").value("Completed"));
    }

    @Test
    void testGetTravelHistoryByPassenger_NotFound() throws Exception {
        when(travelHistoryService.getTravelHistoryByPassenger(999L)).thenReturn(notFoundResponse);

        mockMvc.perform(get("/history/passenger/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Passenger not found with ID: 999"))
                .andExpect(jsonPath("$.totalRecords").value(0));
    }

    @Test
    void testGetTravelHistoryByPassenger_InvalidId() throws Exception {
        mockMvc.perform(get("/history/passenger/invalid")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(containsString("Invalid parameter"))); // ✅ fixed
    }

    @Test
    void testGetTravelHistoryByBookingReference_Success() throws Exception {
        TravelHistoryResponseDto bookingResponse = TravelHistoryResponseDto.success(
                "Travel history retrieved successfully", 
                Arrays.asList(sampleTravelHistoryDto), 
                "booking", 
                "ABC123");
        when(travelHistoryService.getTravelHistoryByBookingReference("ABC123")).thenReturn(bookingResponse);

        mockMvc.perform(get("/history/booking/ABC123")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Travel history retrieved successfully"))
                .andExpect(jsonPath("$.totalRecords").value(1))
                .andExpect(jsonPath("$.filterType").value("booking"))
                .andExpect(jsonPath("$.filterValue").value("ABC123"))
                .andExpect(jsonPath("$.travelHistory[0].bookingReference").value("ABC123"));
    }

    @Test
    void testGetTravelHistoryByBookingReference_NotFound() throws Exception {
        TravelHistoryResponseDto notFoundBookingResponse = TravelHistoryResponseDto.notFound(
                "Travel history not found for booking reference: INVALID123");
        when(travelHistoryService.getTravelHistoryByBookingReference("INVALID123"))
                .thenReturn(notFoundBookingResponse);

        mockMvc.perform(get("/history/booking/INVALID123")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(containsString("Travel history not found"))); // ✅ fixed
    }

    @Test
    void testGetTravelHistoryByFlight_Success() throws Exception {
        TravelHistoryResponseDto flightResponse = TravelHistoryResponseDto.success(
                "Travel history retrieved successfully", 
                Arrays.asList(sampleTravelHistoryDto), 
                "flight", 
                "1");
        when(travelHistoryService.getTravelHistoryByFlight(1L)).thenReturn(flightResponse);

        mockMvc.perform(get("/history/flight/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Travel history retrieved successfully"))
                .andExpect(jsonPath("$.totalRecords").value(1))
                .andExpect(jsonPath("$.filterType").value("flight"))
                .andExpect(jsonPath("$.filterValue").value("1"))
                .andExpect(jsonPath("$.travelHistory[0].flightId").value(1));
    }

    @Test
    void testGetRecentTravelHistory_Success() throws Exception {
        TravelHistoryResponseDto recentResponse = TravelHistoryResponseDto.success(
                "Recent travel history retrieved successfully", 
                Arrays.asList(sampleTravelHistoryDto), 
                "passenger", 
                "1");
        when(travelHistoryService.getRecentTravelHistory(1L)).thenReturn(recentResponse);

        mockMvc.perform(get("/history/passenger/1/recent")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Recent travel history retrieved successfully"))
                .andExpect(jsonPath("$.totalRecords").value(1));
    }

    @Test
    void testGetTravelHistoryByStatus_Success() throws Exception {
        TravelHistoryResponseDto statusResponse = TravelHistoryResponseDto.success(
                "Travel history retrieved successfully", 
                Arrays.asList(sampleTravelHistoryDto), 
                "passenger", 
                "1");
        statusResponse.setStatus("Completed");
        when(travelHistoryService.getTravelHistoryByStatus(1L, "Completed")).thenReturn(statusResponse);

        mockMvc.perform(get("/history/passenger/1/status/Completed")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Travel history retrieved successfully"))
                .andExpect(jsonPath("$.totalRecords").value(1))
                .andExpect(jsonPath("$.status").value("Completed"));
    }

    @Test
    void testHealthCheck() throws Exception {
        mockMvc.perform(get("/history/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("Travel History Service is running"));
    }

    @Test
    void testGetApiInfo() throws Exception {
        mockMvc.perform(get("/history/info"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.service").value("Travel History Service"))
                .andExpect(jsonPath("$.version").value("1.0.0"))
                .andExpect(jsonPath("$.description").value("Manage passenger travel records and booking history"))
                .andExpect(jsonPath("$.endpoints").isArray());
    }

    @Test
    void testGetTravelHistoryByPassenger_InternalServerError() throws Exception {
        TravelHistoryResponseDto errorResponse = TravelHistoryResponseDto.error("Database connection failed");
        when(travelHistoryService.getTravelHistoryByPassenger(anyLong())).thenReturn(errorResponse);

        mockMvc.perform(get("/history/passenger/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Database connection failed"));
    }

    @Test
    void testGetTravelHistoryByPassenger_ServiceException() throws Exception {
        when(travelHistoryService.getTravelHistoryByPassenger(anyLong()))
                .thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get("/history/passenger/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(containsString("Internal server error"))); // ✅ fixed
    }
}
