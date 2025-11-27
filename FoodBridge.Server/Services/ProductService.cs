using AutoMapper;
using FoodBridge.Server.Data;
using FoodBridge.Server.Data.Models;
using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Products;
using FoodBridge.Server.Helpers;
using FoodBridge.Server.Mappings;
using Microsoft.EntityFrameworkCore;

namespace FoodBridge.Server.Services
{
    public interface IProductService
    {
        Task<PagedResultDto<ProductDto>> GetAllAsync(ProductFilterDto filter);
        Task<ProductDto?> GetByIdAsync(int id);
        Task<ProductDto> CreateAsync(CreateProductDto dto);
        Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto);
        Task<bool> DeleteAsync(int id);
        Task<List<ProductDto>> GetActiveProductsAsync();
    }

    public class ProductService : IProductService
    {
      private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
 private readonly ILogger<ProductService> _logger;

        public ProductService(
  ApplicationDbContext context,
 IMapper mapper,
            ILogger<ProductService> logger)
{
         _context = context;
            _mapper = mapper;
    _logger = logger;
      }

        public async Task<PagedResultDto<ProductDto>> GetAllAsync(ProductFilterDto filter)
        {
   try
{
    var query = _context.Products.AsQueryable();

    // Apply filters
  query = ApplyFilters(query, filter);

    // Apply search
    if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
    {
        query = query.ApplySearch(filter.SearchTerm,
            p => p.ProductName,
            p => p.Category,
            p => p.ProductCode);
    }

    // Apply sorting
    query = query.ApplySort(filter.SortBy, filter.SortDescending);

    // Get paged results
    var pagedResult = await query.ToPagedResultAsync(filter.PageNumber, filter.PageSize);

       // Map to DTOs
      return new PagedResultDto<ProductDto>
          {
            Items = pagedResult.Items.Select(p => p.ToDto(_mapper)).ToList(),
   TotalCount = pagedResult.TotalCount,
          PageNumber = pagedResult.PageNumber,
       PageSize = pagedResult.PageSize
                };
        }
catch (Exception ex)
   {
     _logger.LogError(ex, "Error retrieving products");
  throw;
            }
     }

        public async Task<ProductDto?> GetByIdAsync(int id)
      {
      try
            {
          var product = await _context.Products
   .FirstOrDefaultAsync(p => p.ProductId == id);

     return product?.ToDto(_mapper);
            }
        catch (Exception ex)
       {
       _logger.LogError(ex, "Error retrieving product {ProductId}", id);
           throw;
          }
        }

   public async Task<ProductDto> CreateAsync(CreateProductDto dto)
        {
  try
      {
         var product = dto.ToEntity(_mapper);
  product.CreatedAt = DateTime.UtcNow;

              _context.Products.Add(product);
                await _context.SaveChangesAsync();

      return product.ToDto(_mapper);
 }
            catch (Exception ex)
     {
     _logger.LogError(ex, "Error creating product");
     throw;
 }
        }

    public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto)
        {
       try
  {
        var product = await _context.Products
             .FirstOrDefaultAsync(p => p.ProductId == id);

     if (product == null)
      return null;

            product.UpdateFromDto(dto, _mapper);

       await _context.SaveChangesAsync();

      return product.ToDto(_mapper);
            }
    catch (Exception ex)
    {
         _logger.LogError(ex, "Error updating product {ProductId}", id);
      throw;
  }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
          var product = await _context.Products
          .FirstOrDefaultAsync(p => p.ProductId == id);

      if (product == null)
 return false;

           // Soft delete
           product.IsActive = false;

      await _context.SaveChangesAsync();

                return true;
      }
            catch (Exception ex)
        {
      _logger.LogError(ex, "Error deleting product {ProductId}", id);
   throw;
            }
        }

        public async Task<List<ProductDto>> GetActiveProductsAsync()
        {
            var products = await _context.Products
      .Where(p => p.IsActive)
    .OrderBy(p => p.ProductName)
                .ToListAsync();

    return products.Select(p => p.ToDto(_mapper)).ToList();
        }

   #region Private Helper Methods

        private IQueryable<Product> ApplyFilters(IQueryable<Product> query, ProductFilterDto filter)
        {
if (!string.IsNullOrWhiteSpace(filter.Category))
        query = query.Where(p => p.Category == filter.Category);

            if (filter.IsPerishable.HasValue)
           query = query.Where(p => p.IsPerishable == filter.IsPerishable.Value);

            if (filter.IsActive.HasValue)
             query = query.Where(p => p.IsActive == filter.IsActive.Value);

            return query;
        }

    #endregion
    }
}
