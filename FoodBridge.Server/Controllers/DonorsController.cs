using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Donations;
using FoodBridge.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodBridge.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DonorsController : ControllerBase
    {
        private readonly IDonorService _donorService;
        private readonly ILogger<DonorsController> _logger;

        public DonorsController(
         IDonorService donorService,
         ILogger<DonorsController> logger)
        {
            _donorService = donorService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResultDto<DonorDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromQuery] DonorFilterDto filter)
        {
            try
            {
                var result = await _donorService.GetAllAsync(filter);
                return Ok(ApiResponse<PagedResultDto<DonorDto>>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving donors");
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving donors"));
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<DonorDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var donor = await _donorService.GetByIdAsync(id);

                if (donor == null)
                    return NotFound(ApiResponse.ErrorResponse($"Donor with ID {id} not found"));

                return Ok(ApiResponse<DonorDto>.SuccessResponse(donor));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving donor {DonorId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving the donor"));
            }
        }

        [HttpGet("active")]
        [ProducesResponseType(typeof(ApiResponse<List<DonorDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetActive()
        {
            try
            {
                var donors = await _donorService.GetActiveDonorsAsync();
                return Ok(ApiResponse<List<DonorDto>>.SuccessResponse(donors));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving active donors");
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving active donors"));
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        [ProducesResponseType(typeof(ApiResponse<DonorDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateDonorDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponse.ErrorResponse("Invalid donor data", ModelState.Values
                          .SelectMany(v => v.Errors)
                  .Select(e => e.ErrorMessage)
                     .ToList()));

                var donor = await _donorService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = donor.DonorId },
        ApiResponse<DonorDto>.SuccessResponse(donor, "Donor created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating donor");
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while creating the donor"));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Staff")]
        [ProducesResponseType(typeof(ApiResponse<DonorDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDonorDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponse.ErrorResponse("Invalid donor data", ModelState.Values
                           .SelectMany(v => v.Errors)
                           .Select(e => e.ErrorMessage)
                      .ToList()));

                var donor = await _donorService.UpdateAsync(id, dto);

                if (donor == null)
                    return NotFound(ApiResponse.ErrorResponse($"Donor with ID {id} not found"));

                return Ok(ApiResponse<DonorDto>.SuccessResponse(donor, "Donor updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating donor {DonorId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while updating the donor"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Staff")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _donorService.DeleteAsync(id);

                if (!result)
                    return NotFound(ApiResponse.ErrorResponse($"Donor with ID {id} not found"));

                return Ok(ApiResponse.SuccessResponse("Donor deactivated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting donor {DonorId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while deleting the donor"));
            }
        }
    }
}
