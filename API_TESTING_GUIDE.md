# Airline Management System - API Testing Guide

This guide provides all the API endpoints for testing the microservices architecture with Postman.

## 🏗️ Architecture Overview

- **Eureka Server**: Service Discovery (Port 8761)
- **Backend1**: Main Authentication Service (Port 8080)
- **Flights Service**: Flight Management (Port 8081)
- **Passengers Service**: Passenger Management (Port 8082)
- **User Management**: User Operations (Port 8083)
- **Service Management**: Flight Services (Port 8084)
- **Travel History Service**: Travel Records (Port 8085)

## 🌐 Service Discovery URLs

When services communicate with each other through Eureka, use these service names:

```
http://BACKEND1/
http://FLIGHTS/
http://PASSENGERS/
http://USERMANAGEMENT/
http://SERVICE_MANAGEMENT/
http://TRAVEL_HISTORY_SERVICE/
```

## 📋 Direct Service URLs for Postman Testing (controller-driven)

Below is an updated, controller-driven list of endpoints discovered in the codebase. Use the service base URL + controller path shown for Postman tests and include the Authorization header (Bearer token) for protected routes.

### 🔐 Authentication Service (Backend1) - Port 8080

**Base URL**: `http://localhost:8080`

Controller: `@RequestMapping("/api/auth")`

Authentication endpoints
```
POST   http://localhost:8080/api/auth/login            # Authenticate user -> returns JWT
POST   http://localhost:8080/api/auth/validate-token   # Validate JWT token (Authorization header)
GET    http://localhost:8080/api/auth/roles            # Get current user's role/info (requires auth)
```

Note: backend1 exposes auth-related endpoints under `/api/auth`. Other user CRUD operations live in the User Management service.

### ✈️ Flights Service - Port 8081

**Base URL**: `http://localhost:8081`

Controller: `@RequestMapping("/flights")`

Flight operations
```
GET    http://localhost:8081/flights                   # Get all flights
GET    http://localhost:8081/flights/{id}              # Get flight by ID
POST   http://localhost:8081/flights                   # Create a new flight
PUT    http://localhost:8081/flights/{id}              # Update existing flight
DELETE http://localhost:8081/flights/{id}              # Delete a flight
```

Search / availability (common query patterns)
```
GET    http://localhost:8081/flights/search?origin={origin}&destination={destination}
GET    http://localhost:8081/flights/search?date={yyyy-MM-dd}
GET    http://localhost:8081/flights/available        # (if implemented) available flights
```

### 👥 Passengers Service - Port 8082

**Base URL**: `http://localhost:8082`

Controller: `@RequestMapping("/passengers")`

Passenger CRUD & actions
```
GET    http://localhost:8082/passengers                        # Get all passengers
GET    http://localhost:8082/passengers/{id}                   # Get passenger by ID
POST   http://localhost:8082/passengers                        # Create passenger
PUT    http://localhost:8082/passengers/{id}                   # Update passenger
DELETE http://localhost:8082/passengers/{id}                   # Delete passenger
```

Flight-scoped passenger queries
```
GET    http://localhost:8082/passengers/flight/{flightId}                  # List passengers for flight
  optional query params: ?checkedIn=true|false, ?specialNeeds=true, ?missingInfo=true
GET    http://localhost:8082/passengers/flight/{flightId}/checkedin        # Checked-in passengers
GET    http://localhost:8082/passengers/flight/{flightId}/not-checkedin    # Not checked-in
GET    http://localhost:8082/passengers/flight/{flightId}/special-needs    # Special needs
```

Other passenger actions
```
GET    http://localhost:8082/passengers/search?name={name}      # Search passengers by name
POST   http://localhost:8082/passengers/checkin/{passengerId}   # Check in passenger (body optional)
PUT    http://localhost:8082/passengers/seat/{flightId}         # Assign seat (body: seatAssignment)
```

Booking-related endpoints may exist in the passengers module depending on implementation (check controller code or `bookings` routes if present).

### 👤 User Management Service - Port 8083

**Base URL**: `http://localhost:8083`

Controller: `@RequestMapping("/users")`

User CRUD & lookup
```
GET    http://localhost:8083/users                         # Get all users
GET    http://localhost:8083/users/{id}                    # Get user by ID
POST   http://localhost:8083/users                         # Create a new user
PUT    http://localhost:8083/users/{id}                    # Update user
DELETE http://localhost:8083/users/{id}                    # Delete user
```

Additional user queries
```
GET    http://localhost:8083/users/username/{username}     # Get user by username
GET    http://localhost:8083/users/role/{role}             # Get users by role
GET    http://localhost:8083/users/count/role/{role}       # Count users by role
GET    http://localhost:8083/users/flight/{flightId}       # Get staff assigned to flight
GET    http://localhost:8083/users/staff                   # Get all staff members
GET    http://localhost:8083/users/exists/{username}       # Check if user exists
```

### 🛎️ Service Management - Port 8084

**Base URL**: `http://localhost:8084`

Controller: `@RequestMapping("/services")`

Passenger services (meals, baggage, shopping, ancillary)
```
GET    http://localhost:8084/services/flight/{flightId}/passengers      # Get passengers & services for a flight (opt: ?serviceType=meal|shopping|ancillary|baggage)
GET    http://localhost:8084/services/meals/flight/{flightId}?mealType={type}  # Filter meal-type passengers

PUT    http://localhost:8084/services/passenger/{passengerId}           # Update passenger services (generic ServiceRequestDto)
PUT    http://localhost:8084/services/passenger/{passengerId}/meal      # Update passenger meal
PUT    http://localhost:8084/services/passenger/{passengerId}/baggage   # Update baggage/excess baggage
PUT    http://localhost:8084/services/passenger/{passengerId}/shopping  # Update in-flight shopping
```

Service categories (if implemented)
```
GET    http://localhost:8084/services/categories
GET    http://localhost:8084/services/categories/{categoryId}
POST   http://localhost:8084/services/categories
```

### 📚 Travel History Service - Port 8085

**Base URL**: `http://localhost:8085`

Controller: `@RequestMapping("/history")` (travel history service uses `/history` base)

Travel history operations
```
GET    http://localhost:8085/history                             # Get all travel history records (if available)
GET    http://localhost:8085/history/{id}                        # Get travel history by ID
POST   http://localhost:8085/history                             # Create travel history record
PUT    http://localhost:8085/history/{id}                        # Update travel history
DELETE http://localhost:8085/history/{id}                        # Delete travel history
```

Passenger-specific queries
```
GET    http://localhost:8085/history/passenger/{passengerId}/status/{status}  # Get travel history filtered by status
GET    http://localhost:8085/history/user/{userId}             # (if implemented) history by user
GET    http://localhost:8085/history/user/{userId}/summary     # (if implemented) user summary
GET    http://localhost:8085/history/user/{userId}/stats       # (if implemented) user stats
```

### 🔧 Health & Debug endpoints

Each service exposes Spring Actuator endpoints (if enabled) and some services expose a custom health/info path.
```
GET    http://localhost:8761                                  # Eureka dashboard
GET    http://localhost:8080/actuator/health                  # Backend1 health (if actuator enabled)
GET    http://localhost:8081/actuator/health                  # Flights
GET    http://localhost:8082/actuator/health                  # Passengers
GET    http://localhost:8083/actuator/health                  # User Management
GET    http://localhost:8084/actuator/health                  # Service Management
GET    http://localhost:8085/actuator/health                  # Travel History

Some services expose lightweight health/info under their own controller paths (example: `GET /history/health` in travel history service).
```

Notes & guidance
- Use the base URLs above and the controller paths shown (controller mapping is authoritative).
- Protected endpoints require the Authorization header: `Authorization: Bearer <token>`.
- Some optional endpoints listed as "(if implemented)" exist in code variants; if a route returns 404, check the service's controller file for the exact mapping.
- For quick discovery, open the service's controller classes under each module (e.g., `flights/src/main/java/.../FlightController.java`) to confirm request parameters and request/response DTOs.

## 🔧 Health Check Endpoints

All services expose health check endpoints:

```
GET    http://localhost:8080/actuator/health
GET    http://localhost:8081/actuator/health
GET    http://localhost:8082/actuator/health
GET    http://localhost:8083/actuator/health
GET    http://localhost:8084/actuator/health
GET    http://localhost:8085/actuator/health
```

## 🎯 Eureka Dashboard

Monitor all registered services:
```
GET    http://localhost:8761
```

## 🔑 Authentication Headers

For protected endpoints, include JWT token in headers:

```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

## 📝 Sample Request Bodies

### Login Request
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

### Flight Creation
```json
{
  "flightNumber": "AA123",
  "origin": "NYC",
  "destination": "LAX",
  "departureTime": "2024-12-25T10:00:00",
  "arrivalTime": "2024-12-25T13:00:00",
  "capacity": 180,
  "price": 299.99
}
```

### Passenger Registration
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-15"
}
```

## 🚀 Testing Workflow

1. **Start Eureka Server** (Port 8761)
2. **Start all microservices** (Ports 8080-8085)
3. **Verify registration** at http://localhost:8761
4. **Test authentication** with Backend1
5. **Use JWT token** for protected endpoints
6. **Test service interactions** using both direct URLs and service discovery

## 📊 Service Communication Examples

### Internal Service Calls (via Eureka)
```
# From any service to flights service
http://FLIGHTS/flights

# From any service to user management
http://USERMANAGEMENT/users/{id}

# From any service to travel history
http://TRAVEL_HISTORY_SERVICE/travel-history/user/{userId}
```

## 🧪 Advanced Testing Scenarios

### Service-to-Service Communication Testing

#### 1. Flight Booking Flow
```
1. POST http://localhost:8080/auth/login (Get JWT token)
2. GET  http://localhost:8081/flights/search?origin=NYC&destination=LAX
3. POST http://localhost:8082/passengers/{id}/bookings
4. GET  http://localhost:8085/travel-history/user/{userId}
```

#### 2. User Registration & Profile Setup
```
1. POST http://localhost:8080/auth/register
2. POST http://localhost:8083/users/{id}/profile
3. PUT  http://localhost:8083/users/{id}/preferences
```

### Load Balancing Test (Multiple Instances)
If you run multiple instances of a service:
```bash
# Start second instance of flights service on different port
cd flights
mvn spring-boot:run -Dserver.port=8091
```

Both instances will register with Eureka and requests will be load-balanced.

## 🔍 Monitoring & Debugging

### Eureka Service Registry
```
GET http://localhost:8761/eureka/apps
GET http://localhost:8761/eureka/apps/{SERVICE_NAME}
```

### Service Instance Information
```
GET http://localhost:8761/eureka/apps/FLIGHTS
GET http://localhost:8761/eureka/apps/PASSENGERS
```

## 🛠️ Postman Collection Setup

### Environment Variables
Create a Postman environment with these variables:
```
eureka_server = http://localhost:8761
backend1_url = http://localhost:8080
flights_url = http://localhost:8081
passengers_url = http://localhost:8082
users_url = http://localhost:8083
services_url = http://localhost:8084
history_url = http://localhost:8085
jwt_token = {{token_from_login_response}}
```

### Pre-request Scripts
For authenticated requests, add this pre-request script:
```javascript
// Auto-login if token is expired
if (!pm.environment.get("jwt_token")) {
    pm.sendRequest({
        url: pm.environment.get("backend1_url") + "/auth/login",
        method: 'POST',
        header: {'Content-Type': 'application/json'},
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                "username": "admin@example.com",
                "password": "admin123"
            })
        }
    }, function (err, response) {
        if (response.json().token) {
            pm.environment.set("jwt_token", response.json().token);
        }
    });
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Service not registering with Eureka**
   - Check if Eureka server is running on port 8761
   - Verify `eureka.client.service-url.defaultZone` in application.properties

2. **Service discovery not working**
   - Ensure `eureka.client.fetch-registry=true`
   - Check service names match exactly (case-sensitive)

3. **JWT Authentication failing**
   - Verify token is included in Authorization header
   - Check token expiration time

### Debug Endpoints
```
GET http://localhost:8761/actuator/health
GET http://localhost:8080/actuator/info
GET http://localhost:8081/actuator/metrics
```

---

**Note**: Replace `{id}`, `{userId}`, `{flightId}` etc. with actual values when testing.

**Pro Tip**: Use Postman's Collection Runner to automate testing workflows and Newman for CI/CD integration.
