# JWT Testing Script for Airline Management System

Write-Host "=== JWT Implementation Testing ===" -ForegroundColor Green

# Test 1: Get JWT token from backend1
Write-Host "`n1. Testing JWT token generation from backend1..." -ForegroundColor Yellow

$loginData = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "✓ Successfully obtained JWT token from backend1" -ForegroundColor Green
    $token = $loginResponse.token
    Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Cyan
} catch {
    Write-Host "✗ Failed to get JWT token from backend1: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Test token validation on backend1
Write-Host "`n2. Testing token validation on backend1..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $validateResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/validate-token" -Method POST -Headers $headers
    Write-Host "✓ Token validation successful on backend1" -ForegroundColor Green
    Write-Host "Username: $($validateResponse.username), Role: $($validateResponse.role)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Token validation failed on backend1: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test flights service without token (should fail)
Write-Host "`n3. Testing flights service without JWT token (should fail)..." -ForegroundColor Yellow

try {
    $flightsResponse = Invoke-RestMethod -Uri "http://localhost:8081/flights" -Method GET
    Write-Host "✗ Flights service allowed access without token (security issue!)" -ForegroundColor Red
} catch {
    Write-Host "✓ Flights service correctly rejected request without token" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Cyan
}

# Test 4: Test flights service with valid JWT token (should succeed)
Write-Host "`n4. Testing flights service with valid JWT token..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $flightsResponse = Invoke-RestMethod -Uri "http://localhost:8081/flights" -Method GET -Headers $headers
    Write-Host "✓ Flights service accepted valid JWT token" -ForegroundColor Green
    Write-Host "Retrieved $($flightsResponse.Count) flights" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Flights service rejected valid JWT token: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Test flights service with invalid token (should fail)
Write-Host "`n5. Testing flights service with invalid JWT token (should fail)..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer invalid.token.here"
    }
    $flightsResponse = Invoke-RestMethod -Uri "http://localhost:8081/flights" -Method GET -Headers $headers
    Write-Host "✗ Flights service allowed access with invalid token (security issue!)" -ForegroundColor Red
} catch {
    Write-Host "✓ Flights service correctly rejected invalid token" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Cyan
}

Write-Host "`n=== JWT Testing Complete ===" -ForegroundColor Green
