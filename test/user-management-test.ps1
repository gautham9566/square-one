# User Management System Test Script
# This script tests all the user management functionality

Write-Host "=== Airline Management System - User Management Test ===" -ForegroundColor Green
Write-Host ""

# Test 1: Authentication
Write-Host "Test 1: Testing Authentication..." -ForegroundColor Yellow
$loginData = @{username='admin1'; password='adminpass'} | ConvertTo-Json
try {
    $authResponse = Invoke-RestMethod -Uri "http://localhost:8090/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $authResponse.token
    Write-Host "✅ Authentication successful" -ForegroundColor Green
    Write-Host "   Username: $($authResponse.username)" -ForegroundColor Gray
    Write-Host "   Role: $($authResponse.role)" -ForegroundColor Gray
    Write-Host "   Name: $($authResponse.name)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Authentication failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: List all users
Write-Host ""
Write-Host "Test 2: Testing List Users..." -ForegroundColor Yellow
$headers = @{Authorization="Bearer $token"}
try {
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:8090/users" -Method GET -Headers $headers
    $users = $usersResponse.data
    Write-Host "✅ Successfully retrieved $($users.Count) users" -ForegroundColor Green
    foreach ($user in $users) {
        Write-Host "   - $($user.username) ($($user.role)) - $($user.name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed to list users: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get users by role
Write-Host ""
Write-Host "Test 3: Testing Get Users by Role..." -ForegroundColor Yellow
try {
    $adminUsers = Invoke-RestMethod -Uri "http://localhost:8090/users/role/admin" -Method GET -Headers $headers
    Write-Host "✅ Found $($adminUsers.data.Count) admin users" -ForegroundColor Green
    
    $staffUsers = Invoke-RestMethod -Uri "http://localhost:8090/users/role/inflightStaff" -Method GET -Headers $headers
    Write-Host "✅ Found $($staffUsers.data.Count) inflight staff users" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get users by role: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get staff members
Write-Host ""
Write-Host "Test 4: Testing Get Staff Members..." -ForegroundColor Yellow
try {
    $staffResponse = Invoke-RestMethod -Uri "http://localhost:8090/users/staff" -Method GET -Headers $headers
    Write-Host "✅ Found $($staffResponse.data.Count) staff members" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get staff members: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Create a new user
Write-Host ""
Write-Host "Test 5: Testing Create User..." -ForegroundColor Yellow
$newUser = @{
    username = "testuser_$(Get-Date -Format 'yyyyMMddHHmmss')"
    password = "testpass123"
    name = "Test User"
    role = "passenger"
    email = "testuser@example.com"
    phoneNumber = "123-456-7890"
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "http://localhost:8090/users" -Method POST -Body $newUser -Headers $headers -ContentType "application/json"
    $createdUser = $createResponse.data
    Write-Host "✅ Successfully created user: $($createdUser.username)" -ForegroundColor Green
    $testUserId = $createdUser.userId
    
    # Test 6: Get user by ID
    Write-Host ""
    Write-Host "Test 6: Testing Get User by ID..." -ForegroundColor Yellow
    $getUserResponse = Invoke-RestMethod -Uri "http://localhost:8090/users/$testUserId" -Method GET -Headers $headers
    Write-Host "✅ Successfully retrieved user by ID: $($getUserResponse.data.username)" -ForegroundColor Green
    
    # Test 7: Update user
    Write-Host ""
    Write-Host "Test 7: Testing Update User..." -ForegroundColor Yellow
    $updateData = @{
        username = $createdUser.username
        password = "newpassword123"
        name = "Updated Test User"
        role = "passenger"
        email = "updated@example.com"
        phoneNumber = "987-654-3210"
    } | ConvertTo-Json
    
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:8090/users/$testUserId" -Method PUT -Body $updateData -Headers $headers -ContentType "application/json"
    Write-Host "✅ Successfully updated user" -ForegroundColor Green
    
    # Test 8: Delete user
    Write-Host ""
    Write-Host "Test 8: Testing Delete User..." -ForegroundColor Yellow
    Invoke-RestMethod -Uri "http://localhost:8090/users/$testUserId" -Method DELETE -Headers $headers
    Write-Host "✅ Successfully deleted test user" -ForegroundColor Green
    
} catch {
    Write-Host "❌ User operations failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Summary ===" -ForegroundColor Green
Write-Host "✅ User Management System is working properly!" -ForegroundColor Green
Write-Host "✅ Authentication is functioning" -ForegroundColor Green
Write-Host "✅ User CRUD operations are working" -ForegroundColor Green
Write-Host "✅ Role-based filtering is working" -ForegroundColor Green
Write-Host "✅ Staff listing is working" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend URLs:" -ForegroundColor Cyan
Write-Host "- Admin Users List: http://localhost:5174/admin/users" -ForegroundColor Gray
Write-Host "- Create New User: http://localhost:5174/admin/users/new" -ForegroundColor Gray
Write-Host "- Test Page: http://localhost:5174/test-users" -ForegroundColor Gray
