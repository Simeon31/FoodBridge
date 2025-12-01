using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Inventory;
using FoodBridge.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodBridge.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InventoryController : ControllerBase
    {
   private readonly IInventoryService _inventoryService;
        private readonly ILogger<InventoryController> _logger;

     public InventoryController(
      IInventoryService inventoryService,
   ILogger<InventoryController> logger)
        {
      _inventoryService = inventoryService;
     _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResultDto<InventoryItemDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll([FromQuery] InventoryFilterDto filter)
        {
      try
          {
      var result = await _inventoryService.GetAllAsync(filter);
           return Ok(ApiResponse<PagedResultDto<InventoryItemDto>>.SuccessResponse(result));
  }
   catch (Exception ex)
            {
  _logger.LogError(ex, "Error retrieving inventory items");
       return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving inventory items"));
            }
      }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<InventoryItemDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            try
    {
   var item = await _inventoryService.GetByIdAsync(id);

    if (item == null)
  return NotFound(ApiResponse.ErrorResponse($"Inventory item with ID {id} not found"));

          return Ok(ApiResponse<InventoryItemDto>.SuccessResponse(item));
     }
            catch (Exception ex)
            {
      _logger.LogError(ex, "Error retrieving inventory item {ItemId}", id);
    return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving the inventory item"));
            }
  }

  [HttpGet("expiring-soon")]
    [ProducesResponseType(typeof(ApiResponse<List<InventoryItemDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetExpiringSoon([FromQuery] int days = 7)
     {
try
       {
      var items = await _inventoryService.GetExpiringSoonAsync(days);
           return Ok(ApiResponse<List<InventoryItemDto>>.SuccessResponse(items));
            }
catch (Exception ex)
            {
         _logger.LogError(ex, "Error retrieving expiring inventory items");
   return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving expiring items"));
    }
     }

        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        [ProducesResponseType(typeof(ApiResponse<InventoryItemDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
   public async Task<IActionResult> Create([FromBody] CreateInventoryItemDto dto)
        {
   try
   {
 if (!ModelState.IsValid)
       return BadRequest(ApiResponse.ErrorResponse("Invalid inventory data", ModelState.Values
            .SelectMany(v => v.Errors)
  .Select(e => e.ErrorMessage)
      .ToList()));

    var item = await _inventoryService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = item.InventoryItemId },
             ApiResponse<InventoryItemDto>.SuccessResponse(item, "Inventory item created successfully"));
}
       catch (Exception ex)
          {
       _logger.LogError(ex, "Error creating inventory item");
   return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while creating the inventory item"));
  }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Staff")]
        [ProducesResponseType(typeof(ApiResponse<InventoryItemDto>), StatusCodes.Status200OK)]
  [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateInventoryItemDto dto)
        {
            try
    {
     if (!ModelState.IsValid)
    return BadRequest(ApiResponse.ErrorResponse("Invalid inventory data", ModelState.Values
       .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage)
            .ToList()));

    var item = await _inventoryService.UpdateAsync(id, dto);

         if (item == null)
      return NotFound(ApiResponse.ErrorResponse($"Inventory item with ID {id} not found"));

      return Ok(ApiResponse<InventoryItemDto>.SuccessResponse(item, "Inventory item updated successfully"));
 }
            catch (Exception ex)
            {
    _logger.LogError(ex, "Error updating inventory item {ItemId}", id);
         return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while updating the inventory item"));
 }
    }

        [HttpPost("{id}/adjust-quantity")]
        [Authorize(Roles = "Admin,Staff")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
  public async Task<IActionResult> AdjustQuantity(int id, [FromBody] InventoryAdjustmentDto dto)
{
      try
       {
 var result = await _inventoryService.AdjustQuantityAsync(id, dto.QuantityChange, dto.Reason);

    if (!result)
        return NotFound(ApiResponse.ErrorResponse($"Inventory item with ID {id} not found"));

   return Ok(ApiResponse.SuccessResponse("Inventory quantity adjusted successfully"));
 }
     catch (Exception ex)
        {
     _logger.LogError(ex, "Error adjusting inventory quantity for {ItemId}", id);
           return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while adjusting inventory quantity"));
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
     var result = await _inventoryService.DeleteAsync(id);

if (!result)
           return NotFound(ApiResponse.ErrorResponse($"Inventory item with ID {id} not found"));

     return Ok(ApiResponse.SuccessResponse("Inventory item deleted successfully"));
          }
     catch (Exception ex)
 {
                _logger.LogError(ex, "Error deleting inventory item {ItemId}", id);
          return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while deleting the inventory item"));
      }
        }
    }
}
