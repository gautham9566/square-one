# Service Management Endpoints Test Script
Write-Host "=== SERVICE MANAGEMENT ENDPOINTS TESTING ===" -ForegroundColor Green

# Configuration
$gatewayUrl = "http://localhost:8090"
$serviceUrl = "$gatewayUrl/services"

# Test data
$passengerId = 6
$flightId = 3

# Test 1: Shopping Service Endpoint
Write-Host "`n=== Testing Shopping Service Endpoint ===" -ForegroundColor Cyan

$shoppingRequest = @{
    passengerId = $passengerId
    flightId = $flightId
    items = @("Magazine", "Perfume", "Headphones")
    deliveryInstructions = "Deliver to seat 12A"
} | ConvertTo-Json

Write-Host "Testing PUT $serviceUrl/passenger/$passengerId/shopping" -ForegroundColor Yellow
Write-Host "Request Body:" -ForegroundColor Gray
Write-Host $shoppingRequest -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/passenger/$passengerId/shopping" -Method PUT -Body $shoppingRequest -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ Shopping Service Test PASSED" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.Exception.Response | Get-Content
    Write-Host "❌ Shopping Service Test FAILED" -ForegroundColor Red
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($errorBody) {
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}

# Test 2: General Service Request Endpoint
Write-Host "`n=== Testing General Service Request Endpoint ===" -ForegroundColor Cyan

$serviceRequest = @{
    passengerId = $passengerId
    flightId = $flightId
    requestedServices = @("Meal", "Shopping")
    mealType = "Veg"
    mealName = "Biryani"
    shoppingItems = @("Magazine", "Perfume")
    serviceNotes = "Special dietary requirements"
} | ConvertTo-Json

Write-Host "Testing PUT $serviceUrl/passenger/$passengerId" -ForegroundColor Yellow
Write-Host "Request Body:" -ForegroundColor Gray
Write-Host $serviceRequest -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/passenger/$passengerId" -Method PUT -Body $serviceRequest -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ General Service Request Test PASSED" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $errorBody = $_.Exception.Response | Get-Content
    Write-Host "❌ General Service Request Test FAILED" -ForegroundColor Red
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($errorBody) {
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
}

# Test 3: Verify passenger data was updated
Write-Host "`n=== Verifying Passenger Data Update ===" -ForegroundColor Cyan

try {
    $passengerResponse = Invoke-RestMethod -Uri "$gatewayUrl/passengers/$passengerId" -Method GET -TimeoutSec 30
    Write-Host "✅ Passenger Data Retrieved Successfully" -ForegroundColor Green
    Write-Host "Updated Passenger Data:" -ForegroundColor Green
    $passengerResponse | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to retrieve passenger data" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test all service endpoints for completeness
Write-Host "`n=== Testing All Service Management Endpoints ===" -ForegroundColor Cyan

$endpoints = @(
    @{ method = "GET"; path = "/services"; description = "Get all services" },
    @{ method = "GET"; path = "/services/passenger/$passengerId"; description = "Get passenger services" },
    @{ method = "GET"; path = "/services/flight/$flightId"; description = "Get flight services" }
)

foreach ($endpoint in $endpoints) {
    Write-Host "`nTesting $($endpoint.method) $serviceUrl$($endpoint.path)" -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$serviceUrl$($endpoint.path)" -Method $endpoint.method -TimeoutSec 30
        Write-Host "✅ $($endpoint.description) - PASSED" -ForegroundColor Green
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "❌ $($endpoint.description) - FAILED (Status: $statusCode)" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Test meal service endpoint
Write-Host "`n=== Testing Meal Service Endpoint ===" -ForegroundColor Cyan

$mealRequest = @{
    passengerId = $passengerId
    flightId = $flightId
    mealType = "Non-Veg"
    mealName = "Chicken Curry"
    specialRequests = "No spicy food please"
} | ConvertTo-Json

Write-Host "Testing PUT $serviceUrl/passenger/$passengerId/meal" -ForegroundColor Yellow
Write-Host "Request Body:" -ForegroundColor Gray
Write-Host $mealRequest -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/passenger/$passengerId/meal" -Method PUT -Body $mealRequest -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ Meal Service Test PASSED" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "❌ Meal Service Test FAILED (Status: $statusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Test baggage service endpoint
Write-Host "`n=== Testing Baggage Service Endpoint ===" -ForegroundColor Cyan

$baggageRequest = @{
    passengerId = $passengerId
    flightId = $flightId
    extraBaggageWeight = 15
    baggageType = "Extra Baggage 15kg"
    specialInstructions = "Handle with care - electronics"
} | ConvertTo-Json

Write-Host "Testing PUT $serviceUrl/passenger/$passengerId/baggage" -ForegroundColor Yellow
Write-Host "Request Body:" -ForegroundColor Gray
Write-Host $baggageRequest -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/passenger/$passengerId/baggage" -Method PUT -Body $baggageRequest -ContentType "application/json" -TimeoutSec 30
    Write-Host "✅ Baggage Service Test PASSED" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "❌ Baggage Service Test FAILED (Status: $statusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== SERVICE MANAGEMENT ENDPOINTS TESTING COMPLETE ===" -ForegroundColor Green
