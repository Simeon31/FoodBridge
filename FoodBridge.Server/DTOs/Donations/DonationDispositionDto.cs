using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Donations
{
/// <summary>
    /// DTO for creating a donation disposition
    /// </summary>
 public class CreateDonationDispositionDto
    {
 [Required]
        public int DonationItemId { get; set; }

        [Required]
        [StringLength(50)]
     public string DispositionType { get; set; } // Approved_ToInventory, Rejected_ToWaste

        public string Reason { get; set; }

public int? QuantityApproved { get; set; }

        public int? QuantityRejected { get; set; }

   [Required]
        public int ApprovedBy { get; set; }
    }

    /// <summary>
  /// DTO for updating a donation disposition
    /// </summary>
    public class UpdateDonationDispositionDto
    {
        [StringLength(50)]
 public string DispositionType { get; set; }

 public string Reason { get; set; }

   public int? QuantityApproved { get; set; }

public int? QuantityRejected { get; set; }
    }

/// <summary>
/// DTO for returning donation disposition details
    /// </summary>
    public class DonationDispositionDto
    {
   public int DispositionId { get; set; }
  public int DonationItemId { get; set; }
      public string DispositionType { get; set; }
    public string Reason { get; set; }
        public int? QuantityApproved { get; set; }
        public int? QuantityRejected { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public int? ApprovedBy { get; set; }
    public string ApprovedByName { get; set; }
   public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
