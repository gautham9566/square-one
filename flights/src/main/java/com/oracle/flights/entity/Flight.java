package com.oracle.flights.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.oracle.flights.dto.SeatDto;
import com.oracle.flights.dto.ServiceSubtypesDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Flight entity representing the flights table
 */
@Entity
@Table(name = "flights")
public class Flight {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_id")
    private Long flightId;
    
    @NotNull
    @Column(name = "flight_name", length = 50, nullable = false)
    private String flightName;
    
    @NotNull
    @Column(name = "flight_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate flightDate;
    
    @NotNull
    @Column(name = "route", length = 20, nullable = false)
    private String route;
    
    @NotNull
    @Column(name = "departure_time", length = 20, nullable = false)
    private String departureTime;
    
    @NotNull
    @Column(name = "arrival_time", length = 20, nullable = false)
    private String arrivalTime;
    
    @Column(name = "aircraft_type", length = 50)
    private String aircraftType;
    
    @NotNull
    @Positive
    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;
    
    @NotNull
    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;
    
    @Lob
    @Column(name = "services")
    private String servicesJson;
    
    @Lob
    @Column(name = "service_subtypes")
    private String serviceSubtypesJson;
    
    @Lob
    @Column(name = "seat_map")
    private String seatMapJson;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Transient fields for JSON conversion
    @Transient
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    // Default constructor
    public Flight() {}
    
    // Constructor with essential fields
    public Flight(String flightName, LocalDate flightDate, String route, 
                  String departureTime, String arrivalTime, String aircraftType,
                  Integer totalSeats, Integer availableSeats) {
        this.flightName = flightName;
        this.flightDate = flightDate;
        this.route = route;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.aircraftType = aircraftType;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
    }
    
    // Getters and setters
    public Long getFlightId() {
        return flightId;
    }
    
    public void setFlightId(Long flightId) {
        this.flightId = flightId;
    }
    
    public String getFlightName() {
        return flightName;
    }
    
    public void setFlightName(String flightName) {
        this.flightName = flightName;
    }
    
    public LocalDate getFlightDate() {
        return flightDate;
    }
    
    public void setFlightDate(LocalDate flightDate) {
        this.flightDate = flightDate;
    }
    
    public String getRoute() {
        return route;
    }
    
    public void setRoute(String route) {
        this.route = route;
    }
    
    public String getDepartureTime() {
        return departureTime;
    }
    
    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }
    
    public String getArrivalTime() {
        return arrivalTime;
    }
    
    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    
    public String getAircraftType() {
        return aircraftType;
    }
    
    public void setAircraftType(String aircraftType) {
        this.aircraftType = aircraftType;
    }
    
    public Integer getTotalSeats() {
        return totalSeats;
    }
    
    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }
    
    public Integer getAvailableSeats() {
        return availableSeats;
    }
    
    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }
    
    public String getServicesJson() {
        return servicesJson;
    }
    
    public void setServicesJson(String servicesJson) {
        this.servicesJson = servicesJson;
    }
    
    public String getServiceSubtypesJson() {
        return serviceSubtypesJson;
    }
    
    public void setServiceSubtypesJson(String serviceSubtypesJson) {
        this.serviceSubtypesJson = serviceSubtypesJson;
    }
    
    public String getSeatMapJson() {
        return seatMapJson;
    }
    
    public void setSeatMapJson(String seatMapJson) {
        this.seatMapJson = seatMapJson;
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
    
    // Helper methods for JSON conversion
    public List<String> getServices() {
        if (servicesJson == null || servicesJson.trim().isEmpty()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(servicesJson, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return List.of();
        }
    }
    
    public void setServices(List<String> services) {
        try {
            this.servicesJson = objectMapper.writeValueAsString(services);
        } catch (JsonProcessingException e) {
            this.servicesJson = "[]";
        }
    }
    
    public ServiceSubtypesDto getServiceSubtypes() {
        if (serviceSubtypesJson == null || serviceSubtypesJson.trim().isEmpty()) {
            return new ServiceSubtypesDto();
        }
        try {
            return objectMapper.readValue(serviceSubtypesJson, ServiceSubtypesDto.class);
        } catch (JsonProcessingException e) {
            return new ServiceSubtypesDto();
        }
    }
    
    public void setServiceSubtypes(ServiceSubtypesDto serviceSubtypes) {
        try {
            this.serviceSubtypesJson = objectMapper.writeValueAsString(serviceSubtypes);
        } catch (JsonProcessingException e) {
            this.serviceSubtypesJson = "{}";
        }
    }
    
    public List<SeatDto> getSeatMap() {
        if (seatMapJson == null || seatMapJson.trim().isEmpty()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(seatMapJson, new TypeReference<List<SeatDto>>() {});
        } catch (JsonProcessingException e) {
            return List.of();
        }
    }
    
    public void setSeatMap(List<SeatDto> seatMap) {
        try {
            this.seatMapJson = objectMapper.writeValueAsString(seatMap);
        } catch (JsonProcessingException e) {
            this.seatMapJson = "[]";
        }
    }
}
