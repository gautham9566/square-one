package com.oracle.backend1.config;

import com.oracle.backend1.security.JwtRequestFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// CORS handled by API Gateway; imports removed

@Configuration
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public SecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        // CORS is handled centrally by the API Gateway to avoid duplicate headers.
        // If you need service-level CORS for direct access during development,
        // temporarily re-enable the following line.
        // .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/login").permitAll()   // login endpoint open to all
            .requestMatchers("/api/auth/validate-token").permitAll()   // token validation open to all
            .requestMatchers("/api/auth/roles").authenticated()   // roles endpoint requires authentication
            .requestMatchers("/api/tasks/**").authenticated() // allow any authenticated user
            .anyRequest().denyAll() // everything else blocked
        )
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

    http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Service-level CORS configuration removed to prevent duplicate
    // Access-Control-Allow-Origin headers when requests are proxied
    // through the API Gateway. The gateway's `CorsConfig` provides
    // the required CORS handling for frontend origins.
    // If you need to enable service-level CORS for local direct access,
    // re-add the @Bean and method body above.

    @Bean
    @SuppressWarnings("deprecation") // Using NoOpPasswordEncoder for demo purposes with plain text passwords in DB
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance(); // plain text comparison - matches DB dummy data
    }
}
