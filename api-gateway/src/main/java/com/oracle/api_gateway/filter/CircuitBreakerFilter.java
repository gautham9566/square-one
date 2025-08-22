package com.oracle.api_gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple Circuit Breaker Filter for API Gateway
 * Provides basic circuit breaker functionality to handle service failures
 */
@Component
public class CircuitBreakerFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(CircuitBreakerFilter.class);
    
    // Circuit breaker state per service
    private final ConcurrentHashMap<String, CircuitBreakerState> circuitStates = new ConcurrentHashMap<>();
    
    // Configuration
    private static final int FAILURE_THRESHOLD = 5;
    private static final Duration TIMEOUT_DURATION = Duration.ofMinutes(1);
    private static final int HALF_OPEN_MAX_CALLS = 3;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String serviceName = extractServiceName(exchange.getRequest().getURI().getPath());
        
        if (serviceName == null) {
            return chain.filter(exchange);
        }
        
        CircuitBreakerState state = circuitStates.computeIfAbsent(serviceName, 
            k -> new CircuitBreakerState());
        
        // Check circuit breaker state
        if (state.isOpen()) {
            if (state.shouldAttemptReset()) {
                state.halfOpen();
                logger.info("Circuit breaker for {} is now HALF_OPEN", serviceName);
            } else {
                logger.warn("Circuit breaker for {} is OPEN, rejecting request", serviceName);
                return handleCircuitOpen(exchange);
            }
        }
        
        return chain.filter(exchange)
            .doOnSuccess(aVoid -> {
                // Success - reset failure count
                state.recordSuccess();
                if (state.isHalfOpen()) {
                    state.close();
                    logger.info("Circuit breaker for {} is now CLOSED", serviceName);
                }
            })
            .doOnError(throwable -> {
                // Failure - increment failure count
                state.recordFailure();
                if (state.shouldOpen()) {
                    state.open();
                    logger.warn("Circuit breaker for {} is now OPEN due to failures", serviceName);
                }
            });
    }
    
    private String extractServiceName(String path) {
        if (path.startsWith("/api/auth") || path.startsWith("/api/tasks")) {
            return "backend1";
        } else if (path.startsWith("/flights")) {
            return "flights";
        } else if (path.startsWith("/passengers")) {
            return "passengers";
        } else if (path.startsWith("/users")) {
            return "usermanagement";
        } else if (path.startsWith("/services")) {
            return "service_management";
        } else if (path.startsWith("/history")) {
            return "travel_history_service";
        }
        return null;
    }
    
    private Mono<Void> handleCircuitOpen(ServerWebExchange exchange) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.SERVICE_UNAVAILABLE);
        response.getHeaders().add("Content-Type", "application/json");
        
        String errorBody = "{\"error\":\"Service temporarily unavailable\",\"message\":\"Circuit breaker is open\"}";
        return response.writeWith(Mono.just(response.bufferFactory().wrap(errorBody.getBytes())));
    }

    @Override
    public int getOrder() {
        return 2; // Execute after authentication filter
    }
    
    /**
     * Circuit Breaker State Management
     */
    private static class CircuitBreakerState {
        private volatile State state = State.CLOSED;
        private final AtomicInteger failureCount = new AtomicInteger(0);
        private final AtomicInteger halfOpenCalls = new AtomicInteger(0);
        private volatile long lastFailureTime = 0;
        
        enum State {
            CLOSED, OPEN, HALF_OPEN
        }
        
        public boolean isOpen() {
            return state == State.OPEN;
        }
        
        public boolean isHalfOpen() {
            return state == State.HALF_OPEN;
        }
        
        public boolean shouldOpen() {
            return state == State.CLOSED && failureCount.get() >= FAILURE_THRESHOLD;
        }
        
        public boolean shouldAttemptReset() {
            return state == State.OPEN && 
                   System.currentTimeMillis() - lastFailureTime > TIMEOUT_DURATION.toMillis();
        }
        
        public void recordSuccess() {
            failureCount.set(0);
            halfOpenCalls.set(0);
        }
        
        public void recordFailure() {
            failureCount.incrementAndGet();
            lastFailureTime = System.currentTimeMillis();
        }
        
        public void open() {
            state = State.OPEN;
            lastFailureTime = System.currentTimeMillis();
        }
        
        public void close() {
            state = State.CLOSED;
            failureCount.set(0);
            halfOpenCalls.set(0);
        }
        
        public void halfOpen() {
            state = State.HALF_OPEN;
            halfOpenCalls.set(0);
        }
    }
}
