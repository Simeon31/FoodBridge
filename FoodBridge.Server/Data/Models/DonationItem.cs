using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("DonationItems")]
    public class DonationItem
    {
        [Key]
        public int DonationItemId { get; set; }

        [Required]
        public int DonationId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int QuantityReceived { get; set; }

        [Required]
        [StringLength(50)]
        public string UnitType { get; set; }

        public DateTime? ExpirationDate { get; set; }
        public DateTime? ManufactureDate { get; set; }

        [StringLength(100)]
        public string BatchNumber { get; set; }

        [StringLength(100)]
        public string StorageCondition { get; set; } // Room Temp, Refrigerated, Frozen

        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(DonationId))]
        public Donation Donation { get; set; }

        [ForeignKey(nameof(ProductId))]
        public Product Product { get; set; }

        public QualityInspection QualityInspection { get; set; }
        public DonationDisposition Disposition { get; set; }
        public ICollection<WasteRecord> WasteRecords { get; set; } = new List<WasteRecord>();
        public ICollection<InventoryItem> InventoryItems { get; set; } = new List<InventoryItem>();
    }

}
