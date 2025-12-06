using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("InventoryItems")]
    public class InventoryItem
    {
        [Key]
        public int InventoryItemId { get; set; }

        [Required]
        public int SourceDonationItemId { get; set; }

        public int? StorageLocationId { get; set; }

        [Required]
        public int QuantityOnHand { get; set; }

        public DateTime? ExpirationDate { get; set; }

        [Required]
        public DateTime DateReceived { get; set; }

        public bool IsBlocked { get; set; }
        public string BlockReason { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(SourceDonationItemId))]
        public DonationItem SourceDonationItem { get; set; }

        [NotMapped]
        public Product Product => SourceDonationItem?.Product;

        [NotMapped]
        public int ProductId => SourceDonationItem?.ProductId ?? 0;

    }
}
