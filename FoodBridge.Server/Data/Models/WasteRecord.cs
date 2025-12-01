using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("WasteRecords")]
    public class WasteRecord
    {
        [Key]
        public int WasteRecordId { get; set; }

        public int? DonationItemId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [StringLength(50)]
        public string UnitType { get; set; }

        [Required]
        [StringLength(100)]
        public string WasteReason { get; set; }

        [StringLength(100)]
        public string DisposalMethod { get; set; }

        public DateTime? DisposedAt { get; set; }
        public int? DisposedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Key Navigation
        [ForeignKey(nameof(DonationItemId))]
        public DonationItem DonationItem { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; }
    }
}

