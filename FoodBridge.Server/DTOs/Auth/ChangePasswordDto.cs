using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Auth
{
    /// <summary>
    /// DTO for password change request
    /// </summary>
  public class ChangePasswordDto
  {
        [Required(ErrorMessage = "Current password is required")]
        public string CurrentPassword { get; set; } = string.Empty;

[Required(ErrorMessage = "New password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$", 
      ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one digit")]
        public string NewPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password confirmation is required")]
    [Compare(nameof(NewPassword), ErrorMessage = "Passwords do not match")]
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }
}
