# Simple JWT Testing Script
Write-Host "=== JWT TESTING FOR AIRLINE MANAGEMENT SYSTEM ===" -ForegroundColor Green

# Test users from database
$users = @(
    @{ username = "admin1"; password = "adminpass" },
    @{ username = "inflight1"; password = "inflightpass" },
    @{ username = "checkin1"; password = "checkinpass" },
    @{ username = "passenger1"; password = "passpass" }
)

# Services to test
$services = @(
    @{ name = "flights"; port = 8081; endpoint = "/flights" },
    @{ name = "passengers"; port = 8082; endpoint = "/passengers" },
    @{ name = "usermanagement"; port = 8083; endpoint = "/users" },
    @{ name = "service_management"; port = 8084; endpoint = "/services" },
    @{ name = "travel_history_service"; port = 8085; endpoint = "/travel-history" }
)

Write-Host "`n=== PHASE 1: TESTING AUTHENTICATION ===" -ForegroundColor Yellow

$tokens = @{}

foreach ($user in $users) {
    Write-Host "`nTesting login for $($user.username)..." -ForegroundColor Cyan
    
    $loginData = @{
        username = $user.username
        password = $user.password
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
        Write-Host "✓ Login successful for $($user.username)" -ForegroundColor Green
        $tokens[$user.username] = $response.token
    } catch {
        Write-Host "✗ Login failed for $($user.username): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== PHASE 2: TESTING SERVICES WITHOUT TOKEN ===" -ForegroundColor Yellow

foreach ($service in $services) {
    Write-Host "`nTesting $($service.name) without token..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:$($service.port)$($service.endpoint)" -Method GET
        Write-Host "✗ $($service.name): SECURITY ISSUE - accessible without token!" -ForegroundColor Red
    } catch {
        Write-Host "✓ $($service.name): Correctly rejected request without token" -ForegroundColor Green
    }
}

Write-Host "`n=== PHASE 3: TESTING SERVICES WITH VALID TOKENS ===" -ForegroundColor Yellow

foreach ($username in $tokens.Keys) {
    $token = $tokens[$username]
    Write-Host "`nTesting services with $username token..." -ForegroundColor Cyan
    
    foreach ($service in $services) {
        Write-Host "  Testing $($service.name)..." -ForegroundColor Gray
        
        try {
            $headers = @{ "Authorization" = "Bearer $token" }
            $response = Invoke-RestMethod -Uri "http://localhost:$($service.port)$($service.endpoint)" -Method GET -Headers $headers
            Write-Host "    ✓ $($service.name): Token accepted" -ForegroundColor Green
        } catch {
            Write-Host "    ✗ $($service.name): Token rejected - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== PHASE 4: TESTING WITH INVALID TOKEN ===" -ForegroundColor Yellow

$invalidToken = "invalid.jwt.token"

foreach ($service in $services) {
    Write-Host "`nTesting $($service.name) with invalid token..." -ForegroundColor Cyan
    
    try {
        $headers = @{ "Authorization" = "Bearer $invalidToken" }
        $response = Invoke-RestMethod -Uri "http://localhost:$($service.port)$($service.endpoint)" -Method GET -Headers $headers
        Write-Host "✗ $($service.name): SECURITY ISSUE - accepted invalid token!" -ForegroundColor Red
    } catch {
        Write-Host "✓ $($service.name): Correctly rejected invalid token" -ForegroundColor Green
    }
}

Write-Host "`n=== TESTING COMPLETE ===" -ForegroundColor Green
