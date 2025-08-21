package com.oracle.passengers.service;

import com.oracle.passengers.dto.*;
import com.oracle.passengers.entity.Passenger;
import com.oracle.passengers.exception.PassengerAlreadyCheckedInException;
import com.oracle.passengers.exception.PassengerNotFoundException;
import com.oracle.passengers.exception.SeatNotAvailableException;
import com.oracle.passengers.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service layer for Passenger operations
 */
@Service
@Transactional
public class PassengerService {
    
    private final PassengerRepository passengerRepository;
    
    @Autowired
    public PassengerService(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }
    
    /**
     * Get all passengers
     * @return list of all passengers
     */
    @Transactional(readOnly = true)
    public List<PassengerDto> getAllPassengers() {
        return passengerRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get passenger by ID
     * @param passengerId the passenger ID
     * @return passenger if found
     */
    @Transactional(readOnly = true)
    public PassengerDto getPassengerById(Long passengerId) {
        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new PassengerNotFoundException(passengerId));
        return convertToDto(passenger);
    }
    
    /**
     * Get passengers by flight ID
     * @param flightId the flight ID
     * @return list of passengers for the specified flight
     */
    @Transactional(readOnly = true)
    public List<PassengerDto> getPassengersByFlightId(Long flightId) {
        return passengerRepository.findByFlightIdOrderByName(flightId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Create a new passenger
     * @param createDto the passenger creation data
     * @return the created passenger
     */
    public PassengerDto createPassenger(PassengerCreateDto createDto) {
        // Validate seat availability if seat is provided
        if (createDto.getSeat() != null && !createDto.getSeat().trim().isEmpty()) {
            if (!passengerRepository.isSeatAvailable(createDto.getFlightId(), createDto.getSeat())) {
                throw new SeatNotAvailableException(createDto.getFlightId(), createDto.getSeat());
            }
        }
        
        Passenger passenger = convertFromCreateDto(createDto);
        Passenger savedPassenger = passengerRepository.save(passenger);
        return convertToDto(savedPassenger);
    }
    
    /**
     * Update passenger information
     * @param passengerId the passenger ID
     * @param updateDto the update data
     * @return the updated passenger
     */
    public PassengerDto updatePassenger(Long passengerId, PassengerUpdateDto updateDto) {
        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new PassengerNotFoundException(passengerId));
        
        // Validate seat availability if seat is being changed
        if (updateDto.getSeat() != null && !updateDto.getSeat().equals(passenger.getSeat())) {
            if (!passengerRepository.isSeatAvailable(passenger.getFlightId(), updateDto.getSeat())) {
                throw new SeatNotAvailableException(passenger.getFlightId(), updateDto.getSeat());
            }
        }
        
        updatePassengerFromDto(passenger, updateDto);
        Passenger savedPassenger = passengerRepository.save(passenger);
        return convertToDto(savedPassenger);
    }
    
    /**
     * Delete a passenger
     * @param passengerId the passenger ID
     */
    public void deletePassenger(Long passengerId) {
        if (!passengerRepository.existsById(passengerId)) {
            throw new PassengerNotFoundException(passengerId);
        }
        passengerRepository.deleteById(passengerId);
    }
    
    /**
     * Check in a passenger
     * @param passengerId the passenger ID
     * @param checkInDto the check-in data
     * @return the updated passenger
     */
    public PassengerDto checkInPassenger(Long passengerId, CheckInDto checkInDto) {
        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new PassengerNotFoundException(passengerId));
        
        if (passenger.isCheckedIn()) {
            throw new PassengerAlreadyCheckedInException(passengerId);
        }
        
        // Validate seat availability if seat is being assigned/changed
        if (checkInDto.getSeat() != null && !checkInDto.getSeat().equals(passenger.getSeat())) {
            if (!passengerRepository.isSeatAvailable(passenger.getFlightId(), checkInDto.getSeat())) {
                throw new SeatNotAvailableException(passenger.getFlightId(), checkInDto.getSeat());
            }
            passenger.setSeat(checkInDto.getSeat());
        }
        
        // Update special requirements
        if (checkInDto.getWheelchair() != null) {
            passenger.setWheelchair(checkInDto.getWheelchair());
        }
        if (checkInDto.getInfant() != null) {
            passenger.setInfant(checkInDto.getInfant());
        }
        
        // Mark as checked in
        passenger.setCheckedIn(true);
        
        Passenger savedPassenger = passengerRepository.save(passenger);
        return convertToDto(savedPassenger);
    }
    
    /**
     * Assign seat to passenger
     * @param flightId the flight ID
     * @param seatAssignmentDto the seat assignment data
     * @return the updated passenger
     */
    public PassengerDto assignSeat(Long flightId, SeatAssignmentDto seatAssignmentDto) {
        Passenger passenger = passengerRepository.findById(seatAssignmentDto.getPassengerId())
                .orElseThrow(() -> new PassengerNotFoundException(seatAssignmentDto.getPassengerId()));
        
        // Verify passenger belongs to the specified flight
        if (!passenger.getFlightId().equals(flightId)) {
            throw new IllegalArgumentException("Passenger does not belong to flight " + flightId);
        }
        
        // Validate seat availability
        if (!passengerRepository.isSeatAvailable(flightId, seatAssignmentDto.getSeat())) {
            throw new SeatNotAvailableException(flightId, seatAssignmentDto.getSeat());
        }
        
        passenger.setSeat(seatAssignmentDto.getSeat());
        Passenger savedPassenger = passengerRepository.save(passenger);
        return convertToDto(savedPassenger);
    }
    
    /**
     * Get passengers with special needs for a flight
     * @param flightId the flight ID
     * @return list of passengers with special needs
     */
    @Transactional(readOnly = true)
    public List<PassengerDto> getPassengersWithSpecialNeeds(Long flightId) {
        return passengerRepository.findPassengersWithSpecialNeedsByFlightId(flightId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get checked-in passengers for a flight
     * @param flightId the flight ID
     * @return list of checked-in passengers
     */
    @Transactional(readOnly = true)
    public List<PassengerDto> getCheckedInPassengers(Long flightId) {
        return passengerRepository.findCheckedInPassengersByFlightId(flightId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get passengers who haven't checked in for a flight
     * @param flightId the flight ID
     * @return list of passengers who haven't checked in
     */
    @Transactional(readOnly = true)
    public List<PassengerDto> getNotCheckedInPassengers(Long flightId) {
        return passengerRepository.findNotCheckedInPassengersByFlightId(flightId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Get passengers with missing mandatory information
     * @param flightId the flight ID
     * @return list of passengers with missing information
     */
    @Transactional(readOnly = true)
    public List<PassengerDto> getPassengersWithMissingInfo(Long flightId) {
        return passengerRepository.findPassengersWithMissingInfoByFlightId(flightId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Search passengers by name
     * @param name the name to search for
     * @return list of passengers with matching names
     */
    @Transactional(readOnly = true)
    public List<PassengerDto> searchPassengersByName(String name) {
        return passengerRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Conversion methods

    /**
     * Convert Passenger entity to PassengerDto
     */
    private PassengerDto convertToDto(Passenger passenger) {
        return new PassengerDto(
                passenger.getPassengerId(),
                passenger.getFlightId(),
                passenger.getName(),
                passenger.getPhoneNumber(),
                passenger.getAddress(),
                passenger.getPassportNumber(),
                passenger.getDateOfBirth(),
                passenger.getOrigin(),
                passenger.getDestination(),
                passenger.getServices(),
                passenger.getMealType(),
                passenger.getMealName(),
                passenger.getExtraBaggage(),
                passenger.getShoppingItems(),
                passenger.getSeat(),
                passenger.isCheckedIn(),
                passenger.needsWheelchair(),
                passenger.hasInfant(),
                passenger.getCreatedAt(),
                passenger.getUpdatedAt()
        );
    }

    /**
     * Convert PassengerCreateDto to Passenger entity
     */
    private Passenger convertFromCreateDto(PassengerCreateDto createDto) {
        Passenger passenger = new Passenger();
        passenger.setFlightId(createDto.getFlightId());
        passenger.setName(createDto.getName());
        passenger.setPhoneNumber(createDto.getPhoneNumber());
        passenger.setAddress(createDto.getAddress());
        passenger.setPassportNumber(createDto.getPassportNumber());
        passenger.setDateOfBirth(createDto.getDateOfBirth());
        passenger.setOrigin(createDto.getOrigin());
        passenger.setDestination(createDto.getDestination());
        passenger.setServices(createDto.getServices());
        passenger.setMealType(createDto.getMealType());
        passenger.setMealName(createDto.getMealName());
        passenger.setExtraBaggage(createDto.getExtraBaggage());
        passenger.setShoppingItems(createDto.getShoppingItems());
        passenger.setSeat(createDto.getSeat());
        passenger.setWheelchair(createDto.isWheelchair());
        passenger.setInfant(createDto.isInfant());
        passenger.setCheckedIn(false); // New passengers are not checked in by default
        return passenger;
    }

    /**
     * Update Passenger entity from PassengerUpdateDto
     */
    private void updatePassengerFromDto(Passenger passenger, PassengerUpdateDto updateDto) {
        if (updateDto.getName() != null) {
            passenger.setName(updateDto.getName());
        }
        if (updateDto.getPhoneNumber() != null) {
            passenger.setPhoneNumber(updateDto.getPhoneNumber());
        }
        if (updateDto.getAddress() != null) {
            passenger.setAddress(updateDto.getAddress());
        }
        if (updateDto.getPassportNumber() != null) {
            passenger.setPassportNumber(updateDto.getPassportNumber());
        }
        if (updateDto.getDateOfBirth() != null) {
            passenger.setDateOfBirth(updateDto.getDateOfBirth());
        }
        if (updateDto.getServices() != null) {
            passenger.setServices(updateDto.getServices());
        }
        if (updateDto.getMealType() != null) {
            passenger.setMealType(updateDto.getMealType());
        }
        if (updateDto.getMealName() != null) {
            passenger.setMealName(updateDto.getMealName());
        }
        if (updateDto.getExtraBaggage() != null) {
            passenger.setExtraBaggage(updateDto.getExtraBaggage());
        }
        if (updateDto.getShoppingItems() != null) {
            passenger.setShoppingItems(updateDto.getShoppingItems());
        }
        if (updateDto.getSeat() != null) {
            passenger.setSeat(updateDto.getSeat());
        }
        if (updateDto.getWheelchair() != null) {
            passenger.setWheelchair(updateDto.getWheelchair());
        }
        if (updateDto.getInfant() != null) {
            passenger.setInfant(updateDto.getInfant());
        }
    }
}
