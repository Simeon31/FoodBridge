using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Products
{
    /// <summary>
/// DTO for creating a new product
    /// </summary>
    public class CreateProductDto
    {
        [Required]
  [StringLength(50)]
 public string ProductCode { get; set; }

        [Required]
     [StringLength(255)]
        public string ProductName { get; set; }

      [StringLength(100)]
     public string Category { get; set; }

      [StringLength(50)]
        public string DefaultUnitType { get; set; }

        public bool IsPerishable { get; set; }

        [StringLength(100)]
        public string OptimalStorageCondition { get; set; }
    }

    /// <summary>
    /// DTO for updating an existing product
    /// </summary>
    public class UpdateProductDto
    {
        [Required]
        [StringLength(255)]
  public string ProductName { get; set; }

        [StringLength(100)]
     public string Category { get; set; }

        [StringLength(50)]
        public string DefaultUnitType { get; set; }

        public bool IsPerishable { get; set; }

        [StringLength(100)]
  public string OptimalStorageCondition { get; set; }

      public bool IsActive { get; set; }
    }

    /// <summary>
/// DTO for returning product details
    /// </summary>
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string Category { get; set; }
        public string DefaultUnitType { get; set; }
   public bool IsPerishable { get; set; }
     public string OptimalStorageCondition { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TotalDonated { get; set; }
        public int CurrentInventory { get; set; }
    }

    /// <summary>
    /// DTO for product list view (summary)
    /// </summary>
 public class ProductSummaryDto
    {
public int ProductId { get; set; }
        public string ProductCode { get; set; }
   public string ProductName { get; set; }
      public string Category { get; set; }
        public bool IsPerishable { get; set; }
   public bool IsActive { get; set; }
  public int CurrentInventory { get; set; }
    }
}
