using FoodBridge.Server.Data;
using FoodBridge.Server.DTOs.Auth;
using FoodBridge.Server.Mappings;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FoodBridge.Server.Services
{
  public interface IAuthenticationService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> GetCurrentUserAsync(string userId);
        Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto);
        Task<bool> UpdateProfileAsync(string userId, UpdateProfileDto dto);
    }

public class AuthenticationService : IAuthenticationService
    {
private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
   private readonly IConfiguration _configuration;
        private readonly ILogger<AuthenticationService> _logger;

        public AuthenticationService(
    UserManager<ApplicationUser> userManager,
          SignInManager<ApplicationUser> signInManager,
         IConfiguration configuration,
 ILogger<AuthenticationService> logger)
        {
   _userManager = userManager;
    _signInManager = signInManager;
  _configuration = configuration;
      _logger = logger;
}

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
   {
      try
   {
       var existingUser = await _userManager.FindByEmailAsync(dto.Email);
       if (existingUser != null)
  {
     return new AuthResponseDto
   {
       Success = false,
       Message = "User with this email already exists."
          };
    }

      var user = dto.ToEntity();

     var result = await _userManager.CreateAsync(user, dto.Password);

    if (!result.Succeeded)
        {
      var errors = string.Join(", ", result.Errors.Select(e => e.Description));
     return new AuthResponseDto
  {
  Success = false,
     Message = $"Registration failed: {errors}"
         };
 }

       // Assign default role (optional)
   // await _userManager.AddToRoleAsync(user, "User");

     var token = await GenerateJwtToken(user);
   var userRoles = await _userManager.GetRolesAsync(user);

       return new AuthResponseDto
   {
           Success = true,
        Message = "Registration successful!",
           Token = token,
        Expiration = DateTime.UtcNow.AddDays(7),
     User = user.ToDto(userRoles)
         };
            }
catch (Exception ex)
       {
 _logger.LogError(ex, "Error during registration");
        return new AuthResponseDto
     {
       Success = false,
      Message = "An error occurred during registration."
       };
            }
  }

 public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
    try
    {
   var user = await _userManager.FindByEmailAsync(dto.Email);
     if (user == null)
   {
        return new AuthResponseDto
       {
          Success = false,
            Message = "Invalid email or password."
     };
       }

       if (!user.IsActive)
    {
   return new AuthResponseDto
      {
        Success = false,
        Message = "Your account has been deactivated."
     };
         }

       var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
       if (!result.Succeeded)
            {
           return new AuthResponseDto
   {
      Success = false,
     Message = "Invalid email or password."
  };
 }

   // Update last login
 user.LastLoginAt = DateTime.UtcNow;
         await _userManager.UpdateAsync(user);

var token = await GenerateJwtToken(user);
 var userRoles = await _userManager.GetRolesAsync(user);

       return new AuthResponseDto
          {
        Success = true,
      Message = "Login successful!",
   Token = token,
       Expiration = DateTime.UtcNow.AddDays(7),
         User = user.ToDto(userRoles)
      };
            }
         catch (Exception ex)
       {
         _logger.LogError(ex, "Error during login");
   return new AuthResponseDto
            {
    Success = false,
         Message = "An error occurred during login."
     };
      }
        }

        public async Task<AuthResponseDto> GetCurrentUserAsync(string userId)
        {
     try
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
     {
   return new AuthResponseDto
         {
         Success = false,
       Message = "User not found."
          };
      }

             var userRoles = await _userManager.GetRolesAsync(user);

        return new AuthResponseDto
         {
         Success = true,
        Message = "User retrieved successfully.",
         User = user.ToDto(userRoles)
  };
            }
  catch (Exception ex)
    {
      _logger.LogError(ex, "Error retrieving user");
           return new AuthResponseDto
     {
      Success = false,
      Message = "An error occurred while retrieving user information."
        };
   }
        }

   public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordDto dto)
        {
       try
 {
  var user = await _userManager.FindByIdAsync(userId);
   if (user == null) return false;

  var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
   return result.Succeeded;
       }
            catch (Exception ex)
       {
  _logger.LogError(ex, "Error changing password");
   return false;
     }
   }

   public async Task<bool> UpdateProfileAsync(string userId, UpdateProfileDto dto)
{
   try
         {
 var user = await _userManager.FindByIdAsync(userId);
       if (user == null) return false;

            user.UpdateFromDto(dto);

    var result = await _userManager.UpdateAsync(user);
       return result.Succeeded;
         }
            catch (Exception ex)
            {
    _logger.LogError(ex, "Error updating profile");
    return false;
     }
}

   private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
      {
       new Claim(ClaimTypes.NameIdentifier, user.Id),
    new Claim(ClaimTypes.Email, user.Email!),
         new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
       };

     // Add role claims
   claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Add custom claims
          if (!string.IsNullOrEmpty(user.FirstName))
         claims.Add(new Claim("FirstName", user.FirstName));
     if (!string.IsNullOrEmpty(user.LastName))
         claims.Add(new Claim("LastName", user.LastName));

     var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key not configured")));
     var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

      var token = new JwtSecurityToken(
issuer: _configuration["Jwt:Issuer"],
     audience: _configuration["Jwt:Audience"],
            claims: claims,
          expires: DateTime.UtcNow.AddDays(7),
          signingCredentials: creds
            );

          return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
