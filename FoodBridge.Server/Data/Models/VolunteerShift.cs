using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodBridge.Server.Data.Models
{
    [Table("VolunteerShifts")]
    public class VolunteerShift
    {
        [Key]
        public int ShiftId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [Required]
        [StringLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        public int RequiredVolunteers { get; set; }

        public int AssignedVolunteers { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Open"; // Open, Filled, InProgress, Completed, Cancelled

        [Required]
        public string CreatedBy { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey("CreatedBy")]
        public ApplicationUser? Creator { get; set; }

        public ICollection<VolunteerAssignment> Assignments { get; set; } = new List<VolunteerAssignment>();
    }

    [Table("VolunteerAssignments")]
    public class VolunteerAssignment
    {
        [Key]
        public int AssignmentId { get; set; }

        [Required]
        public int ShiftId { get; set; }

        [Required]
        public string VolunteerId { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Assigned"; // Assigned, Confirmed, Completed, NoShow, Cancelled

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CheckInTime { get; set; }

        public DateTime? CheckOutTime { get; set; }

        public string? Notes { get; set; }

        [ForeignKey("ShiftId")]
        public VolunteerShift Shift { get; set; } = null!;

        [ForeignKey("VolunteerId")]
        public ApplicationUser Volunteer { get; set; } = null!;
    }
}
