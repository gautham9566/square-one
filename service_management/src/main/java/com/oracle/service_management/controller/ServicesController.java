package com.oracle.service_management.controller;

import com.oracle.service_management.dto.*;
import com.oracle.service_management.service.ServicesService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for Services Management
 * Handles meals, baggage, shopping, and other passenger services
 */
@RestController
@RequestMapping("/services")
@CrossOrigin(origins = "*") // Allow CORS for frontend integration
public class ServicesController {

    private static final Logger logger = LoggerFactory.getLogger(ServicesController.class);
    private final ServicesService servicesService;

    @Autowired
    public ServicesController(ServicesService servicesService) {
        this.servicesService = servicesService;
    }
    
    /**
     * GET /services/flight/{flightId} - Get available services for a flight
     * @param flightId the flight ID
     * @return flight services information
     */
    @GetMapping("/flight/{flightId}")
    public ResponseEntity<FlightServicesDto> getFlightServices(@PathVariable Long flightId) {
        Optional<FlightServicesDto> flightServices = servicesService.getFlightServices(flightId);
        
        if (flightServices.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(flightServices.get());
    }
    
    /**
     * GET /services/flight/{flightId}/passengers - Get all passengers with services for a flight
     * @param flightId the flight ID
     * @param serviceType optional filter by service type (meal, shopping, ancillary)
     * @return list of passengers with their services
     */
    @GetMapping("/flight/{flightId}/passengers")
    public ResponseEntity<List<PassengerServicesDto>> getFlightPassengerServices(
            @PathVariable Long flightId,
            @RequestParam(required = false) String serviceType) {
        
        List<PassengerServicesDto> passengers;
        
        if ("meal".equalsIgnoreCase(serviceType)) {
            passengers = servicesService.getPassengersWithMealServices(flightId);
        } else if ("shopping".equalsIgnoreCase(serviceType)) {
            passengers = servicesService.getPassengersWithShoppingServices(flightId);
        } else if ("ancillary".equalsIgnoreCase(serviceType)) {
            passengers = servicesService.getPassengersWithAncillaryServices(flightId);
        } else if ("baggage".equalsIgnoreCase(serviceType)) {
            passengers = servicesService.getPassengersWithExtraBaggage(flightId);
        } else {
            passengers = servicesService.getPassengerServicesByFlight(flightId);
        }
        
        return ResponseEntity.ok(passengers);
    }
    
    /**
     * GET /services/flight/{flightId}/stats - Get service statistics for a flight
     * @param flightId the flight ID
     * @return service statistics
     */
    @GetMapping("/flight/{flightId}/stats")
    public ResponseEntity<FlightServiceStatsDto> getFlightServiceStats(@PathVariable Long flightId) {
        Optional<FlightServiceStatsDto> stats = servicesService.getFlightServiceStats(flightId);
        
        if (stats.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(stats.get());
    }
    
    /**
     * GET /services/passenger/{passengerId} - Get passenger services information
     * @param passengerId the passenger ID
     * @return passenger services information
     */
    @GetMapping("/passenger/{passengerId}")
    public ResponseEntity<PassengerServicesDto> getPassengerServices(@PathVariable Long passengerId) {
        Optional<PassengerServicesDto> passengerServices = servicesService.getPassengerServices(passengerId);
        
        if (passengerServices.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(passengerServices.get());
    }
    
    /**
     * PUT /services/passenger/{passengerId} - Update passenger services
     * @param passengerId the passenger ID
     * @param serviceRequest the service request
     * @return service response
     */
    @PutMapping("/passenger/{passengerId}")
    public ResponseEntity<ServiceResponseDto> updatePassengerServices(
            @PathVariable Long passengerId,
            @Valid @RequestBody ServiceRequestDto serviceRequest) {

        // Debug logging
        logger.info("Received service request for passenger {}: passengerId={}, flightId={}, requestedServices={}, mealType={}, shoppingItems={}",
                passengerId, serviceRequest.getPassengerId(), serviceRequest.getFlightId(),
                serviceRequest.getRequestedServices(), serviceRequest.getMealType(), serviceRequest.getShoppingItems());

        ServiceResponseDto response = servicesService.updatePassengerServices(passengerId, serviceRequest);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * PUT /services/passenger/{passengerId}/meal - Update passenger meal service
     * @param passengerId the passenger ID
     * @param mealDto the meal request
     * @return service response
     */
    @PutMapping("/passenger/{passengerId}/meal")
    public ResponseEntity<ServiceResponseDto> updatePassengerMeal(
            @PathVariable Long passengerId,
            @Valid @RequestBody MealDto mealDto) {
        
        ServiceResponseDto response = servicesService.updatePassengerMeal(passengerId, mealDto);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * PUT /services/passenger/{passengerId}/baggage - Update passenger baggage service
     * @param passengerId the passenger ID
     * @param baggageDto the baggage request
     * @return service response
     */
    @PutMapping("/passenger/{passengerId}/baggage")
    public ResponseEntity<ServiceResponseDto> updatePassengerBaggage(
            @PathVariable Long passengerId,
            @Valid @RequestBody BaggageDto baggageDto) {
        
        ServiceResponseDto response = servicesService.updatePassengerBaggage(passengerId, baggageDto);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * PUT /services/passenger/{passengerId}/shopping - Update passenger shopping service
     * @param passengerId the passenger ID
     * @param shoppingDto the shopping request
     * @return service response
     */
    @PutMapping("/passenger/{passengerId}/shopping")
    public ResponseEntity<ServiceResponseDto> updatePassengerShopping(
            @PathVariable Long passengerId,
            @Valid @RequestBody ShoppingDto shoppingDto) {

        // Debug logging
        logger.info("Received shopping request for passenger {}: passengerId={}, flightId={}, items={}, deliveryInstructions={}",
                passengerId, shoppingDto.getPassengerId(), shoppingDto.getFlightId(),
                shoppingDto.getItems(), shoppingDto.getDeliveryInstructions());

        ServiceResponseDto response = servicesService.updatePassengerShopping(passengerId, shoppingDto);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * GET /services/meals/flight/{flightId} - Get passengers with meal services for a flight
     * @param flightId the flight ID
     * @param mealType optional filter by meal type
     * @return list of passengers with meal services
     */
    @GetMapping("/meals/flight/{flightId}")
    public ResponseEntity<List<PassengerServicesDto>> getFlightMealServices(
            @PathVariable Long flightId,
            @RequestParam(required = false) String mealType) {
        
        List<PassengerServicesDto> passengers;
        
        if (mealType != null && !mealType.trim().isEmpty()) {
            passengers = servicesService.getPassengersByMealType(flightId, mealType);
        } else {
            passengers = servicesService.getPassengersWithMealServices(flightId);
        }
        
        return ResponseEntity.ok(passengers);
    }
    
    /**
     * GET /services/baggage/flight/{flightId} - Get passengers with extra baggage for a flight
     * @param flightId the flight ID
     * @return list of passengers with extra baggage
     */
    @GetMapping("/baggage/flight/{flightId}")
    public ResponseEntity<List<PassengerServicesDto>> getFlightBaggageServices(@PathVariable Long flightId) {
        List<PassengerServicesDto> passengers = servicesService.getPassengersWithExtraBaggage(flightId);
        return ResponseEntity.ok(passengers);
    }
    
    /**
     * GET /services/shopping/flight/{flightId} - Get passengers with shopping services for a flight
     * @param flightId the flight ID
     * @return list of passengers with shopping services
     */
    @GetMapping("/shopping/flight/{flightId}")
    public ResponseEntity<List<PassengerServicesDto>> getFlightShoppingServices(@PathVariable Long flightId) {
        List<PassengerServicesDto> passengers = servicesService.getPassengersWithShoppingServices(flightId);
        return ResponseEntity.ok(passengers);
    }

    /**
     * Health check endpoint
     * @return simple health status
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Service Management Service is running");
    }

    /**
     * Get API information
     * @return API information
     */
    @GetMapping("/info")
    public ResponseEntity<Object> getApiInfo() {
        return ResponseEntity.ok(new Object() {
            public final String service = "Service Management Service";
            public final String version = "1.0.0";
            public final String description = "Manage passenger services including meals, baggage, shopping, and ancillary services";
            public final String[] endpoints = {
                "GET /services/flight/{flightId} - Get services for specific flight",
                "GET /services/flight/{flightId}?serviceType={type} - Get services by type for flight",
                "GET /services/passenger/{passengerId} - Get passenger services information",
                "PUT /services/passenger/{passengerId} - Update passenger services",
                "GET /services/meals/flight/{flightId} - Get meal services for flight",
                "GET /services/baggage/flight/{flightId} - Get baggage services for flight",
                "GET /services/shopping/flight/{flightId} - Get shopping services for flight"
            };
        });
    }
}
