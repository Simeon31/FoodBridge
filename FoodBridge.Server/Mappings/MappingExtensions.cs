using AutoMapper;
using FoodBridge.Server.Data;
using FoodBridge.Server.DTOs.Auth;
using Microsoft.AspNetCore.Identity;

namespace FoodBridge.Server.Mappings
{
    /// <summary>
    /// Provides mapping between domain entities and DTOs using AutoMapper
    /// </summary>
    public static class MappingExtensions
    {
        /// <summary>
        /// Maps ApplicationUser to UserDto with roles
        /// Note: This is a convenience method that handles roles separately since they require UserManager
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
    }
}
