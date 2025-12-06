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
    public interface IDonationService
    {
        Task<PagedResultDto<DonationDto>> GetAllAsync(DonationFilterDto filter);
        Task<DonationDto?> GetByIdAsync(int id);
        Task<DonationDto> CreateAsync(CreateDonationDto dto);
        Task<DonationDto?> UpdateAsync(int id, UpdateDonationDto dto);
        Task<bool> DeleteAsync(int id);
        Task<List<DonationItemDto>> GetDonationItemsAsync(int donationId);
        Task<QualityInspectionDto?> GetQualityInspectionAsync(int donationId);
        Task<DonationReceiptDto?> GetReceiptAsync(int donationId);
        Task<List<AvailableDonationItemDto>> GetAvailableDonationItemsAsync();
    }

    public class DonationService : IDonationService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<DonationService> _logger;

        public DonationService(
            ApplicationDbContext context,
            IMapper mapper,
            ILogger<DonationService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PagedResultDto<DonationDto>> GetAllAsync(DonationFilterDto filter)
        {
            try
            {
                var query = _context.Donations
                    .Include(d => d.Donor)
                    .Include(d => d.DonationItems)
                    .ThenInclude(di => di.Product)
                    .AsQueryable();

                query = ApplyFilters(query, filter);

                // Search
                if (!string.IsNullOrWhiteSpace(filter.SearchTerm))
                {
                    query = query.ApplySearch(filter.SearchTerm,
                       d => d.Donor.Name,
                       d => d.Status,
                       d => d.Notes ?? string.Empty);
                }


                query = query.ApplySort(filter.SortBy, filter.SortDescending);


                var pagedResult = await query.ToPagedResultAsync(filter.PageNumber, filter.PageSize);

                // Map to DTOs
                return new PagedResultDto<DonationDto>
                {
                    Items = pagedResult.Items.Select(d => d.ToDto(_mapper)).ToList(),
                    TotalCount = pagedResult.TotalCount,
                    PageNumber = pagedResult.PageNumber,
                    PageSize = pagedResult.PageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving donations");
                throw;
            }
        }

        public async Task<DonationDto?> GetByIdAsync(int id)
        {
            try
            {
                var donation = await _context.Donations
                .Include(d => d.Donor)
                .Include(d => d.DonationItems)
                .ThenInclude(di => di.Product)
                .Include(d => d.DonationReceipt)
                .Include(d => d.AuditTrail)
                .FirstOrDefaultAsync(d => d.DonationId == id);

                return donation?.ToDto(_mapper);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving donation {DonationId}", id);
                throw;
            }
        }

        public async Task<DonationDto> CreateAsync(CreateDonationDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var donation = dto.ToEntity(_mapper);
                donation.Status = "Approved";
                donation.CreatedAt = DateTime.UtcNow;

                _context.Donations.Add(donation);
                await _context.SaveChangesAsync();

                // Add audit trail
                await AddAuditTrailAsync(donation.DonationId, donation.DonorId, "Created", "Donation created");

                await transaction.CommitAsync();

                return await GetByIdAsync(donation.DonationId) ?? donation.ToDto(_mapper);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error creating donation");
                throw;
            }
        }

        public async Task<DonationDto?> UpdateAsync(int id, UpdateDonationDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var donation = await _context.Donations
                   .Include(d => d.DonationItems)
                   .FirstOrDefaultAsync(d => d.DonationId == id);

                if (donation == null)
                    return null;

                var oldStatus = donation.Status;
                donation.UpdateFromDto(dto, _mapper);
                donation.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Add audit trail if status changed
                if (oldStatus != donation.Status)
                {
                    await AddAuditTrailAsync(id, donation.DonorId, "Status Changed", $"Status changed from {oldStatus} to {donation.Status}");
                }

                await transaction.CommitAsync();

                return await GetByIdAsync(id);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error updating donation {DonationId}", id);
                throw;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var donation = await _context.Donations
            .Include(d => d.DonationItems)
            .Include(d => d.DonationReceipt)
            .Include(d => d.AuditTrail)
            .FirstOrDefaultAsync(d => d.DonationId == id);

                if (donation == null)
                    return false;

                _context.Donations.Remove(donation);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error deleting donation {DonationId}", id);
                throw;
            }
        }

        public async Task<List<DonationItemDto>> GetDonationItemsAsync(int donationId)
        {
            var items = await _context.DonationItems
         .Include(di => di.Product)
           .Where(di => di.DonationId == donationId)
           .ToListAsync();

            return items.Select(i => i.ToDto(_mapper)).ToList();
        }

        public async Task<QualityInspectionDto?> GetQualityInspectionAsync(int donationId)
        {
            var inspection = await _context.QualityInspections
               .Include(qi => qi.DonationItem)
           .Where(qi => qi.DonationItem.DonationId == donationId)
           .FirstOrDefaultAsync();

            return inspection?.ToDto(_mapper);
        }

        public async Task<DonationReceiptDto?> GetReceiptAsync(int donationId)
        {
            var receipt = await _context.DonationReceipts
        .FirstOrDefaultAsync(r => r.DonationId == donationId);

            return receipt?.ToDto(_mapper);
        }

        public async Task<List<AvailableDonationItemDto>> GetAvailableDonationItemsAsync()
        {
            try
            {
                // Get all DonationItemIds that are already in inventory
                var inventoryItemIds = await _context.InventoryItems
             .Where(i => i.SourceDonationItemId > 0)
             .Select(i => i.SourceDonationItemId)
             .Distinct()
             .ToListAsync();

                // Get all donation items from Approved donations
                var availableItems = await _context.DonationItems
             .Include(di => di.Product)
             .Include(di => di.Donation)
             .Where(di => !inventoryItemIds.Contains(di.DonationItemId))
             .Where(di => di.Donation.Status == "Approved")
             .Select(di => new AvailableDonationItemDto
             {
                 DonationItemId = di.DonationItemId,
                 DonationId = di.DonationId,
                 ProductId = di.ProductId,
                 ProductName = di.Product.ProductName,
                 Quantity = di.QuantityReceived,
                 UnitType = di.UnitType,
                 ExpirationDate = di.ExpirationDate
             })
              .ToListAsync();

                return availableItems;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving available donation items");
                throw;
            }
        }
        private IQueryable<Donation> ApplyFilters(IQueryable<Donation> query, DonationFilterDto filter)
        {
            // Filter by DonorId only when a valid nullable value is provided
            if (filter.DonorId.HasValue && filter.DonorId.Value > 0)
            {
                query = query.Where(d => d.DonorId == filter.DonorId.Value);
            }

            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                query = query.Where(d => d.Status == filter.Status);
            }

            if (filter.StartDate.HasValue)
            {
                query = query.Where(d => d.DonationDate >= filter.StartDate.Value);
            }

            if (filter.EndDate.HasValue)
            {
                query = query.Where(d => d.DonationDate <= filter.EndDate.Value);
            }

            return query;
        }

        private async Task AddAuditTrailAsync(int donationId, int donorId, string action, string description)
        {
            var audit = new DonationAuditTrail
            {
                DonationId = donationId,
                Action = action,
                Details = description,
                ActionDate = DateTime.UtcNow,
                ActionBy = donorId,
            };

            _context.DonationAuditTrails.Add(audit);
            await _context.SaveChangesAsync();
        }
    }
}
