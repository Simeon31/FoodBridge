using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Waste
{
    /// <summary>
    /// DTO for creating a waste record
    /// </summary>
    public class CreateWasteRecordDto
    {
        public int? DonationItemId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

 [StringLength(50)]
        public string UnitType { get; set; }

        [Required]
   [StringLength(100)]
        public string WasteReason { get; set; }

    [StringLength(100)]
        public string DisposalMethod { get; set; }

        public DateTime? DisposedAt { get; set; }

    public int? DisposedBy { get; set; }
    }

    /// <summary>
    /// DTO for updating a waste record
    /// </summary>
    public class UpdateWasteRecordDto
    {
 [StringLength(100)]
        public string WasteReason { get; set; }

        [StringLength(100)]
      public string DisposalMethod { get; set; }

      public DateTime? DisposedAt { get; set; }

     public int? DisposedBy { get; set; }
    }

    /// <summary>
    /// DTO for returning waste record details
    /// </summary>
    public class WasteRecordDto
    {
        public int WasteRecordId { get; set; }
   public int? DonationItemId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string Category { get; set; }
        public int Quantity { get; set; }
        public string UnitType { get; set; }
        public string WasteReason { get; set; }
        public string DisposalMethod { get; set; }
        public DateTime? DisposedAt { get; set; }
        public int? DisposedBy { get; set; }
        public string DisposedByName { get; set; }
   public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO for waste record list view (summary)
    /// </summary>
    public class WasteRecordSummaryDto
    {
        public int WasteRecordId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
      public string UnitType { get; set; }
        public string WasteReason { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO for waste statistics/dashboard
  /// </summary>
    public class WasteStatisticsDto
    {
public int TotalWasteRecords { get; set; }
        public int TotalQuantityWasted { get; set; }
        public Dictionary<string, int> WasteByReason { get; set; } = new();
   public Dictionary<string, int> WasteByCategory { get; set; } = new();
        public List<MonthlyWasteDto> MonthlyWaste { get; set; } = new();
  }

    /// <summary>
    /// DTO for monthly waste data
    /// </summary>
    public class MonthlyWasteDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; }
        public int TotalQuantity { get; set; }
   public int RecordCount { get; set; }
    }
}
