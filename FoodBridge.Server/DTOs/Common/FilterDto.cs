using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Common
{
    /// <summary>
    /// DTO for donation filtering and search
    /// </summary>
    public class DonationFilterDto : PaginationParams
    {
        public int? DonorId { get; set; }
        public string? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public override string SortBy { get; set; } = "DonationDate";
        public override bool SortDescending { get; set; } = true;
    }

    /// <summary>
    /// DTO for inventory filtering and search
    /// </summary>
    public class InventoryFilterDto : PaginationParams
    {
        public int? ProductId { get; set; }
        public string? Category { get; set; }
        public bool? IsExpiringSoon { get; set; }
        public bool? IsExpired { get; set; }
        public bool? IsBlocked { get; set; }
        public override string SortBy { get; set; } = "ProductName";
        public override bool SortDescending { get; set; } = false;
    }

    /// <summary>
    /// DTO for donor filtering and search
    /// </summary>
    public class DonorFilterDto : PaginationParams
    {
        public string? DonorType { get; set; }
        public bool? IsActive { get; set; }
        public override string SortBy { get; set; } = "Name";
        public override bool SortDescending { get; set; } = false;
    }

    /// <summary>
    /// DTO for product filtering and search
    /// </summary>
    public class ProductFilterDto : PaginationParams
    {
        public string? Category { get; set; }
        public bool? IsPerishable { get; set; }
        public bool? IsActive { get; set; }
        public override string SortBy { get; set; } = "ProductName";
        public override bool SortDescending { get; set; } = false;
    }

    /// <summary>
    /// DTO for waste record filtering
    /// </summary>
    public class WasteFilterDto : PaginationParams
    {
        public int? ProductId { get; set; }
        public string? Category { get; set; }
        public string? WasteReason { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public override string SortBy { get; set; } = "CreatedAt";
        public override bool SortDescending { get; set; } = true;
    }

    /// <summary>
    /// DTO for date range queries
    /// </summary>
    public class DateRangeDto
    {
        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }
    }
}
