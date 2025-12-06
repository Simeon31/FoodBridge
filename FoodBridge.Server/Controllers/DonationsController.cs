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
    public class DonationsController : ControllerBase
    {
        private readonly IDonationService _donationService;
        private readonly ILogger<DonationsController> _logger;

        public DonationsController(
            IDonationService donationService,
       ILogger<DonationsController> logger)
        {
            _donationService = donationService;
            _logger = logger;
        }

        /// <summary>
        /// Get all donations with filtering and pagination
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResultDto<DonationDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromQuery] DonationFilterDto filter)
        {
            try
            {
                var result = await _donationService.GetAllAsync(filter);
                return Ok(ApiResponse<PagedResultDto<DonationDto>>.SuccessResponse(result));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving donations");
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving donations"));
            }
        }

        /// <summary>
        /// Get donation by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<DonationDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var donation = await _donationService.GetByIdAsync(id);

                if (donation == null)
                    return NotFound(ApiResponse.ErrorResponse($"Donation with ID {id} not found"));

                return Ok(ApiResponse<DonationDto>.SuccessResponse(donation));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving donation {DonationId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving the donation"));
            }
        }

        /// <summary>
        /// Create a new donation
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<DonationDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateDonationDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponse.ErrorResponse("Invalid donation data", ModelState.Values
                        .SelectMany(v => v.Errors)
                                .Select(e => e.ErrorMessage)
                                  .ToList()));

                var donation = await _donationService.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = donation.DonationId },
             ApiResponse<DonationDto>.SuccessResponse(donation, "Donation created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating donation");
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while creating the donation"));
            }
        }

        /// <summary>
        /// Update an existing donation
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse<DonationDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDonationDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ApiResponse.ErrorResponse("Invalid donation data", ModelState.Values
                .SelectMany(v => v.Errors)
                         .Select(e => e.ErrorMessage)
            .ToList()));

                var donation = await _donationService.UpdateAsync(id, dto);

                if (donation == null)
                    return NotFound(ApiResponse.ErrorResponse($"Donation with ID {id} not found"));

                return Ok(ApiResponse<DonationDto>.SuccessResponse(donation, "Donation updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating donation {DonationId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while updating the donation"));
            }
        }

        /// <summary>
        /// Delete a donation
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var result = await _donationService.DeleteAsync(id);

                if (!result)
                    return NotFound(ApiResponse.ErrorResponse($"Donation with ID {id} not found"));

                return Ok(ApiResponse.SuccessResponse("Donation deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting donation {DonationId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while deleting the donation"));
            }
        }

        /// <summary>
        /// Get donation items for a specific donation
        /// </summary>
        [HttpGet("{id}/items")]
        [ProducesResponseType(typeof(ApiResponse<List<DonationItemDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetDonationItems(int id)
        {
            try
            {
                var items = await _donationService.GetDonationItemsAsync(id);
                return Ok(ApiResponse<List<DonationItemDto>>.SuccessResponse(items));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving donation items for {DonationId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving donation items"));
            }
        }

        /// <summary>
        /// Get quality inspection for a donation
        /// </summary>
        [HttpGet("{id}/inspection")]
        [ProducesResponseType(typeof(ApiResponse<QualityInspectionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetQualityInspection(int id)
        {
            try
            {
                var inspection = await _donationService.GetQualityInspectionAsync(id);

                if (inspection == null)
                    return NotFound(ApiResponse.ErrorResponse($"Quality inspection not found for donation {id}"));

                return Ok(ApiResponse<QualityInspectionDto>.SuccessResponse(inspection));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quality inspection for {DonationId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving quality inspection"));
            }
        }

        /// <summary>
        /// Get receipt for a donation
        /// </summary>
        [HttpGet("{id}/receipt")]
        [ProducesResponseType(typeof(ApiResponse<DonationReceiptDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetReceipt(int id)
        {
            try
            {
                var receipt = await _donationService.GetReceiptAsync(id);

                if (receipt == null)
                    return NotFound(ApiResponse.ErrorResponse($"Receipt not found for donation {id}"));

                return Ok(ApiResponse<DonationReceiptDto>.SuccessResponse(receipt));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving receipt for {DonationId}", id);
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving receipt"));
            }
        }

        /// <summary>
        /// Get available donation items
        /// </summary>
        [HttpGet("available-items")]
        [ProducesResponseType(typeof(ApiResponse<List<AvailableDonationItemDto>>), 200)]
        [ProducesResponseType(typeof(ApiResponse), 500)]
        public async Task<IActionResult> GetAvailableDonationItems()
        {
            try
            {
                var items = await _donationService.GetAvailableDonationItemsAsync();
                return Ok(ApiResponse<List<AvailableDonationItemDto>>.SuccessResponse(items, "Available donation items retrieved successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving available donation items.", new List<string> { ex.Message }));
            }
        }
    }
}
