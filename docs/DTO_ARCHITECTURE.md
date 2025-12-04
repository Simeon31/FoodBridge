# FoodBridge DTO Architecture Guide

## Overview

This document outlines the Data Transfer Object (DTO) architecture
## Directory Structure

```
FoodBridge.Server/
    DTOs/
        Auth/
            RegisterDto.cs
            LoginDto.cs
            AuthResponseDto.cs
            UserDto.cs
            ChangePasswordDto.cs
            UpdateProfileDto.cs
        Common/
            ApiResponse.cs
            PaginationDto.cs
    Mappings/
        MappingExtensions.cs
    ```

## DTO Categories

### 1. **Authentication DTOs** (`DTOs/Auth/`)

#### **RegisterDto**
Used for user registration requests.

```csharp
public class RegisterDto
{
    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$")]
    public string Password { get; set; }

[Required]
    [Compare(nameof(Password))]
    public string ConfirmPassword { get; set; }

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public string LastName { get; set; }
}
```

**Validation Rules:**
- Email: Required, valid format, max 100 characters
- Password: Min 6 chars, must include uppercase, lowercase, and digit
- FirstName/LastName: Required, max 50 characters

#### **LoginDto**
Used for login requests.

```csharp
public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    public bool RememberMe { get; set; }
}
```

#### **UserDto**
Used to return user information (never expose ApplicationUser directly).

```csharp
public class UserDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? FullName { get; }  // Computed property
    public List<string> Roles { get; set; }
public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; }
}
```

**Security Note:** Never includes password hash or security stamps!

#### **AuthResponseDto**
Standardized response for authentication operations.

```csharp
public class AuthResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string? Token { get; set; }
    public DateTime? Expiration { get; set; }
    public UserDto? User { get; set; }
}
```

#### **ChangePasswordDto**
Used for password change requests.

```csharp
public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 6)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$")]
    public string NewPassword { get; set; }

    [Required]
    [Compare(nameof(NewPassword))]
    public string ConfirmNewPassword { get; set; }
}
```

#### **UpdateProfileDto**
Used for profile update requests.

```csharp
public class UpdateProfileDto
{
    [Required]
    [StringLength(50)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public string LastName { get; set; }
}
```

### 2. **Common DTOs** (`DTOs/Common/`)

#### **ApiResponse<T>**
Generic wrapper for all API responses.

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }
    public List<string> Errors { get; set; }
    public DateTime Timestamp { get; set; }

    // Helper methods
    public static ApiResponse<T> SuccessResponse(T data, string message);
    public static ApiResponse<T> ErrorResponse(string message, List<string>? errors);
}
```

**Usage Examples:**
```csharp
// Success response
return Ok(ApiResponse<UserDto>.SuccessResponse(userDto, "Profile updated"));

// Error response
return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
```

#### **PagedResultDto<T>**
Used for paginated data.

```csharp
public class PagedResultDto<T>
{
 public List<T> Items { get; set; }
    public int TotalCount { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
public int TotalPages { get; }         // Computed
    public bool HasPreviousPage { get; }   // Computed
    public bool HasNextPage { get; }    // Computed
}
```

#### **PaginationParams**
Parameters for paginated requests.

```csharp
public class PaginationParams
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;  // Max 100
    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; }
}
```

## Mapping Strategy

### Using Extension Methods (`Mappings/MappingExtensions.cs`)

```csharp
// Entity to DTO
UserDto userDto = user.ToDto(roles);

// DTO to Entity
ApplicationUser user = registerDto.ToEntity();

// Update Entity from DTO
user.UpdateFromDto(updateProfileDto);
```

### Benefits of Extension Methods:
- Cleaner code
- Centralized mapping logic
- Easy to test
- No external dependencies needed

### Alternative: AutoMapper (Optional)

For larger projects, consider using AutoMapper:

```csharp
// Install-Package AutoMapper.Extensions.Microsoft.DependencyInjection

// Program.cs
builder.Services.AddAutoMapper(typeof(Program));

// Create MappingProfile.cs
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<ApplicationUser, UserDto>();
        CreateMap<RegisterDto, ApplicationUser>();
    }
}
```

## Security Benefits

### 1. **Prevent Over-Posting**
```csharp
// BAD: Direct entity binding
[HttpPost]
public async Task<IActionResult> Register([FromBody] ApplicationUser user) 
{
    // Attacker could set: IsActive=true, Roles=["Admin"], etc.
}

// GOOD: DTO with specific properties
[HttpPost]
public async Task<IActionResult> Register([FromBody] RegisterDto dto)
{
    // Only Email, Password, FirstName, LastName can be set
}
```

### 2. **Prevent Data Exposure**
```csharp
// BAD: Returning entity directly
return Ok(user); // Exposes PasswordHash, SecurityStamp, etc.

// GOOD: Returning DTO
return Ok(user.ToDto(roles)); // Only exposes safe properties
```

### 3. **Input Validation**
```csharp
public class RegisterDto
{
    [EmailAddress]
    [Required]
    public string Email { get; set; }
    
  [StringLength(100, MinimumLength = 6)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$")]
    public string Password { get; set; }
}
```

## Controller Implementation Pattern

```csharp
[HttpPost("action")]
[ProducesResponseType(typeof(ApiResponse<ResultDto>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
public async Task<IActionResult> Action([FromBody] RequestDto dto)
{
    // 1. Validate ModelState
    if (!ModelState.IsValid)
    {
        var errors = ModelState.Values
         .SelectMany(v => v.Errors)
       .Select(e => e.ErrorMessage)
   .ToList();
        
        return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
    }

    // 2. Call service with DTO
    var result = await _service.ProcessAsync(dto);

    // 3. Return appropriate response
    if (!result.Success)
    {
   return BadRequest(result);
    }

    return Ok(result);
}
```

## Best Practices

### 1. **Naming Conventions**
- Use `Dto` suffix: `UserDto`, `RegisterDto`
- Use descriptive names: `UpdateProfileDto` not `UpdateDto`
- Group by feature: `Auth/`, `Inventory/`, `Volunteer/`

### 2. **Validation**
- Always use DataAnnotations
- Provide meaningful error messages
- Validate at DTO level, not entity level

### 3. **Immutability**
- Use `init` for read-only DTOs:
```csharp
public class UserDto
{
public string Id { get; init; }
    public string Email { get; init; }
}
```

### 4. **Documentation**
- Use XML comments
- Document validation rules
- Provide usage examples

### 5. **Versioning**
- Use separate DTO namespaces for API versions:
```csharp
namespace FoodBridge.Server.DTOs.V1.Auth { }
namespace FoodBridge.Server.DTOs.V2.Auth { }
```

## Testing DTOs

### Unit Test Example
```csharp
[Fact]
public void RegisterDto_WithValidData_PassesValidation()
{
    // Arrange
    var dto = new RegisterDto
    {
  Email = "test@example.com",
        Password = "Test@123",
        ConfirmPassword = "Test@123",
        FirstName = "Test",
        LastName = "User"
    };

    var context = new ValidationContext(dto);
    var results = new List<ValidationResult>();

    // Act
    var isValid = Validator.TryValidateObject(dto, context, results, true);

    // Assert
    Assert.True(isValid);
    Assert.Empty(results);
}
```

## Future Enhancements

### 1. **Inventory Management DTOs**
```csharp
// DTOs/Inventory/
- FoodItemDto
- CreateFoodItemDto
- UpdateFoodItemDto
- FoodItemListDto
```

### 2. **Volunteer Management DTOs**
```csharp
// DTOs/Volunteer/
- VolunteerDto
- VolunteerApplicationDto
- VolunteerScheduleDto
```

### 3. **Donation Management DTOs**
```csharp
// DTOs/Donation/
- DonationDto
- CreateDonationDto
- DonationHistoryDto
```

## Additional Resources

- [Microsoft DTOs Documentation](https://learn.microsoft.com/en-us/aspnet/web-api/overview/data/using-web-api-with-entity-framework/part-5)
- [AutoMapper Documentation](https://docs.automapper.org/)
- [ASP.NET Core Model Validation](https://learn.microsoft.com/en-us/aspnet/core/mvc/models/validation)

---

**Version**: 1.0.0
**Last Updated**: 2025
