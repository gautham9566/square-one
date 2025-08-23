package com.oracle.flights.controller;

import com.oracle.flights.entity.Route;
import com.oracle.flights.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Route operations
 */
@RestController
@RequestMapping("/routes")
public class RouteController {
    
    private final RouteService routeService;
    
    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }
    
    /**
     * GET /routes - Get all routes
     * @return list of all routes
     */
    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        List<Route> routes = routeService.getAllRoutes();
        return ResponseEntity.ok(routes);
    }
    
    /**
     * GET /routes/{id} - Get route by ID
     * @param id the route ID
     * @return the route if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable Long id) {
        return routeService.getRouteById(id)
                .map(route -> ResponseEntity.ok(route))
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * GET /routes/code/{routeCode} - Get route by route code
     * @param routeCode the route code (e.g., "NYC-LON")
     * @return the route if found
     */
    @GetMapping("/code/{routeCode}")
    public ResponseEntity<Route> getRouteByCode(@PathVariable String routeCode) {
        return routeService.getRouteByCode(routeCode)
                .map(route -> ResponseEntity.ok(route))
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * GET /routes/active - Get all active routes
     * @return list of active routes
     */
    @GetMapping("/active")
    public ResponseEntity<List<Route>> getActiveRoutes() {
        List<Route> routes = routeService.getActiveRoutes();
        return ResponseEntity.ok(routes);
    }
    
    /**
     * GET /routes/departure/{airport} - Get routes by departure airport
     * @param airport the departure airport code
     * @return list of routes
     */
    @GetMapping("/departure/{airport}")
    public ResponseEntity<List<Route>> getRoutesByDepartureAirport(@PathVariable String airport) {
        List<Route> routes = routeService.getRoutesByDepartureAirport(airport);
        return ResponseEntity.ok(routes);
    }
    
    /**
     * GET /routes/arrival/{airport} - Get routes by arrival airport
     * @param airport the arrival airport code
     * @return list of routes
     */
    @GetMapping("/arrival/{airport}")
    public ResponseEntity<List<Route>> getRoutesByArrivalAirport(@PathVariable String airport) {
        List<Route> routes = routeService.getRoutesByArrivalAirport(airport);
        return ResponseEntity.ok(routes);
    }
    
    /**
     * GET /routes/departure-city/{city} - Get routes by departure city
     * @param city the departure city
     * @return list of routes
     */
    @GetMapping("/departure-city/{city}")
    public ResponseEntity<List<Route>> getRoutesByDepartureCity(@PathVariable String city) {
        List<Route> routes = routeService.getRoutesByDepartureCity(city);
        return ResponseEntity.ok(routes);
    }
    
    /**
     * GET /routes/arrival-city/{city} - Get routes by arrival city
     * @param city the arrival city
     * @return list of routes
     */
    @GetMapping("/arrival-city/{city}")
    public ResponseEntity<List<Route>> getRoutesByArrivalCity(@PathVariable String city) {
        List<Route> routes = routeService.getRoutesByArrivalCity(city);
        return ResponseEntity.ok(routes);
    }
    
    /**
     * GET /routes/search - Search routes by departure and arrival
     * @param departure departure city or airport code
     * @param arrival arrival city or airport code
     * @return list of matching routes
     */
    @GetMapping("/search")
    public ResponseEntity<List<Route>> searchRoutes(@RequestParam String departure, @RequestParam String arrival) {
        List<Route> routes = routeService.searchRoutes(departure, arrival);
        return ResponseEntity.ok(routes);
    }
    
    /**
     * POST /routes - Create a new route
     * @param route the route to create
     * @return the created route
     */
    @PostMapping
    public ResponseEntity<Route> createRoute(@Valid @RequestBody Route route) {
        try {
            Route createdRoute = routeService.createRoute(route);
            return new ResponseEntity<>(createdRoute, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * PUT /routes/{id} - Update an existing route
     * @param id the route ID
     * @param route the updated route details
     * @return the updated route
     */
    @PutMapping("/{id}")
    public ResponseEntity<Route> updateRoute(@PathVariable Long id, @Valid @RequestBody Route route) {
        try {
            return routeService.updateRoute(id, route)
                    .map(updatedRoute -> ResponseEntity.ok(updatedRoute))
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * DELETE /routes/{id} - Delete a route
     * @param id the route ID
     * @return no content if successful
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable Long id) {
        boolean deleted = routeService.deleteRoute(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * PUT /routes/{id}/activate - Activate a route
     * @param id the route ID
     * @return the updated route
     */
    @PutMapping("/{id}/activate")
    public ResponseEntity<Route> activateRoute(@PathVariable Long id) {
        return routeService.activateRoute(id)
                .map(route -> ResponseEntity.ok(route))
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * PUT /routes/{id}/deactivate - Deactivate a route
     * @param id the route ID
     * @return the updated route
     */
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Route> deactivateRoute(@PathVariable Long id) {
        return routeService.deactivateRoute(id)
                .map(route -> ResponseEntity.ok(route))
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * GET /routes/exists/{routeCode} - Check if route code exists
     * @param routeCode the route code
     * @return true if exists, false otherwise
     */
    @GetMapping("/exists/{routeCode}")
    public ResponseEntity<Boolean> routeCodeExists(@PathVariable String routeCode) {
        boolean exists = routeService.routeCodeExists(routeCode);
        return ResponseEntity.ok(exists);
    }
}
