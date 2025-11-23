# ?? DTO Quick Reference Card

## ?? Quick Commands

### Build & Run
```bash
# Build backend
cd FoodBridge.Server
dotnet build

# Run backend
dotnet run --launch-profile https

# Run frontend
cd ../foodbridge.client
npm run dev
```

### Quick Test
```bash
# Test login
curl -X POST https://localhost:7066/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@foodbridge.com","password":"Admin@123"}' \
  -k
```

## ?? New File Structure

```
FoodBridge.Server/
??? DTOs/
?   ??? Auth/
?   ?   ??? RegisterDto.cs
?   ?   ??? LoginDto.cs
?   ???? AuthResponseDto.cs
?   ?   ??? UserDto.cs
?   ?   ??? ChangePasswordDto.cs
?   ?   ??? UpdateProfileDto.cs
?   ??? Common/
?    ??? ApiResponse.cs
?   ??? PaginationDto.cs
??? Mappings/
?   ??? MappingExtensions.cs
??? Documentation/
    ??? DTO_ARCHITECTURE.md
    ??? DTO_MIGRATION_GUIDE.md
  ??? DTO_IMPLEMENTATION_SUMMARY.md
    ??? DTO_TESTING_CHECKLIST.md
```

## ?? Using DTOs

### In Controllers
```csharp
using FoodBridge.Server.DTOs.Auth;
using FoodBridge.Server.DTOs.Common;

[HttpPost("action")]
public async Task<IActionResult> Action([FromBody] RequestDto dto)
{
    if (!ModelState.IsValid)
    {
        var errors = ModelState.Values
.SelectMany(v => v.Errors)
     .Select(e => e.ErrorMessage)
     .ToList();
        
  return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
    }
    
    var result = await _service.ProcessAsync(dto);
 return Ok(result);
}
```

### In Services
```csharp
using FoodBridge.Server.DTOs.Auth;
using FoodBridge.Server.Mappings;

public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
{
    var user = dto.ToEntity(); // DTO ? Entity
    
    // ... process ...
    
    var userRoles = await _userManager.GetRolesAsync(user);
    return new AuthResponseDto
    {
   Success = true,
  User = user.ToDto(userRoles) // Entity ? DTO
    };
}
```

### Mapping Extensions
```csharp
// Entity to DTO
UserDto userDto = user.ToDto(roles);

// DTO to Entity
ApplicationUser user = registerDto.ToEntity();

// Update Entity from DTO
user.UpdateFromDto(updateProfileDto);
```

## ? Validation Patterns

### Required + Email
```csharp
[Required(ErrorMessage = "Email is required")]
[EmailAddress(ErrorMessage = "Invalid email format")]
[StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
public string Email { get; set; }
```

### Password
```csharp
[Required(ErrorMessage = "Password is required")]
[StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
[RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$", 
    ErrorMessage = "Password must contain uppercase, lowercase, and digit")]
public string Password { get; set; }
```

### Password Confirmation
```csharp
[Required(ErrorMessage = "Password confirmation is required")]
[Compare(nameof(Password), ErrorMessage = "Passwords do not match")]
public string ConfirmPassword { get; set; }
```

## ?? API Response Formats

### Success (with data)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* your data */ },
  "errors": [],
  "timestamp": "2024-11-03T12:00:00Z"
}
```

### Success (auth)
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGc...",
  "expiration": "2024-11-10T12:00:00Z",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "roles": ["User"],
    "createdAt": "2024-11-01T10:00:00Z",
    "lastLoginAt": "2024-11-03T12:00:00Z",
    "isActive": true
  }
}
```

### Error (validation)
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

### Error (generic)
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": [],
  "timestamp": "2024-11-03T12:00:00Z"
}
```

## ?? Frontend TypeScript Interfaces

```typescript
// Auth Response
interface AuthResponseDto {
  success: boolean;
  message: string;
  token?: string;
  expiration?: string;
  user?: UserDto;
}

// User DTO
interface UserDto {
  id: string;
email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  roles: string[];
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

// Generic API Response
interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
  errors: string[];
  timestamp: string;
}
```

## ?? Test Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@foodbridge.com | Admin@123 | Admin |
| donor@foodbridge.com | Donor@123 | Donor |
| recipient@foodbridge.com | Recipient@123 | Recipient |
| volunteer@foodbridge.com | Volunteer@123 | Volunteer |

## ?? Common Tasks

### Add New DTO
1. Create in appropriate folder (`DTOs/YourFeature/`)
2. Add validation attributes
3. Add XML documentation
4. Create mapping extensions if needed
5. Update controller to use new DTO
6. Update service interface and implementation

### Create API Response Helper
```csharp
// Success
return Ok(ApiResponse<YourDto>.SuccessResponse(data, "Success message"));

// Error
return BadRequest(ApiResponse.ErrorResponse("Error message", errorList));
```

### Handle ModelState Errors
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

## ?? HTTP Status Codes

| Code | Use When |
|------|----------|
| 200 OK | Successful operation |
| 400 Bad Request | Validation failed |
| 401 Unauthorized | Not authenticated |
| 403 Forbidden | Not authorized |
| 404 Not Found | Resource doesn't exist |
| 500 Internal Server Error | Unexpected error |

## ?? Security Checklist

- ? Never return entities directly
- ? Always use DTOs for input/output
- ? Validate all inputs
- ? Never expose PasswordHash
- ? Use [Authorize] on protected endpoints
- ? Return generic errors for auth failures

## ?? Documentation Links

- **Full Architecture**: `DTO_ARCHITECTURE.md`
- **Migration Guide**: `DTO_MIGRATION_GUIDE.md`
- **Implementation Summary**: `DTO_IMPLEMENTATION_SUMMARY.md`
- **Testing Checklist**: `DTO_TESTING_CHECKLIST.md`
- **Auth Troubleshooting**: `AUTHENTICATION_TROUBLESHOOTING.md`

## ?? Quick Fixes

### Build Errors
```bash
dotnet clean
dotnet build
```

### Frontend Not Connecting
1. Check backend is running: `https://localhost:7066`
2. Check vite proxy: `vite.config.js` ? `target: 'https://127.0.0.1:7066'`
3. Clear browser cache and localStorage

### Validation Not Working
1. Check ModelState validation in controller
2. Verify DTO has validation attributes
3. Check error response format

### Mapping Errors
1. Verify mapping extension exists
2. Check using statement: `using FoodBridge.Server.Mappings;`
3. Ensure method signature matches

---

**Pro Tip**: Keep this card handy while developing! ??

**Version**: 1.0.0
**Last Updated**: November 2024
