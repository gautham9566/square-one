# Services Management API

This Spring Boot application provides REST API endpoints for managing passenger services including meals, baggage, shopping, and other ancillary services in an airline management system.

## Features

- **Flight Services Management**: Get available services for flights
- **Passenger Services Management**: Manage individual passenger service requests
- **Meal Services**: Handle meal preferences and special dietary requirements
- **Baggage Services**: Manage extra baggage requests and weight allowances
- **Shopping Services**: Handle in-flight shopping requests and items
- **Service Statistics**: Get service usage statistics for flights
- **Comprehensive Validation**: Input validation and error handling
- **Database Integration**: Oracle database integration with JPA/Hibernate

## Technology Stack

- **Java 17**
- **Spring Boot 3.5.5**
- **Spring Data JPA**
- **Spring Web**
- **Spring Validation**
- **Oracle Database**
- **Jackson (JSON processing)**
- **Maven**

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Oracle Database (configured in application.properties)

## Database Setup

1. Run the SQL schema from `../Database/airline-db-schema.sql` in your Oracle database
2. Update the database connection properties in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:oracle:thin:@localhost:1521:orcl
   spring.datasource.username=system
   spring.datasource.password=orcl
   ```

## Running the Application

```bash
# Navigate to the service_management directory
cd service_management

# Run with Maven
mvn spring-boot:run

# Or build and run the JAR
mvn clean package
java -jar target/service_management-0.0.1-SNAPSHOT.jar
```

The application will start on port 8083 by default.

## API Endpoints

### Flight Services

#### Get Flight Services
```http
GET /services/flight/{flightId}
```
Returns available services for a specific flight.

**Response:**
```json
{
  "flightId": 1,
  "flightName": "Flight 101",
  "flightDate": "2025-08-20",
  "route": "NYC-LON",
  "departureTime": "08:00 AM",
  "arrivalTime": "04:00 PM",
  "aircraftType": "Boeing 747",
  "totalSeats": 20,
  "availableSeats": 17,
  "services": ["Ancillary", "Meal", "Shopping"],
  "serviceSubtypes": {
    "Ancillary": ["Extra Baggage 5kg", "Extra Baggage 10kg", "Priority Boarding"],
    "Meal": ["Veg", "Non-Veg", "Vegan", "Gluten-Free"],
    "Shopping": ["Magazine", "Perfume", "Sunglasses", "Headphones"]
  }
}
```

#### Get Flight Passenger Services
```http
GET /services/flight/{flightId}/passengers?serviceType={type}
```
Get passengers with services for a flight. Optional `serviceType` parameter can filter by:
- `meal` - passengers with meal services
- `shopping` - passengers with shopping services
- `ancillary` - passengers with ancillary services
- `baggage` - passengers with extra baggage

#### Get Flight Service Statistics
```http
GET /services/flight/{flightId}/stats
```
Returns service usage statistics for a flight.

### Passenger Services

#### Get Passenger Services
```http
GET /services/passenger/{passengerId}
```
Returns service information for a specific passenger.

#### Update Passenger Services//
```http
PUT /services/passenger/{passengerId}
Content-Type: application/json

{
  "passengerId": 1,
  "flightId": 1,
  "requestedServices": ["Meal", "Shopping"],
  "mealType": "Veg",
  "mealName": "Biryani",
  "shoppingItems": ["Magazine", "Perfume"],
  "serviceNotes": "Special dietary requirements"
}
```

#### Update Passenger Meal Service
```http
PUT /services/passenger/{passengerId}/meal
Content-Type: application/json

{
  "passengerId": 1,
  "flightId": 1,
  "mealType": "Veg",
  "mealName": "Biryani",
  "specialRequests": "No onions please"
}
```

#### Update Passenger Baggage Service
```http
PUT /services/passenger/{passengerId}/baggage
Content-Type: application/json

{
  "passengerId": 1,
  "flightId": 1,
  "extraBaggageWeight": 10,
  "baggageType": "Extra Baggage 10kg",
  "specialInstructions": "Fragile items"
}
```

#### Update Passenger Shopping Service//
```http
PUT /services/passenger/{passengerId}/shopping
Content-Type: application/json

{
  "passengerId": 1,
  "flightId": 1,
  "items": ["Magazine", "Perfume", "Headphones"],
  "deliveryInstructions": "Deliver to seat 12A"
}
```

### Service-Specific Endpoints

#### Meal Services
```http
GET /services/meals/flight/{flightId}?mealType={type}
```
Get passengers with meal services. Optional `mealType` parameter filters by meal type.

#### Baggage Services
```http
GET /services/baggage/flight/{flightId}
```
Get passengers with extra baggage services.

#### Shopping Services
```http
GET /services/shopping/flight/{flightId}
```
Get passengers with shopping services.

## Data Models

### Service Request
```json
{
  "passengerId": 1,
  "flightId": 1,
  "requestedServices": ["Meal", "Shopping", "Ancillary"],
  "mealType": "Veg",
  "mealName": "Biryani",
  "mealSpecialRequests": "No spicy food",
  "extraBaggageWeight": 10,
  "baggageType": "Extra Baggage 10kg",
  "shoppingItems": ["Magazine", "Perfume"],
  "serviceNotes": "VIP passenger"
}
```

### Service Response
```json
{
  "success": true,
  "message": "Services updated successfully",
  "operation": "UPDATE_SERVICES",
  "passengerId": 1,
  "flightId": 1,
  "updatedServices": {
    "passengerId": 1,
    "flightId": 1,
    "name": "Alice Johnson",
    "requestedServices": ["Meal", "Shopping"],
    "mealType": "Veg",
    "mealName": "Biryani",
    "shoppingItems": ["Magazine", "Perfume"],
    "updatedAt": "2025-08-21 12:30:00"
  },
  "timestamp": "2025-08-21 12:30:00"
}
```

## Error Handling

The API provides comprehensive error handling with detailed error messages:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid service request: Meal type is required when requesting meal service",
  "path": "/services/passenger/1",
  "timestamp": "2025-08-21 12:30:00"
}
```

## Configuration

### Application Properties
```properties
# Server Configuration
server.port=8083

# Database Configuration
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:orcl
spring.datasource.username=system
spring.datasource.password=orcl
spring.datasource.driver-class-name=oracle.jdbc.driver.OracleDriver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true

# JSON Configuration
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.date-format=yyyy-MM-dd

# Actuator Configuration
management.endpoints.web.exposure.include=health,info
```

## Business Rules

1. **Service Availability**: Services must be available for the flight before passengers can request them
2. **Service Validation**: Each service type has specific validation rules
3. **Meal Services**: Meal type is required, meal name is optional
4. **Baggage Services**: Extra baggage weight must be non-negative
5. **Shopping Services**: At least one item must be selected
6. **Flight-Passenger Relationship**: Passenger must belong to the specified flight
7. **Service Updates**: Services can be updated multiple times before flight departure

## Testing

The application includes comprehensive validation and error handling. Test the endpoints using tools like Postman or curl to ensure proper functionality.

## Integration

This service integrates with:
- **Flight Management Service** (port 8080) - for flight information
- **Passenger Management Service** (port 8081) - for passenger information
- **User Management Service** (port 8082) - for authentication and authorization

## Health Check

```http
GET /actuator/health
```

Returns the health status of the application and its dependencies.
