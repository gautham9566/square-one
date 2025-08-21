# Flight Management API

This Spring Boot application provides REST API endpoints for managing flight information and seat availability.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Oracle Database (configured in application.properties)

## Database Setup

1. Run the SQL schema from `../Database/airline-db-schema.sql` in your Oracle database
2. Update the database connection properties in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:oracle:thin:@localhost:1521:xe
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

## Running the Application

```bash
mvn spring-boot:run
```

The application will start on port 8080.

## API Endpoints

### Flight CRUD Operations

#### Get All Flights
```
GET /flights
```
Returns a list of all flights ordered by departure time.

#### Get Flight by ID
```
GET /flights/{id}
```
Returns a specific flight by its ID.

#### Create New Flight
```
POST /flights
Content-Type: application/json

{
  "flightName": "Flight 101",
  "flightDate": "2025-08-20",
  "route": "NYC-LON",
  "departureTime": "08:00 AM",
  "arrivalTime": "04:00 PM",
  "aircraftType": "Boeing 747",
  "totalSeats": 20,
  "availableSeats": 17,
  "servicesJson": "[\"Ancillary\", \"Meal\", \"Shopping\"]",
  "serviceSubtypesJson": "{\"Ancillary\": [\"Extra Baggage 5kg\"], \"Meal\": [\"Veg\", \"Non-Veg\"]}",
  "seatMapJson": "[{\"number\": 1, \"isBooked\": false}, {\"number\": 2, \"isBooked\": true}]"
}
```

#### Update Flight
```
PUT /flights/{id}
Content-Type: application/json

{
  "flightName": "Updated Flight 101",
  "flightDate": "2025-08-20",
  "route": "NYC-LON",
  "departureTime": "08:30 AM",
  "arrivalTime": "04:30 PM",
  "aircraftType": "Boeing 747",
  "totalSeats": 20,
  "availableSeats": 15
}
```

#### Delete Flight
```
DELETE /flights/{id}
```

### Specialized Query Endpoints

#### Get Flights by Route
```
GET /flights/route/{route}
```
Example: `GET /flights/route/NYC-LON`

#### Get Flights by Date
```
GET /flights/date/{date}
```
Example: `GET /flights/date/2025-08-20`

#### Get Flight Seat Availability
```
GET /flights/{flightId}/seats
```
Returns detailed seat map and availability information for a specific flight.

### Additional Endpoints

#### Get Flights with Available Seats
```
GET /flights/available
```

#### Get Flights by Route with Available Seats
```
GET /flights/route/{route}/available
```

#### Get Flights by Date with Available Seats
```
GET /flights/date/{date}/available
```

## Response Examples

### Flight Object
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
  "servicesJson": "[\"Ancillary\", \"Meal\", \"Shopping\"]",
  "serviceSubtypesJson": "{\"Ancillary\": [\"Extra Baggage 5kg\"]}",
  "seatMapJson": "[{\"number\": 1, \"isBooked\": false}]",
  "createdAt": "2025-08-21T10:30:00",
  "updatedAt": "2025-08-21T10:30:00"
}
```

### Seat Availability Response
```json
{
  "flightId": 1,
  "flightName": "Flight 101",
  "route": "NYC-LON",
  "flightDate": "2025-08-20",
  "totalSeats": 20,
  "availableSeats": 17,
  "seatMap": [
    {"number": 1, "isBooked": false},
    {"number": 2, "isBooked": true},
    {"number": 3, "isBooked": false}
  ]
}
```

## Error Handling

The API returns standardized error responses:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Flight not found with ID: 999",
  "path": "/flights/999",
  "timestamp": "2025-08-21 10:30:00"
}
```

## Testing

Run the tests with:
```bash
mvn test
```

The application includes comprehensive unit tests for all components.

## Health Check

The application includes Spring Boot Actuator for monitoring:
```
GET /actuator/health
```
