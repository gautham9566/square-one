# API Gateway Testing Script
Write-Host "=== API GATEWAY TESTING FOR AIRLINE MANAGEMENT SYSTEM ===" -ForegroundColor Green

# Configuration
$gatewayUrl = "http://localhost:8090"
$authUrl = "$gatewayUrl/api/auth"
$servicesUrl = "$gatewayUrl"

# Test users from database
$users = @(
    @{ username = "admin1"; password = "adminpass"; role = "admin" },
    @{ username = "inflight1"; password = "inflightpass"; role = "inflightStaff" },
    @{ username = "checkin1"; password = "checkinpass"; role = "checkinStaff" },
    @{ username = "passenger1"; password = "passpass"; role = "passenger" }
)

# Services to test through gateway
$services = @(
    @{ name = "flights"; endpoint = "/flights"; method = "GET" },
    @{ name = "passengers"; endpoint = "/passengers"; method = "GET" },
    @{ name = "users"; endpoint = "/users"; method = "GET" },
    @{ name = "services"; endpoint = "/services"; method = "GET" },
    @{ name = "history"; endpoint = "/history"; method = "GET" }
)

# Function to test login and get JWT token
function Test-Login {
    param($username, $password)
    
    $loginData = @{
        username = $username
        password = $password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$authUrl/login" -Method POST -Body $loginData -ContentType "application/json"
        return $response.token
    }
    catch {
        Write-Host "Login failed for $username : $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Function to test service endpoint through gateway
function Test-ServiceEndpoint {
    param($serviceName, $endpoint, $method, $token)
    
    $headers = @{}
    if ($token) {
        $headers["Authorization"] = "Bearer $token"
    }
    
    try {
        $url = "$servicesUrl$endpoint"
        Write-Host "Testing: $method $url" -ForegroundColor Yellow
        
        $response = Invoke-RestMethod -Uri $url -Method $method -Headers $headers -TimeoutSec 10
        Write-Host "✅ SUCCESS: $serviceName service accessible through gateway" -ForegroundColor Green
        return $true
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "❌ FAILED: $serviceName service - Status: $statusCode, Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to test gateway health
function Test-GatewayHealth {
    try {
        Write-Host "Testing Gateway Health..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$gatewayUrl/actuator/health" -Method GET -TimeoutSec 5
        Write-Host "✅ Gateway Health: $($response.status)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Gateway Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to test Eureka integration
function Test-EurekaIntegration {
    try {
        Write-Host "Testing Eureka Integration..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "http://localhost:8761/eureka/apps" -Method GET -TimeoutSec 5
        
        $registeredServices = @()
        if ($response.applications.application) {
            foreach ($app in $response.applications.application) {
                $registeredServices += $app.name
            }
        }
        
        Write-Host "✅ Registered Services in Eureka:" -ForegroundColor Green
        $registeredServices | ForEach-Object { Write-Host "  - $_" -ForegroundColor Cyan }
        return $true
    }
    catch {
        Write-Host "❌ Eureka Integration Test Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to test CORS
function Test-CORS {
    try {
        Write-Host "Testing CORS Configuration..." -ForegroundColor Yellow
        
        $headers = @{
            "Origin" = "http://localhost:5173"
            "Access-Control-Request-Method" = "GET"
            "Access-Control-Request-Headers" = "Authorization,Content-Type"
        }
        
        $response = Invoke-WebRequest -Uri "$gatewayUrl/flights" -Method OPTIONS -Headers $headers -TimeoutSec 5
        
        if ($response.Headers["Access-Control-Allow-Origin"]) {
            Write-Host "✅ CORS Headers Present" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ CORS Headers Missing" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ CORS Test Failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main Test Execution
Write-Host "`n=== STARTING API GATEWAY TESTS ===" -ForegroundColor Cyan

# Test 1: Gateway Health
Write-Host "`n1. Testing Gateway Health..." -ForegroundColor Magenta
$healthResult = Test-GatewayHealth

# Test 2: Eureka Integration
Write-Host "`n2. Testing Eureka Integration..." -ForegroundColor Magenta
$eurekaResult = Test-EurekaIntegration

# Test 3: Authentication through Gateway
Write-Host "`n3. Testing Authentication through Gateway..." -ForegroundColor Magenta
$authResults = @{}
foreach ($user in $users) {
    Write-Host "Testing login for $($user.username)..." -ForegroundColor Yellow
    $token = Test-Login -username $user.username -password $user.password
    $authResults[$user.username] = $token
    
    if ($token) {
        Write-Host "✅ Login successful for $($user.username)" -ForegroundColor Green
    } else {
        Write-Host "❌ Login failed for $($user.username)" -ForegroundColor Red
    }
}

# Test 4: Service Routing through Gateway
Write-Host "`n4. Testing Service Routing through Gateway..." -ForegroundColor Magenta
$routingResults = @{}

# Use admin token for testing (if available)
$testToken = $authResults["admin1"]

foreach ($service in $services) {
    Write-Host "`nTesting $($service.name) service..." -ForegroundColor Yellow
    $result = Test-ServiceEndpoint -serviceName $service.name -endpoint $service.endpoint -method $service.method -token $testToken
    $routingResults[$service.name] = $result
}

# Test 5: CORS Configuration
Write-Host "`n5. Testing CORS Configuration..." -ForegroundColor Magenta
$corsResult = Test-CORS

# Test 6: Error Handling
Write-Host "`n6. Testing Error Handling..." -ForegroundColor Magenta
try {
    Write-Host "Testing non-existent service..." -ForegroundColor Yellow
    Invoke-RestMethod -Uri "$gatewayUrl/nonexistent" -Method GET -TimeoutSec 5
    Write-Host "❌ Error handling test failed - should have returned error" -ForegroundColor Red
}
catch {
    Write-Host "✅ Error handling working - returned appropriate error" -ForegroundColor Green
}

# Summary
Write-Host "`n=== TEST SUMMARY ===" -ForegroundColor Cyan
Write-Host "Gateway Health: $(if($healthResult) {'✅ PASS'} else {'❌ FAIL'})" -ForegroundColor $(if($healthResult) {'Green'} else {'Red'})
Write-Host "Eureka Integration: $(if($eurekaResult) {'✅ PASS'} else {'❌ FAIL'})" -ForegroundColor $(if($eurekaResult) {'Green'} else {'Red'})
Write-Host "CORS Configuration: $(if($corsResult) {'✅ PASS'} else {'❌ FAIL'})" -ForegroundColor $(if($corsResult) {'Green'} else {'Red'})

Write-Host "`nAuthentication Results:" -ForegroundColor Yellow
foreach ($user in $users) {
    $result = if($authResults[$user.username]) {'✅ PASS'} else {'❌ FAIL'}
    $color = if($authResults[$user.username]) {'Green'} else {'Red'}
    Write-Host "  $($user.username): $result" -ForegroundColor $color
}

Write-Host "`nService Routing Results:" -ForegroundColor Yellow
foreach ($service in $services) {
    $result = if($routingResults[$service.name]) {'✅ PASS'} else {'❌ FAIL'}
    $color = if($routingResults[$service.name]) {'Green'} else {'Red'}
    Write-Host "  $($service.name): $result" -ForegroundColor $color
}

$totalTests = 6 + $users.Count + $services.Count
$passedTests = @($healthResult, $eurekaResult, $corsResult) + $authResults.Values + $routingResults.Values | Where-Object { $_ -eq $true }
$passCount = ($passedTests | Measure-Object).Count

Write-Host "`n=== FINAL RESULT ===" -ForegroundColor Cyan
Write-Host "Passed: $passCount / $totalTests tests" -ForegroundColor $(if($passCount -eq $totalTests) {'Green'} else {'Yellow'})

if ($passCount -eq $totalTests) {
    Write-Host "🎉 ALL TESTS PASSED! API Gateway is working correctly." -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tests failed. Please check the services and gateway configuration." -ForegroundColor Yellow
}

Write-Host "`n=== API GATEWAY TESTING COMPLETE ===" -ForegroundColor Green
