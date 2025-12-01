using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Donations
{
    /// <summary>
    /// DTO for creating a donation receipt
    /// </summary>
    public class CreateDonationReceiptDto
  {
   [Required]
        public int DonationId { get; set; }

     [Required]
   [StringLength(50)]
        public string ReceiptNumber { get; set; }

     [Required]
  public DateTime IssueDate { get; set; }

    [Required]
 public int IssuedBy { get; set; }

        public decimal? TotalEstimatedValue { get; set; }

        public bool IsTaxDeductible { get; set; }

        public string ReceiptNotes { get; set; }
    }

    /// <summary>
  /// DTO for returning donation receipt details
    /// </summary>
    public class DonationReceiptDto
    {
        public int ReceiptId { get; set; }
     public int DonationId { get; set; }
        public string ReceiptNumber { get; set; }
        public DateTime IssueDate { get; set; }
     public int IssuedBy { get; set; }
    public string IssuedByName { get; set; }
 public decimal? TotalEstimatedValue { get; set; }
  public bool IsTaxDeductible { get; set; }
public string ReceiptNotes { get; set; }
  public DateTime CreatedAt { get; set; }
        
        // Related donation info
 public string DonorName { get; set; }
        public DateTime DonationDate { get; set; }
        public int TotalItems { get; set; }
    }

    /// <summary>
    /// DTO for receipt generation request
    /// </summary>
 public class GenerateReceiptDto
    {
        [Required]
        public int DonationId { get; set; }

        public decimal? TotalEstimatedValue { get; set; }

     public bool IsTaxDeductible { get; set; } = true;

public string ReceiptNotes { get; set; }
    }
}
