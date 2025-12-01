using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Auth
{
    /// <summary>
    /// DTO for profile update request
    /// </summary>
    public class UpdateProfileDto
    {
        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required")]
   [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
  public string LastName { get; set; } = string.Empty;
    }
}
