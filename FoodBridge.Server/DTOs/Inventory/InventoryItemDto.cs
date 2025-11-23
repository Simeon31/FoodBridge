using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Inventory
{
    /// <summary>
    /// DTO for creating an inventory item
    /// </summary>
    public class CreateInventoryItemDto
    {
        [Required]
        public int ProductId { get; set; }

   public int? StorageLocationId { get; set; }

        [Required]
  public int QuantityOnHand { get; set; }

     public DateTime? ExpirationDate { get; set; }

        [Required]
  public DateTime DateReceived { get; set; }

        public int? SourceDonationItemId { get; set; }
    }

    /// <summary>
    /// DTO for updating an inventory item
    /// </summary>
    public class UpdateInventoryItemDto
    {
 public int? StorageLocationId { get; set; }

  [Required]
        public int QuantityOnHand { get; set; }

        public DateTime? ExpirationDate { get; set; }

        public bool IsBlocked { get; set; }

        public string BlockReason { get; set; }
    }

/// <summary>
    /// DTO for returning inventory item details
    /// </summary>
    public class InventoryItemDto
    {
        public int InventoryItemId { get; set; }
    public int ProductId { get; set; }
     public string ProductName { get; set; }
   public string ProductCode { get; set; }
public string Category { get; set; }
        public int? StorageLocationId { get; set; }
  public string StorageLocationName { get; set; }
   public int QuantityOnHand { get; set; }
public DateTime? ExpirationDate { get; set; }
  public int? DaysUntilExpiration { get; set; }
        public DateTime DateReceived { get; set; }
    public int? SourceDonationItemId { get; set; }
  public bool IsBlocked { get; set; }
     public string BlockReason { get; set; }
   public DateTime CreatedAt { get; set; }
  public DateTime UpdatedAt { get; set; }
    }

    /// <summary>
    /// DTO for inventory list view (summary)
    /// </summary>
    public class InventoryItemSummaryDto
    {
   public int InventoryItemId { get; set; }
        public string ProductName { get; set; }
  public string ProductCode { get; set; }
        public string Category { get; set; }
  public int QuantityOnHand { get; set; }
   public DateTime? ExpirationDate { get; set; }
        public int? DaysUntilExpiration { get; set; }
  public bool IsBlocked { get; set; }
        public bool IsExpiringSoon { get; set; }
    }

    /// <summary>
    /// DTO for inventory adjustment
 /// </summary>
    public class InventoryAdjustmentDto
    {
        [Required]
        public int InventoryItemId { get; set; }

  [Required]
        public int QuantityChange { get; set; } // Positive for increase, negative for decrease

        [Required]
        [StringLength(100)]
   public string Reason { get; set; }

     public string Notes { get; set; }
    }

    /// <summary>
    /// DTO for inventory summary/dashboard
    /// </summary>
    public class InventorySummaryDto
    {
  public int TotalItems { get; set; }
        public int TotalProducts { get; set; }
   public int ExpiringSoon { get; set; } // Within 7 days
        public int Expired { get; set; }
public int BlockedItems { get; set; }
        public List<CategoryInventoryDto> InventoryByCategory { get; set; } = new();
    }

    /// <summary>
    /// DTO for inventory grouped by category
    /// </summary>
  public class CategoryInventoryDto
    {
        public string Category { get; set; }
        public int TotalQuantity { get; set; }
   public int ProductCount { get; set; }
    }
}
