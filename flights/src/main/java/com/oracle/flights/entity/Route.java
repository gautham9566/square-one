package com.oracle.flights.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * Entity representing a flight route
 */
@Entity
@Table(name = "routes")
public class Route {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Long routeId;
    
    @NotBlank(message = "Route code is required")
    @Size(max = 20, message = "Route code must not exceed 20 characters")
    @Column(name = "route_code", unique = true, nullable = false)
    private String routeCode;
    
    @NotBlank(message = "Departure city is required")
    @Size(max = 50, message = "Departure city must not exceed 50 characters")
    @Column(name = "departure_city", nullable = false)
    private String departureCity;
    
    @NotBlank(message = "Departure airport is required")
    @Size(max = 10, message = "Departure airport must not exceed 10 characters")
    @Column(name = "departure_airport", nullable = false)
    private String departureAirport;
    
    @NotBlank(message = "Arrival city is required")
    @Size(max = 50, message = "Arrival city must not exceed 50 characters")
    @Column(name = "arrival_city", nullable = false)
    private String arrivalCity;
    
    @NotBlank(message = "Arrival airport is required")
    @Size(max = 10, message = "Arrival airport must not exceed 10 characters")
    @Column(name = "arrival_airport", nullable = false)
    private String arrivalAirport;
    
    @Column(name = "distance_km")
    private Integer distanceKm;
    
    @Column(name = "estimated_duration")
    private Integer estimatedDuration; // in minutes
    
    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RouteStatus status = RouteStatus.ACTIVE;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Route() {}
    
    public Route(String routeCode, String departureCity, String departureAirport, 
                 String arrivalCity, String arrivalAirport) {
        this.routeCode = routeCode;
        this.departureCity = departureCity;
        this.departureAirport = departureAirport;
        this.arrivalCity = arrivalCity;
        this.arrivalAirport = arrivalAirport;
    }
    
    // JPA lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getRouteId() {
        return routeId;
    }
    
    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }
    
    public String getRouteCode() {
        return routeCode;
    }
    
    public void setRouteCode(String routeCode) {
        this.routeCode = routeCode;
    }
    
    public String getDepartureCity() {
        return departureCity;
    }
    
    public void setDepartureCity(String departureCity) {
        this.departureCity = departureCity;
    }
    
    public String getDepartureAirport() {
        return departureAirport;
    }
    
    public void setDepartureAirport(String departureAirport) {
        this.departureAirport = departureAirport;
    }
    
    public String getArrivalCity() {
        return arrivalCity;
    }
    
    public void setArrivalCity(String arrivalCity) {
        this.arrivalCity = arrivalCity;
    }
    
    public String getArrivalAirport() {
        return arrivalAirport;
    }
    
    public void setArrivalAirport(String arrivalAirport) {
        this.arrivalAirport = arrivalAirport;
    }
    
    public Integer getDistanceKm() {
        return distanceKm;
    }
    
    public void setDistanceKm(Integer distanceKm) {
        this.distanceKm = distanceKm;
    }
    
    public Integer getEstimatedDuration() {
        return estimatedDuration;
    }
    
    public void setEstimatedDuration(Integer estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }
    
    public RouteStatus getStatus() {
        return status;
    }
    
    public void setStatus(RouteStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    // toString method
    @Override
    public String toString() {
        return "Route{" +
                "routeId=" + routeId +
                ", routeCode='" + routeCode + '\'' +
                ", departureCity='" + departureCity + '\'' +
                ", departureAirport='" + departureAirport + '\'' +
                ", arrivalCity='" + arrivalCity + '\'' +
                ", arrivalAirport='" + arrivalAirport + '\'' +
                ", distanceKm=" + distanceKm +
                ", estimatedDuration=" + estimatedDuration +
                ", status=" + status +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
    
    // Enum for route status
    public enum RouteStatus {
        ACTIVE,
        INACTIVE
    }
}
