package com.oracle.service_management.service;

import com.oracle.service_management.dto.*;
import com.oracle.service_management.entity.Flight;
import com.oracle.service_management.entity.Passenger;
import com.oracle.service_management.exception.*;
import com.oracle.service_management.repository.FlightRepository;
import com.oracle.service_management.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service layer for managing passenger services including meals, baggage, shopping, and other services
 */
@Service
@Transactional
public class ServicesService {
    
    private final FlightRepository flightRepository;
    private final PassengerRepository passengerRepository;
    
    @Autowired
    public ServicesService(FlightRepository flightRepository, PassengerRepository passengerRepository) {
        this.flightRepository = flightRepository;
        this.passengerRepository = passengerRepository;
    }
    
    /**
     * Get available services for a specific flight
     * @param flightId the flight ID
     * @return flight services information
     * @throws FlightNotFoundException if flight is not found
     */
    @Transactional(readOnly = true)
    public Optional<FlightServicesDto> getFlightServices(Long flightId) {
        validateFlightId(flightId);
        return flightRepository.findByIdWithServices(flightId)
                .map(this::convertToFlightServicesDto);
    }
    
    /**
     * Get passenger services information
     * @param passengerId the passenger ID
     * @return passenger services information
     * @throws PassengerNotFoundException if passenger is not found
     */
    @Transactional(readOnly = true)
    public Optional<PassengerServicesDto> getPassengerServices(Long passengerId) {
        validatePassengerId(passengerId);
        return passengerRepository.findByIdWithServices(passengerId)
                .map(this::convertToPassengerServicesDto);
    }
    
    /**
     * Get all passengers with services for a specific flight
     * @param flightId the flight ID
     * @return list of passengers with their services
     */
    @Transactional(readOnly = true)
    public List<PassengerServicesDto> getPassengerServicesByFlight(Long flightId) {
        return passengerRepository.findByFlightIdOrderByName(flightId).stream()
                .map(this::convertToPassengerServicesDto)
                .collect(Collectors.toList());
    }
    
    /**
     * Update passenger services
     * @param passengerId the passenger ID
     * @param serviceRequest the service request
     * @return service response
     */
    public ServiceResponseDto updatePassengerServices(Long passengerId, ServiceRequestDto serviceRequest) {
        validatePassengerId(passengerId);
        validateServiceRequest(serviceRequest);

        Optional<Passenger> passengerOpt = passengerRepository.findById(passengerId);
        
        if (passengerOpt.isEmpty()) {
            return ServiceResponseDto.error("Passenger not found", "UPDATE_SERVICES", passengerId, serviceRequest.getFlightId());
        }
        
        Passenger passenger = passengerOpt.get();
        
        // Validate flight ID matches
        if (!passenger.getFlightId().equals(serviceRequest.getFlightId())) {
            return ServiceResponseDto.error("Flight ID mismatch", "UPDATE_SERVICES", passengerId, serviceRequest.getFlightId());
        }
        
        // Update services
        if (serviceRequest.getRequestedServices() != null) {
            passenger.setServices(serviceRequest.getRequestedServices());
        }
        
        // Update meal information if meal service is requested
        if (serviceRequest.hasMealService() && serviceRequest.hasMealDetails()) {
            passenger.setMealType(serviceRequest.getMealType());
            passenger.setMealName(serviceRequest.getMealName());
        }
        
        // Update baggage information if ancillary service is requested
        if (serviceRequest.hasAncillaryService() && serviceRequest.hasBaggageDetails()) {
            passenger.setExtraBaggage(serviceRequest.getExtraBaggageWeight());
        }
        
        // Update shopping items if shopping service is requested
        if (serviceRequest.hasShoppingService() && serviceRequest.hasShoppingDetails()) {
            passenger.setShoppingItems(serviceRequest.getShoppingItems());
        }
        
        Passenger savedPassenger = passengerRepository.save(passenger);
        PassengerServicesDto updatedServices = convertToPassengerServicesDto(savedPassenger);
        
        return ServiceResponseDto.success("Services updated successfully", "UPDATE_SERVICES", 
                passengerId, serviceRequest.getFlightId(), updatedServices);
    }
    
    /**
     * Update passenger meal service
     * @param passengerId the passenger ID
     * @param mealDto the meal request
     * @return service response
     */
    public ServiceResponseDto updatePassengerMeal(Long passengerId, MealDto mealDto) {
        validatePassengerId(passengerId);
        validateMealRequest(mealDto);

        Optional<Passenger> passengerOpt = passengerRepository.findById(passengerId);
        
        if (passengerOpt.isEmpty()) {
            return ServiceResponseDto.error("Passenger not found", "UPDATE_MEAL", passengerId, mealDto.getFlightId());
        }
        
        Passenger passenger = passengerOpt.get();
        
        // Validate flight ID matches
        if (!passenger.getFlightId().equals(mealDto.getFlightId())) {
            return ServiceResponseDto.error("Flight ID mismatch", "UPDATE_MEAL", passengerId, mealDto.getFlightId());
        }
        
        // Validate flight has meal service
        Optional<Flight> flightOpt = flightRepository.findById(mealDto.getFlightId());
        if (flightOpt.isEmpty() || !flightOpt.get().getServices().contains("Meal")) {
            return ServiceResponseDto.error("Meal service not available for this flight", "UPDATE_MEAL", 
                    passengerId, mealDto.getFlightId());
        }
        
        // Update meal information
        passenger.setMealType(mealDto.getMealType());
        passenger.setMealName(mealDto.getMealName());
        
        // Add meal service to passenger services if not already present
        List<String> services = passenger.getServices();
        if (!services.contains("Meal")) {
            services.add("Meal");
            passenger.setServices(services);
        }
        
        Passenger savedPassenger = passengerRepository.save(passenger);
        PassengerServicesDto updatedServices = convertToPassengerServicesDto(savedPassenger);
        
        return ServiceResponseDto.success("Meal service updated successfully", "UPDATE_MEAL", 
                passengerId, mealDto.getFlightId(), updatedServices);
    }
    
    /**
     * Update passenger baggage service
     * @param passengerId the passenger ID
     * @param baggageDto the baggage request
     * @return service response
     */
    public ServiceResponseDto updatePassengerBaggage(Long passengerId, BaggageDto baggageDto) {
        validatePassengerId(passengerId);
        validateBaggageRequest(baggageDto);

        Optional<Passenger> passengerOpt = passengerRepository.findById(passengerId);
        
        if (passengerOpt.isEmpty()) {
            return ServiceResponseDto.error("Passenger not found", "UPDATE_BAGGAGE", passengerId, baggageDto.getFlightId());
        }
        
        Passenger passenger = passengerOpt.get();
        
        // Validate flight ID matches
        if (!passenger.getFlightId().equals(baggageDto.getFlightId())) {
            return ServiceResponseDto.error("Flight ID mismatch", "UPDATE_BAGGAGE", passengerId, baggageDto.getFlightId());
        }
        
        // Validate flight has ancillary service
        Optional<Flight> flightOpt = flightRepository.findById(baggageDto.getFlightId());
        if (flightOpt.isEmpty() || !flightOpt.get().getServices().contains("Ancillary")) {
            return ServiceResponseDto.error("Baggage service not available for this flight", "UPDATE_BAGGAGE", 
                    passengerId, baggageDto.getFlightId());
        }
        
        // Update baggage information
        passenger.setExtraBaggage(baggageDto.getExtraBaggageWeight());
        
        // Add ancillary service to passenger services if not already present
        List<String> services = passenger.getServices();
        if (!services.contains("Ancillary")) {
            services.add("Ancillary");
            passenger.setServices(services);
        }
        
        Passenger savedPassenger = passengerRepository.save(passenger);
        PassengerServicesDto updatedServices = convertToPassengerServicesDto(savedPassenger);
        
        return ServiceResponseDto.success("Baggage service updated successfully", "UPDATE_BAGGAGE", 
                passengerId, baggageDto.getFlightId(), updatedServices);
    }
    
    /**
     * Update passenger shopping service
     * @param passengerId the passenger ID
     * @param shoppingDto the shopping request
     * @return service response
     */
    public ServiceResponseDto updatePassengerShopping(Long passengerId, ShoppingDto shoppingDto) {
        validatePassengerId(passengerId);
        validateShoppingRequest(shoppingDto);

        Optional<Passenger> passengerOpt = passengerRepository.findById(passengerId);
        
        if (passengerOpt.isEmpty()) {
            return ServiceResponseDto.error("Passenger not found", "UPDATE_SHOPPING", passengerId, shoppingDto.getFlightId());
        }
        
        Passenger passenger = passengerOpt.get();
        
        // Validate flight ID matches
        if (!passenger.getFlightId().equals(shoppingDto.getFlightId())) {
            return ServiceResponseDto.error("Flight ID mismatch", "UPDATE_SHOPPING", passengerId, shoppingDto.getFlightId());
        }
        
        // Validate flight has shopping service
        Optional<Flight> flightOpt = flightRepository.findById(shoppingDto.getFlightId());
        if (flightOpt.isEmpty() || !flightOpt.get().getServices().contains("Shopping")) {
            return ServiceResponseDto.error("Shopping service not available for this flight", "UPDATE_SHOPPING", 
                    passengerId, shoppingDto.getFlightId());
        }
        
        // Update shopping items
        passenger.setShoppingItems(shoppingDto.getItems());
        
        // Add shopping service to passenger services if not already present
        List<String> services = passenger.getServices();
        if (!services.contains("Shopping")) {
            services.add("Shopping");
            passenger.setServices(services);
        }
        
        Passenger savedPassenger = passengerRepository.save(passenger);
        PassengerServicesDto updatedServices = convertToPassengerServicesDto(savedPassenger);
        
        return ServiceResponseDto.success("Shopping service updated successfully", "UPDATE_SHOPPING",
                passengerId, shoppingDto.getFlightId(), updatedServices);
    }

    /**
     * Get passengers with meal services for a specific flight
     * @param flightId the flight ID
     * @return list of passengers with meal services
     */
    @Transactional(readOnly = true)
    public List<PassengerServicesDto> getPassengersWithMealServices(Long flightId) {
        return passengerRepository.findPassengersWithMealServicesByFlightId(flightId).stream()
                .map(this::convertToPassengerServicesDto)
                .collect(Collectors.toList());
    }

    /**
     * Get passengers with shopping services for a specific flight
     * @param flightId the flight ID
     * @return list of passengers with shopping services
     */
    @Transactional(readOnly = true)
    public List<PassengerServicesDto> getPassengersWithShoppingServices(Long flightId) {
        return passengerRepository.findPassengersWithShoppingServicesByFlightId(flightId).stream()
                .map(this::convertToPassengerServicesDto)
                .collect(Collectors.toList());
    }

    /**
     * Get passengers with ancillary services for a specific flight
     * @param flightId the flight ID
     * @return list of passengers with ancillary services
     */
    @Transactional(readOnly = true)
    public List<PassengerServicesDto> getPassengersWithAncillaryServices(Long flightId) {
        return passengerRepository.findPassengersWithAncillaryServicesByFlightId(flightId).stream()
                .map(this::convertToPassengerServicesDto)
                .collect(Collectors.toList());
    }

    /**
     * Get passengers with extra baggage for a specific flight
     * @param flightId the flight ID
     * @return list of passengers with extra baggage
     */
    @Transactional(readOnly = true)
    public List<PassengerServicesDto> getPassengersWithExtraBaggage(Long flightId) {
        return passengerRepository.findPassengersWithExtraBaggageByFlightId(flightId).stream()
                .map(this::convertToPassengerServicesDto)
                .collect(Collectors.toList());
    }

    /**
     * Get passengers with shopping items for a specific flight
     * @param flightId the flight ID
     * @return list of passengers with shopping items
     */
    @Transactional(readOnly = true)
    public List<PassengerServicesDto> getPassengersWithShoppingItems(Long flightId) {
        return passengerRepository.findPassengersWithShoppingItemsByFlightId(flightId).stream()
                .map(this::convertToPassengerServicesDto)
                .collect(Collectors.toList());
    }

    /**
     * Get passengers by meal type for a specific flight
     * @param flightId the flight ID
     * @param mealType the meal type
     * @return list of passengers with the specified meal type
     */
    @Transactional(readOnly = true)
    public List<PassengerServicesDto> getPassengersByMealType(Long flightId, String mealType) {
        return passengerRepository.findPassengersByFlightIdAndMealType(flightId, mealType).stream()
                .map(this::convertToPassengerServicesDto)
                .collect(Collectors.toList());
    }

    /**
     * Get service statistics for a flight
     * @param flightId the flight ID
     * @return service statistics
     */
    @Transactional(readOnly = true)
    public Optional<FlightServiceStatsDto> getFlightServiceStats(Long flightId) {
        if (!flightRepository.existsById(flightId)) {
            return Optional.empty();
        }

        Long mealCount = passengerRepository.countPassengersWithMealServicesByFlightId(flightId);
        Long shoppingCount = passengerRepository.countPassengersWithShoppingServicesByFlightId(flightId);
        Long ancillaryCount = passengerRepository.countPassengersByFlightIdAndServiceType(flightId, "Ancillary");

        FlightServiceStatsDto stats = new FlightServiceStatsDto(flightId, mealCount, shoppingCount, ancillaryCount);
        return Optional.of(stats);
    }

    // Conversion methods

    /**
     * Convert Flight entity to FlightServicesDto
     */
    private FlightServicesDto convertToFlightServicesDto(Flight flight) {
        return new FlightServicesDto(
                flight.getFlightId(),
                flight.getFlightName(),
                flight.getFlightDate(),
                flight.getRoute(),
                flight.getDepartureTime(),
                flight.getArrivalTime(),
                flight.getAircraftType(),
                flight.getTotalSeats(),
                flight.getAvailableSeats(),
                flight.getServices(),
                flight.getServiceSubtypes()
        );
    }

    /**
     * Convert Passenger entity to PassengerServicesDto
     */
    private PassengerServicesDto convertToPassengerServicesDto(Passenger passenger) {
        return new PassengerServicesDto(
                passenger.getPassengerId(),
                passenger.getFlightId(),
                passenger.getName(),
                passenger.getPhoneNumber(),
                passenger.getOrigin(),
                passenger.getDestination(),
                passenger.getSeat(),
                passenger.isCheckedIn(),
                passenger.needsWheelchair(),
                passenger.hasInfant(),
                passenger.getServices(),
                passenger.getMealType(),
                passenger.getMealName(),
                passenger.getExtraBaggage(),
                passenger.getShoppingItems(),
                passenger.getUpdatedAt()
        );
    }

    // Validation methods

    /**
     * Validate flight ID
     * @param flightId the flight ID to validate
     * @throws IllegalArgumentException if flight ID is null or invalid
     */
    private void validateFlightId(Long flightId) {
        if (flightId == null) {
            throw new IllegalArgumentException("Flight ID cannot be null");
        }
        if (flightId <= 0) {
            throw new IllegalArgumentException("Flight ID must be positive");
        }
    }

    /**
     * Validate passenger ID
     * @param passengerId the passenger ID to validate
     * @throws IllegalArgumentException if passenger ID is null or invalid
     */
    private void validatePassengerId(Long passengerId) {
        if (passengerId == null) {
            throw new IllegalArgumentException("Passenger ID cannot be null");
        }
        if (passengerId <= 0) {
            throw new IllegalArgumentException("Passenger ID must be positive");
        }
    }

    /**
     * Validate service request
     * @param serviceRequest the service request to validate
     * @throws InvalidServiceRequestException if request is invalid
     */
    private void validateServiceRequest(ServiceRequestDto serviceRequest) {
        if (serviceRequest == null) {
            throw new InvalidServiceRequestException("SERVICE_REQUEST", "Service request cannot be null");
        }

        if (serviceRequest.getPassengerId() == null) {
            throw new InvalidServiceRequestException("SERVICE_REQUEST", "Passenger ID is required");
        }

        if (serviceRequest.getFlightId() == null) {
            throw new InvalidServiceRequestException("SERVICE_REQUEST", "Flight ID is required");
        }

        if (serviceRequest.getRequestedServices() == null || serviceRequest.getRequestedServices().isEmpty()) {
            throw new InvalidServiceRequestException("SERVICE_REQUEST", "At least one service must be requested");
        }

        // Validate meal service details if meal service is requested
        if (serviceRequest.hasMealService() && !serviceRequest.hasMealDetails()) {
            throw new InvalidServiceRequestException("MEAL_SERVICE", "Meal type is required when requesting meal service");
        }

        // Validate baggage service details if ancillary service is requested
        if (serviceRequest.hasAncillaryService() && !serviceRequest.hasBaggageDetails()) {
            throw new InvalidServiceRequestException("BAGGAGE_SERVICE", "Baggage weight is required when requesting baggage service");
        }

        // Validate shopping service details if shopping service is requested
        if (serviceRequest.hasShoppingService() && !serviceRequest.hasShoppingDetails()) {
            throw new InvalidServiceRequestException("SHOPPING_SERVICE", "Shopping items are required when requesting shopping service");
        }
    }

    /**
     * Validate meal request
     * @param mealDto the meal request to validate
     * @throws InvalidServiceRequestException if request is invalid
     */
    private void validateMealRequest(MealDto mealDto) {
        if (mealDto == null) {
            throw new InvalidServiceRequestException("MEAL_REQUEST", "Meal request cannot be null");
        }

        if (mealDto.getPassengerId() == null) {
            throw new InvalidServiceRequestException("MEAL_REQUEST", "Passenger ID is required");
        }

        if (mealDto.getFlightId() == null) {
            throw new InvalidServiceRequestException("MEAL_REQUEST", "Flight ID is required");
        }

        if (mealDto.getMealType() == null || mealDto.getMealType().trim().isEmpty()) {
            throw new InvalidServiceRequestException("MEAL_REQUEST", "Meal type is required");
        }
    }

    /**
     * Validate baggage request
     * @param baggageDto the baggage request to validate
     * @throws InvalidServiceRequestException if request is invalid
     */
    private void validateBaggageRequest(BaggageDto baggageDto) {
        if (baggageDto == null) {
            throw new InvalidServiceRequestException("BAGGAGE_REQUEST", "Baggage request cannot be null");
        }

        if (baggageDto.getPassengerId() == null) {
            throw new InvalidServiceRequestException("BAGGAGE_REQUEST", "Passenger ID is required");
        }

        if (baggageDto.getFlightId() == null) {
            throw new InvalidServiceRequestException("BAGGAGE_REQUEST", "Flight ID is required");
        }

        if (baggageDto.getExtraBaggageWeight() == null || baggageDto.getExtraBaggageWeight() < 0) {
            throw new InvalidServiceRequestException("BAGGAGE_REQUEST", "Extra baggage weight must be non-negative");
        }
    }

    /**
     * Validate shopping request
     * @param shoppingDto the shopping request to validate
     * @throws InvalidServiceRequestException if request is invalid
     */
    private void validateShoppingRequest(ShoppingDto shoppingDto) {
        if (shoppingDto == null) {
            throw new InvalidServiceRequestException("SHOPPING_REQUEST", "Shopping request cannot be null");
        }

        if (shoppingDto.getPassengerId() == null) {
            throw new InvalidServiceRequestException("SHOPPING_REQUEST", "Passenger ID is required");
        }

        if (shoppingDto.getFlightId() == null) {
            throw new InvalidServiceRequestException("SHOPPING_REQUEST", "Flight ID is required");
        }

        if (shoppingDto.getItems() == null || shoppingDto.getItems().isEmpty()) {
            throw new InvalidServiceRequestException("SHOPPING_REQUEST", "At least one shopping item is required");
        }
    }
}
