@echo off
echo Starting Airline Management System Microservices...
echo ================================================

:: Start Eureka Server first
echo Starting Eureka Server...
start "Eureka Server" cmd /k "cd eureka-server && mvn spring-boot:run"
timeout /t 15 /nobreak > nul

:: Start Backend1 (Authentication Service)
echo Starting Backend1 (Authentication)...
start "Backend1" cmd /k "cd backend1 && mvn spring-boot:run"
timeout /t 5 /nobreak > nul

:: Start Flights Service
echo Starting Flights Service...
start "Flights" cmd /k "cd flights && mvn spring-boot:run"
timeout /t 5 /nobreak > nul

:: Start Passengers Service
echo Starting Passengers Service...
start "Passengers" cmd /k "cd passengers && mvn spring-boot:run"
timeout /t 5 /nobreak > nul

:: Start User Management Service
echo Starting User Management Service...
start "User Management" cmd /k "cd usermanagement && mvn spring-boot:run"
timeout /t 5 /nobreak > nul

:: Start Service Management
echo Starting Service Management...
start "Service Management" cmd /k "cd service_management && mvn spring-boot:run"
timeout /t 5 /nobreak > nul

:: Start Travel History Service
echo Starting Travel History Service...
start "Travel History" cmd /k "cd travel_history_service && mvn spring-boot:run"
timeout /t 5 /nobreak > nul

:: Start Frontend
echo Starting Frontend Application...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo ================================================
echo All services are starting...
echo Please wait for all services to fully initialize.
echo 
echo Service URLs:
echo - Eureka Server: http://localhost:8761
echo - Backend1 (Auth): http://localhost:8080
echo - Flights: http://localhost:8081
echo - Passengers: http://localhost:8082
echo - User Management: http://localhost:8083
echo - Service Management: http://localhost:8084
echo - Travel History: http://localhost:8085
echo - Frontend: http://localhost:5173
echo ================================================
pause
