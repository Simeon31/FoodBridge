using FoodBridge.Server.Data;
using FoodBridge.Server.DTOs.Dashboard;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace FoodBridge.Server.Services
{
    public interface IDashboardService
    {
        Task<DashboardStatisticsDto> GetDashboardStatisticsAsync();
    }

    public class DashboardService : IDashboardService
    {
        private readonly ApplicationDbContext _context;
   private readonly ILogger<DashboardService> _logger;

        public DashboardService(
     ApplicationDbContext context,
       ILogger<DashboardService> logger)
      {
        _context = context;
     _logger = logger;
        }

        public async Task<DashboardStatisticsDto> GetDashboardStatisticsAsync()
        {
    try
    {
        var now = DateTime.UtcNow;
   var lastMonth = now.AddMonths(-1);

     // Get donation statistics
      var donations = await GetDonationStatsAsync(now, lastMonth);

   // Get inventory statistics
  var inventory = await GetInventoryStatsAsync(now, lastMonth);

       // Get waste statistics
          var waste = await GetWasteStatsAsync(now, lastMonth);

     // Get donor statistics
      var donors = await GetDonorStatsAsync(now, lastMonth);

   // Get recent activities
    var recentActivities = await GetRecentActivitiesAsync();

           return new DashboardStatisticsDto
    {
            Donations = donations,
  Inventory = inventory,
    Waste = waste,
          Donors = donors,
       RecentActivities = recentActivities
                };
            }
    catch (Exception ex)
            {
  _logger.LogError(ex, "Error retrieving dashboard statistics");
            throw;
            }
        }

        private async Task<DonationStatsDto> GetDonationStatsAsync(DateTime now, DateTime lastMonth)
        {
      var allDonations = await _context.Donations.ToListAsync();
          var totalDonations = allDonations.Count;
            var pendingDonations = allDonations.Count(d => d.Status == "Pending");
        var approvedDonations = allDonations.Count(d => d.Status == "Approved");
   var rejectedDonations = allDonations.Count(d => d.Status == "Rejected");

            // Handle empty donation items
   var donationItems = await _context.DonationItems.ToListAsync();
    var totalItemsDonated = donationItems.Any() ? donationItems.Sum(di => di.QuantityReceived) : 0;

            // Calculate percentage change vs last month
     var thisMonthCount = allDonations.Count(d => d.DonationDate >= now.AddMonths(-1));
            var lastMonthCount = allDonations.Count(d => d.DonationDate >= lastMonth && d.DonationDate < lastMonth.AddMonths(1));
      var percentageChange = lastMonthCount > 0 ? ((decimal)(thisMonthCount - lastMonthCount) / lastMonthCount) * 100 : 0;

    // Get monthly trend for the last 12 months
       var monthlyTrend = await GetMonthlyDonationTrendAsync();

   return new DonationStatsDto
 {
                TotalDonations = totalDonations,
          PendingDonations = pendingDonations,
                ApprovedDonations = approvedDonations,
       RejectedDonations = rejectedDonations,
        TotalItemsDonated = totalItemsDonated,
                PercentageChange = Math.Round(percentageChange, 2),
          MonthlyTrend = monthlyTrend
            };
        }

        private async Task<List<MonthlyDonationDto>> GetMonthlyDonationTrendAsync()
        {
    var twelveMonthsAgo = DateTime.UtcNow.AddMonths(-12);

    // Load donations with their items
  var donations = await _context.Donations
       .Include(d => d.DonationItems)
                .Where(d => d.DonationDate >= twelveMonthsAgo)
       .ToListAsync();

// Group and aggregate in memory to avoid EF Core translation issues
          var monthlyData = donations
         .GroupBy(d => new { d.DonationDate.Year, d.DonationDate.Month })
   .Select(g => new
        {
Year = g.Key.Year,
             Month = g.Key.Month,
DonationCount = g.Count(),
            ItemCount = g.Sum(d => d.DonationItems?.Sum(di => di.QuantityReceived) ?? 0)
     })
   .OrderBy(x => x.Year)
   .ThenBy(x => x.Month)
    .ToList();

            return monthlyData.Select(m => new MonthlyDonationDto
     {
  Year = m.Year,
       Month = m.Month,
     MonthName = new DateTime(m.Year, m.Month, 1).ToString("MMM yyyy", CultureInfo.InvariantCulture),
DonationCount = m.DonationCount,
            ItemCount = m.ItemCount
}).ToList();
        }

        private async Task<InventoryStatsDto> GetInventoryStatsAsync(DateTime now, DateTime lastMonth)
        {
            var allItems = await _context.InventoryItems.ToListAsync();
            var totalItems = allItems.Count;
  var totalProducts = await _context.Products.CountAsync(p => p.IsActive);

            var expiringSoon = allItems.Count(i => i.ExpirationDate.HasValue &&
      i.ExpirationDate.Value <= now.AddDays(7) &&
     i.ExpirationDate.Value > now &&
    !i.IsBlocked);

            var expired = allItems.Count(i => i.ExpirationDate.HasValue &&
 i.ExpirationDate.Value <= now &&
    !i.IsBlocked);

            var blockedItems = allItems.Count(i => i.IsBlocked);

   // Calculate percentage change
     var thisMonthCount = allItems.Count(i => i.DateReceived >= now.AddMonths(-1));
      var lastMonthCount = allItems.Count(i => i.DateReceived >= lastMonth && i.DateReceived < lastMonth.AddMonths(1));
            var percentageChange = lastMonthCount > 0 ? ((decimal)(thisMonthCount - lastMonthCount) / lastMonthCount) * 100 : 0;

  return new InventoryStatsDto
            {
        TotalItems = totalItems,
     TotalProducts = totalProducts,
      ExpiringSoon = expiringSoon,
            Expired = expired,
     BlockedItems = blockedItems,
         PercentageChange = Math.Round(percentageChange, 2)
            };
        }

 private async Task<WasteStatsDto> GetWasteStatsAsync(DateTime now, DateTime lastMonth)
        {
            var allWaste = await _context.WasteRecords.ToListAsync();
      var totalWasteRecords = allWaste.Count;
      var totalQuantityWasted = allWaste.Any() ? allWaste.Sum(w => w.Quantity) : 0;

            // Calculate waste percentage vs total received
var donationItems = await _context.DonationItems.ToListAsync();
        var totalReceived = donationItems.Any() ? donationItems.Sum(di => di.QuantityReceived) : 0;
var wastePercentage = totalReceived > 0 ? ((decimal)totalQuantityWasted / totalReceived) * 100 : 0;

      // Calculate percentage change
      var thisMonthCount = allWaste.Count(w => w.DisposedAt.HasValue && w.DisposedAt.Value >= now.AddMonths(-1));
            var lastMonthCount = allWaste.Count(w => w.DisposedAt.HasValue && w.DisposedAt.Value >= lastMonth && w.DisposedAt.Value < lastMonth.AddMonths(1));
            var percentageChange = lastMonthCount > 0 ? ((decimal)(thisMonthCount - lastMonthCount) / lastMonthCount) * 100 : 0;

       // Get top waste reason
  var topWasteReason = allWaste.Any()
         ? allWaste
  .Where(w => !string.IsNullOrEmpty(w.WasteReason))
        .GroupBy(w => w.WasteReason)
    .OrderByDescending(g => g.Count())
         .Select(g => g.Key)
          .FirstOrDefault() ?? "N/A"
         : "N/A";

            return new WasteStatsDto
            {
                TotalWasteRecords = totalWasteRecords,
  TotalQuantityWasted = totalQuantityWasted,
       WastePercentage = Math.Round(wastePercentage, 2),
       PercentageChange = Math.Round(percentageChange, 2),
                TopWasteReason = topWasteReason
};
        }

        private async Task<DonorStatsDto> GetDonorStatsAsync(DateTime now, DateTime lastMonth)
   {
       var allDonors = await _context.Donors.ToListAsync();
          var totalDonors = allDonors.Count;
  var activeDonors = allDonors.Count(d => d.IsActive);

      var startOfMonth = new DateTime(now.Year, now.Month, 1);
    var newDonorsThisMonth = allDonors.Count(d => d.CreatedAt >= startOfMonth);

      // Calculate percentage change
  var thisMonthCount = allDonors.Count(d => d.CreatedAt >= now.AddMonths(-1));
   var lastMonthCount = allDonors.Count(d => d.CreatedAt >= lastMonth && d.CreatedAt < lastMonth.AddMonths(1));
            var percentageChange = lastMonthCount > 0 ? ((decimal)(thisMonthCount - lastMonthCount) / lastMonthCount) * 100 : 0;

            // Get top donors - Load donations with items in memory
          var donations = await _context.Donations
     .Include(d => d.Donor)
      .Include(d => d.DonationItems)
      .ToListAsync();

          var topDonors = donations
                .GroupBy(d => d.DonorId)
                .Select(g => new TopDonorDto
    {
          DonorId = g.Key,
            DonorName = g.First().Donor?.Name ?? "Unknown",
        TotalDonations = g.Count(),
          TotalItems = g.Sum(d => d.DonationItems?.Sum(di => di.QuantityReceived) ?? 0)
                })
      .OrderByDescending(d => d.TotalDonations)
        .Take(5)
            .ToList();

 return new DonorStatsDto
      {
    TotalDonors = totalDonors,
       ActiveDonors = activeDonors,
                NewDonorsThisMonth = newDonorsThisMonth,
            PercentageChange = Math.Round(percentageChange, 2),
           TopDonors = topDonors
 };
        }

        private async Task<List<RecentActivityDto>> GetRecentActivitiesAsync()
        {
  var activities = new List<RecentActivityDto>();

   // Get recent donations
        var recentDonations = await _context.Donations
          .Include(d => d.Donor)
         .OrderByDescending(d => d.DonationDate)
   .Take(5)
      .ToListAsync();

            activities.AddRange(recentDonations.Select(d => new RecentActivityDto
      {
         ActivityType = "Donation",
                Description = $"{d.Donor?.Name ?? "Unknown"} donated items",
      PerformedBy = d.Donor?.Name ?? "Unknown",
        ActivityDate = d.DonationDate,
       Status = d.Status,
        RelatedId = d.DonationId
            }));

        // Get recent inventory additions
            var recentInventory = await _context.InventoryItems
        .OrderByDescending(i => i.DateReceived)
      .Take(5)
       .ToListAsync();

    activities.AddRange(recentInventory.Select(i => new RecentActivityDto
            {
     ActivityType = "Inventory",
              Description = $"Added {i.QuantityOnHand} items to inventory",
                PerformedBy = "System",
        ActivityDate = i.DateReceived,
 Status = i.IsBlocked ? "Blocked" : "Available",
        RelatedId = i.InventoryItemId
    }));

    // Sort all activities by date and take top 10
   return activities
      .OrderByDescending(a => a.ActivityDate)
      .Take(10)
          .ToList();
        }
    }
}
