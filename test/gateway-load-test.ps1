# API Gateway Load Testing Script
Write-Host "=== API GATEWAY LOAD TESTING ===" -ForegroundColor Green

# Configuration
$gatewayUrl = "http://localhost:8090"
$concurrentRequests = 10
$requestsPerEndpoint = 50
$testDurationSeconds = 60

# Test endpoints
$endpoints = @(
    @{ path = "/api/auth/login"; method = "POST"; body = '{"username":"admin1","password":"adminpass"}'; contentType = "application/json" },
    @{ path = "/flights"; method = "GET"; body = $null; contentType = $null },
    @{ path = "/passengers"; method = "GET"; body = $null; contentType = $null },
    @{ path = "/users"; method = "GET"; body = $null; contentType = $null },
    @{ path = "/services"; method = "GET"; body = $null; contentType = $null },
    @{ path = "/history"; method = "GET"; body = $null; contentType = $null }
)

# Function to make a single request
function Invoke-SingleRequest {
    param($endpoint, $token = $null)
    
    $headers = @{}
    if ($token) {
        $headers["Authorization"] = "Bearer $token"
    }
    
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    
    try {
        $url = "$gatewayUrl$($endpoint.path)"
        
        if ($endpoint.method -eq "POST" -and $endpoint.body) {
            if ($endpoint.contentType) {
                $response = Invoke-RestMethod -Uri $url -Method $endpoint.method -Body $endpoint.body -ContentType $endpoint.contentType -Headers $headers -TimeoutSec 30
            } else {
                $response = Invoke-RestMethod -Uri $url -Method $endpoint.method -Body $endpoint.body -Headers $headers -TimeoutSec 30
            }
        } else {
            $response = Invoke-RestMethod -Uri $url -Method $endpoint.method -Headers $headers -TimeoutSec 30
        }
        
        $stopwatch.Stop()
        return @{
            Success = $true
            ResponseTime = $stopwatch.ElapsedMilliseconds
            StatusCode = 200
            Error = $null
        }
    }
    catch {
        $stopwatch.Stop()
        $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { 0 }
        return @{
            Success = $false
            ResponseTime = $stopwatch.ElapsedMilliseconds
            StatusCode = $statusCode
            Error = $_.Exception.Message
        }
    }
}

# Function to run concurrent requests
function Start-ConcurrentRequests {
    param($endpoint, $requestCount, $token = $null)
    
    Write-Host "Testing $($endpoint.method) $($endpoint.path) with $requestCount requests..." -ForegroundColor Yellow
    
    $jobs = @()
    $results = @()
    
    # Start concurrent jobs
    for ($i = 1; $i -le $requestCount; $i++) {
        $job = Start-Job -ScriptBlock {
            param($gatewayUrl, $endpoint, $token)
            
            # Import the function into the job scope
            function Invoke-SingleRequest {
                param($endpoint, $token = $null)
                
                $headers = @{}
                if ($token) {
                    $headers["Authorization"] = "Bearer $token"
                }
                
                $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
                
                try {
                    $url = "$gatewayUrl$($endpoint.path)"
                    
                    if ($endpoint.method -eq "POST" -and $endpoint.body) {
                        if ($endpoint.contentType) {
                            $response = Invoke-RestMethod -Uri $url -Method $endpoint.method -Body $endpoint.body -ContentType $endpoint.contentType -Headers $headers -TimeoutSec 30
                        } else {
                            $response = Invoke-RestMethod -Uri $url -Method $endpoint.method -Body $endpoint.body -Headers $headers -TimeoutSec 30
                        }
                    } else {
                        $response = Invoke-RestMethod -Uri $url -Method $endpoint.method -Headers $headers -TimeoutSec 30
                    }
                    
                    $stopwatch.Stop()
                    return @{
                        Success = $true
                        ResponseTime = $stopwatch.ElapsedMilliseconds
                        StatusCode = 200
                        Error = $null
                    }
                }
                catch {
                    $stopwatch.Stop()
                    $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { 0 }
                    return @{
                        Success = $false
                        ResponseTime = $stopwatch.ElapsedMilliseconds
                        StatusCode = $statusCode
                        Error = $_.Exception.Message
                    }
                }
            }
            
            return Invoke-SingleRequest -endpoint $endpoint -token $token
        } -ArgumentList $gatewayUrl, $endpoint, $token
        
        $jobs += $job
    }
    
    # Wait for all jobs to complete
    $jobs | Wait-Job | ForEach-Object {
        $result = Receive-Job $_
        $results += $result
        Remove-Job $_
    }
    
    return $results
}

# Function to analyze results
function Get-ResultAnalysis {
    param($results, $endpointName)
    
    $successCount = ($results | Where-Object { $_.Success }).Count
    $failureCount = ($results | Where-Object { -not $_.Success }).Count
    $totalRequests = $results.Count
    
    $responseTimes = $results | Where-Object { $_.Success } | ForEach-Object { $_.ResponseTime }
    
    $analysis = @{
        EndpointName = $endpointName
        TotalRequests = $totalRequests
        SuccessCount = $successCount
        FailureCount = $failureCount
        SuccessRate = if ($totalRequests -gt 0) { [math]::Round(($successCount / $totalRequests) * 100, 2) } else { 0 }
        AverageResponseTime = if ($responseTimes.Count -gt 0) { [math]::Round(($responseTimes | Measure-Object -Average).Average, 2) } else { 0 }
        MinResponseTime = if ($responseTimes.Count -gt 0) { ($responseTimes | Measure-Object -Minimum).Minimum } else { 0 }
        MaxResponseTime = if ($responseTimes.Count -gt 0) { ($responseTimes | Measure-Object -Maximum).Maximum } else { 0 }
    }
    
    return $analysis
}

# Main Load Test Execution
Write-Host "`n=== STARTING LOAD TESTS ===" -ForegroundColor Cyan

# First, get an authentication token
Write-Host "Getting authentication token..." -ForegroundColor Yellow
$loginEndpoint = $endpoints | Where-Object { $_.path -eq "/api/auth/login" }
$loginResult = Invoke-SingleRequest -endpoint $loginEndpoint

$token = $null
if ($loginResult.Success) {
    try {
        $loginResponse = Invoke-RestMethod -Uri "$gatewayUrl/api/auth/login" -Method POST -Body $loginEndpoint.body -ContentType $loginEndpoint.contentType
        $token = $loginResponse.token
        Write-Host "✅ Authentication token obtained" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to get authentication token" -ForegroundColor Red
    }
}

# Run load tests for each endpoint
$allResults = @()

foreach ($endpoint in $endpoints) {
    Write-Host "`n--- Testing $($endpoint.method) $($endpoint.path) ---" -ForegroundColor Magenta
    
    $testToken = if ($endpoint.path -ne "/api/auth/login") { $token } else { $null }
    $results = Start-ConcurrentRequests -endpoint $endpoint -requestCount $requestsPerEndpoint -token $testToken
    
    $analysis = Get-ResultAnalysis -results $results -endpointName "$($endpoint.method) $($endpoint.path)"
    $allResults += $analysis
    
    # Display results
    Write-Host "Results:" -ForegroundColor Cyan
    Write-Host "  Total Requests: $($analysis.TotalRequests)" -ForegroundColor White
    Write-Host "  Successful: $($analysis.SuccessCount)" -ForegroundColor Green
    Write-Host "  Failed: $($analysis.FailureCount)" -ForegroundColor Red
    Write-Host "  Success Rate: $($analysis.SuccessRate)%" -ForegroundColor $(if($analysis.SuccessRate -ge 95) {'Green'} elseif($analysis.SuccessRate -ge 80) {'Yellow'} else {'Red'})
    Write-Host "  Avg Response Time: $($analysis.AverageResponseTime)ms" -ForegroundColor White
    Write-Host "  Min Response Time: $($analysis.MinResponseTime)ms" -ForegroundColor White
    Write-Host "  Max Response Time: $($analysis.MaxResponseTime)ms" -ForegroundColor White
}

# Overall Summary
Write-Host "`n=== LOAD TEST SUMMARY ===" -ForegroundColor Cyan

$totalRequests = ($allResults | Measure-Object -Property TotalRequests -Sum).Sum
$totalSuccessful = ($allResults | Measure-Object -Property SuccessCount -Sum).Sum
$totalFailed = ($allResults | Measure-Object -Property FailureCount -Sum).Sum
$overallSuccessRate = if ($totalRequests -gt 0) { [math]::Round(($totalSuccessful / $totalRequests) * 100, 2) } else { 0 }
$avgResponseTime = [math]::Round(($allResults | Measure-Object -Property AverageResponseTime -Average).Average, 2)

Write-Host "Overall Statistics:" -ForegroundColor Yellow
Write-Host "  Total Requests: $totalRequests" -ForegroundColor White
Write-Host "  Total Successful: $totalSuccessful" -ForegroundColor Green
Write-Host "  Total Failed: $totalFailed" -ForegroundColor Red
Write-Host "  Overall Success Rate: $overallSuccessRate%" -ForegroundColor $(if($overallSuccessRate -ge 95) {'Green'} elseif($overallSuccessRate -ge 80) {'Yellow'} else {'Red'})
Write-Host "  Average Response Time: ${avgResponseTime}ms" -ForegroundColor White

Write-Host "`nDetailed Results by Endpoint:" -ForegroundColor Yellow
foreach ($result in $allResults) {
    $color = if($result.SuccessRate -ge 95) {'Green'} elseif($result.SuccessRate -ge 80) {'Yellow'} else {'Red'}
    Write-Host "  $($result.EndpointName): $($result.SuccessRate)% success, ${$result.AverageResponseTime}ms avg" -ForegroundColor $color
}

# Performance Assessment
Write-Host "`n=== PERFORMANCE ASSESSMENT ===" -ForegroundColor Cyan
if ($overallSuccessRate -ge 95 -and $avgResponseTime -le 1000) {
    Write-Host "🎉 EXCELLENT: API Gateway performance is excellent!" -ForegroundColor Green
} elseif ($overallSuccessRate -ge 90 -and $avgResponseTime -le 2000) {
    Write-Host "✅ GOOD: API Gateway performance is good." -ForegroundColor Green
} elseif ($overallSuccessRate -ge 80 -and $avgResponseTime -le 5000) {
    Write-Host "⚠️  ACCEPTABLE: API Gateway performance is acceptable but could be improved." -ForegroundColor Yellow
} else {
    Write-Host "❌ POOR: API Gateway performance needs improvement." -ForegroundColor Red
}

Write-Host "`n=== LOAD TESTING COMPLETE ===" -ForegroundColor Green
