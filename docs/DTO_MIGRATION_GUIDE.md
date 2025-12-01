# ?? DTO Migration Guide

## Overview

This guide helps you migrate from the old `AuthenticationModels.cs` to the new DTO architecture.

## ?? Migration Checklist

- [x] Created new DTO structure (`DTOs/Auth/`, `DTOs/Common/`)
- [x] Created mapping extensions (`Mappings/MappingExtensions.cs`)
- [x] Updated `AuthController.cs` to use new DTOs
- [x] Updated `AuthenticationService.cs` to use new DTOs
- [ ] Update frontend to match new response structure
- [ ] Remove old `Models/AuthenticationModels.cs` (after verification)
- [ ] Update API documentation/Swagger
- [ ] Update integration tests

## ?? Changes Summary

### Old Structure ? New Structure

| Old Class | New Class | Location |
|-----------|-----------|----------|
| `RegisterRequest` | `RegisterDto` | `DTOs/Auth/RegisterDto.cs` |
| `LoginRequest` | `LoginDto` | `DTOs/Auth/LoginDto.cs` |
| `AuthenticationResponse` | `AuthResponseDto` | `DTOs/Auth/AuthResponseDto.cs` |
| `UserInfo` | `UserDto` | `DTOs/Auth/UserDto.cs` |
| `ChangePasswordRequest` | `ChangePasswordDto` | `DTOs/Auth/ChangePasswordDto.cs` |
| `UpdateProfileRequest` | `UpdateProfileDto` | `DTOs/Auth/UpdateProfileDto.cs` |
| N/A | `ApiResponse<T>` | `DTOs/Common/ApiResponse.cs` |
| N/A | `PagedResultDto<T>` | `DTOs/Common/PaginationDto.cs` |

## ?? Code Changes Required

### 1. Controller Changes

#### Before:
```csharp
using FoodBridge.Server.Models;

[HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterRequest request)
{
    var result = await _authService.RegisterAsync(request);
    
    if (!result.Success)
    {
        return BadRequest(result);
  }
    
    return Ok(result);
}
```

#### After:
```csharp
using FoodBridge.Server.DTOs.Auth;
using FoodBridge.Server.DTOs.Common;

[HttpPost("register")]
[ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
public async Task<IActionResult> Register([FromBody] RegisterDto dto)
{
    if (!ModelState.IsValid)
    {
        var errors = ModelState.Values
      .SelectMany(v => v.Errors)
    .Select(e => e.ErrorMessage)
       .ToList();
    
        return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
    }
    
    var result = await _authService.RegisterAsync(dto);
    
    if (!result.Success)
    {
  return BadRequest(result);
    }
    
    return Ok(result);
}
```

### 2. Service Interface Changes

#### Before:
```csharp
public interface IAuthenticationService
{
    Task<AuthenticationResponse> RegisterAsync(RegisterRequest request);
    Task<AuthenticationResponse> LoginAsync(LoginRequest request);
}
```

#### After:
```csharp
using FoodBridge.Server.DTOs.Auth;

public interface IAuthenticationService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> GetCurrentUserAsync(string userId);
    Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto);
    Task<bool> UpdateProfileAsync(string userId, UpdateProfileDto dto);
}
```

### 3. Service Implementation Changes

#### Before:
```csharp
public async Task<AuthenticationResponse> RegisterAsync(RegisterRequest request)
{
    var user = new ApplicationUser
    {
   UserName = request.Email,
      Email = request.Email,
        FirstName = request.FirstName,
        LastName = request.LastName
    };
    
    // ... rest of implementation
}
```

#### After:
```csharp
using FoodBridge.Server.Mappings;

public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
{
    var user = dto.ToEntity(); // Using mapping extension
    
    // ... rest of implementation
    
    return new AuthResponseDto
    {
        Success = true,
        Message = "Registration successful!",
     Token = token,
        Expiration = DateTime.UtcNow.AddDays(7),
        User = user.ToDto(userRoles) // Using mapping extension
    };
}
```

## ?? Frontend Changes

### JavaScript/TypeScript Updates

#### Before:
```typescript
// Old API response
interface AuthenticationResponse {
    success: boolean;
    message: string;
    token?: string;
    expiration?: string;
    user?: UserInfo;
}

interface UserInfo {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
}
```

#### After:
```typescript
// New API response structure
interface AuthResponseDto {
    success: boolean;
    message: string;
    token?: string;
 expiration?: string;
    user?: UserDto;
}

interface UserDto {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;  // NEW: Computed property
    roles: string[];
    createdAt: string;   // NEW
    lastLoginAt?: string; // NEW
    isActive: boolean;  // NEW
}

// Generic API response wrapper
interface ApiResponse<T = void> {
    success: boolean;
    message: string;
    data?: T;
    errors: string[];
    timestamp: string;
}
```

### Frontend Service Updates

#### Before:
```javascript
// authService.js
export const authService = {
    register: async (email, password, confirmPassword, firstName, lastName) => {
        const response = await apiClient.post('/auth/register', {
            email,
     password,
        confirmPassword,
        firstName,
         lastName,
        });
        
        return response.data; // AuthenticationResponse
    }
};
```

#### After:
```javascript
// authService.js - No changes needed!
// The response structure is backward compatible
export const authService = {
    register: async (email, password, confirmPassword, firstName, lastName) => {
        const response = await apiClient.post('/auth/register', {
        email,
            password,
         confirmPassword,
    firstName,
            lastName,
        });
        
        return response.data; // AuthResponseDto (compatible with old structure)
    }
};
```

**Note**: The new DTO structure is **backward compatible** with your existing frontend code!

## ?? Testing Migration

### 1. Test Backend Endpoints

```bash
# Test Registration
curl -X POST https://localhost:7066/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@test.com",
    "password": "Test@123",
    "confirmPassword": "Test@123",
    "firstName": "Test",
    "lastName": "User"
  }' \
  -k

# Expected Response:
{
  "success": true,
  "message": "Registration successful!",
  "token": "eyJhbGc...",
  "expiration": "2024-11-10T...",
  "user": {
    "id": "...",
    "email": "newuser@test.com",
    "firstName": "Test",
    "lastName": "User",
    "fullName": "Test User",
    "roles": [],
  "createdAt": "2024-11-03T...",
    "lastLoginAt": null,
    "isActive": true
  }
}
```

### 2. Test Frontend Integration

```javascript
// Test in browser console
const testAuth = async () => {
    try {
        const response = await fetch('/api/auth/login', {
  method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
       email: 'admin@foodbridge.com',
      password: 'Admin@123'
            })
        });
        
        const data = await response.json();
        console.log('Response structure:', data);
        console.log('User FullName (NEW):', data.user?.fullName);
        console.log('User CreatedAt (NEW):', data.user?.createdAt);
    } catch (error) {
        console.error('Test failed:', error);
    }
};

testAuth();
```

## ?? Breaking Changes

### Response Structure Changes

#### Old Response:
```json
{
    "success": true,
    "message": "Login successful",
"user": {
        "id": "123",
 "email": "user@example.com"
    }
}
```

#### New Response:
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": "123",
  "email": "user@example.com",
        "fullName": "John Doe",
        "createdAt": "2024-11-03T10:00:00Z",
        "lastLoginAt": "2024-11-03T12:00:00Z",
        "isActive": true
    }
}
```

**Impact**: ? **Backward Compatible** - Old frontend code will still work; new properties are additional.

### Validation Error Responses

#### Old Response:
```json
{
    "success": false,
    "message": "Registration failed"
}
```

#### New Response:
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        "Email is required",
        "Password must be at least 6 characters"
    ],
    "timestamp": "2024-11-03T12:00:00Z"
}
```

**Impact**: ?? **Enhanced** - Frontend can now display specific validation errors.

## ?? Rollback Plan

If you need to rollback:

1. **Keep old Models file** (don't delete yet):
```bash
# Rename instead of delete
mv Models/AuthenticationModels.cs Models/AuthenticationModels.cs.backup
```

2. **Create rollback branch**:
```bash
git checkout -b dto-migration-rollback
git revert <commit-hash>
```

3. **Update using directives back**:
```csharp
// Change
using FoodBridge.Server.DTOs.Auth;

// Back to
using FoodBridge.Server.Models;
```

## ? Verification Steps

### 1. Build Solution
```bash
cd FoodBridge.Server
dotnet build
```

Expected: ? No build errors

### 2. Run Backend
```bash
dotnet run --launch-profile https
```

Expected: ? Server starts successfully

### 3. Check Swagger
Navigate to: `https://localhost:7066/swagger`

Expected: ? All endpoints visible with new DTO models

### 4. Test Frontend
```bash
cd ../foodbridge.client
npm run dev
```

Expected: ? Login and registration work normally

### 5. Run Tests (if available)
```bash
cd ../FoodBridge.Server
dotnet test
```

## ?? Migration Status

Current Status: **? 80% Complete**

### Completed:
- ? Created DTO structure
- ? Created mapping extensions
- ? Updated AuthController
- ? Updated AuthenticationService
- ? Created documentation

### Remaining:
- ? Frontend TypeScript interface updates (optional)
- ? Integration tests update
- ? Remove old Models file
- ? Update Swagger documentation

## ?? Next Steps

1. **Test thoroughly** in development environment
2. **Update frontend TypeScript interfaces** (optional - for better type safety)
3. **Update API documentation**
4. **Remove old Models file** after 1 week of testing
5. **Create similar DTO structures** for future features (Inventory, Donations, etc.)

## ?? Common Issues

### Issue 1: Namespace Not Found
**Error**: `The type or namespace name 'DTOs' could not be found`

**Solution**: Clean and rebuild
```bash
dotnet clean
dotnet build
```

### Issue 2: Frontend 401 Errors
**Error**: Authentication suddenly fails

**Solution**: Check token structure hasn't changed
```javascript
console.log('Token from localStorage:', localStorage.getItem('authToken'));
```

### Issue 3: Validation Errors Not Showing
**Error**: ModelState errors not displaying

**Solution**: Check controller ModelState handling:
```csharp
if (!ModelState.IsValid)
{
    var errors = ModelState.Values
        .SelectMany(v => v.Errors)
 .Select(e => e.ErrorMessage)
.ToList();
    
    return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
}
```

---

**Need Help?** Check the `DTO_ARCHITECTURE.md` file for detailed documentation.
