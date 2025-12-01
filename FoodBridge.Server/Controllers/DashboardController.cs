using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Dashboard;
using FoodBridge.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodBridge.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(
     IDashboardService dashboardService,
      ILogger<DashboardController> logger)
        {
            _dashboardService = dashboardService;
            _logger = logger;
        }

        [HttpGet("statistics")]
        [ProducesResponseType(typeof(ApiResponse<DashboardStatisticsDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetStatistics()
        {
            try
            {
                var statistics = await _dashboardService.GetDashboardStatisticsAsync();
                return Ok(ApiResponse<DashboardStatisticsDto>.SuccessResponse(statistics));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard statistics");
                return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving dashboard statistics"));
            }
        }
    }
}
