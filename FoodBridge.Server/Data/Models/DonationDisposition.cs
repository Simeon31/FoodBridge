using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("DonationDispositions")]
    public class DonationDisposition
    {
        [Key]
        public int DispositionId { get; set; }

        [Required]
        public int DonationItemId { get; set; }

        [Required]
        [StringLength(50)]
        public string DispositionType { get; set; } // Approved_ToInventory, Rejected_ToWaste

        public string Reason { get; set; }

        public int? QuantityApproved { get; set; }
        public int? QuantityRejected { get; set; }

        public DateTime? ApprovedAt { get; set; }
        public int? ApprovedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(DonationItemId))]
        public DonationItem DonationItem { get; set; }
    }
}
