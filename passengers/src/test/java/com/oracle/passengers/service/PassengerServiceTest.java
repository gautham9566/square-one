package com.oracle.passengers.service;

import com.oracle.passengers.dto.*;
import com.oracle.passengers.entity.Passenger;
import com.oracle.passengers.exception.PassengerAlreadyCheckedInException;
import com.oracle.passengers.exception.PassengerNotFoundException;
import com.oracle.passengers.exception.SeatNotAvailableException;
import com.oracle.passengers.repository.PassengerRepository;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PassengerServiceTest {
    
    @Mock
    private PassengerRepository passengerRepository;
    
    @InjectMocks
    private PassengerService passengerService;
    
    private Passenger testPassenger;
    private PassengerCreateDto testCreateDto;
    private PassengerUpdateDto testUpdateDto;
    private CheckInDto testCheckInDto;
    private SeatAssignmentDto testSeatAssignmentDto;
    
    @BeforeEach
    void setUp() {
        testPassenger = new Passenger();
        testPassenger.setPassengerId(1L);
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
        testPassenger.setCreatedAt(LocalDateTime.now());
        testPassenger.setUpdatedAt(LocalDateTime.now());
        
        testCreateDto = new PassengerCreateDto(1L, "John Doe", "NYC", "LON");
        testCreateDto.setPhoneNumber("123-456-7890");
        testCreateDto.setAddress("123 Main St");
        testCreateDto.setPassportNumber("P123456");
        testCreateDto.setDateOfBirth(LocalDate.of(1990, 1, 1));
        testCreateDto.setServices(List.of("Meal"));
        testCreateDto.setMealType("Veg");
        testCreateDto.setMealName("Pasta");
        testCreateDto.setSeat("12A");
        
        testUpdateDto = new PassengerUpdateDto();
        testUpdateDto.setName("John Smith");
        testUpdateDto.setPhoneNumber("987-654-3210");
        
        testCheckInDto = new CheckInDto("12A", false, false, null);
        
        testSeatAssignmentDto = new SeatAssignmentDto(1L, "12B");
    }
    
    @Test
    void getAllPassengers_ShouldReturnAllPassengers() {
        List<Passenger> passengers = Arrays.asList(testPassenger);
        when(passengerRepository.findAll()).thenReturn(passengers);
        
        List<PassengerDto> result = passengerService.getAllPassengers();
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("John Doe", result.get(0).getName());
        verify(passengerRepository).findAll();
    }
    
    @Test
    void getPassengerById_WhenExists_ShouldReturnPassenger() {
        when(passengerRepository.findById(1L)).thenReturn(Optional.of(testPassenger));
        
        PassengerDto result = passengerService.getPassengerById(1L);
        
        assertNotNull(result);
        assertEquals(1L, result.getPassengerId());
        assertEquals("John Doe", result.getName());
        verify(passengerRepository).findById(1L);
    }
    
    @Test
    void getPassengerById_WhenNotExists_ShouldThrowException() {
        when(passengerRepository.findById(999L)).thenReturn(Optional.empty());
        
        assertThrows(PassengerNotFoundException.class, 
                () -> passengerService.getPassengerById(999L));
        
        verify(passengerRepository).findById(999L);
    }
    
    @Test
    void createPassenger_WithValidData_ShouldCreatePassenger() {
        when(passengerRepository.isSeatAvailable(1L, "12A")).thenReturn(true);
        when(passengerRepository.save(any(Passenger.class))).thenReturn(testPassenger);
        
        PassengerDto result = passengerService.createPassenger(testCreateDto);
        
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("12A", result.getSeat());
        verify(passengerRepository).isSeatAvailable(1L, "12A");
        verify(passengerRepository).save(any(Passenger.class));
    }
    
    @Test
    void createPassenger_WithUnavailableSeat_ShouldThrowException() {
        when(passengerRepository.isSeatAvailable(1L, "12A")).thenReturn(false);
        
        assertThrows(SeatNotAvailableException.class, 
                () -> passengerService.createPassenger(testCreateDto));
        
        verify(passengerRepository).isSeatAvailable(1L, "12A");
        verify(passengerRepository, never()).save(any(Passenger.class));
    }
    
    @Test
    void updatePassenger_WhenExists_ShouldUpdatePassenger() {
        when(passengerRepository.findById(1L)).thenReturn(Optional.of(testPassenger));
        when(passengerRepository.save(any(Passenger.class))).thenReturn(testPassenger);
        
        PassengerDto result = passengerService.updatePassenger(1L, testUpdateDto);
        
        assertNotNull(result);
        verify(passengerRepository).findById(1L);
        verify(passengerRepository).save(any(Passenger.class));
    }
    
    @Test
    void deletePassenger_WhenExists_ShouldDeletePassenger() {
        when(passengerRepository.existsById(1L)).thenReturn(true);
        doNothing().when(passengerRepository).deleteById(1L);
        
        assertDoesNotThrow(() -> passengerService.deletePassenger(1L));
        
        verify(passengerRepository).existsById(1L);
        verify(passengerRepository).deleteById(1L);
    }
    
    @Test
    void deletePassenger_WhenNotExists_ShouldThrowException() {
        when(passengerRepository.existsById(999L)).thenReturn(false);
        
        assertThrows(PassengerNotFoundException.class, 
                () -> passengerService.deletePassenger(999L));
        
        verify(passengerRepository).existsById(999L);
        verify(passengerRepository, never()).deleteById(999L);
    }
    
    @Test
    void checkInPassenger_WhenNotCheckedIn_ShouldCheckInPassenger() {
        testPassenger.setCheckedIn(false);
        when(passengerRepository.findById(1L)).thenReturn(Optional.of(testPassenger));
        when(passengerRepository.save(any(Passenger.class))).thenReturn(testPassenger);

        PassengerDto result = passengerService.checkInPassenger(1L, testCheckInDto);

        assertNotNull(result);
        verify(passengerRepository).findById(1L);
        verify(passengerRepository).save(any(Passenger.class));
    }
    
    @Test
    void checkInPassenger_WhenAlreadyCheckedIn_ShouldThrowException() {
        testPassenger.setCheckedIn(true);
        when(passengerRepository.findById(1L)).thenReturn(Optional.of(testPassenger));
        
        assertThrows(PassengerAlreadyCheckedInException.class, 
                () -> passengerService.checkInPassenger(1L, testCheckInDto));
        
        verify(passengerRepository).findById(1L);
        verify(passengerRepository, never()).save(any(Passenger.class));
    }
    
    @Test
    void assignSeat_WithValidData_ShouldAssignSeat() {
        when(passengerRepository.findById(1L)).thenReturn(Optional.of(testPassenger));
        when(passengerRepository.isSeatAvailable(1L, "12B")).thenReturn(true);
        when(passengerRepository.save(any(Passenger.class))).thenReturn(testPassenger);
        
        PassengerDto result = passengerService.assignSeat(1L, testSeatAssignmentDto);
        
        assertNotNull(result);
        verify(passengerRepository).findById(1L);
        verify(passengerRepository).isSeatAvailable(1L, "12B");
        verify(passengerRepository).save(any(Passenger.class));
    }
    
    @Test
    void assignSeat_WithUnavailableSeat_ShouldThrowException() {
        when(passengerRepository.findById(1L)).thenReturn(Optional.of(testPassenger));
        when(passengerRepository.isSeatAvailable(1L, "12B")).thenReturn(false);
        
        assertThrows(SeatNotAvailableException.class, 
                () -> passengerService.assignSeat(1L, testSeatAssignmentDto));
        
        verify(passengerRepository).findById(1L);
        verify(passengerRepository).isSeatAvailable(1L, "12B");
        verify(passengerRepository, never()).save(any(Passenger.class));
    }
    
    @Test
    void getPassengersByFlightId_ShouldReturnFlightPassengers() {
        List<Passenger> passengers = Arrays.asList(testPassenger);
        when(passengerRepository.findByFlightIdOrderByName(1L)).thenReturn(passengers);
        
        List<PassengerDto> result = passengerService.getPassengersByFlightId(1L);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getFlightId());
        verify(passengerRepository).findByFlightIdOrderByName(1L);
    }
    
    @Test
    void searchPassengersByName_ShouldReturnMatchingPassengers() {
        List<Passenger> passengers = Arrays.asList(testPassenger);
        when(passengerRepository.findByNameContainingIgnoreCase("John")).thenReturn(passengers);
        
        List<PassengerDto> result = passengerService.searchPassengersByName("John");
        
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getName().contains("John"));
        verify(passengerRepository).findByNameContainingIgnoreCase("John");
    }
}
