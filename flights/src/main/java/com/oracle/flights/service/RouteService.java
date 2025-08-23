package com.oracle.flights.service;

import com.oracle.flights.entity.Route;
import com.oracle.flights.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Route operations
 */
@Service
@Transactional
public class RouteService {
    
    private final RouteRepository routeRepository;
    
    @Autowired
    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }
    
    /**
     * Get all routes
     * @return list of all routes
     */
    @Transactional(readOnly = true)
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }
    
    /**
     * Get route by ID
     * @param id the route ID
     * @return Optional route
     */
    @Transactional(readOnly = true)
    public Optional<Route> getRouteById(Long id) {
        return routeRepository.findById(id);
    }
    
    /**
     * Get route by route code
     * @param routeCode the route code
     * @return Optional route
     */
    @Transactional(readOnly = true)
    public Optional<Route> getRouteByCode(String routeCode) {
        return routeRepository.findByRouteCode(routeCode);
    }
    
    /**
     * Get all active routes
     * @return list of active routes
     */
    @Transactional(readOnly = true)
    public List<Route> getActiveRoutes() {
        return routeRepository.findActiveRoutes();
    }
    
    /**
     * Get routes by departure airport
     * @param departureAirport the departure airport code
     * @return list of routes
     */
    @Transactional(readOnly = true)
    public List<Route> getRoutesByDepartureAirport(String departureAirport) {
        return routeRepository.findByDepartureAirport(departureAirport);
    }
    
    /**
     * Get routes by arrival airport
     * @param arrivalAirport the arrival airport code
     * @return list of routes
     */
    @Transactional(readOnly = true)
    public List<Route> getRoutesByArrivalAirport(String arrivalAirport) {
        return routeRepository.findByArrivalAirport(arrivalAirport);
    }
    
    /**
     * Get routes by departure city
     * @param departureCity the departure city
     * @return list of routes
     */
    @Transactional(readOnly = true)
    public List<Route> getRoutesByDepartureCity(String departureCity) {
        return routeRepository.findByDepartureCity(departureCity);
    }
    
    /**
     * Get routes by arrival city
     * @param arrivalCity the arrival city
     * @return list of routes
     */
    @Transactional(readOnly = true)
    public List<Route> getRoutesByArrivalCity(String arrivalCity) {
        return routeRepository.findByArrivalCity(arrivalCity);
    }
    
    /**
     * Search routes by departure and arrival locations
     * @param departure departure city or airport code
     * @param arrival arrival city or airport code
     * @return list of matching routes
     */
    @Transactional(readOnly = true)
    public List<Route> searchRoutes(String departure, String arrival) {
        return routeRepository.searchRoutes(departure, arrival);
    }
    
    /**
     * Create a new route
     * @param route the route to create
     * @return the created route
     * @throws IllegalArgumentException if route code already exists
     */
    public Route createRoute(Route route) {
        if (routeRepository.existsByRouteCode(route.getRouteCode())) {
            throw new IllegalArgumentException("Route code already exists: " + route.getRouteCode());
        }
        return routeRepository.save(route);
    }
    
    /**
     * Update an existing route
     * @param id the route ID
     * @param routeDetails the updated route details
     * @return Optional updated route
     */
    public Optional<Route> updateRoute(Long id, Route routeDetails) {
        return routeRepository.findById(id)
                .map(existingRoute -> {
                    // Check if route code is being changed and if new code already exists
                    if (!existingRoute.getRouteCode().equals(routeDetails.getRouteCode()) &&
                        routeRepository.existsByRouteCode(routeDetails.getRouteCode())) {
                        throw new IllegalArgumentException("Route code already exists: " + routeDetails.getRouteCode());
                    }
                    
                    existingRoute.setRouteCode(routeDetails.getRouteCode());
                    existingRoute.setDepartureCity(routeDetails.getDepartureCity());
                    existingRoute.setDepartureAirport(routeDetails.getDepartureAirport());
                    existingRoute.setArrivalCity(routeDetails.getArrivalCity());
                    existingRoute.setArrivalAirport(routeDetails.getArrivalAirport());
                    existingRoute.setDistanceKm(routeDetails.getDistanceKm());
                    existingRoute.setEstimatedDuration(routeDetails.getEstimatedDuration());
                    existingRoute.setStatus(routeDetails.getStatus());
                    
                    return routeRepository.save(existingRoute);
                });
    }
    
    /**
     * Delete a route
     * @param id the route ID
     * @return true if deleted, false if not found
     */
    public boolean deleteRoute(Long id) {
        if (routeRepository.existsById(id)) {
            routeRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    /**
     * Activate a route
     * @param id the route ID
     * @return Optional updated route
     */
    public Optional<Route> activateRoute(Long id) {
        return routeRepository.findById(id)
                .map(route -> {
                    route.setStatus(Route.RouteStatus.ACTIVE);
                    return routeRepository.save(route);
                });
    }
    
    /**
     * Deactivate a route
     * @param id the route ID
     * @return Optional updated route
     */
    public Optional<Route> deactivateRoute(Long id) {
        return routeRepository.findById(id)
                .map(route -> {
                    route.setStatus(Route.RouteStatus.INACTIVE);
                    return routeRepository.save(route);
                });
    }
    
    /**
     * Check if route code exists
     * @param routeCode the route code
     * @return true if exists, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean routeCodeExists(String routeCode) {
        return routeRepository.existsByRouteCode(routeCode);
    }
}
