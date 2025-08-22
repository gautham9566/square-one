package com.oracle.api_gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

/**
 * Global filter for handling JWT token forwarding and basic authentication checks
 */
@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationFilter.class);
    
    // Paths that don't require authentication
    private static final List<String> OPEN_ENDPOINTS = Arrays.asList(
        "/api/auth/login",
        "/api/auth/validate-token",
        "/actuator/health",
        "/actuator/info",
        "/eureka"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        
        logger.debug("Processing authentication for path: {}", path);
        
        // Check if the path is in the open endpoints list
        if (isOpenEndpoint(path)) {
            logger.debug("Open endpoint detected, skipping authentication: {}", path);
            return chain.filter(exchange);
        }
        
        // Extract Authorization header
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            logger.debug("JWT token found in request for path: {}", path);
            
            // Forward the Authorization header to downstream services
            ServerHttpRequest modifiedRequest = request.mutate()
                    .header(HttpHeaders.AUTHORIZATION, authHeader)
                    .build();
            
            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        } else {
            logger.warn("No valid JWT token found for protected endpoint: {}", path);
            
            // For now, we'll allow requests without tokens to pass through
            // The individual services will handle their own authentication
            // This can be modified later to enforce gateway-level authentication
            return chain.filter(exchange);
        }
    }
    
    private boolean isOpenEndpoint(String path) {
        return OPEN_ENDPOINTS.stream().anyMatch(endpoint -> 
            path.startsWith(endpoint) || path.contains(endpoint));
    }
    
    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        logger.error("Authentication error: {}", err);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return 1; // Execute after logging filter
    }
}
