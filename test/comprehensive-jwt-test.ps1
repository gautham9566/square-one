# Comprehensive JWT Testing Script for Airline Management System
# Tests all microservices with all user types from database

Write-Host "=== COMPREHENSIVE JWT TESTING ===" -ForegroundColor Green
Write-Host "Testing all microservices with database user credentials" -ForegroundColor Cyan

# Database user credentials
$users = @(
    @{ username = "admin1"; password = "adminpass"; role = "admin" },
    @{ username = "inflight1"; password = "inflightpass"; role = "inflightStaff" },
    @{ username = "checkin1"; password = "checkinpass"; role = "checkinStaff" },
    @{ username = "passenger1"; password = "passpass"; role = "passenger" }
)

# Microservices to test
$services = @(
    @{ name = "flights"; port = 8081; endpoint = "/flights" },
    @{ name = "passengers"; port = 8082; endpoint = "/passengers" },
    @{ name = "usermanagement"; port = 8083; endpoint = "/users" },
    @{ name = "service_management"; port = 8084; endpoint = "/services" },
    @{ name = "travel_history_service"; port = 8085; endpoint = "/travel-history" }
)

$testResults = @()

# Function to test authentication
function Test-Authentication {
    param($username, $password)
    
    $loginData = @{
        username = $username
        password = $password
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
        return @{ success = $true; token = $response.token; message = "Login successful" }
    } catch {
        return @{ success = $false; token = $null; message = $_.Exception.Message }
    }
}

# Function to test service endpoint
function Test-ServiceEndpoint {
    param($serviceName, $port, $endpoint, $token)
    
    try {
        $headers = @{ "Authorization" = "Bearer $token" }
        $response = Invoke-RestMethod -Uri "http://localhost:$port$endpoint" -Method GET -Headers $headers
        return @{ success = $true; message = "Endpoint accessible" }
    } catch {
        return @{ success = $false; message = $_.Exception.Message }
    }
}

# Function to test without token (should fail)
function Test-ServiceWithoutToken {
    param($serviceName, $port, $endpoint)
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$port$endpoint" -Method GET
        return @{ success = $false; message = "Security issue: endpoint accessible without token" }
    } catch {
        return @{ success = $true; message = "Correctly rejected: " + $_.Exception.Message }
    }
}

Write-Host "`n=== PHASE 1: TESTING AUTHENTICATION FOR ALL USERS ===" -ForegroundColor Yellow

foreach ($user in $users) {
    Write-Host "`nTesting authentication for $($user.username) ($($user.role))..." -ForegroundColor Cyan
    
    $authResult = Test-Authentication -username $user.username -password $user.password
    
    if ($authResult.success) {
        Write-Host "✓ Authentication successful for $($user.username)" -ForegroundColor Green
        $user.token = $authResult.token
    } else {
        Write-Host "✗ Authentication failed for $($user.username): $($authResult.message)" -ForegroundColor Red
        $user.token = $null
    }
}

Write-Host "`n=== PHASE 2: TESTING SERVICE ENDPOINTS WITHOUT TOKENS ===" -ForegroundColor Yellow

foreach ($service in $services) {
    Write-Host "`nTesting $($service.name) without token..." -ForegroundColor Cyan
    
    $result = Test-ServiceWithoutToken -serviceName $service.name -port $service.port -endpoint $service.endpoint
    
    if ($result.success) {
        Write-Host "✓ $($service.name): $($result.message)" -ForegroundColor Green
    } else {
        Write-Host "✗ $($service.name): $($result.message)" -ForegroundColor Red
    }
    
    $testResults += @{
        Service = $service.name
        User = "No Token"
        Test = "Security Check"
        Result = if ($result.success) { "PASS" } else { "FAIL" }
        Message = $result.message
    }
}

Write-Host "`n=== PHASE 3: TESTING SERVICE ENDPOINTS WITH VALID TOKENS ===" -ForegroundColor Yellow

foreach ($user in $users) {
    if ($user.token) {
        Write-Host "`nTesting all services with $($user.username) token..." -ForegroundColor Cyan
        
        foreach ($service in $services) {
            Write-Host "  Testing $($service.name)..." -ForegroundColor Gray
            
            $result = Test-ServiceEndpoint -serviceName $service.name -port $service.port -endpoint $service.endpoint -token $user.token
            
            if ($result.success) {
                Write-Host "    ✓ $($service.name): $($result.message)" -ForegroundColor Green
            } else {
                Write-Host "    ✗ $($service.name): $($result.message)" -ForegroundColor Red
            }
            
            $testResults += @{
                Service = $service.name
                User = $user.username
                Test = "Token Validation"
                Result = if ($result.success) { "PASS" } else { "FAIL" }
                Message = $result.message
            }
        }
    }
}

Write-Host "`n=== PHASE 4: TESTING WITH INVALID TOKEN ===" -ForegroundColor Yellow

$invalidToken = "invalid.jwt.token.here"

foreach ($service in $services) {
    Write-Host "`nTesting $($service.name) with invalid token..." -ForegroundColor Cyan
    
    try {
        $headers = @{ "Authorization" = "Bearer $invalidToken" }
        $response = Invoke-RestMethod -Uri "http://localhost:$($service.port)$($service.endpoint)" -Method GET -Headers $headers
        Write-Host "✗ $($service.name): Security issue - accepted invalid token" -ForegroundColor Red
        $result = "FAIL"
        $message = "Accepted invalid token"
    } catch {
        Write-Host "✓ $($service.name): Correctly rejected invalid token" -ForegroundColor Green
        $result = "PASS"
        $message = "Rejected invalid token"
    }
    
    $testResults += @{
        Service = $service.name
        User = "Invalid Token"
        Test = "Invalid Token Check"
        Result = $result
        Message = $message
    }
}

Write-Host "`n=== TEST RESULTS SUMMARY ===" -ForegroundColor Green

$testResults | Format-Table -AutoSize

$passCount = ($testResults | Where-Object { $_.Result -eq "PASS" }).Count
$failCount = ($testResults | Where-Object { $_.Result -eq "FAIL" }).Count
$totalTests = $testResults.Count

Write-Host "`nTEST SUMMARY:" -ForegroundColor Green
Write-Host "Total Tests: $totalTests" -ForegroundColor Cyan
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passCount / $totalTests) * 100, 2))%" -ForegroundColor Cyan

if ($failCount -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED! JWT implementation is working correctly." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Please review the results above." -ForegroundColor Yellow
}

Write-Host "`n=== TESTING COMPLETE ===" -ForegroundColor Green
