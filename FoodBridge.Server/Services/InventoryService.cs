using AutoMapper;
using FoodBridge.Server.Data;
using FoodBridge.Server.Data.Models;
using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Inventory;
using FoodBridge.Server.Helpers;
using FoodBridge.Server.Mappings;
using Microsoft.EntityFrameworkCore;

namespace FoodBridge.Server.Services
{
    public interface IInventoryService
    {
      Task<PagedResultDto<InventoryItemDto>> GetAllAsync(InventoryFilterDto filter);
     Task<InventoryItemDto?> GetByIdAsync(int id);
 Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto dto);
        Task<InventoryItemDto?> UpdateAsync(int id, UpdateInventoryItemDto dto);
        Task<bool> DeleteAsync(int id);
    Task<List<InventoryItemDto>> GetExpiringSoonAsync(int days = 7);
        Task<bool> AdjustQuantityAsync(int id, decimal quantityChange, string reason);
    }

public class InventoryService : IInventoryService
    {
  private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<InventoryService> _logger;

  public InventoryService(
      ApplicationDbContext context,
            IMapper mapper,
    ILogger<InventoryService> logger)
      {
       _context = context;
  _mapper = mapper;
            _logger = logger;
     }

     public async Task<PagedResultDto<InventoryItemDto>> GetAllAsync(InventoryFilterDto filter)
        {
    try
     {
         var query = _context.InventoryItems
    .Include(i => i.Product)
          .AsQueryable();

           // Apply filters
query = ApplyFilters(query, filter);

      // Apply search
       if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
        {
    query = query.ApplySearch(filter.SearchTerm,
       i => i.Product.ProductName,
     i => i.Product.Category,
  i => i.BlockReason ?? string.Empty);
       }

    // Apply sorting
    query = query.ApplySort(filter.SortBy, filter.SortDescending);

   // Get paged results
     var pagedResult = await query.ToPagedResultAsync(filter.PageNumber, filter.PageSize);

    // Map to DTOs
 return new PagedResultDto<InventoryItemDto>
    {
 Items = pagedResult.Items.Select(i => i.ToDto(_mapper)).ToList(),
    TotalCount = pagedResult.TotalCount,
   PageNumber = pagedResult.PageNumber,
 PageSize = pagedResult.PageSize
     };
}
catch (Exception ex)
        {
      _logger.LogError(ex, "Error retrieving inventory items");
      throw;
    }
        }

        public async Task<InventoryItemDto?> GetByIdAsync(int id)
        {
   try
{
       var item = await _context.InventoryItems
       .Include(i => i.Product)
 .FirstOrDefaultAsync(i => i.InventoryItemId == id);

     return item?.ToDto(_mapper);
            }
       catch (Exception ex)
       {
   _logger.LogError(ex, "Error retrieving inventory item {ItemId}", id);
 throw;
}
        }

    public async Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto dto)
{
     try
     {
      var item = dto.ToEntity(_mapper);
      item.CreatedAt = DateTime.UtcNow;

        _context.InventoryItems.Add(item);
    await _context.SaveChangesAsync();

       var created = await GetByIdAsync(item.InventoryItemId);
      return created ?? item.ToDto(_mapper);
      }
       catch (Exception ex)
     {
        _logger.LogError(ex, "Error creating inventory item");
   throw;
}
 }

 public async Task<InventoryItemDto?> UpdateAsync(int id, UpdateInventoryItemDto dto)
  {
     try
   {
          var item = await _context.InventoryItems
 .FirstOrDefaultAsync(i => i.InventoryItemId == id);

         if (item == null)
      return null;

    item.UpdateFromDto(dto, _mapper);
      item.UpdatedAt = DateTime.UtcNow;

         await _context.SaveChangesAsync();

    return await GetByIdAsync(id);
  }
        catch (Exception ex)
    {
    _logger.LogError(ex, "Error updating inventory item {ItemId}", id);
    throw;
 }
      }

  public async Task<bool> DeleteAsync(int id)
        {
      try
   {
         var item = await _context.InventoryItems
  .FirstOrDefaultAsync(i => i.InventoryItemId == id);

       if (item == null)
        return false;

      _context.InventoryItems.Remove(item);
        await _context.SaveChangesAsync();

 return true;
     }
            catch (Exception ex)
         {
          _logger.LogError(ex, "Error deleting inventory item {ItemId}", id);
    throw;
            }
 }

      public async Task<List<InventoryItemDto>> GetExpiringSoonAsync(int days = 7)
      {
   var expiryDate = DateTime.UtcNow.AddDays(days);

  var items = await _context.InventoryItems
       .Include(i => i.Product)
 .Where(i => i.ExpirationDate.HasValue &&
   i.ExpirationDate.Value <= expiryDate &&
      i.ExpirationDate.Value >= DateTime.UtcNow &&
       i.QuantityOnHand > 0)
   .OrderBy(i => i.ExpirationDate)
      .ToListAsync();

            return items.Select(i => i.ToDto(_mapper)).ToList();
        }

  public async Task<bool> AdjustQuantityAsync(int id, decimal quantityChange, string reason)
    {
  using var transaction = await _context.Database.BeginTransactionAsync();
   try
  {
      var item = await _context.InventoryItems
     .FirstOrDefaultAsync(i => i.InventoryItemId == id);

    if (item == null)
     return false;

     var oldQuantity = item.QuantityOnHand;
       item.QuantityOnHand += (int)quantityChange;
         item.UpdatedAt = DateTime.UtcNow;

       if (item.QuantityOnHand < 0)
    item.QuantityOnHand = 0;

 await _context.SaveChangesAsync();

       _logger.LogInformation(
"Inventory adjusted for item {ItemId}: {OldQty} -> {NewQty}. Reason: {Reason}",
    id, oldQuantity, item.QuantityOnHand, reason);

    await transaction.CommitAsync();
     return true;
     }
   catch (Exception ex)
  {
   await transaction.RollbackAsync();
 _logger.LogError(ex, "Error adjusting inventory quantity for item {ItemId}", id);
 throw;
          }
  }

        #region Private Helper Methods

        private IQueryable<InventoryItem> ApplyFilters(IQueryable<InventoryItem> query, InventoryFilterDto filter)
     {
 if (filter.ProductId.HasValue)
    query = query.Where(i => i.ProductId == filter.ProductId.Value);

  if (!string.IsNullOrWhiteSpace(filter.Category))
      query = query.Where(i => i.Product.Category == filter.Category);

    if (filter.IsExpiringSoon.HasValue && filter.IsExpiringSoon.Value)
  {
      var expiryDate = DateTime.UtcNow.AddDays(7);
    query = query.Where(i => i.ExpirationDate.HasValue &&
     i.ExpirationDate.Value <= expiryDate &&
  i.ExpirationDate.Value >= DateTime.UtcNow);
      }

 if (filter.IsExpired.HasValue && filter.IsExpired.Value)
 {
       query = query.Where(i => i.ExpirationDate.HasValue &&
       i.ExpirationDate.Value < DateTime.UtcNow);
}

            if (filter.IsBlocked.HasValue)
 query = query.Where(i => i.IsBlocked == filter.IsBlocked.Value);

     return query;
        }

        #endregion
    }
}
