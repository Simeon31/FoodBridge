using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Waste;
using FoodBridge.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodBridge.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WasteController : ControllerBase
    {
        private readonly IWasteService _wasteService;
        private readonly ILogger<WasteController> _logger;

        public WasteController(
IWasteService wasteService,
            ILogger<WasteController> logger)
  {
_wasteService = wasteService;
            _logger = logger;
      }

    [HttpGet]
  [ProducesResponseType(typeof(ApiResponse<PagedResultDto<WasteRecordDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromQuery] WasteFilterDto filter)
        {
      try
    {
      var result = await _wasteService.GetAllAsync(filter);
 return Ok(ApiResponse<PagedResultDto<WasteRecordDto>>.SuccessResponse(result));
   }
     catch (Exception ex)
      {
      _logger.LogError(ex, "Error retrieving waste records");
return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving waste records"));
      }
      }

     [HttpGet("{id}")]
   [ProducesResponseType(typeof(ApiResponse<WasteRecordDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
      {
            try
{
  var wasteRecord = await _wasteService.GetByIdAsync(id);

   if (wasteRecord == null)
        return NotFound(ApiResponse.ErrorResponse($"Waste record with ID {id} not found"));

    return Ok(ApiResponse<WasteRecordDto>.SuccessResponse(wasteRecord));
   }
   catch (Exception ex)
     {
    _logger.LogError(ex, "Error retrieving waste record {WasteRecordId}", id);
     return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving the waste record"));
}
        }

  [HttpPost]
      [ProducesResponseType(typeof(ApiResponse<WasteRecordDto>), StatusCodes.Status201Created)]
   [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
   public async Task<IActionResult> Create([FromBody] CreateWasteRecordDto dto)
        {
try
       {
  if (!ModelState.IsValid)
    return BadRequest(ApiResponse.ErrorResponse("Invalid waste record data", ModelState.Values
            .SelectMany(v => v.Errors)
   .Select(e => e.ErrorMessage)
   .ToList()));

       var wasteRecord = await _wasteService.CreateAsync(dto);
       return CreatedAtAction(nameof(GetById), new { id = wasteRecord.WasteRecordId },
    ApiResponse<WasteRecordDto>.SuccessResponse(wasteRecord, "Waste record created successfully"));
   }
  catch (Exception ex)
       {
    _logger.LogError(ex, "Error creating waste record");
  return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while creating the waste record"));
     }
}

      [HttpPut("{id}")]
     [ProducesResponseType(typeof(ApiResponse<WasteRecordDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateWasteRecordDto dto)
        {
     try
     {
     if (!ModelState.IsValid)
     return BadRequest(ApiResponse.ErrorResponse("Invalid waste record data", ModelState.Values
  .SelectMany(v => v.Errors)
     .Select(e => e.ErrorMessage)
   .ToList()));

var wasteRecord = await _wasteService.UpdateAsync(id, dto);

    if (wasteRecord == null)
   return NotFound(ApiResponse.ErrorResponse($"Waste record with ID {id} not found"));

   return Ok(ApiResponse<WasteRecordDto>.SuccessResponse(wasteRecord, "Waste record updated successfully"));
}
     catch (Exception ex)
    {
            _logger.LogError(ex, "Error updating waste record {WasteRecordId}", id);
    return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while updating the waste record"));
     }
   }

     [HttpDelete("{id}")]
   [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
  [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
 public async Task<IActionResult> Delete(int id)
  {
      try
            {
    var result = await _wasteService.DeleteAsync(id);

   if (!result)
   return NotFound(ApiResponse.ErrorResponse($"Waste record with ID {id} not found"));

       return Ok(ApiResponse.SuccessResponse("Waste record deleted successfully"));
     }
  catch (Exception ex)
    {
    _logger.LogError(ex, "Error deleting waste record {WasteRecordId}", id);
   return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while deleting the waste record"));
       }
  }
    }
}
