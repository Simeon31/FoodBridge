using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Donations
{
    /// <summary>
    /// DTO for creating a donation item
    /// </summary>
    public class CreateDonationItemDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
  public int Quantity { get; set; }

        [Required]
        [StringLength(50)]
     public string UnitType { get; set; }

    public DateTime? ExpirationDate { get; set; }

        public string Condition { get; set; }

    public string Notes { get; set; }
    }

    /// <summary>
    /// DTO for updating a donation item
    /// </summary>
    public class UpdateDonationItemDto
    {
     public int Quantity { get; set; }

    [StringLength(50)]
  public string UnitType { get; set; }

     public DateTime? ExpirationDate { get; set; }

 public string Condition { get; set; }

        public string Notes { get; set; }
    }

    /// <summary>
    /// DTO for returning donation item details
    /// </summary>
    public class DonationItemDto
    {
        public int DonationItemId { get; set; }
        public int DonationId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string Category { get; set; }
        public int Quantity { get; set; }
        public string UnitType { get; set; }
    public DateTime? ExpirationDate { get; set; }
        public string Condition { get; set; }
        public string Notes { get; set; }
        public string InspectionStatus { get; set; }
        public DateTime CreatedAt { get; set; }
      public QualityInspectionDto QualityInspection { get; set; }
        public DonationDispositionDto Disposition { get; set; }
    }
}
