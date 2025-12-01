using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Products;
using FoodBridge.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodBridge.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
public class ProductsController : ControllerBase
    {
     private readonly IProductService _productService;
      private readonly ILogger<ProductsController> _logger;

 public ProductsController(
       IProductService productService,
 ILogger<ProductsController> logger)
 {
     _productService = productService;
    _logger = logger;
        }

  [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PagedResultDto<ProductDto>>), StatusCodes.Status200OK)]
     public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto filter)
        {
     try
            {
     var result = await _productService.GetAllAsync(filter);
     return Ok(ApiResponse<PagedResultDto<ProductDto>>.SuccessResponse(result));
   }
          catch (Exception ex)
     {
    _logger.LogError(ex, "Error retrieving products");
   return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving products"));
    }
        }

        [HttpGet("{id}")]
   [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
 public async Task<IActionResult> GetById(int id)
      {
 try
  {
     var product = await _productService.GetByIdAsync(id);

     if (product == null)
     return NotFound(ApiResponse.ErrorResponse($"Product with ID {id} not found"));

           return Ok(ApiResponse<ProductDto>.SuccessResponse(product));
    }
     catch (Exception ex)
     {
    _logger.LogError(ex, "Error retrieving product {ProductId}", id);
      return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving the product"));
   }
}

      [HttpGet("active")]
   [ProducesResponseType(typeof(ApiResponse<List<ProductDto>>), StatusCodes.Status200OK)]
   public async Task<IActionResult> GetActive()
  {
   try
   {
           var products = await _productService.GetActiveProductsAsync();
       return Ok(ApiResponse<List<ProductDto>>.SuccessResponse(products));
   }
      catch (Exception ex)
            {
    _logger.LogError(ex, "Error retrieving active products");
   return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while retrieving active products"));
      }
    }

    [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Create([FromBody] CreateProductDto dto)
 {
    try
      {
      if (!ModelState.IsValid)
        return BadRequest(ApiResponse.ErrorResponse("Invalid product data", ModelState.Values
        .SelectMany(v => v.Errors)
      .Select(e => e.ErrorMessage)
 .ToList()));

     var product = await _productService.CreateAsync(dto);
      return CreatedAtAction(nameof(GetById), new { id = product.ProductId },
            ApiResponse<ProductDto>.SuccessResponse(product, "Product created successfully"));
   }
       catch (Exception ex)
     {
    _logger.LogError(ex, "Error creating product");
   return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while creating the product"));
   }
     }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
  [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
      [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
  public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto dto)
      {
   try
{
      if (!ModelState.IsValid)
  return BadRequest(ApiResponse.ErrorResponse("Invalid product data", ModelState.Values
            .SelectMany(v => v.Errors)
        .Select(e => e.ErrorMessage)
     .ToList()));

      var product = await _productService.UpdateAsync(id, dto);

    if (product == null)
       return NotFound(ApiResponse.ErrorResponse($"Product with ID {id} not found"));

         return Ok(ApiResponse<ProductDto>.SuccessResponse(product, "Product updated successfully"));
  }
   catch (Exception ex)
   {
           _logger.LogError(ex, "Error updating product {ProductId}", id);
   return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while updating the product"));
   }
      }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
[ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
  public async Task<IActionResult> Delete(int id)
        {
       try
            {
  var result = await _productService.DeleteAsync(id);

         if (!result)
      return NotFound(ApiResponse.ErrorResponse($"Product with ID {id} not found"));

    return Ok(ApiResponse.SuccessResponse("Product deleted successfully"));
      }
            catch (Exception ex)
   {
       _logger.LogError(ex, "Error deleting product {ProductId}", id);
 return StatusCode(500, ApiResponse.ErrorResponse("An error occurred while deleting the product"));
       }
        }
    }
}
