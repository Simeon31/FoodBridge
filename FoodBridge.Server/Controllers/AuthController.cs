using FoodBridge.Server.DTOs.Auth;
using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodBridge.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthenticationService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        [HttpPost("register")]
        [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
                }

                var result = await _authService.RegisterAsync(dto);

                if (!result.Success)
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for email: {Email}", dto?.Email);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred during registration"));
            }
        }

        /// <summary>
        /// Login with email and password
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
                }

                _logger.LogInformation("Login attempt for email: {Email}", dto.Email);

                var result = await _authService.LoginAsync(dto);

                if (!result.Success)
                {
                    _logger.LogWarning("Login failed for email: {Email}, Reason: {Message}", dto.Email, result.Message);
                    return Unauthorized(result);
                }

                _logger.LogInformation("Login successful for email: {Email}", dto.Email);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception during login for email: {Email}", dto?.Email);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred during login"));
            }
        }

        /// <summary>
        /// Get current authenticated user information
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));
            }

            var result = await _authService.GetCurrentUserAsync(userId);

            if (!result.Success)
            {
                return NotFound(result);
            }

            return Ok(result);
        }

        /// <summary>
        /// Change user password
        /// </summary>
        [HttpPost("change-password")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));
            }

            var result = await _authService.ChangePasswordAsync(userId, dto);

            if (!result)
            {
                return BadRequest(ApiResponse.ErrorResponse("Failed to change password. Please check your current password."));
            }

            return Ok(ApiResponse.SuccessResponse("Password changed successfully"));
        }

        /// <summary>
        /// Update user profile
        /// </summary>
        [HttpPut("profile")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(ApiResponse.ErrorResponse("Validation failed", errors));
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));
            }

            var result = await _authService.UpdateProfileAsync(userId, dto);

            if (!result)
            {
                return BadRequest(ApiResponse.ErrorResponse("Failed to update profile"));
            }

            return Ok(ApiResponse.SuccessResponse("Profile updated successfully"));
        }

        /// <summary>
        /// Logout (client-side token removal)
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        public IActionResult Logout()
        {
            // With JWT, logout is mainly handled on the client side by removing the token
            // You can implement token blacklisting here if needed
            return Ok(ApiResponse.SuccessResponse("Logged out successfully"));
        }
    }
}
