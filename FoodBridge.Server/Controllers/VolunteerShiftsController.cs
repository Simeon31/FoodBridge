using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Volunteers;
using FoodBridge.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FoodBridge.Server.Controllers
{
 [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VolunteerShiftsController : ControllerBase
    {
  private readonly IVolunteerShiftService _shiftService;
        private readonly ILogger<VolunteerShiftsController> _logger;

public VolunteerShiftsController(
     IVolunteerShiftService shiftService,
    ILogger<VolunteerShiftsController> logger)
        {
 _shiftService = shiftService;
   _logger = logger;
        }

[HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResultDto<VolunteerShiftDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromQuery] VolunteerShiftFilterDto filter)
        {
     try
       {
      var result = await _shiftService.GetAllShiftsAsync(filter);
 return Ok(ApiResponse<PagedResultDto<VolunteerShiftDto>>.SuccessResponse(result));
 }
     catch (Exception ex)
{
    _logger.LogError(ex, "Error retrieving volunteer shifts");
 return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving volunteer shifts"));
     }
 }

  [HttpGet("{id}")]
[ProducesResponseType(typeof(ApiResponse<VolunteerShiftDto>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
 {
  try
          {
            var shift = await _shiftService.GetShiftByIdAsync(id);

if (shift == null)
   return NotFound(ApiResponse.ErrorResponse($"Volunteer shift with ID {id} not found"));

     return Ok(ApiResponse<VolunteerShiftDto>.SuccessResponse(shift));
   }
  catch (Exception ex)
     {
    _logger.LogError(ex, "Error retrieving shift {ShiftId}", id);
 return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving the shift"));
      }
    }

 [HttpPost]
   [Authorize(Roles = "Admin,Coordinator")]
[ProducesResponseType(typeof(ApiResponse<VolunteerShiftDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateVolunteerShiftDto dto)
 {
  try
 {
      if (!ModelState.IsValid)
     return BadRequest(ApiResponse.ErrorResponse("Invalid shift data", ModelState.Values
        .SelectMany(v => v.Errors)
 .Select(e => e.ErrorMessage)
      .ToList()));

     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId))
   return Unauthorized(ApiResponse.ErrorResponse("User not authenticated"));

     var shift = await _shiftService.CreateShiftAsync(dto, userId);
   return CreatedAtAction(nameof(GetById), new { id = shift.ShiftId },
     ApiResponse<VolunteerShiftDto>.SuccessResponse(shift, "Volunteer shift created successfully"));
            }
       catch (InvalidOperationException ex)
     {
     return BadRequest(ApiResponse.ErrorResponse(ex.Message));
     }
  catch (Exception ex)
 {
  _logger.LogError(ex, "Error creating volunteer shift");
     return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while creating the shift"));
 }
 }

   [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Coordinator")]
        [ProducesResponseType(typeof(ApiResponse<VolunteerShiftDto>), StatusCodes.Status200OK)]
 [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
  public async Task<IActionResult> Update(int id, [FromBody] UpdateVolunteerShiftDto dto)
        {
   try
  {
      if (!ModelState.IsValid)
  return BadRequest(ApiResponse.ErrorResponse("Invalid shift data", ModelState.Values
   .SelectMany(v => v.Errors)
        .Select(e => e.ErrorMessage)
.ToList()));

     var shift = await _shiftService.UpdateShiftAsync(id, dto);

      if (shift == null)
       return NotFound(ApiResponse.ErrorResponse($"Volunteer shift with ID {id} not found"));

    return Ok(ApiResponse<VolunteerShiftDto>.SuccessResponse(shift, "Volunteer shift updated successfully"));
   }
       catch (InvalidOperationException ex)
            {
   return BadRequest(ApiResponse.ErrorResponse(ex.Message));
}
  catch (Exception ex)
          {
         _logger.LogError(ex, "Error updating shift {ShiftId}", id);
      return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while updating the shift"));
     }
 }

  [HttpDelete("{id}")]
   [Authorize(Roles = "Admin,Coordinator")]
   [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
 [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
  public async Task<IActionResult> Delete(int id)
        {
        try
     {
    var result = await _shiftService.DeleteShiftAsync(id);

      if (!result)
   return NotFound(ApiResponse.ErrorResponse($"Volunteer shift with ID {id} not found"));

 return Ok(ApiResponse.SuccessResponse("Volunteer shift deleted successfully"));
  }
       catch (InvalidOperationException ex)
  {
        return BadRequest(ApiResponse.ErrorResponse(ex.Message));
  }
     catch (Exception ex)
       {
    _logger.LogError(ex, "Error deleting shift {ShiftId}", id);
   return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while deleting the shift"));
            }
  }

        #region Volunteer Assignments

   [HttpGet("{id}/assignments")]
 [ProducesResponseType(typeof(ApiResponse<List<VolunteerAssignmentDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAssignments(int id)
        {
      try
  {
    var assignments = await _shiftService.GetShiftAssignmentsAsync(id);
  return Ok(ApiResponse<List<VolunteerAssignmentDto>>.SuccessResponse(assignments));
     }
  catch (Exception ex)
     {
 _logger.LogError(ex, "Error retrieving assignments for shift {ShiftId}", id);
       return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving assignments"));
  }
   }

   [HttpPost("{id}/assign")]
        [Authorize(Roles = "Admin,Coordinator")]
 [ProducesResponseType(typeof(ApiResponse<VolunteerAssignmentDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> AssignVolunteer(int id, [FromBody] AssignVolunteerDto dto)
  {
try
  {
         if (!ModelState.IsValid)
       return BadRequest(ApiResponse.ErrorResponse("Invalid assignment data", ModelState.Values
 .SelectMany(v => v.Errors)
          .Select(e => e.ErrorMessage)
   .ToList()));

         var assignment = await _shiftService.AssignVolunteerAsync(id, dto);
     return CreatedAtAction(nameof(GetAssignments), new { id },
       ApiResponse<VolunteerAssignmentDto>.SuccessResponse(assignment, "Volunteer assigned successfully"));
      }
  catch (InvalidOperationException ex)
            {
     return BadRequest(ApiResponse.ErrorResponse(ex.Message));
   }
     catch (Exception ex)
            {
    _logger.LogError(ex, "Error assigning volunteer to shift {ShiftId}", id);
 return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while assigning the volunteer"));
}
        }

        [HttpPost("assignments/{assignmentId}/unassign")]
      [Authorize(Roles = "Admin,Coordinator")]
 [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
 [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UnassignVolunteer(int assignmentId)
{
 try
       {
 var result = await _shiftService.UnassignVolunteerAsync(assignmentId);

   if (!result)
     return NotFound(ApiResponse.ErrorResponse($"Assignment with ID {assignmentId} not found"));

   return Ok(ApiResponse.SuccessResponse("Volunteer unassigned successfully"));
            }
catch (Exception ex)
        {
 _logger.LogError(ex, "Error unassigning volunteer {AssignmentId}", assignmentId);
    return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while unassigning the volunteer"));
  }
     }

   [HttpPost("assignments/{assignmentId}/checkin")]
        [Authorize(Roles = "Admin,Coordinator")]
     [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
 [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CheckIn(int assignmentId)
 {
            try
{
      var result = await _shiftService.CheckInVolunteerAsync(assignmentId);

       if (!result)
        return NotFound(ApiResponse.ErrorResponse($"Assignment with ID {assignmentId} not found"));

      return Ok(ApiResponse.SuccessResponse("Volunteer checked in successfully"));
     }
       catch (Exception ex)
        {
    _logger.LogError(ex, "Error checking in volunteer {AssignmentId}", assignmentId);
   return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while checking in the volunteer"));
         }
 }

[HttpPost("assignments/{assignmentId}/checkout")]
      [Authorize(Roles = "Admin,Coordinator")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CheckOut(int assignmentId)
        {
     try
  {
      var result = await _shiftService.CheckOutVolunteerAsync(assignmentId);

    if (!result)
      return NotFound(ApiResponse.ErrorResponse($"Assignment with ID {assignmentId} not found"));

       return Ok(ApiResponse.SuccessResponse("Volunteer checked out successfully"));
     }
  catch (Exception ex)
       {
         _logger.LogError(ex, "Error checking out volunteer {AssignmentId}", assignmentId);
     return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while checking out the volunteer"));
        }
      }

  #endregion
    }
}
