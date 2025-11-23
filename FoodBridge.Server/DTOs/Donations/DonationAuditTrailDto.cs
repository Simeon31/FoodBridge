using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Donations
{
    /// <summary>
    /// DTO for creating an audit trail entry
    /// </summary>
    public class CreateDonationAuditTrailDto
    {
        [Required]
        public int DonationId { get; set; }

    [Required]
   [StringLength(100)]
   public string Action { get; set; }

        [Required]
   public int PerformedBy { get; set; }

  public string ActionDetails { get; set; }

   public string OldValue { get; set; }

        public string NewValue { get; set; }
    }

    /// <summary>
    /// DTO for returning audit trail details
    /// </summary>
    public class DonationAuditTrailDto
    {
  public int AuditId { get; set; }
  public int DonationId { get; set; }
  public string Action { get; set; }
      public int PerformedBy { get; set; }
   public string PerformedByName { get; set; }
     public DateTime ActionDate { get; set; }
     public string ActionDetails { get; set; }
        public string OldValue { get; set; }
   public string NewValue { get; set; }
    }

    /// <summary>
    /// DTO for audit trail summary
 /// </summary>
 public class AuditTrailSummaryDto
    {
   public int AuditId { get; set; }
public string Action { get; set; }
 public string PerformedByName { get; set; }
        public DateTime ActionDate { get; set; }
    }
}
