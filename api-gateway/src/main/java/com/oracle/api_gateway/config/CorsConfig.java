package com.oracle.api_gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * CORS Configuration for API Gateway
 * Handles cross-origin requests from frontend applications
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allow specific origins (frontend applications)
        corsConfig.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:5173",  // Vite dev server
            "http://localhost:3000",  // React dev server
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000"
        ));
        
        // Allow all HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"
        ));
        
        // Allow all headers
        corsConfig.setAllowedHeaders(Collections.singletonList("*"));
        
        // Allow credentials (important for JWT tokens)
        corsConfig.setAllowCredentials(true);
        
        // Set max age for preflight requests
        corsConfig.setMaxAge(3600L);
        
        // Expose headers that frontend might need
        corsConfig.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        
        return new CorsWebFilter(source);
    }
}
