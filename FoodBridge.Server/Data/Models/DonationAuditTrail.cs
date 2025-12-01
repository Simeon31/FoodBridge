using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("DonationAuditTrail")]
    public class DonationAuditTrail
    {
        [Key]
        public int AuditId { get; set; }

        [Required]
        public int DonationId { get; set; }

        [Required]
        [StringLength(100)]
        public string Action { get; set; }

        [Required]
        public int ActionBy { get; set; }

        public DateTime ActionDate { get; set; } = DateTime.UtcNow;

        public string Details { get; set; }

        [ForeignKey(nameof(DonationId))]
        public Donation Donation { get; set; }
    }

}
