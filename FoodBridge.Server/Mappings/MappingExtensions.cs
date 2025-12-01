using FoodBridge.Server.Data;
using FoodBridge.Server.DTOs.Auth;
using Microsoft.AspNetCore.Identity;

namespace FoodBridge.Server.Mappings
{
    /// <summary>
    /// Provides mapping between domain entities and DTOs
    /// </summary>
    public static class MappingExtensions
    {
        /// <summary>
        /// Maps ApplicationUser to UserDto
        /// </summary>
        public static UserDto ToDto(this ApplicationUser user, IList<string> roles)
        {
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles.ToList(),
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt,
                IsActive = user.IsActive
            };
        }

        /// <summary>
        /// Maps RegisterDto to ApplicationUser
        /// </summary>
        public static ApplicationUser ToEntity(this RegisterDto dto)
        {
            return new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                EmailConfirmed = false, // Set based on your email confirmation strategy
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
        }

        /// <summary>
        /// Updates ApplicationUser from UpdateProfileDto
        /// </summary>
        public static void UpdateFromDto(this ApplicationUser user, UpdateProfileDto dto)
        {
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
        }
    }
}
