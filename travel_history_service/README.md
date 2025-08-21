# Travel History Service

This Spring Boot application provides REST API endpoints for managing passenger travel records and booking history in an airline management system.

## Purpose

The Travel History Service manages passenger travel records and booking history, providing comprehensive endpoints to retrieve historical travel data by passenger, booking reference, or flight.

## Key Features

- **Passenger Travel History**: Retrieve complete travel history for any passenger
- **Booking Reference Lookup**: Find travel records by booking reference
- **Flight History**: Get all travel history for a specific flight
- **Status Filtering**: Filter travel history by status (Completed, Cancelled, Pending, etc.)
- **Recent History**: Get recent travel history (last 30 days)
- **Comprehensive Data**: Includes passenger details, flight information, and travel metadata
- **Error Handling**: Robust error handling with detailed error responses
- **Validation**: Input validation for all endpoints
- **Testing**: Comprehensive unit and integration tests

## Key Entities

- **travel_history table**: Main entity storing travel records
- **passengers table**: Passenger information (minimal for relationships)
- **flights table**: Flight information (minimal for relationships)

## API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/history/passenger/{passengerId}` | Get passenger travel history |
| GET | `/history/booking/{reference}` | Get booking by reference |
| GET | `/history/flight/{flightId}` | Get history for specific flight |

### Additional Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/history/passenger/{passengerId}/recent` | Get recent travel history (last 30 days) |
| GET | `/history/passenger/{passengerId}/status/{status}` | Get travel history by status |
| GET | `/history/health` | Health check endpoint |
| GET | `/history/info` | API information |

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

1. **Clone the repository** (if not already done)
2. **Navigate to the service directory**:
   ```bash
   cd travel_history_service
   ```
3. **Build the application**:
   ```bash
   mvn clean compile
   ```
4. **Run tests**:
   ```bash
   mvn test
   ```
5. **Start the application**:
   ```bash
   mvn spring-boot:run
   ```

The service will start on port **8084** by default.

## API Usage Examples

### Get Passenger Travel History
```bash
curl -X GET "http://localhost:8084/history/passenger/1" \
     -H "Content-Type: application/json"
```

### Get Booking by Reference
```bash
curl -X GET "http://localhost:8084/history/booking/ABC123" \
     -H "Content-Type: application/json"
```

### Get Flight History
```bash
curl -X GET "http://localhost:8084/history/flight/1" \
     -H "Content-Type: application/json"
```

### Get Recent Travel History
```bash
curl -X GET "http://localhost:8084/history/passenger/1/recent" \
     -H "Content-Type: application/json"
```

### Get Travel History by Status
```bash
curl -X GET "http://localhost:8084/history/passenger/1/status/Completed" \
     -H "Content-Type: application/json"
```

## Response Format

All endpoints return a standardized response format:

```json
{
  "success": true,
  "message": "Travel history retrieved successfully",
  "totalRecords": 2,
  "travelHistory": [
    {
      "historyId": 1,
      "passengerId": 1,
      "flightId": 1,
      "travelDate": "2024-12-15",
      "origin": "NYC",
      "destination": "LON",
      "seat": "12A",
      "bookingReference": "ABC123",
      "fareClass": "Economy",
      "status": "Completed",
      "distanceKm": 5567,
      "durationMin": 420,
      "notes": "On-time arrival",
      "createdAt": "2024-12-15 10:30:00",
      "passengerDetails": {
        "passengerId": 1,
        "name": "Alice Johnson",
        "phoneNumber": "123-456-7890",
        "seat": "12A",
        "checkedIn": "Y"
      },
      "flightDetails": {
        "flightId": 1,
        "flightName": "Flight 101",
        "flightDate": "2025-08-20",
        "route": "NYC-LON",
        "departureTime": "08:00 AM",
        "arrivalTime": "04:00 PM",
        "aircraftType": "Boeing 747"
      }
    }
  ],
  "filterType": "passenger",
  "filterValue": "1",
  "timestamp": "2024-12-15 15:30:00"
}
```

## Error Handling

The service provides comprehensive error handling:

- **400 Bad Request**: Invalid parameters or validation errors
- **404 Not Found**: Passenger, flight, or booking reference not found
- **500 Internal Server Error**: Database or system errors

Error response format:
```json
{
  "success": false,
  "message": "Passenger not found with ID: 999",
  "totalRecords": 0,
  "timestamp": "2024-12-15 15:30:00"
}
```

## Testing

Run the test suite:
```bash
mvn test
```

The service includes:
- Unit tests for service layer
- Integration tests for controller endpoints
- Mock data for testing scenarios

## Configuration

Key configuration properties in `application.properties`:

```properties
# Server Configuration
server.port=8084

# Database Configuration
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:orcl
spring.datasource.username=system
spring.datasource.password=orcl

# JPA Configuration
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true

# JSON Configuration
spring.jackson.date-format=yyyy-MM-dd
```

## Monitoring

The service includes Spring Boot Actuator endpoints:
- `/actuator/health` - Health check
- `/actuator/info` - Application information

## Development

### Project Structure
```
src/
├── main/java/com/oracle/travel_history_service/
│   ├── controller/          # REST controllers
│   ├── service/            # Business logic
│   ├── repository/         # Data access layer
│   ├── entity/            # JPA entities
│   ├── dto/               # Data transfer objects
│   └── exception/         # Exception handling
└── test/                  # Unit and integration tests
```

### Adding New Features

1. Create/update entities in the `entity` package
2. Add repository methods in the `repository` package
3. Implement business logic in the `service` package
4. Create DTOs for API responses in the `dto` package
5. Add REST endpoints in the `controller` package
6. Write comprehensive tests

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify Oracle database is running
   - Check connection properties in application.properties
   - Ensure database schema is properly set up

2. **Port Conflicts**
   - Change server.port in application.properties if 8084 is in use

3. **Memory Issues**
   - Increase JVM heap size: `-Xmx512m`

### Logs

Check application logs for detailed error information. The service uses SLF4J with Logback for logging.
