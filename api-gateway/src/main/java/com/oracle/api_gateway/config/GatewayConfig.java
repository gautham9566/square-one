package com.oracle.api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Gateway Route Configuration for Airline Management System
 * Routes requests to appropriate microservices based on path patterns
 */
@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Authentication Service (Backend1) Routes
                .route("auth-service", r -> r
                        .path("/api/auth/**", "/api/tasks/**")
                        .uri("lb://backend1"))
                
                // Flights Service Routes
                .route("flights-service", r -> r
                        .path("/flights/**")
                        .uri("lb://flights"))
                
                // Passengers Service Routes
                .route("passengers-service", r -> r
                        .path("/passengers/**")
                        .uri("lb://passengers"))
                
                // User Management Service Routes
                .route("users-service", r -> r
                        .path("/users/**")
                        .uri("lb://usermanagement"))
                
                // Service Management Routes
                .route("services-management", r -> r
                        .path("/services/**")
                        .uri("http://localhost:8084"))
                
                // Travel History Service Routes
                .route("travel-history-service", r -> r
                        .path("/history/**")
                        .uri("http://localhost:8085"))
                
                // Health Check Routes for all services
                .route("eureka-health", r -> r
                        .path("/eureka/**")
                        .uri("http://localhost:8761"))
                
                // Actuator endpoints for individual services
                .route("backend1-actuator", r -> r
                        .path("/actuator/backend1/**")
                        .filters(f -> f.rewritePath("/actuator/backend1/(?<segment>.*)", "/actuator/${segment}"))
                        .uri("lb://backend1"))
                
                .route("flights-actuator", r -> r
                        .path("/actuator/flights/**")
                        .filters(f -> f.rewritePath("/actuator/flights/(?<segment>.*)", "/actuator/${segment}"))
                        .uri("lb://flights"))
                
                .route("passengers-actuator", r -> r
                        .path("/actuator/passengers/**")
                        .filters(f -> f.rewritePath("/actuator/passengers/(?<segment>.*)", "/actuator/${segment}"))
                        .uri("lb://passengers"))
                
                .route("users-actuator", r -> r
                        .path("/actuator/users/**")
                        .filters(f -> f.rewritePath("/actuator/users/(?<segment>.*)", "/actuator/${segment}"))
                        .uri("lb://usermanagement"))
                
                .route("services-actuator", r -> r
                        .path("/actuator/services/**")
                        .filters(f -> f.rewritePath("/actuator/services/(?<segment>.*)", "/actuator/${segment}"))
                        .uri("lb://service_management"))
                
                .route("history-actuator", r -> r
                        .path("/actuator/history/**")
                        .filters(f -> f.rewritePath("/actuator/history/(?<segment>.*)", "/actuator/${segment}"))
                        .uri("lb://travel_history_service"))
                
                .build();
    }
}
