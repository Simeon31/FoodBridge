using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("QualityInspections")]
    public class QualityInspection
    {
        [Key]
        public int InspectionId { get; set; }

        [Required]
        public int DonationItemId { get; set; }

        [Required]
        public DateTime InspectionDate { get; set; }

        [Required]
        public int InspectedBy { get; set; } 

        [Required]
        [StringLength(50)]
        public string Status { get; set; } // Passed, Failed, PartiallyFailed

        // Physical Condition Checks
        [StringLength(50)]
        public string PackagingIntegrity { get; set; }

        [StringLength(50)]
        public string ProductAppearance { get; set; } 

        public decimal? TemperatureCheck { get; set; } 

        // Compliance Checks
        public bool HasExpiredItems { get; set; }
        public bool HasAllergenInfo { get; set; }
        public bool HasNutritionLabel { get; set; }
        public bool IsFromApprovedSource { get; set; }

        public string? DecisionReason { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(DonationItemId))]
        public DonationItem DonationItem { get; set; }
    }
}
