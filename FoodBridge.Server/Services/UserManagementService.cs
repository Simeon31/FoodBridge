using AutoMapper;
using FoodBridge.Server.Data;
using FoodBridge.Server.DTOs.Admin;
using FoodBridge.Server.DTOs.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FoodBridge.Server.Services
{
    public interface IUserManagementService
    {
        Task<PagedResultDto<UserManagementDto>> GetAllUsersAsync(UserFilterDto filter);
        Task<UserManagementDto?> GetUserByIdAsync(string userId);
        Task<UserManagementDto> CreateUserAsync(CreateUserDto dto);
        Task<UserManagementDto?> UpdateUserAsync(string userId, UpdateUserDto dto);
        Task<bool> DeleteUserAsync(string userId);
        Task<List<RoleDto>> GetAllRolesAsync();
        Task<bool> CreateRoleAsync(CreateRoleDto dto);
        Task<bool> DeleteRoleAsync(string roleId);
    }

    public class UserManagementService : IUserManagementService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<UserManagementService> _logger;
        private readonly IMapper _mapper;

        public UserManagementService(
         UserManager<ApplicationUser> userManager,
         RoleManager<IdentityRole> roleManager,
         ILogger<UserManagementService> logger,
        IMapper mapper)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<PagedResultDto<UserManagementDto>> GetAllUsersAsync(UserFilterDto filter)
        {
            try
            {
                var query = _userManager.Users.AsQueryable();

                // Apply filters
                if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                {
                    var searchLower = filter.SearchTerm.ToLower();
                    query = query.Where(u =>
              u.Email!.ToLower().Contains(searchLower) ||
                u.FirstName!.ToLower().Contains(searchLower) ||
           u.LastName!.ToLower().Contains(searchLower));
                }

                if (filter.IsActive.HasValue)
                {
                    query = query.Where(u => u.IsActive == filter.IsActive.Value);
                }

                var totalCount = await query.CountAsync();
                var users = await query
                         .OrderByDescending(u => u.CreatedAt)
                         .Skip((filter.PageNumber - 1) * filter.PageSize)
                         .Take(filter.PageSize)
                         .ToListAsync();

                var userDtos = new List<UserManagementDto>();
                foreach (var user in users)
                {
                    var roles = await _userManager.GetRolesAsync(user);
                    userDtos.Add(new UserManagementDto
                    {
                        Id = user.Id,
                        Email = user.Email ?? string.Empty,
                        FirstName = user.FirstName ?? string.Empty,
                        LastName = user.LastName ?? string.Empty,
                        UserName = user.UserName ?? string.Empty,
                        IsActive = user.IsActive,
                        CreatedAt = user.CreatedAt,
                        LastLoginAt = user.LastLoginAt,
                        Roles = roles.ToList()
                    });
                }

                // Filter by role if specified
                if (!string.IsNullOrWhiteSpace(filter.Role))
                {
                    userDtos = userDtos.Where(u => u.Roles.Contains(filter.Role)).ToList();
                    totalCount = userDtos.Count;
                }

                return new PagedResultDto<UserManagementDto>
                {
                    Items = userDtos,
                    TotalCount = totalCount,
                    PageNumber = filter.PageNumber,
                    PageSize = filter.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                throw;
            }
        }

        public async Task<UserManagementDto?> GetUserByIdAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null) return null;

                var roles = await _userManager.GetRolesAsync(user);

                return new UserManagementDto
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName ?? string.Empty,
                    LastName = user.LastName ?? string.Empty,
                    UserName = user.UserName ?? string.Empty,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    LastLoginAt = user.LastLoginAt,
                    Roles = roles.ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user {UserId}", userId);
                throw;
            }
        }

        public async Task<UserManagementDto> CreateUserAsync(CreateUserDto dto)
        {
            try
            {
                var user = new ApplicationUser
                {
                    UserName = dto.Email,
                    Email = dto.Email,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    EmailConfirmed = true,
                    IsActive = dto.IsActive,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(user, dto.Password);

                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to create user: {errors}");
                }

                // Assign roles
                if (dto.Roles.Any())
                {
                    await _userManager.AddToRolesAsync(user, dto.Roles);
                }

                return new UserManagementDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName ?? string.Empty,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    Roles = dto.Roles
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                throw;
            }
        }

        public async Task<UserManagementDto?> UpdateUserAsync(string userId, UpdateUserDto dto)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null) return null;

                user.FirstName = dto.FirstName;
                user.LastName = dto.LastName;
                user.IsActive = dto.IsActive;

                var result = await _userManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to update user: {errors}");
                }

                // Update roles
                var currentRoles = await _userManager.GetRolesAsync(user);
                var rolesToRemove = currentRoles.Except(dto.Roles).ToList();
                var rolesToAdd = dto.Roles.Except(currentRoles).ToList();

                if (rolesToRemove.Any())
                {
                    await _userManager.RemoveFromRolesAsync(user, rolesToRemove);
                }

                if (rolesToAdd.Any())
                {
                    await _userManager.AddToRolesAsync(user, rolesToAdd);
                }

                return new UserManagementDto
                {
                    Id = user.Id,
                    Email = user.Email ?? string.Empty,
                    FirstName = user.FirstName ?? string.Empty,
                    LastName = user.LastName ?? string.Empty,
                    UserName = user.UserName ?? string.Empty,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,
                    LastLoginAt = user.LastLoginAt,
                    Roles = dto.Roles
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null) return false;

                // Soft delete by deactivating
                user.IsActive = false;
                var result = await _userManager.UpdateAsync(user);

                return result.Succeeded;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", userId);
                throw;
            }
        }

        public async Task<List<RoleDto>> GetAllRolesAsync()
        {
            try
            {
                var roles = await _roleManager.Roles.ToListAsync();
                var roleDtos = new List<RoleDto>();

                foreach (var role in roles)
                {
                    var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);
                    roleDtos.Add(new RoleDto
                    {
                        Id = role.Id,
                        Name = role.Name ?? string.Empty,
                        UserCount = usersInRole.Count
                    });
                }

                return roleDtos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving roles");
                throw;
            }
        }

        public async Task<bool> CreateRoleAsync(CreateRoleDto dto)
        {
            try
            {
                var roleExists = await _roleManager.RoleExistsAsync(dto.Name);
                if (roleExists)
                {
                    throw new InvalidOperationException($"Role '{dto.Name}' already exists");
                }

                var result = await _roleManager.CreateAsync(new IdentityRole(dto.Name));
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating role");
                throw;
            }
        }

        public async Task<bool> DeleteRoleAsync(string roleId)
        {
            try
            {
                var role = await _roleManager.FindByIdAsync(roleId);
                if (role == null) return false;

                // Check if any users have this role
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);
                if (usersInRole.Any())
                {
                    throw new InvalidOperationException($"Cannot delete role '{role.Name}' because it has users assigned to it");
                }

                var result = await _roleManager.DeleteAsync(role);
                return result.Succeeded;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting role {RoleId}", roleId);
                throw;
            }
        }
    }
}
