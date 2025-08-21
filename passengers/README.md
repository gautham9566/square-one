# Passenger Management API

This Spring Boot application provides REST API endpoints for managing passenger information, check-in processes, seating, and special requests in an airline management system.

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

1. Clone the repository
2. Navigate to the passengers directory
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will start on port 8081 by default.

## API Endpoints

### Passenger CRUD Operations

#### Get All Passengers
```http
GET /passengers
```
Returns a list of all passengers in the system.

#### Get Passenger by ID
```http
GET /passengers/{id}
```
Returns details of a specific passenger.

#### Create New Passenger
```http
POST /passengers
Content-Type: application/json

{
  "flightId": 1,
  "name": "John Doe",
  "phoneNumber": "123-456-7890",
  "address": "123 Main St",
  "passportNumber": "P123456",
  "dateOfBirth": "1990-01-01",
  "origin": "NYC",
  "destination": "LON",
  "services": ["Meal", "Shopping"],
  "mealType": "Veg",
  "mealName": "Pasta",
  "extraBaggage": 10,
  "shoppingItems": ["Magazine"],
  "seat": "12A",
  "wheelchair": false,
  "infant": false
}
```

#### Update Passenger
```http
PUT /passengers/{id}
Content-Type: application/json

{
  "name": "John Smith",
  "phoneNumber": "987-654-3210",
  "address": "456 Oak St",
  "seat": "14B"
}
```

#### Delete Passenger
```http
DELETE /passengers/{id}
```

### Flight-Specific Operations

#### Get Passengers by Flight
```http
GET /passengers/flight/{flightId}
```
Optional query parameters:
- `checkedIn=true/false` - Filter by check-in status
- `specialNeeds=true` - Filter passengers with special needs
- `missingInfo=true` - Filter passengers with missing mandatory information

#### Get Checked-in Passengers
```http
GET /passengers/flight/{flightId}/checkedin
```

#### Get Not Checked-in Passengers
```http
GET /passengers/flight/{flightId}/not-checkedin
```

#### Get Passengers with Special Needs
```http
GET /passengers/flight/{flightId}/special-needs
```

#### Get Passengers with Missing Information
```http
GET /passengers/flight/{flightId}/missing-info
```

### Check-in Operations

#### Check-in Passenger
```http
POST /passengers/checkin/{passengerId}
Content-Type: application/json

{
  "seat": "12A",
  "wheelchair": false,
  "infant": false,
  "specialRequests": "Window seat preferred"
}
```

### Seat Management

#### Assign Seat
```http
PUT /passengers/seat/{flightId}
Content-Type: application/json

{
  "passengerId": 1,
  "seat": "15C"
}
```

### Search Operations

#### Search Passengers by Name
```http
GET /passengers/search?name=John
```

## Data Models

### PassengerDto
```json
{
  "passengerId": 1,
  "flightId": 1,
  "name": "John Doe",
  "phoneNumber": "123-456-7890",
  "address": "123 Main St",
  "passportNumber": "P123456",
  "dateOfBirth": "1990-01-01",
  "origin": "NYC",
  "destination": "LON",
  "services": ["Meal", "Shopping"],
  "mealType": "Veg",
  "mealName": "Pasta",
  "extraBaggage": 10,
  "shoppingItems": ["Magazine"],
  "seat": "12A",
  "checkedIn": true,
  "wheelchair": false,
  "infant": false,
  "createdAt": "2025-08-21 10:30:00",
  "updatedAt": "2025-08-21 11:45:00"
}
```

## Error Handling

The API returns standardized error responses:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Passenger not found with ID: 999",
  "path": "/passengers/999",
  "timestamp": "2025-08-21 10:30:00"
}
```

Common HTTP status codes:
- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `204 No Content` - Successful deletion
- `400 Bad Request` - Invalid input data
- `404 Not Found` - Resource not found
- `409 Conflict` - Business rule violation (e.g., seat already taken)
- `500 Internal Server Error` - Unexpected server error

## Testing

### Run Unit Tests
```bash
mvn test
```

### Run Integration Tests
```bash
mvn test -Dtest=*IntegrationTest
```

### Run All Tests
```bash
mvn verify
```

## Business Rules

1. **Seat Assignment**: Seats must be unique per flight
2. **Check-in**: Passengers can only be checked in once
3. **Mandatory Fields**: Name, flight ID, origin, and destination are required
4. **Special Needs**: Wheelchair and infant flags help staff provide appropriate assistance
5. **Services**: JSON array of selected services (Meal, Shopping, Ancillary)
6. **Shopping Items**: JSON array of purchased items

## Configuration

### Application Properties
```properties
# Server Configuration
server.port=8081

# Database Configuration
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:orcl
spring.datasource.username=system
spring.datasource.password=orcl
spring.datasource.driver-class-name=oracle.jdbc.driver.OracleDriver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.OracleDialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true

# JSON Configuration
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.date-format=yyyy-MM-dd
```

## Monitoring

Health check endpoint:
```http
GET /actuator/health
```

Application info:
```http
GET /actuator/info
```
