using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Donations
{
    /// <summary>
    /// DTO for creating a quality inspection
    /// </summary>
    public class CreateQualityInspectionDto
    {
        [Required]
        public int DonationItemId { get; set; }

        [Required]
  public int InspectedBy { get; set; }

        [Required]
 public DateTime InspectionDate { get; set; }

        [Required]
        [StringLength(50)]
        public string InspectionResult { get; set; } // Approved, Rejected, Conditional

        [Range(1, 5)]
   public int? QualityRating { get; set; }

        public string InspectionNotes { get; set; }

        public string RejectionReason { get; set; }
    }

    /// <summary>
    /// DTO for updating a quality inspection
 /// </summary>
    public class UpdateQualityInspectionDto
    {
        [Required]
   [StringLength(50)]
     public string InspectionResult { get; set; }

        [Range(1, 5)]
        public int? QualityRating { get; set; }

    public string InspectionNotes { get; set; }

 public string RejectionReason { get; set; }
    }

    /// <summary>
    /// DTO for returning quality inspection details
    /// </summary>
    public class QualityInspectionDto
 {
        public int InspectionId { get; set; }
        public int DonationItemId { get; set; }
    public int InspectedBy { get; set; }
        public string InspectedByName { get; set; }
        public DateTime InspectionDate { get; set; }
        public string InspectionResult { get; set; }
        public int? QualityRating { get; set; }
        public string InspectionNotes { get; set; }
     public string RejectionReason { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
