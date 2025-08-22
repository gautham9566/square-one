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

## 📋 Direct Service URLs for Postman Testing

### 🔐 Authentication Service (Backend1) - Port 8080

**Base URL**: `http://localhost:8080`

#### Authentication Endpoints
```
POST   http://localhost:8080/auth/login
POST   http://localhost:8080/auth/register
POST   http://localhost:8080/auth/refresh
GET    http://localhost:8080/auth/profile
```

#### User Management Endpoints
```
GET    http://localhost:8080/users
GET    http://localhost:8080/users/{id}
POST   http://localhost:8080/users
PUT    http://localhost:8080/users/{id}
DELETE http://localhost:8080/users/{id}
```

### ✈️ Flights Service - Port 8081

**Base URL**: `http://localhost:8081`

#### Flight CRUD Operations
```
GET    http://localhost:8081/flights
GET    http://localhost:8081/flights/{id}
POST   http://localhost:8081/flights
PUT    http://localhost:8081/flights/{id}
DELETE http://localhost:8081/flights/{id}
```

#### Flight Search & Filtering
```
GET    http://localhost:8081/flights/search?origin={origin}&destination={destination}
GET    http://localhost:8081/flights/search?date={yyyy-MM-dd}
GET    http://localhost:8081/flights/available
```

### 👥 Passengers Service - Port 8082

**Base URL**: `http://localhost:8082`

#### Passenger Operations
```
GET    http://localhost:8082/passengers
GET    http://localhost:8082/passengers/{id}
POST   http://localhost:8082/passengers
PUT    http://localhost:8082/passengers/{id}
DELETE http://localhost:8082/passengers/{id}
```

#### Booking Operations
```
GET    http://localhost:8082/passengers/{id}/bookings
POST   http://localhost:8082/passengers/{id}/bookings
GET    http://localhost:8082/bookings/{bookingId}
```

### 👤 User Management Service - Port 8083

**Base URL**: `http://localhost:8083`

#### User Operations
```
GET    http://localhost:8083/users
GET    http://localhost:8083/users/{id}
POST   http://localhost:8083/users
PUT    http://localhost:8083/users/{id}
DELETE http://localhost:8083/users/{id}
```

#### User Profile Management
```
GET    http://localhost:8083/users/{id}/profile
PUT    http://localhost:8083/users/{id}/profile
GET    http://localhost:8083/users/{id}/preferences
PUT    http://localhost:8083/users/{id}/preferences
```

### 🛎️ Service Management - Port 8084

**Base URL**: `http://localhost:8084`

#### Flight Services
```
GET    http://localhost:8084/services/flight/{flightId}
POST   http://localhost:8084/services/flight/{flightId}
PUT    http://localhost:8084/services/flight/{flightId}
DELETE http://localhost:8084/services/flight/{flightId}
```

#### Service Categories
```
GET    http://localhost:8084/services/categories
GET    http://localhost:8084/services/categories/{categoryId}
POST   http://localhost:8084/services/categories
```

### 📚 Travel History Service - Port 8085

**Base URL**: `http://localhost:8085`

#### Travel History Operations
```
GET    http://localhost:8085/travel-history
GET    http://localhost:8085/travel-history/{id}
POST   http://localhost:8085/travel-history
PUT    http://localhost:8085/travel-history/{id}
DELETE http://localhost:8085/travel-history/{id}
```

#### User Travel History
```
GET    http://localhost:8085/travel-history/user/{userId}
GET    http://localhost:8085/travel-history/user/{userId}/summary
GET    http://localhost:8085/travel-history/user/{userId}/stats
```

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
