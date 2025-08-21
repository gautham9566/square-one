package com.oracle.flights.entity;

import com.oracle.flights.dto.SeatDto;
import com.oracle.flights.dto.ServiceSubtypesDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Flight entity
 */
class FlightTest {
    
    private Flight flight;
    
    @BeforeEach
    void setUp() {
        flight = new Flight();
        flight.setFlightId(1L);
        flight.setFlightName("Flight 101");
        flight.setFlightDate(LocalDate.of(2025, 8, 20));
        flight.setRoute("NYC-LON");
        flight.setDepartureTime("08:00 AM");
        flight.setArrivalTime("04:00 PM");
        flight.setAircraftType("Boeing 747");
        flight.setTotalSeats(20);
        flight.setAvailableSeats(17);
    }
    
    @Test
    void testFlightCreation() {
        assertNotNull(flight);
        assertEquals(1L, flight.getFlightId());
        assertEquals("Flight 101", flight.getFlightName());
        assertEquals("NYC-LON", flight.getRoute());
        assertEquals(20, flight.getTotalSeats());
        assertEquals(17, flight.getAvailableSeats());
    }
    
    @Test
    void testServicesJsonConversion() {
        List<String> services = Arrays.asList("Ancillary", "Meal", "Shopping");
        flight.setServices(services);
        
        assertNotNull(flight.getServicesJson());
        List<String> retrievedServices = flight.getServices();
        assertEquals(3, retrievedServices.size());
        assertTrue(retrievedServices.contains("Ancillary"));
        assertTrue(retrievedServices.contains("Meal"));
        assertTrue(retrievedServices.contains("Shopping"));
    }
    
    @Test
    void testSeatMapJsonConversion() {
        List<SeatDto> seatMap = Arrays.asList(
                new SeatDto(1, false),
                new SeatDto(2, true),
                new SeatDto(3, false)
        );
        flight.setSeatMap(seatMap);
        
        assertNotNull(flight.getSeatMapJson());
        List<SeatDto> retrievedSeatMap = flight.getSeatMap();
        assertEquals(3, retrievedSeatMap.size());
        assertEquals(1, retrievedSeatMap.get(0).getNumber());
        assertFalse(retrievedSeatMap.get(0).getIsBooked());
        assertTrue(retrievedSeatMap.get(1).getIsBooked());
    }
    
    @Test
    void testServiceSubtypesJsonConversion() {
        ServiceSubtypesDto serviceSubtypes = new ServiceSubtypesDto();
        serviceSubtypes.setAncillary(Arrays.asList("Extra Baggage 5kg", "Priority Boarding"));
        serviceSubtypes.setMeal(Arrays.asList("Veg", "Non-Veg"));
        serviceSubtypes.setShopping(Arrays.asList("Magazine", "Perfume"));
        
        flight.setServiceSubtypes(serviceSubtypes);
        
        assertNotNull(flight.getServiceSubtypesJson());
        ServiceSubtypesDto retrieved = flight.getServiceSubtypes();
        assertNotNull(retrieved.getAncillary());
        assertEquals(2, retrieved.getAncillary().size());
        assertTrue(retrieved.getAncillary().contains("Extra Baggage 5kg"));
    }
    
    @Test
    void testEmptyJsonHandling() {
        flight.setServicesJson("");
        flight.setSeatMapJson("");
        flight.setServiceSubtypesJson("");
        
        assertTrue(flight.getServices().isEmpty());
        assertTrue(flight.getSeatMap().isEmpty());
        assertNotNull(flight.getServiceSubtypes());
    }
    
    @Test
    void testNullJsonHandling() {
        flight.setServicesJson(null);
        flight.setSeatMapJson(null);
        flight.setServiceSubtypesJson(null);
        
        assertTrue(flight.getServices().isEmpty());
        assertTrue(flight.getSeatMap().isEmpty());
        assertNotNull(flight.getServiceSubtypes());
    }
}
