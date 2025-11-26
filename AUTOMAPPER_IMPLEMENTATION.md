# AutoMapper Implementation Guide

## Overview
AutoMapper has been successfully integrated into the FoodBridge.Server project to handle all entity-to-DTO and DTO-to-entity mappings. This replaces the previous manual mapping extension methods with a more maintainable and convention-based approach.

## What Was Done

### 1. Package Installation
**Package Added:** `AutoMapper.Extensions.Microsoft.DependencyInjection` (v12.0.1)

This package includes:
- AutoMapper core library
- Dependency injection integration for ASP.NET Core
- Automatic profile discovery

### 2. Files Created/Modified

#### Created Files:
- **`FoodBridge.Server/Mappings/MappingProfile.cs`** - Main AutoMapper profile containing all entity-DTO mappings

#### Modified Files:
- **`FoodBridge.Server/Program.cs`** - Added AutoMapper configuration
- **`FoodBridge.Server/Mappings/MappingExtensions.cs`** - Updated to use AutoMapper
- **`FoodBridge.Server/Services/AuthenticationService.cs`** - Updated to inject and use IMapper
- **`FoodBridge.Server/DTOs/Donations/QualityInspectionDto.cs`** - Fixed broken class name

### 3. AutoMapper Configuration

#### In Program.cs:
```csharp
using FoodBridge.Server.Mappings;

// AutoMapper Configuration
builder.Services.AddAutoMapper(typeof(MappingProfile));
```

This automatically:
- Scans the assembly for Profile classes
- Registers AutoMapper with dependency injection
- Makes IMapper available for injection

### 4. Mapping Profile Structure

The `MappingProfile` class contains organized mapping methods:

```csharp
public class MappingProfile : Profile
{
public MappingProfile()
    {
        CreateAuthMappings();
        CreateDonationMappings();
        CreateDonorMappings();
        CreateDonationItemMappings();
   CreateProductMappings();
  CreateInventoryMappings();
        CreateQualityInspectionMappings();
        CreateDonationReceiptMappings();
      CreateDonationDispositionMappings();
    CreateDonationAuditTrailMappings();
        CreateWasteRecordMappings();
    }
}
```

## Mapping Details

### Authentication Mappings

#### ApplicationUser ↔ UserDto
```csharp
// To DTO (roles handled separately via UserManager)
CreateMap<ApplicationUser, UserDto>()
  .ForMember(dest => dest.Roles, opt => opt.Ignore());

// From RegisterDto
CreateMap<RegisterDto, ApplicationUser>()
    .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
    .ForMember(dest => dest.EmailConfirmed, opt => opt.MapFrom(src => false))
    .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
    .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

// Update Profile
CreateMap<UpdateProfileDto, ApplicationUser>()
    .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
    .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName));
```

### Donor Mappings

#### Donor ↔ DonorDto
```csharp
CreateMap<CreateDonorDto, Donor>()
    .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
    .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

CreateMap<Donor, DonorDto>()
    .ForMember(dest => dest.TotalDonations, opt => opt.MapFrom(src => src.Donations.Count))
    .ForMember(dest => dest.LastDonationDate, opt => opt.MapFrom(src => 
      src.Donations.Any() ? src.Donations.Max(d => d.DonationDate) : (DateTime?)null));
```

### Donation Mappings

#### Donation ↔ DonationDto
```csharp
CreateMap<CreateDonationDto, Donation>()
    .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pending"))
    .ForMember(dest => dest.InspectedBy, opt => opt.Ignore())
    .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

CreateMap<Donation, DonationDto>()
    .ForMember(dest => dest.DonorName, opt => opt.MapFrom(src => src.Donor.Name))
    .ForMember(dest => dest.ReceivedByName, opt => opt.Ignore())
    .ForMember(dest => dest.InspectedByName, opt => opt.Ignore());
```

**Note:** User names (ReceivedByName, InspectedByName) are ignored in the mapping and should be resolved separately using UserManager.

### Donation Item Mappings

#### DonationItem ↔ DonationItemDto
```csharp
CreateMap<CreateDonationItemDto, DonationItem>()
    .ForMember(dest => dest.QuantityReceived, opt => opt.MapFrom(src => src.Quantity))
    .ForMember(dest => dest.StorageCondition, opt => opt.MapFrom(src => src.Condition));

CreateMap<DonationItem, DonationItemDto>()
    .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
    .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.QuantityReceived))
    .ForMember(dest => dest.InspectionStatus, opt => opt.MapFrom(src => 
 src.QualityInspection != null ? src.QualityInspection.Status : "Pending"));
```

### Product Mappings

#### Product ↔ ProductDto
```csharp
CreateMap<Product, ProductDto>()
    .ForMember(dest => dest.TotalDonated, opt => opt.MapFrom(src => 
        src.DonationItems.Sum(di => di.QuantityReceived)))
    .ForMember(dest => dest.CurrentInventory, opt => opt.MapFrom(src => 
        src.InventoryItems.Sum(ii => ii.QuantityOnHand)));
```

### Inventory Mappings

#### InventoryItem ↔ InventoryItemDto
```csharp
CreateMap<InventoryItem, InventoryItemDto>()
    .ForMember(dest => dest.DaysUntilExpiration, opt => opt.MapFrom(src => 
        src.ExpirationDate.HasValue ? 
 (int?)(src.ExpirationDate.Value - DateTime.UtcNow).TotalDays : null));

CreateMap<InventoryItem, InventoryItemSummaryDto>()
 .ForMember(dest => dest.IsExpiringSoon, opt => opt.MapFrom(src => 
   src.ExpirationDate.HasValue && 
        (src.ExpirationDate.Value - DateTime.UtcNow).TotalDays <= 7));
```

### Quality Inspection Mappings

#### QualityInspection ↔ QualityInspectionDto
```csharp
CreateMap<CreateQualityInspectionDto, QualityInspection>()
    .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.InspectionResult))
    .ForMember(dest => dest.DecisionReason, opt => opt.MapFrom(src => src.RejectionReason));

CreateMap<QualityInspection, QualityInspectionDto>()
    .ForMember(dest => dest.InspectionResult, opt => opt.MapFrom(src => src.Status))
    .ForMember(dest => dest.QualityRating, opt => opt.Ignore())
    .ForMember(dest => dest.InspectionNotes, opt => opt.Ignore());
```

**Note:** QualityRating and InspectionNotes exist in the DTO but not in the model. These need to be added to the model or handled separately.

### Other Mappings

Similar patterns are implemented for:
- **DonationReceipt** ↔ DonationReceiptDto
- **DonationDisposition** ↔ DonationDispositionDto
- **DonationAuditTrail** ↔ DonationAuditTrailDto
- **WasteRecord** ↔ WasteRecordDto

## Usage in Services

### Injecting IMapper

```csharp
public class AuthenticationService : IAuthenticationService
{
    private readonly IMapper _mapper;

    public AuthenticationService(
        UserManager<ApplicationUser> userManager,
     IMapper mapper)
    {
        _mapper = mapper;
    }
}
```

### Using AutoMapper

#### Simple Mapping:
```csharp
var userDto = _mapper.Map<UserDto>(user);
var donor = _mapper.Map<Donor>(createDonorDto);
```

#### Mapping with Additional Data:
```csharp
// Map and then add roles
var userDto = _mapper.Map<UserDto>(user);
userDto.Roles = await _userManager.GetRolesAsync(user);
```

#### Updating Existing Entity:
```csharp
// Update existing entity from DTO
_mapper.Map(updateDto, existingEntity);
```

### MappingExtensions Helper Methods

For convenience, extension methods are still available:

```csharp
// Maps ApplicationUser to UserDto with roles
public static UserDto ToDto(this ApplicationUser user, IList<string> roles, IMapper mapper)
{
    var userDto = mapper.Map<UserDto>(user);
    userDto.Roles = roles.ToList();
    return userDto;
}

// Maps RegisterDto to ApplicationUser
public static ApplicationUser ToEntity(this RegisterDto dto, IMapper mapper)
{
    return mapper.Map<ApplicationUser>(dto);
}

// Updates ApplicationUser from UpdateProfileDto
public static void UpdateFromDto(this ApplicationUser user, UpdateProfileDto dto, IMapper mapper)
{
    mapper.Map(dto, user);
}
```

## Property Mapping Decisions

### Properties That Require Manual Resolution

These properties are ignored in mappings and must be resolved separately:

1. **User Names** (require UserManager):
   - `ReceivedByName`
 - `InspectedByName`
   - `InspectedByName` (QualityInspection)
   - `IssuedByName` (DonationReceipt)
   - `ApprovedByName` (DonationDisposition)
   - `PerformedByName` (DonationAuditTrail)
   - `DisposedByName` (WasteRecord)

2. **Storage Location Names** (require StorageLocation entity):
   - `StorageLocationName` (InventoryItem)

3. **Calculated Properties**:
   - `TotalItemsReceived` (DonationReceipt) - calculated from donation items
   - `TotalItemsApproved` (DonationReceipt) - calculated from approved items

### Model-DTO Mismatches

Some DTOs contain properties not in the model:

1. **DonationReceiptDto**:
   - `TotalEstimatedValue` - not in model
   - `IsTaxDeductible` - not in model
   - `ReceiptNotes` - not in model

2. **QualityInspectionDto**:
- `QualityRating` - not in model
   - `InspectionNotes` - not in model

3. **DonationAuditTrailDto**:
   - `OldValue` - not in model
   - `NewValue` - not in model

**Recommendation:** Either add these properties to the models or remove them from DTOs.

## Benefits of AutoMapper

1. **Reduced Boilerplate**: No need to write manual mapping code for each property
2. **Convention-Based**: Automatically maps properties with matching names
3. **Type Safety**: Compile-time checking of mappings
4. **Maintainability**: Centralized mapping configuration
5. **Performance**: Compiled mappings are cached and optimized
6. **Testability**: Mappings can be validated in unit tests

## Testing Mappings

Add mapping validation in your tests:

```csharp
[Test]
public void AutoMapper_Configuration_IsValid()
{
    var configuration = new MapperConfiguration(cfg => {
        cfg.AddProfile<MappingProfile>();
    });

    configuration.AssertConfigurationIsValid();
}
```


## Files Modified Summary

| File | Change |
|------|--------|
| `FoodBridge.Server.csproj` | Added AutoMapper.Extensions.Microsoft.DependencyInjection package |
| `Program.cs` | Added AutoMapper configuration |
| `Mappings/MappingProfile.cs` | Created comprehensive mapping profile |
| `Mappings/MappingExtensions.cs` | Updated to use IMapper |
| `Services/AuthenticationService.cs` | Injected and used IMapper |
| `DTOs/Donations/QualityInspectionDto.cs` | Fixed broken class name |

---
