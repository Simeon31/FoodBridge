using AutoMapper;
using FoodBridge.Server.Data;
using FoodBridge.Server.Data.Models;
using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Waste;
using FoodBridge.Server.Helpers;
using FoodBridge.Server.Mappings;
using Microsoft.EntityFrameworkCore;

namespace FoodBridge.Server.Services
{
    public interface IWasteService
    {
        Task<PagedResultDto<WasteRecordDto>> GetAllAsync(WasteFilterDto filter);
        Task<WasteRecordDto?> GetByIdAsync(int id);
     Task<WasteRecordDto> CreateAsync(CreateWasteRecordDto dto);
        Task<WasteRecordDto?> UpdateAsync(int id, UpdateWasteRecordDto dto);
  Task<bool> DeleteAsync(int id);
    }

    public class WasteService : IWasteService
 {
        private readonly ApplicationDbContext _context;
  private readonly IMapper _mapper;
        private readonly ILogger<WasteService> _logger;

   public WasteService(
       ApplicationDbContext context,
            IMapper mapper,
            ILogger<WasteService> logger)
        {
         _context = context;
         _mapper = mapper;
_logger = logger;
        }

  public async Task<PagedResultDto<WasteRecordDto>> GetAllAsync(WasteFilterDto filter)
        {
            try
            {
 var query = _context.WasteRecords
       .Include(w => w.Product)
           .AsQueryable();

  // Apply filters
        query = ApplyFilters(query, filter);

   // Apply search
     if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
         {
  query = query.ApplySearch(filter.SearchTerm,
 w => w.Product.ProductName,
     w => w.Product.Category,
      w => w.WasteReason ?? string.Empty);
        }

    // Apply sorting
    query = query.ApplySort(filter.SortBy, filter.SortDescending);

    // Get paged results
    var pagedResult = await query.ToPagedResultAsync(filter.PageNumber, filter.PageSize);

        // Map to DTOs
                return new PagedResultDto<WasteRecordDto>
 {
         Items = pagedResult.Items.Select(w => w.ToDto(_mapper)).ToList(),
         TotalCount = pagedResult.TotalCount,
       PageNumber = pagedResult.PageNumber,
   PageSize = pagedResult.PageSize
       };
            }
    catch (Exception ex)
  {
                _logger.LogError(ex, "Error retrieving waste records");
       throw;
   }
        }

        public async Task<WasteRecordDto?> GetByIdAsync(int id)
        {
      try
       {
    var wasteRecord = await _context.WasteRecords
         .Include(w => w.Product)
          .FirstOrDefaultAsync(w => w.WasteRecordId == id);

         return wasteRecord?.ToDto(_mapper);
     }
       catch (Exception ex)
            {
    _logger.LogError(ex, "Error retrieving waste record {WasteRecordId}", id);
                throw;
            }
        }

    public async Task<WasteRecordDto> CreateAsync(CreateWasteRecordDto dto)
        {
            try
   {
      var wasteRecord = dto.ToEntity(_mapper);
           wasteRecord.CreatedAt = DateTime.UtcNow;

    _context.WasteRecords.Add(wasteRecord);
            await _context.SaveChangesAsync();

                var created = await GetByIdAsync(wasteRecord.WasteRecordId);
          return created ?? wasteRecord.ToDto(_mapper);
            }
            catch (Exception ex)
   {
    _logger.LogError(ex, "Error creating waste record");
         throw;
       }
        }

        public async Task<WasteRecordDto?> UpdateAsync(int id, UpdateWasteRecordDto dto)
        {
            try
    {
                var wasteRecord = await _context.WasteRecords
 .FirstOrDefaultAsync(w => w.WasteRecordId == id);

     if (wasteRecord == null)
            return null;

            wasteRecord.UpdateFromDto(dto, _mapper);

                await _context.SaveChangesAsync();

return await GetByIdAsync(id);
}
   catch (Exception ex)
  {
   _logger.LogError(ex, "Error updating waste record {WasteRecordId}", id);
       throw;
        }
    }

   public async Task<bool> DeleteAsync(int id)
        {
            try
            {
        var wasteRecord = await _context.WasteRecords
          .FirstOrDefaultAsync(w => w.WasteRecordId == id);

    if (wasteRecord == null)
               return false;

             _context.WasteRecords.Remove(wasteRecord);
       await _context.SaveChangesAsync();

            return true;
   }
            catch (Exception ex)
       {
    _logger.LogError(ex, "Error deleting waste record {WasteRecordId}", id);
            throw;
     }
        }

        #region Private Helper Methods

        private IQueryable<WasteRecord> ApplyFilters(IQueryable<WasteRecord> query, WasteFilterDto filter)
    {
 if (filter.ProductId.HasValue)
      query = query.Where(w => w.ProductId == filter.ProductId.Value);

        if (!string.IsNullOrWhiteSpace(filter.Category))
     query = query.Where(w => w.Product.Category == filter.Category);

         if (!string.IsNullOrWhiteSpace(filter.WasteReason))
         query = query.Where(w => w.WasteReason == filter.WasteReason);

 if (filter.StartDate.HasValue)
   query = query.Where(w => w.CreatedAt >= filter.StartDate.Value);

       if (filter.EndDate.HasValue)
      query = query.Where(w => w.CreatedAt <= filter.EndDate.Value);

        return query;
    }

        #endregion
    }
}
