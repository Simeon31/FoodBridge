using AutoMapper;
using FoodBridge.Server.Data;
using FoodBridge.Server.Data.Models;
using FoodBridge.Server.DTOs.Common;
using FoodBridge.Server.DTOs.Donations;
using FoodBridge.Server.Helpers;
using FoodBridge.Server.Mappings;
using Microsoft.EntityFrameworkCore;

namespace FoodBridge.Server.Services
{
    public interface IDonorService
    {
        Task<PagedResultDto<DonorDto>> GetAllAsync(DonorFilterDto filter);
        Task<DonorDto?> GetByIdAsync(int id);
        Task<DonorDto> CreateAsync(CreateDonorDto dto);
        Task<DonorDto?> UpdateAsync(int id, UpdateDonorDto dto);
        Task<bool> DeleteAsync(int id);
        Task<List<DonorDto>> GetActiveDonorsAsync();
    }

    public class DonorService : IDonorService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<DonorService> _logger;

        public DonorService(
            ApplicationDbContext context,
         IMapper mapper,
         ILogger<DonorService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PagedResultDto<DonorDto>> GetAllAsync(DonorFilterDto filter)
        {
            try
            {
                var query = _context.Donors.AsQueryable();

                // Apply filters
                query = ApplyFilters(query, filter);

                // Apply search
                if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                {
                    query = query.ApplySearch(filter.SearchTerm,
                        d => d.Name,
                        d => d.Email ?? string.Empty,
                        d => d.PhoneNumber ?? string.Empty,
                        d => d.Address ?? string.Empty);
                }

                // Apply sorting
                query = query.ApplySort(filter.SortBy, filter.SortDescending);

                // Get paged results
                var pagedResult = await query.ToPagedResultAsync(filter.PageNumber, filter.PageSize);

                // Map to DTOs
                return new PagedResultDto<DonorDto>
                {
                    Items = pagedResult.Items.Select(d => d.ToDto(_mapper)).ToList(),
                    TotalCount = pagedResult.TotalCount,
                    PageNumber = pagedResult.PageNumber,
                    PageSize = pagedResult.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving donors");
                throw;
            }
        }

        public async Task<DonorDto?> GetByIdAsync(int id)
        {
            try
            {
                var donor = await _context.Donors
                .FirstOrDefaultAsync(d => d.DonorId == id);

                return donor?.ToDto(_mapper);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving donor {DonorId}", id);
                throw;
            }
        }

        public async Task<DonorDto> CreateAsync(CreateDonorDto dto)
        {
            try
            {
                var donor = dto.ToEntity(_mapper);
                donor.CreatedAt = DateTime.UtcNow;

                _context.Donors.Add(donor);
                await _context.SaveChangesAsync();

                return donor.ToDto(_mapper);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating donor");
                throw;
            }
        }

        public async Task<DonorDto?> UpdateAsync(int id, UpdateDonorDto dto)
        {
            try
            {
                var donor = await _context.Donors
                     .FirstOrDefaultAsync(d => d.DonorId == id);

                if (donor == null)
                    return null;

                donor.UpdateFromDto(dto, _mapper);
                donor.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return donor.ToDto(_mapper);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating donor {DonorId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var donor = await _context.Donors
                    .FirstOrDefaultAsync(d => d.DonorId == id);

                if (donor == null)
                    return false;

                // Soft delete
                donor.IsActive = false;
                donor.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting donor {DonorId}", id);
                throw;
            }
        }

        public async Task<List<DonorDto>> GetActiveDonorsAsync()
        {
            var donors = await _context.Donors
               .Where(d => d.IsActive)
               .OrderBy(d => d.Name)
               .ToListAsync();

            return donors.Select(d => d.ToDto(_mapper)).ToList();
        }

        #region Private Helper Methods

        private IQueryable<Donor> ApplyFilters(IQueryable<Donor> query, DonorFilterDto filter)
        {
            if (!string.IsNullOrWhiteSpace(filter.DonorType))
                query = query.Where(d => d.DonorType == filter.DonorType);

            if (filter.IsActive.HasValue)
                query = query.Where(d => d.IsActive == filter.IsActive.Value);

            return query;
        }

        #endregion
    }
}
