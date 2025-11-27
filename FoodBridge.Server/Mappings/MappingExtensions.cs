using AutoMapper;
using FoodBridge.Server.Data;
using FoodBridge.Server.Data.Models;
using FoodBridge.Server.DTOs.Auth;
using FoodBridge.Server.DTOs.Donations;
using FoodBridge.Server.DTOs.Inventory;
using FoodBridge.Server.DTOs.Products;
using FoodBridge.Server.DTOs.Waste;
using Microsoft.AspNetCore.Identity;

namespace FoodBridge.Server.Mappings
{
    /// <summary>
    /// Provides mapping between domain entities and DTOs using AutoMapper
    /// </summary>
    public static class MappingExtensions
    {
        #region User Mappings

        /// <summary>
        /// Maps ApplicationUser to UserDto with roles
        /// </summary>
        public static UserDto ToDto(this ApplicationUser user, IList<string> roles, IMapper mapper)
        {
            var userDto = mapper.Map<UserDto>(user);
            userDto.Roles = roles.ToList();
            return userDto;
        }

        /// <summary>
        /// Maps RegisterDto to ApplicationUser
        /// </summary>
        public static ApplicationUser ToEntity(this RegisterDto dto, IMapper mapper)
        {
            return mapper.Map<ApplicationUser>(dto);
        }

        /// <summary>
        /// Updates ApplicationUser from UpdateProfileDto
        /// </summary>
        public static void UpdateFromDto(this ApplicationUser user, UpdateProfileDto dto, IMapper mapper)
        {
            mapper.Map(dto, user);
        }

        #endregion

        #region Donation Mappings

        public static DonationDto ToDto(this Donation entity, IMapper mapper)
        {
            return mapper.Map<DonationDto>(entity);
        }

        public static Donation ToEntity(this CreateDonationDto dto, IMapper mapper)
        {
            return mapper.Map<Donation>(dto);
        }

        public static void UpdateFromDto(this Donation entity, UpdateDonationDto dto, IMapper mapper)
        {
            mapper.Map(dto, entity);
        }

        #endregion

        #region Donor Mappings

        public static DonorDto ToDto(this Donor entity, IMapper mapper)
        {
            return mapper.Map<DonorDto>(entity);
        }

        public static Donor ToEntity(this CreateDonorDto dto, IMapper mapper)
        {
            return mapper.Map<Donor>(dto);
        }

        public static void UpdateFromDto(this Donor entity, UpdateDonorDto dto, IMapper mapper)
        {
            mapper.Map(dto, entity);
        }

        #endregion

        #region DonationItem Mappings

        public static DonationItemDto ToDto(this DonationItem entity, IMapper mapper)
        {
            return mapper.Map<DonationItemDto>(entity);
        }

        public static DonationItem ToEntity(this CreateDonationItemDto dto, IMapper mapper)
        {
            return mapper.Map<DonationItem>(dto);
        }

        public static void UpdateFromDto(this DonationItem entity, UpdateDonationItemDto dto, IMapper mapper)
        {
            mapper.Map(dto, entity);
        }

        #endregion

        #region Product Mappings

        public static ProductDto ToDto(this Product entity, IMapper mapper)
        {
            return mapper.Map<ProductDto>(entity);
        }

        public static Product ToEntity(this CreateProductDto dto, IMapper mapper)
        {
            return mapper.Map<Product>(dto);
        }

        public static void UpdateFromDto(this Product entity, UpdateProductDto dto, IMapper mapper)
        {
            mapper.Map(dto, entity);
        }

        #endregion

        #region Inventory Mappings

        public static InventoryItemDto ToDto(this InventoryItem entity, IMapper mapper)
        {
            return mapper.Map<InventoryItemDto>(entity);
        }

        public static InventoryItem ToEntity(this CreateInventoryItemDto dto, IMapper mapper)
        {
            return mapper.Map<InventoryItem>(dto);
        }

        public static void UpdateFromDto(this InventoryItem entity, UpdateInventoryItemDto dto, IMapper mapper)
        {
            mapper.Map(dto, entity);
        }

        #endregion

        #region WasteRecord Mappings

        public static WasteRecordDto ToDto(this WasteRecord entity, IMapper mapper)
        {
            return mapper.Map<WasteRecordDto>(entity);
        }

        public static WasteRecord ToEntity(this CreateWasteRecordDto dto, IMapper mapper)
        {
            return mapper.Map<WasteRecord>(dto);
        }

        public static void UpdateFromDto(this WasteRecord entity, UpdateWasteRecordDto dto, IMapper mapper)
        {
            mapper.Map(dto, entity);
        }

        #endregion

        #region QualityInspection Mappings

        public static QualityInspectionDto ToDto(this QualityInspection entity, IMapper mapper)
        {
            return mapper.Map<QualityInspectionDto>(entity);
        }

        public static QualityInspection ToEntity(this CreateQualityInspectionDto dto, IMapper mapper)
        {
            return mapper.Map<QualityInspection>(dto);
        }

        #endregion

        #region DonationReceipt Mappings

        public static DonationReceiptDto ToDto(this DonationReceipt entity, IMapper mapper)
        {
            return mapper.Map<DonationReceiptDto>(entity);
        }

        public static DonationReceipt ToEntity(this CreateDonationReceiptDto dto, IMapper mapper)
        {
            return mapper.Map<DonationReceipt>(dto);
        }

        #endregion

        #region DonationAuditTrail Mappings

        public static DonationAuditTrailDto ToDto(this DonationAuditTrail entity, IMapper mapper)
        {
            return mapper.Map<DonationAuditTrailDto>(entity);
        }

        #endregion
    }
}
