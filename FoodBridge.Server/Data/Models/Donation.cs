using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("Donations")]
    public class Donation
    {
        [Key]
        public int DonationId { get; set; }

        [Required]
        public int DonorId { get; set; }

        [Required]
        public DateTime DonationDate { get; set; }

        [Required]
        [StringLength(50)]
        public string ReceiptNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } // Pending, Inspection, Approved, Rejected, Archived

        [Required]
        public int ReceivedBy { get; set; } // UserId

        public int? InspectedBy { get; set; } // UserId (nullable until inspected)

        public string Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key Navigation
        [ForeignKey(nameof(DonorId))]
        public Donor Donor { get; set; }

        // Navigation Properties
        public ICollection<DonationItem> DonationItems { get; set; } = new List<DonationItem>();
        public DonationReceipt DonationReceipt { get; set; }
        public ICollection<DonationAuditTrail> AuditTrail { get; set; } = new List<DonationAuditTrail>();
    }
}
