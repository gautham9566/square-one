# API Gateway Health Check Script
Write-Host "=== API GATEWAY HEALTH CHECK ===" -ForegroundColor Green

# Configuration
$gatewayUrl = "http://localhost:8090"
$eurekaUrl = "http://localhost:8761"

# Services to check
$services = @(
    @{ name = "API Gateway"; url = "$gatewayUrl/actuator/health"; port = 8090 },
    @{ name = "Eureka Server"; url = "$eurekaUrl/actuator/health"; port = 8761 },
    @{ name = "Backend1"; url = "http://localhost:8080/actuator/health"; port = 8080 },
    @{ name = "Flights"; url = "http://localhost:8081/actuator/health"; port = 8081 },
    @{ name = "Passengers"; url = "http://localhost:8082/actuator/health"; port = 8082 },
    @{ name = "User Management"; url = "http://localhost:8083/actuator/health"; port = 8083 },
    @{ name = "Service Management"; url = "http://localhost:8084/actuator/health"; port = 8084 },
    @{ name = "Travel History"; url = "http://localhost:8085/actuator/health"; port = 8085 }
)

# Gateway routes to test
$gatewayRoutes = @(
    @{ name = "Auth Service"; url = "$gatewayUrl/api/auth/validate-token"; method = "POST" },
    @{ name = "Flights Service"; url = "$gatewayUrl/flights"; method = "GET" },
    @{ name = "Passengers Service"; url = "$gatewayUrl/passengers"; method = "GET" },
    @{ name = "Users Service"; url = "$gatewayUrl/users"; method = "GET" },
    @{ name = "Services Management"; url = "$gatewayUrl/services"; method = "GET" },
    @{ name = "Travel History"; url = "$gatewayUrl/history"; method = "GET" }
)

# Function to check service health
function Test-ServiceHealth {
    param($serviceName, $url, $port)
    
    try {
        # First check if port is listening
        $tcpTest = Test-NetConnection -ComputerName "localhost" -Port $port -WarningAction SilentlyContinue
        
        if (-not $tcpTest.TcpTestSucceeded) {
            return @{
                Service = $serviceName
                Status = "DOWN"
                Message = "Port $port is not listening"
                ResponseTime = 0
            }
        }
        
        # Check health endpoint
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $response = Invoke-RestMethod -Uri $url -Method GET -TimeoutSec 5
        $stopwatch.Stop()
        
        $status = if ($response.status -eq "UP") { "UP" } else { "DOWN" }
        
        return @{
            Service = $serviceName
            Status = $status
            Message = "Health check successful"
            ResponseTime = $stopwatch.ElapsedMilliseconds
            Details = $response
        }
    }
    catch {
        return @{
            Service = $serviceName
            Status = "DOWN"
            Message = $_.Exception.Message
            ResponseTime = 0
        }
    }
}

# Function to test gateway routing
function Test-GatewayRoute {
    param($routeName, $url, $method)
    
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        
        if ($method -eq "POST") {
            # For POST requests, send minimal data
            $body = '{"test": "data"}' 
            $response = Invoke-WebRequest -Uri $url -Method $method -Body $body -ContentType "application/json" -TimeoutSec 5
        } else {
            $response = Invoke-WebRequest -Uri $url -Method $method -TimeoutSec 5
        }
        
        $stopwatch.Stop()
        
        $status = if ($response.StatusCode -lt 400) { "ACCESSIBLE" } else { "ERROR" }
        
        return @{
            Route = $routeName
            Status = $status
            StatusCode = $response.StatusCode
            Message = "Route accessible"
            ResponseTime = $stopwatch.ElapsedMilliseconds
        }
    }
    catch {
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { 0 }
        
        # Some errors are expected (like 401 Unauthorized) and indicate the route is working
        if ($statusCode -eq 401 -or $statusCode -eq 403) {
            return @{
                Route = $routeName
                Status = "ACCESSIBLE"
                StatusCode = $statusCode
                Message = "Route accessible (authentication required)"
                ResponseTime = 0
            }
        }
        
        return @{
            Route = $routeName
            Status = "ERROR"
            StatusCode = $statusCode
            Message = $_.Exception.Message
            ResponseTime = 0
        }
    }
}

# Function to check Eureka service registration
function Test-EurekaRegistration {
    try {
        Write-Host "Checking Eureka service registration..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri "$eurekaUrl/eureka/apps" -Method GET -TimeoutSec 5
        
        $registeredServices = @()
        if ($response.applications.application) {
            if ($response.applications.application -is [array]) {
                foreach ($app in $response.applications.application) {
                    $registeredServices += @{
                        Name = $app.name
                        Instances = $app.instance.Count
                        Status = $app.instance[0].status
                    }
                }
            } else {
                $app = $response.applications.application
                $registeredServices += @{
                    Name = $app.name
                    Instances = if ($app.instance -is [array]) { $app.instance.Count } else { 1 }
                    Status = if ($app.instance -is [array]) { $app.instance[0].status } else { $app.instance.status }
                }
            }
        }
        
        return $registeredServices
    }
    catch {
        Write-Host "❌ Failed to check Eureka registration: $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

# Main Health Check Execution
Write-Host "`n=== CHECKING SERVICE HEALTH ===" -ForegroundColor Cyan

$healthResults = @()
foreach ($service in $services) {
    Write-Host "Checking $($service.name)..." -ForegroundColor Yellow
    $result = Test-ServiceHealth -serviceName $service.name -url $service.url -port $service.port
    $healthResults += $result
    
    $color = if ($result.Status -eq "UP") { "Green" } else { "Red" }
    $symbol = if ($result.Status -eq "UP") { "✅" } else { "❌" }
    Write-Host "$symbol $($result.Service): $($result.Status) ($($result.ResponseTime)ms)" -ForegroundColor $color
    
    if ($result.Status -ne "UP") {
        Write-Host "   Error: $($result.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== CHECKING GATEWAY ROUTES ===" -ForegroundColor Cyan

$routeResults = @()
foreach ($route in $gatewayRoutes) {
    Write-Host "Testing $($route.name) route..." -ForegroundColor Yellow
    $result = Test-GatewayRoute -routeName $route.name -url $route.url -method $route.method
    $routeResults += $result
    
    $color = if ($result.Status -eq "ACCESSIBLE") { "Green" } else { "Red" }
    $symbol = if ($result.Status -eq "ACCESSIBLE") { "✅" } else { "❌" }
    Write-Host "$symbol $($result.Route): $($result.Status) (Status: $($result.StatusCode), $($result.ResponseTime)ms)" -ForegroundColor $color
    
    if ($result.Status -ne "ACCESSIBLE") {
        Write-Host "   Error: $($result.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== CHECKING EUREKA REGISTRATION ===" -ForegroundColor Cyan

$registeredServices = Test-EurekaRegistration

if ($registeredServices.Count -gt 0) {
    Write-Host "✅ Services registered in Eureka:" -ForegroundColor Green
    foreach ($service in $registeredServices) {
        Write-Host "  - $($service.Name): $($service.Instances) instance(s), Status: $($service.Status)" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ No services found in Eureka or Eureka is not accessible" -ForegroundColor Red
}

# Summary
Write-Host "`n=== HEALTH CHECK SUMMARY ===" -ForegroundColor Cyan

$upServices = ($healthResults | Where-Object { $_.Status -eq "UP" }).Count
$totalServices = $healthResults.Count
$accessibleRoutes = ($routeResults | Where-Object { $_.Status -eq "ACCESSIBLE" }).Count
$totalRoutes = $routeResults.Count

Write-Host "Service Health:" -ForegroundColor Yellow
Write-Host "  Services UP: $upServices / $totalServices" -ForegroundColor $(if($upServices -eq $totalServices) {'Green'} else {'Red'})

Write-Host "Gateway Routes:" -ForegroundColor Yellow
Write-Host "  Routes Accessible: $accessibleRoutes / $totalRoutes" -ForegroundColor $(if($accessibleRoutes -eq $totalRoutes) {'Green'} else {'Red'})

Write-Host "Service Discovery:" -ForegroundColor Yellow
Write-Host "  Registered Services: $($registeredServices.Count)" -ForegroundColor $(if($registeredServices.Count -gt 0) {'Green'} else {'Red'})

# Overall Status
if ($upServices -eq $totalServices -and $accessibleRoutes -eq $totalRoutes -and $registeredServices.Count -gt 0) {
    Write-Host "`n🎉 ALL SYSTEMS HEALTHY! API Gateway and all services are running correctly." -ForegroundColor Green
} elseif ($upServices -ge ($totalServices * 0.8) -and $accessibleRoutes -ge ($totalRoutes * 0.8)) {
    Write-Host "`n⚠️  PARTIAL HEALTH: Most services are running, but some issues detected." -ForegroundColor Yellow
} else {
    Write-Host "`n❌ SYSTEM ISSUES: Multiple services are down or not accessible." -ForegroundColor Red
}

Write-Host "`n=== HEALTH CHECK COMPLETE ===" -ForegroundColor Green
