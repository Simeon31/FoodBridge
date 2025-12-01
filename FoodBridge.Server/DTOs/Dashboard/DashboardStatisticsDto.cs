namespace FoodBridge.Server.DTOs.Dashboard
{
    /// <summary>
    /// DTO for main dashboard statistics
    /// </summary>
    public class DashboardStatisticsDto
    {
        public DonationStatsDto Donations { get; set; }
        public InventoryStatsDto Inventory { get; set; }
        public WasteStatsDto Waste { get; set; }
        public DonorStatsDto Donors { get; set; }
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
    }

    /// <summary>
    /// DTO for donation statistics
    /// </summary>
    public class DonationStatsDto
    {
        public int TotalDonations { get; set; }
        public int PendingDonations { get; set; }
        public int ApprovedDonations { get; set; }
        public int RejectedDonations { get; set; }
        public int TotalItemsDonated { get; set; }
        public decimal PercentageChange { get; set; } // vs previous period
        public List<MonthlyDonationDto> MonthlyTrend { get; set; } = new();
    }

    /// <summary>
    /// DTO for inventory statistics
    /// </summary>
    public class InventoryStatsDto
    {
        public int TotalItems { get; set; }
        public int TotalProducts { get; set; }
        public int ExpiringSoon { get; set; }
        public int Expired { get; set; }
        public int BlockedItems { get; set; }
        public decimal PercentageChange { get; set; }
    }

    /// <summary>
    /// DTO for waste statistics
    /// </summary>
    public class WasteStatsDto
    {
        public int TotalWasteRecords { get; set; }
        public int TotalQuantityWasted { get; set; }
        public decimal WastePercentage { get; set; } // vs total received
        public decimal PercentageChange { get; set; }
        public string TopWasteReason { get; set; }
    }

    /// <summary>
    /// DTO for donor statistics
    /// </summary>
    public class DonorStatsDto
    {
        public int TotalDonors { get; set; }
        public int ActiveDonors { get; set; }
        public int NewDonorsThisMonth { get; set; }
        public decimal PercentageChange { get; set; }
        public List<TopDonorDto> TopDonors { get; set; } = new();
    }

    /// <summary>
    /// DTO for monthly donation data
    /// </summary>
    public class MonthlyDonationDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; }
        public int DonationCount { get; set; }
        public int ItemCount { get; set; }
    }

    /// <summary>
    /// DTO for top donors
    /// </summary>
    public class TopDonorDto
    {
        public int DonorId { get; set; }
        public string DonorName { get; set; }
        public int TotalDonations { get; set; }
        public int TotalItems { get; set; }
    }

    /// <summary>
    /// DTO for recent activity feed
    /// </summary>
    public class RecentActivityDto
    {
        public string ActivityType { get; set; } // Donation, Inspection, Disposition, etc.
        public string Description { get; set; }
        public string PerformedBy { get; set; }
        public DateTime ActivityDate { get; set; }
        public string Status { get; set; }
        public int? RelatedId { get; set; } // ID of related entity
    }
}
