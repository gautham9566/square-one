# API Gateway for Airline Management System

This Spring Cloud Gateway serves as the single entry point for all microservices in the Airline Management System. It provides service discovery, load balancing, routing, and cross-cutting concerns like CORS, logging, and circuit breaking.

## Features

- **Service Discovery**: Integrates with Eureka Server for automatic service discovery
- **Load Balancing**: Distributes requests across multiple service instances
- **Routing**: Routes requests to appropriate microservices based on path patterns
- **CORS Support**: Handles cross-origin requests from frontend applications
- **Circuit Breaker**: Provides fault tolerance with circuit breaker pattern
- **Request/Response Logging**: Comprehensive logging of all gateway traffic
- **Health Monitoring**: Actuator endpoints for monitoring gateway health
- **Error Handling**: Centralized error handling with consistent error responses

## Architecture

```
Frontend (Port 5173)
        ↓
API Gateway (Port 8090) ← Single Entry Point
        ↓
Eureka Server (Port 8761) ← Service Discovery
        ↓
┌─────────────────────────────────────────────────┐
│                Microservices                    │
├─────────────────────────────────────────────────┤
│ • Backend1 (Auth) - Port 8080                  │
│ • Flights Service - Port 8081                  │
│ • Passengers Service - Port 8082               │
│ • User Management - Port 8083                  │
│ • Service Management - Port 8084               │
│ • Travel History - Port 8085                   │
└─────────────────────────────────────────────────┘
```

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Eureka Server running on port 8761
- All microservices registered with Eureka

## Configuration

### Application Properties

```properties
# Server Configuration
server.port=8090

# Eureka Client Configuration
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true

# Gateway Configuration
spring.cloud.gateway.discovery.locator.enabled=true
spring.cloud.gateway.discovery.locator.lower-case-service-id=true

# CORS Configuration
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowed-origins=http://localhost:5173
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.cloud.gateway.globalcors.cors-configurations.[/**].allowed-headers=*
spring.cloud.gateway.globalcors.cors-configurations.[/**].allow-credentials=true
```

## Route Configuration

The gateway automatically routes requests based on the following patterns:

| Service | Route Pattern | Target Service |
|---------|---------------|----------------|
| Authentication | `/api/auth/**`, `/api/tasks/**` | `backend1` |
| Routes | `/flights/routes/**` | `flights` (mapped to `/routes/**`) |
| Flights | `/flights/**` | `flights` |
| Passengers | `/passengers/**` | `passengers` |
| User Management | `/users/**` | `usermanagement` |
| Service Management | `/services/**` | `service_management` |
| Travel History | `/history/**` | `travel_history_service` |

## Running the Gateway

### Using Maven

```bash
# Navigate to the api-gateway directory
cd api-gateway

# Run the application
mvn spring-boot:run
```

### Using JAR

```bash
# Build the application
mvn clean package

# Run the JAR
java -jar target/api-gateway-0.0.1-SNAPSHOT.jar
```

### Using the Startup Script

```bash
# Run the complete system (recommended)
./start-all-services.bat
```

## API Usage

### Base URL
All requests should be made to: `http://localhost:8090`

### Authentication
```bash
# Login through gateway
curl -X POST http://localhost:8090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"adminpass"}'

# Validate token through gateway
curl -X POST http://localhost:8090/api/auth/validate-token \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Service Endpoints
```bash
# Routes service through gateway
curl -X GET http://localhost:8090/flights/routes

# Flights service through gateway
curl -X GET http://localhost:8090/flights

# Passengers service through gateway
curl -X GET http://localhost:8090/passengers

# Users service through gateway
curl -X GET http://localhost:8090/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Services management through gateway
curl -X GET http://localhost:8090/services \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Travel history through gateway
curl -X GET http://localhost:8090/history/passenger/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Monitoring and Health Checks

### Gateway Health
```bash
curl http://localhost:8090/actuator/health
```

### Gateway Routes
```bash
curl http://localhost:8090/actuator/gateway/routes
```

### Service Discovery
```bash
curl http://localhost:8761/eureka/apps
```

## Testing

### Comprehensive Testing
```bash
# Run comprehensive API Gateway tests
./test/api-gateway-test.ps1
```

### Load Testing
```bash
# Run load tests
./test/gateway-load-test.ps1
```

### Health Check
```bash
# Quick health check of all services
./test/gateway-health-check.ps1
```

## Error Handling

The gateway provides consistent error responses:

```json
{
  "timestamp": "2025-08-22T10:30:00",
  "status": 503,
  "error": "Service Unavailable",
  "message": "Service is currently unavailable. Please try again later.",
  "errorCode": "SERVICE_UNAVAILABLE",
  "path": "/flights"
}
```

## Circuit Breaker

The gateway includes a simple circuit breaker implementation:

- **Failure Threshold**: 5 failures
- **Timeout Duration**: 1 minute
- **Half-Open Max Calls**: 3

When a service fails repeatedly, the circuit breaker opens and returns immediate error responses.

## CORS Configuration

The gateway is configured to allow cross-origin requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

## Logging

The gateway logs all requests and responses with the following information:
- Request method and URI
- Request headers
- Response status code
- Response time
- Remote address

## Troubleshooting

### Common Issues

1. **Service Not Found (503)**
   - Ensure the target service is running
   - Check Eureka registration: `http://localhost:8761`
   - Verify service name matches Eureka registration

2. **CORS Errors**
   - Check allowed origins in `application.properties`
   - Ensure frontend is running on allowed port

3. **Circuit Breaker Open**
   - Check target service health
   - Wait for circuit breaker timeout (1 minute)
   - Restart failing services

4. **Gateway Not Starting**
   - Ensure port 8090 is available
   - Check Eureka Server is running on port 8761
   - Verify all dependencies are resolved

### Debug Mode

Enable debug logging:
```properties
logging.level.org.springframework.cloud.gateway=DEBUG
logging.level.reactor.netty.http.client=DEBUG
```

## Performance Tuning

### Connection Timeouts
```properties
spring.cloud.gateway.httpclient.connect-timeout=10000
spring.cloud.gateway.httpclient.response-timeout=30s
```

### Circuit Breaker Tuning
```properties
resilience4j.circuitbreaker.instances.default.sliding-window-size=10
resilience4j.circuitbreaker.instances.default.minimum-number-of-calls=5
resilience4j.circuitbreaker.instances.default.failure-rate-threshold=50
```

## Security Considerations

- JWT tokens are forwarded to downstream services
- Open endpoints (login, health checks) don't require authentication
- All other endpoints require valid JWT tokens
- CORS is configured for specific origins only

## Development

### Project Structure
```
src/
├── main/java/com/oracle/api_gateway/
│   ├── config/
│   │   ├── GatewayConfig.java      # Route configuration
│   │   └── CorsConfig.java         # CORS configuration
│   ├── filter/
│   │   ├── LoggingFilter.java      # Request/response logging
│   │   ├── AuthenticationFilter.java # JWT token handling
│   │   └── CircuitBreakerFilter.java # Circuit breaker
│   ├── exception/
│   │   └── GlobalErrorHandler.java # Error handling
│   └── ApiGatewayApplication.java  # Main application
└── test/                           # Test scripts
```

### Adding New Routes

To add a new service route, update `GatewayConfig.java`:

```java
.route("new-service", r -> r
    .path("/new-service/**")
    .uri("lb://new-service-name"))
```

## Support

For issues and questions:
1. Check the logs: `logs/api-gateway.log`
2. Run health checks: `./test/gateway-health-check.ps1`
3. Verify Eureka registration: `http://localhost:8761`
4. Check service connectivity directly
