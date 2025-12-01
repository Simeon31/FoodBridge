using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Admin
{
    /// <summary>
    /// DTO for user information in admin panel
    /// </summary>
    public class UserManagementDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public List<string> Roles { get; set; } = new List<string>();
    }

    /// <summary>
    /// DTO for creating a new user by admin
    /// </summary>
    public class CreateUserDto
    {
        [Required]
        [EmailAddress]
  public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
     public string LastName { get; set; } = string.Empty;

    [Required]
        [StringLength(100, MinimumLength = 6)]
   public string Password { get; set; } = string.Empty;

        [Required]
        public List<string> Roles { get; set; } = new List<string>();

        public bool IsActive { get; set; } = true;
    }

    /// <summary>
    /// DTO for updating user by admin
    /// </summary>
    public class UpdateUserDto
  {
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
     public string LastName { get; set; } = string.Empty;

        [Required]
        public bool IsActive { get; set; }

        [Required]
        public List<string> Roles { get; set; } = new List<string>();
    }

    /// <summary>
  /// DTO for role information
    /// </summary>
    public class RoleDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int UserCount { get; set; }
    }

    /// <summary>
    /// DTO for creating/updating roles
  /// </summary>
    public class CreateRoleDto
    {
   [Required]
 [StringLength(50)]
        public string Name { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for user filter
    /// </summary>
    public class UserFilterDto
    {
        public string? SearchTerm { get; set; }
        public string? Role { get; set; }
  public bool? IsActive { get; set; }
  public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
