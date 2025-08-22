package com.oracle.api_gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Global filter for logging all requests and responses through the API Gateway
 */
@Component
public class LoggingFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String timestamp = LocalDateTime.now().format(formatter);
        
        // Log incoming request
        logger.info("=== GATEWAY REQUEST [{}] ===", timestamp);
        logger.info("Method: {}", request.getMethod());
        logger.info("URI: {}", request.getURI());
        logger.info("Path: {}", request.getPath());
        logger.info("Headers: {}", request.getHeaders());
        logger.info("Remote Address: {}", request.getRemoteAddress());
        
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = exchange.getResponse();
            String responseTimestamp = LocalDateTime.now().format(formatter);
            
            // Log outgoing response
            logger.info("=== GATEWAY RESPONSE [{}] ===", responseTimestamp);
            logger.info("Status Code: {}", response.getStatusCode());
            logger.info("Response Headers: {}", response.getHeaders());
            logger.info("Request completed for: {} {}", request.getMethod(), request.getURI());
            logger.info("=====================================");
        }));
    }

    @Override
    public int getOrder() {
        return -1; // Execute this filter first
    }
}
