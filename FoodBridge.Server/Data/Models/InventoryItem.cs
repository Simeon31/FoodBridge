using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("InventoryItems")]
    public class InventoryItem
    {
        [Key]
        public int InventoryItemId { get; set; }

        /// <summary>
        /// Required: Every inventory item must come from a donation
        /// Product information is accessed through SourceDonationItem.Product
        /// </summary>
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

        // Navigation Properties
        [ForeignKey(nameof(SourceDonationItemId))]
        public DonationItem SourceDonationItem { get; set; }

        /// <summary>
        /// Product is accessed via: SourceDonationItem.Product
        /// No direct ProductId foreign key to enforce normalization
        /// </summary>
        [NotMapped]
        public Product Product => SourceDonationItem?.Product;

        [NotMapped]
        public int ProductId => SourceDonationItem?.ProductId ?? 0;

        // Note: StorageLocation navigation will be added when StorageLocation entity is created
    }
}
