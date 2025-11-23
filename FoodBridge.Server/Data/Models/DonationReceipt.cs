using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("DonationReceipts")]
    public class DonationReceipt
    {
        [Key]
        public int ReceiptId { get; set; }

        [Required]
        public int DonationId { get; set; }

        [Required]
        [StringLength(50)]
        public string ReceiptNumber { get; set; }

        [Required]
        public int TotalItemsReceived { get; set; }

        [Required]
        public int TotalItemsApproved { get; set; }

        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public int IssuedBy { get; set; }

        public bool SentToDonor { get; set; }
        public DateTime? SentAt { get; set; }

        [StringLength(500)]
        public string PDFPath { get; set; }

        [ForeignKey(nameof(DonationId))]
        public Donation Donation { get; set; }
    }

}
