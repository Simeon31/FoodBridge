using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Donations
{
    /// <summary>
    /// DTO for creating a new donation
    /// </summary>
    public class CreateDonationDto
    {
        [Required]
public int DonorId { get; set; }

        [Required]
        public DateTime DonationDate { get; set; }

        [Required]
   [StringLength(50)]
        public string ReceiptNumber { get; set; }

        [Required]
        public int ReceivedBy { get; set; }

        public string Notes { get; set; }

        public List<CreateDonationItemDto> DonationItems { get; set; } = new();
    }

 /// <summary>
    /// DTO for updating an existing donation
    /// </summary>
    public class UpdateDonationDto
    {
        [Required]
        [StringLength(50)]
        public string Status { get; set; }

 public int? InspectedBy { get; set; }

     public string Notes { get; set; }
    }

    /// <summary>
    /// DTO for returning donation details
/// </summary>
    public class DonationDto
    {
    public int DonationId { get; set; }
        public int DonorId { get; set; }
      public string DonorName { get; set; }
        public DateTime DonationDate { get; set; }
 public string ReceiptNumber { get; set; }
        public string Status { get; set; }
        public int ReceivedBy { get; set; }
        public string ReceivedByName { get; set; }
        public int? InspectedBy { get; set; }
        public string InspectedByName { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    public List<DonationItemDto> DonationItems { get; set; } = new();
        public DonationReceiptDto DonationReceipt { get; set; }
    }

    /// <summary>
    /// DTO for donation list view (summary)
    /// </summary>
    public class DonationSummaryDto
    {
        public int DonationId { get; set; }
        public string DonorName { get; set; }
        public DateTime DonationDate { get; set; }
      public string ReceiptNumber { get; set; }
public string Status { get; set; }
        public int TotalItems { get; set; }
     public DateTime CreatedAt { get; set; }
    }
}
