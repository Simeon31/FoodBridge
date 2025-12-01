using FoodBridge.Server.DTOs.Admin;
using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodBridge.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserManagementService _userManagementService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(
        IUserManagementService userManagementService,
        ILogger<AdminController> logger)
        {
            _userManagementService = userManagementService;
            _logger = logger;
        }

        #region User Management

        [HttpGet("users")]
        [ProducesResponseType(typeof(ApiResponse<PagedResultDto<UserManagementDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllUsers([FromQuery] UserFilterDto filter)
        {
            try
            {
                var result = await _userManagementService.GetAllUsersAsync(filter);
                return Ok(ApiResponse<PagedResultDto<UserManagementDto>>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving users"));
            }
        }

        [HttpGet("users/{id}")]
        [ProducesResponseType(typeof(ApiResponse<UserManagementDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserById(string id)
        {
            try
            {
                var user = await _userManagementService.GetUserByIdAsync(id);

                if (user == null)
                    return NotFound(ApiResponse.ErrorResponse($"User with ID {id} not found"));

                return Ok(ApiResponse<UserManagementDto>.SuccessResponse(user));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving user {UserId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving the user"));
            }
        }

        [HttpPost("users")]
        [ProducesResponseType(typeof(ApiResponse<UserManagementDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponse.ErrorResponse("Invalid user data", ModelState.Values
                  .SelectMany(v => v.Errors)
               .Select(e => e.ErrorMessage)
               .ToList()));

                var user = await _userManagementService.CreateUserAsync(dto);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id },
                   ApiResponse<UserManagementDto>.SuccessResponse(user, "User created successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while creating the user"));
            }
        }

        [HttpPut("users/{id}")]
        [ProducesResponseType(typeof(ApiResponse<UserManagementDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponse.ErrorResponse("Invalid user data", ModelState.Values
                   .SelectMany(v => v.Errors)
                      .Select(e => e.ErrorMessage)
                         .ToList()));

                var user = await _userManagementService.UpdateUserAsync(id, dto);

                if (user == null)
                    return NotFound(ApiResponse.ErrorResponse($"User with ID {id} not found"));

                return Ok(ApiResponse<UserManagementDto>.SuccessResponse(user, "User updated successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while updating the user"));
            }
        }

        [HttpDelete("users/{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                var result = await _userManagementService.DeleteUserAsync(id);

                if (!result)
                    return NotFound(ApiResponse.ErrorResponse($"User with ID {id} not found"));

                return Ok(ApiResponse.SuccessResponse("User deactivated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while deleting the user"));
            }
        }

        #endregion

        #region Role Management

        [HttpGet("roles")]
        [ProducesResponseType(typeof(ApiResponse<List<RoleDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllRoles()
        {
            try
            {
                var roles = await _userManagementService.GetAllRolesAsync();
                return Ok(ApiResponse<List<RoleDto>>.SuccessResponse(roles));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving roles");
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving roles"));
            }
        }

        [HttpPost("roles")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponse.ErrorResponse("Invalid role data", ModelState.Values
               .SelectMany(v => v.Errors)
                   .Select(e => e.ErrorMessage)
            .ToList()));

                var result = await _userManagementService.CreateRoleAsync(dto);
                return CreatedAtAction(nameof(GetAllRoles), null,
                     ApiResponse.SuccessResponse("Role created successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating role");
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while creating the role"));
            }
        }

        [HttpDelete("roles/{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteRole(string id)
        {
            try
            {
                var result = await _userManagementService.DeleteRoleAsync(id);

                if (!result)
                    return NotFound(ApiResponse.ErrorResponse($"Role with ID {id} not found"));

                return Ok(ApiResponse.SuccessResponse("Role deleted successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse.ErrorResponse(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting role {RoleId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while deleting the role"));
            }
        }

        #endregion
    }
}
