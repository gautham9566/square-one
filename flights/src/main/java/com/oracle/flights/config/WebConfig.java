package com.oracle.flights.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration for CORS and other web-related settings
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
    // CORS is handled centrally by the API Gateway. Removing service-level
    // CORS mappings prevents duplicate Access-Control-Allow-Origin headers.
    // If you need direct access to this service (bypassing the gateway)
    // during local development, re-enable an appropriate mapping here.
    }
}
