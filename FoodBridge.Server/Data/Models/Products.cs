using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("Products")]
    public class Product
    {
        [Key]
        public int ProductId { get; set; }

        [Required]
        [StringLength(50)]
        public string ProductCode { get; set; }

        [Required]
        [StringLength(255)]
        public string ProductName { get; set; }

        [StringLength(100)]
        public string Category { get; set; }

        [StringLength(50)]
        public string DefaultUnitType { get; set; }

        public bool IsPerishable { get; set; }

        [StringLength(100)]
        public string OptimalStorageCondition { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<DonationItem> DonationItems { get; set; } = new List<DonationItem>();
        public ICollection<InventoryItem> InventoryItems { get; set; } = new List<InventoryItem>();
    }
}
