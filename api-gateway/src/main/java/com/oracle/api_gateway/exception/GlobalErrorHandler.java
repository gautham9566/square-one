package com.oracle.api_gateway.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.cloud.gateway.support.NotFoundException;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * Global error handler for API Gateway
 * Handles various types of errors and provides consistent error responses
 */
@Component
@Order(-1)
public class GlobalErrorHandler implements ErrorWebExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalErrorHandler.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        ServerHttpResponse response = exchange.getResponse();
        
        if (response.isCommitted()) {
            return Mono.error(ex);
        }

        // Set content type
        response.getHeaders().add("Content-Type", MediaType.APPLICATION_JSON_VALUE);
        
        HttpStatus status;
        String message;
        String errorCode;

        if (ex instanceof NotFoundException) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = "Service is currently unavailable. Please try again later.";
            errorCode = "SERVICE_UNAVAILABLE";
            logger.error("Service not found: {}", ex.getMessage());
        } else if (ex instanceof ResponseStatusException) {
            ResponseStatusException rse = (ResponseStatusException) ex;
            status = HttpStatus.valueOf(rse.getStatusCode().value());
            message = rse.getReason() != null ? rse.getReason() : "An error occurred";
            errorCode = "RESPONSE_STATUS_ERROR";
            logger.error("Response status exception: {}", ex.getMessage());
        } else if (ex instanceof java.net.ConnectException) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = "Unable to connect to the requested service. The service may be down.";
            errorCode = "CONNECTION_ERROR";
            logger.error("Connection error: {}", ex.getMessage());
        } else if (ex instanceof java.util.concurrent.TimeoutException) {
            status = HttpStatus.GATEWAY_TIMEOUT;
            message = "Request timeout. The service took too long to respond.";
            errorCode = "TIMEOUT_ERROR";
            logger.error("Timeout error: {}", ex.getMessage());
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = "An unexpected error occurred. Please try again later.";
            errorCode = "INTERNAL_ERROR";
            logger.error("Unexpected error: ", ex);
        }

        response.setStatusCode(status);

        // Create error response
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        errorResponse.put("status", status.value());
        errorResponse.put("error", status.getReasonPhrase());
        errorResponse.put("message", message);
        errorResponse.put("errorCode", errorCode);
        errorResponse.put("path", exchange.getRequest().getPath().value());

        try {
            String body = objectMapper.writeValueAsString(errorResponse);
            DataBuffer buffer = response.bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8));
            return response.writeWith(Mono.just(buffer));
        } catch (JsonProcessingException e) {
            logger.error("Error creating error response", e);
            return response.setComplete();
        }
    }
}
