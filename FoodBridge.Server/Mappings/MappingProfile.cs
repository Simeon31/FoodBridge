using AutoMapper;
using FoodBridge.Server.Data;
using FoodBridge.Server.Data.Models;
using FoodBridge.Server.DTOs.Auth;
using FoodBridge.Server.DTOs.Donations;
using FoodBridge.Server.DTOs.Products;
using FoodBridge.Server.DTOs.Inventory;
using FoodBridge.Server.DTOs.Waste;
using FoodBridge.Server.DTOs.Dashboard;

namespace FoodBridge.Server.Mappings
{
    /// <summary>
    /// AutoMapper profile containing all entity-DTO mappings
    /// </summary>
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

            CreateDonationAuditTrailMappings();

            CreateWasteRecordMappings();
        }

        private void CreateAuthMappings()
        {
            // ApplicationUser -> UserDto
            CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.Roles, opt => opt.Ignore()); // Roles will be set manually

            // RegisterDto -> ApplicationUser
            CreateMap<RegisterDto, ApplicationUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.EmailConfirmed, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.NormalizedEmail, opt => opt.Ignore())
            .ForMember(dest => dest.NormalizedUserName, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.SecurityStamp, opt => opt.Ignore())
            .ForMember(dest => dest.ConcurrencyStamp, opt => opt.Ignore())
            .ForMember(dest => dest.PhoneNumber, opt => opt.Ignore())
            .ForMember(dest => dest.PhoneNumberConfirmed, opt => opt.Ignore())
            .ForMember(dest => dest.TwoFactorEnabled, opt => opt.Ignore())
            .ForMember(dest => dest.LockoutEnd, opt => opt.Ignore())
            .ForMember(dest => dest.LockoutEnabled, opt => opt.Ignore())
            .ForMember(dest => dest.AccessFailedCount, opt => opt.Ignore())
            .ForMember(dest => dest.LastLoginAt, opt => opt.Ignore());

            // UpdateProfileDto -> ApplicationUser
            CreateMap<UpdateProfileDto, ApplicationUser>()
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName));
        }

        private void CreateDonorMappings()
        {
            // CreateDonorDto -> Donor
            CreateMap<CreateDonorDto, Donor>()
           .ForMember(dest => dest.DonorId, opt => opt.Ignore())
           .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
           .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
           .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
           .ForMember(dest => dest.Donations, opt => opt.Ignore());

            // UpdateDonorDto -> Donor
            CreateMap<UpdateDonorDto, Donor>()
           .ForMember(dest => dest.DonorId, opt => opt.Ignore())
           .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
           .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
           .ForMember(dest => dest.Donations, opt => opt.Ignore());

            // Donor -> DonorDto
            CreateMap<Donor, DonorDto>()
           .ForMember(dest => dest.TotalDonations, opt => opt.MapFrom(src => src.Donations.Count))
           .ForMember(dest => dest.LastDonationDate, opt => opt.MapFrom(src =>
              src.Donations.Any() ? src.Donations.Max(d => d.DonationDate) : (DateTime?)null));

            // Donor -> DonorSummaryDto
            CreateMap<Donor, DonorSummaryDto>()
           .ForMember(dest => dest.TotalDonations, opt => opt.MapFrom(src => src.Donations.Count))
           .ForMember(dest => dest.LastDonationDate, opt => opt.MapFrom(src =>
    src.Donations.Any() ? src.Donations.Max(d => d.DonationDate) : (DateTime?)null));
        }

        private void CreateDonationMappings()
        {
            // CreateDonationDto -> Donation
            CreateMap<CreateDonationDto, Donation>()
             .ForMember(dest => dest.DonationId, opt => opt.Ignore())
             .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Pending"))
             .ForMember(dest => dest.InspectedBy, opt => opt.Ignore())
             .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
             .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
             .ForMember(dest => dest.Donor, opt => opt.Ignore())
             .ForMember(dest => dest.DonationItems, opt => opt.Ignore())
             .ForMember(dest => dest.DonationReceipt, opt => opt.Ignore())
             .ForMember(dest => dest.AuditTrail, opt => opt.Ignore());

            // UpdateDonationDto -> Donation
            CreateMap<UpdateDonationDto, Donation>()
             .ForMember(dest => dest.DonationId, opt => opt.Ignore())
             .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
             .ForMember(dest => dest.DonorId, opt => opt.Ignore())
             .ForMember(dest => dest.DonationDate, opt => opt.Ignore())
             .ForMember(dest => dest.ReceiptNumber, opt => opt.Ignore())
             .ForMember(dest => dest.ReceivedBy, opt => opt.Ignore())
             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
             .ForMember(dest => dest.Donor, opt => opt.Ignore())
             .ForMember(dest => dest.DonationItems, opt => opt.Ignore())
             .ForMember(dest => dest.DonationReceipt, opt => opt.Ignore())
             .ForMember(dest => dest.AuditTrail, opt => opt.Ignore());

            // Donation -> DonationDto
            CreateMap<Donation, DonationDto>()
                  .ForMember(dest => dest.DonorName, opt => opt.MapFrom(src => src.Donor.Name))
                  .ForMember(dest => dest.ReceivedByName, opt => opt.Ignore()) 
                  .ForMember(dest => dest.InspectedByName, opt => opt.Ignore()); 

            // Donation -> DonationSummaryDto
            CreateMap<Donation, DonationSummaryDto>()
                  .ForMember(dest => dest.DonorName, opt => opt.MapFrom(src => src.Donor.Name))
                  .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src => src.DonationItems.Count));
        }

        private void CreateDonationItemMappings()
        {
            // CreateDonationItemDto -> DonationItem
            CreateMap<CreateDonationItemDto, DonationItem>()
             .ForMember(dest => dest.DonationItemId, opt => opt.Ignore())
             .ForMember(dest => dest.DonationId, opt => opt.Ignore())
             .ForMember(dest => dest.QuantityReceived, opt => opt.MapFrom(src => src.Quantity))
             .ForMember(dest => dest.ManufactureDate, opt => opt.Ignore())
             .ForMember(dest => dest.BatchNumber, opt => opt.Ignore())
             .ForMember(dest => dest.StorageCondition, opt => opt.MapFrom(src => src.Condition))
             .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
             .ForMember(dest => dest.Donation, opt => opt.Ignore())
             .ForMember(dest => dest.Product, opt => opt.Ignore())
             .ForMember(dest => dest.QualityInspection, opt => opt.Ignore())
             .ForMember(dest => dest.WasteRecords, opt => opt.Ignore())
             .ForMember(dest => dest.InventoryItems, opt => opt.Ignore());

            // UpdateDonationItemDto -> DonationItem
            CreateMap<UpdateDonationItemDto, DonationItem>()
              .ForMember(dest => dest.DonationItemId, opt => opt.Ignore())
              .ForMember(dest => dest.DonationId, opt => opt.Ignore())
              .ForMember(dest => dest.ProductId, opt => opt.Ignore())
              .ForMember(dest => dest.QuantityReceived, opt => opt.MapFrom(src => src.Quantity))
              .ForMember(dest => dest.StorageCondition, opt => opt.MapFrom(src => src.Condition))
              .ForMember(dest => dest.ManufactureDate, opt => opt.Ignore())
              .ForMember(dest => dest.BatchNumber, opt => opt.Ignore())
              .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
              .ForMember(dest => dest.Donation, opt => opt.Ignore())
              .ForMember(dest => dest.Product, opt => opt.Ignore())
              .ForMember(dest => dest.QualityInspection, opt => opt.Ignore())
              .ForMember(dest => dest.WasteRecords, opt => opt.Ignore())
              .ForMember(dest => dest.InventoryItems, opt => opt.Ignore());

            // DonationItem -> DonationItemDto
            CreateMap<DonationItem, DonationItemDto>()
              .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
              .ForMember(dest => dest.ProductCode, opt => opt.MapFrom(src => src.Product.ProductCode))
              .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Product.Category))
              .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.QuantityReceived))
              .ForMember(dest => dest.Condition, opt => opt.MapFrom(src => src.StorageCondition))
              .ForMember(dest => dest.InspectionStatus, opt => opt.MapFrom(src =>
                       src.QualityInspection != null ? src.QualityInspection.Status : "Pending"))
              .ForMember(dest => dest.QualityInspection, opt => opt.MapFrom(src => src.QualityInspection));
        }

        private void CreateProductMappings()
        {
            // CreateProductDto -> Product
            CreateMap<CreateProductDto, Product>()
             .ForMember(dest => dest.ProductId, opt => opt.Ignore())
             .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
             .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
             .ForMember(dest => dest.DonationItems, opt => opt.Ignore())
             .ForMember(dest => dest.InventoryItems, opt => opt.Ignore());

            // UpdateProductDto -> Product
            CreateMap<UpdateProductDto, Product>()
            .ForMember(dest => dest.ProductId, opt => opt.Ignore())
            .ForMember(dest => dest.ProductCode, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DonationItems, opt => opt.Ignore())
            .ForMember(dest => dest.InventoryItems, opt => opt.Ignore());

            // Product -> ProductDto
            CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.TotalDonated, opt => opt.MapFrom(src =>
            src.DonationItems.Sum(di => di.QuantityReceived)))
              .ForMember(dest => dest.CurrentInventory, opt => opt.MapFrom(src =>
            src.InventoryItems.Sum(ii => ii.QuantityOnHand)));

            // Product -> ProductSummaryDto
            CreateMap<Product, ProductSummaryDto>()
              .ForMember(dest => dest.CurrentInventory, opt => opt.MapFrom(src =>
            src.InventoryItems.Sum(ii => ii.QuantityOnHand)));
        }

        private void CreateInventoryMappings()
        {
            // CreateInventoryItemDto -> InventoryItem
            CreateMap<CreateInventoryItemDto, InventoryItem>()
             .ForMember(dest => dest.InventoryItemId, opt => opt.Ignore())
             .ForMember(dest => dest.IsBlocked, opt => opt.MapFrom(src => false))
             .ForMember(dest => dest.BlockReason, opt => opt.Ignore())
             .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
             .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
             .ForMember(dest => dest.SourceDonationItem, opt => opt.Ignore());

            // UpdateInventoryItemDto -> InventoryItem
            CreateMap<UpdateInventoryItemDto, InventoryItem>()
             .ForMember(dest => dest.InventoryItemId, opt => opt.Ignore())
             .ForMember(dest => dest.DateReceived, opt => opt.Ignore())
             .ForMember(dest => dest.SourceDonationItemId, opt => opt.Ignore())
             .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
             .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
             .ForMember(dest => dest.SourceDonationItem, opt => opt.Ignore());

            // InventoryItem -> InventoryItemDto
            CreateMap<InventoryItem, InventoryItemDto>()
             .ForMember(dest => dest.StorageLocationName, opt => opt.Ignore())
             .ForMember(dest => dest.DaysUntilExpiration, opt => opt.MapFrom(src =>
             src.ExpirationDate.HasValue ? (int?)(src.ExpirationDate.Value - DateTime.UtcNow).TotalDays : null));

            // InventoryItem -> InventoryItemSummaryDto
            CreateMap<InventoryItem, InventoryItemSummaryDto>()
             .ForMember(dest => dest.DaysUntilExpiration, opt => opt.MapFrom(src =>
                src.ExpirationDate.HasValue ? (int?)(src.ExpirationDate.Value - DateTime.UtcNow).TotalDays : null))
             .ForMember(dest => dest.IsExpiringSoon, opt => opt.MapFrom(src =>
                src.ExpirationDate.HasValue && (src.ExpirationDate.Value - DateTime.UtcNow).TotalDays <= 7));
        }

        private void CreateQualityInspectionMappings()
        {
            // CreateQualityInspectionDto -> QualityInspection
            CreateMap<CreateQualityInspectionDto, QualityInspection>()
            .ForMember(dest => dest.InspectionId, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.InspectionResult))
            .ForMember(dest => dest.PackagingIntegrity, opt => opt.Ignore())
            .ForMember(dest => dest.ProductAppearance, opt => opt.Ignore())
            .ForMember(dest => dest.TemperatureCheck, opt => opt.Ignore())
            .ForMember(dest => dest.HasExpiredItems, opt => opt.Ignore())
            .ForMember(dest => dest.HasAllergenInfo, opt => opt.Ignore())
            .ForMember(dest => dest.HasNutritionLabel, opt => opt.Ignore())
            .ForMember(dest => dest.IsFromApprovedSource, opt => opt.Ignore())
            .ForMember(dest => dest.DecisionReason, opt => opt.MapFrom(src => src.RejectionReason))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.DonationItem, opt => opt.Ignore());

            // QualityInspection -> QualityInspectionDto
            CreateMap<QualityInspection, QualityInspectionDto>()
            .ForMember(dest => dest.InspectionResult, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.RejectionReason, opt => opt.MapFrom(src => src.DecisionReason))
            .ForMember(dest => dest.InspectedByName, opt => opt.Ignore());
        }

        private void CreateDonationReceiptMappings()
        {
            // CreateDonationReceiptDto -> DonationReceipt
            CreateMap<CreateDonationReceiptDto, DonationReceipt>()
            .ForMember(dest => dest.ReceiptId, opt => opt.Ignore())
            .ForMember(dest => dest.TotalItemsReceived, opt => opt.Ignore()) // Will be calculated
            .ForMember(dest => dest.TotalItemsApproved, opt => opt.Ignore()) // Will be calculated
            .ForMember(dest => dest.GeneratedAt, opt => opt.MapFrom(src => src.IssueDate))
            .ForMember(dest => dest.SentToDonor, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.SentAt, opt => opt.Ignore())
            .ForMember(dest => dest.PDFPath, opt => opt.Ignore())
            .ForMember(dest => dest.Donation, opt => opt.Ignore());

            // DonationReceipt -> DonationReceiptDto
            CreateMap<DonationReceipt, DonationReceiptDto>()
            .ForMember(dest => dest.IssueDate, opt => opt.MapFrom(src => src.GeneratedAt))
            .ForMember(dest => dest.IssuedByName, opt => opt.Ignore())
            .ForMember(dest => dest.DonorName, opt => opt.MapFrom(src => src.Donation.Donor.Name))
            .ForMember(dest => dest.DonationDate, opt => opt.MapFrom(src => src.Donation.DonationDate))
            .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src => src.TotalItemsReceived))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.GeneratedAt));
        }


        private void CreateDonationAuditTrailMappings()
        {
            // DonationAuditTrail -> DonationAuditTrailDto
            CreateMap<DonationAuditTrail, DonationAuditTrailDto>()
        .ForMember(dest => dest.PerformedBy, opt => opt.MapFrom(src => src.ActionBy))
             .ForMember(dest => dest.ActionDetails, opt => opt.MapFrom(src => src.Details))
       .ForMember(dest => dest.OldValue, opt => opt.Ignore()) // Not in model
   .ForMember(dest => dest.NewValue, opt => opt.Ignore()) // Not in model
             .ForMember(dest => dest.PerformedByName, opt => opt.Ignore());
        }

        private void CreateWasteRecordMappings()
        {
            // CreateWasteRecordDto -> WasteRecord
            CreateMap<CreateWasteRecordDto, WasteRecord>()
                  .ForMember(dest => dest.WasteRecordId, opt => opt.Ignore())
                  .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
          .ForMember(dest => dest.DonationItem, opt => opt.Ignore())
        .ForMember(dest => dest.Product, opt => opt.Ignore());

            // WasteRecord -> WasteRecordDto
            CreateMap<WasteRecord, WasteRecordDto>()
             .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
            .ForMember(dest => dest.ProductCode, opt => opt.MapFrom(src => src.Product.ProductCode))
           .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Product.Category))
           .ForMember(dest => dest.DisposedByName, opt => opt.Ignore());
        }
    }
}
