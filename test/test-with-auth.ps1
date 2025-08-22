# Test Service Management Endpoints with Authentication
Write-Host "=== TESTING SERVICE MANAGEMENT WITH AUTHENTICATION ===" -ForegroundColor Green

# Configuration
$gatewayUrl = "http://localhost:8090"
$serviceUrl = "$gatewayUrl/services"

# Step 1: Get JWT Token
Write-Host "`n=== Getting JWT Token ===" -ForegroundColor Cyan

$loginData = @{
    username = "admin1"
    password = "adminpass"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$gatewayUrl/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "✅ Successfully obtained JWT token" -ForegroundColor Green
    Write-Host "Token: $($token.Substring(0, 50))..." -ForegroundColor Gray
}
catch {
    Write-Host "❌ Failed to get JWT token" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Test Shopping Service Endpoint with Authentication
Write-Host "`n=== Testing Shopping Service Endpoint with Auth ===" -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$shoppingRequest = @{
    passengerId = 6
    flightId = 3
    items = @("Magazine", "Perfume", "Headphones")
    deliveryInstructions = "Deliver to seat 12A"
} | ConvertTo-Json

Write-Host "Testing PUT $serviceUrl/passenger/6/shopping" -ForegroundColor Yellow
Write-Host "Request Body:" -ForegroundColor Gray
Write-Host $shoppingRequest -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/passenger/6/shopping" -Method PUT -Body $shoppingRequest -Headers $headers -TimeoutSec 30
    Write-Host "✅ Shopping Service Test PASSED" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "❌ Shopping Service Test FAILED" -ForegroundColor Red
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to get error details
    try {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
    catch {
        Write-Host "Could not read error details" -ForegroundColor Red
    }
}

# Step 3: Test General Service Request Endpoint with Authentication
Write-Host "`n=== Testing General Service Request Endpoint with Auth ===" -ForegroundColor Cyan

$serviceRequest = @{
    passengerId = 6
    flightId = 3
    requestedServices = @("Meal", "Shopping")
    mealType = "Veg"
    mealName = "Biryani"
    shoppingItems = @("Magazine", "Perfume")
    serviceNotes = "Special dietary requirements"
} | ConvertTo-Json

Write-Host "Testing PUT $serviceUrl/passenger/6" -ForegroundColor Yellow
Write-Host "Request Body:" -ForegroundColor Gray
Write-Host $serviceRequest -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/passenger/6" -Method PUT -Body $serviceRequest -Headers $headers -TimeoutSec 30
    Write-Host "✅ General Service Request Test PASSED" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "❌ General Service Request Test FAILED" -ForegroundColor Red
    Write-Host "Status Code: $statusCode" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to get error details
    try {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error Body: $errorBody" -ForegroundColor Red
    }
    catch {
        Write-Host "Could not read error details" -ForegroundColor Red
    }
}

# Step 4: Test GET endpoints with authentication
Write-Host "`n=== Testing GET Endpoints with Auth ===" -ForegroundColor Cyan

$getEndpoints = @(
    @{ url = "$serviceUrl"; description = "Get all services" },
    @{ url = "$serviceUrl/passenger/6"; description = "Get passenger 6 services" },
    @{ url = "$serviceUrl/flight/3"; description = "Get flight 3 services" }
)

foreach ($endpoint in $getEndpoints) {
    Write-Host "`nTesting GET $($endpoint.url)" -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri $endpoint.url -Method GET -Headers @{"Authorization" = "Bearer $token"} -TimeoutSec 30
        Write-Host "✅ $($endpoint.description) - PASSED" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Green
        $response | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor Green
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "❌ $($endpoint.description) - FAILED (Status: $statusCode)" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 5: Test other service endpoints
Write-Host "`n=== Testing Other Service Endpoints with Auth ===" -ForegroundColor Cyan

# Test meal service
$mealRequest = @{
    passengerId = 6
    flightId = 3
    mealType = "Non-Veg"
    mealName = "Chicken Curry"
    specialRequests = "No spicy food please"
} | ConvertTo-Json

Write-Host "`nTesting PUT $serviceUrl/passenger/6/meal" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/passenger/6/meal" -Method PUT -Body $mealRequest -Headers $headers -TimeoutSec 30
    Write-Host "✅ Meal Service Test PASSED" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "❌ Meal Service Test FAILED (Status: $statusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test baggage service
$baggageRequest = @{
    passengerId = 6
    flightId = 3
    extraBaggageWeight = 15
    baggageType = "Extra Baggage 15kg"
    specialInstructions = "Handle with care - electronics"
} | ConvertTo-Json

Write-Host "`nTesting PUT $serviceUrl/passenger/6/baggage" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$serviceUrl/passenger/6/baggage" -Method PUT -Body $baggageRequest -Headers $headers -TimeoutSec 30
    Write-Host "✅ Baggage Service Test PASSED" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor Green
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "❌ Baggage Service Test FAILED (Status: $statusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TESTING COMPLETE ===" -ForegroundColor Green
