using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Volunteers
{
    /// <summary>
    /// DTO for volunteer shift details
    /// </summary>
    public class VolunteerShiftDto
    {
        public int ShiftId { get; set; }
      public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
    public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
 public string Location { get; set; } = string.Empty;
        public int RequiredVolunteers { get; set; }
        public int AssignedVolunteers { get; set; }
        public string Status { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
  public string CreatedByName { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; }
      public DateTime? UpdatedAt { get; set; }
   public List<VolunteerAssignmentDto> Assignments { get; set; } = new List<VolunteerAssignmentDto>();
    }

    /// <summary>
    /// DTO for creating a volunteer shift
    /// </summary>
    public class CreateVolunteerShiftDto
 {
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
        [Range(1, 100)]
        public int RequiredVolunteers { get; set; }
    }

  /// <summary>
/// DTO for updating a volunteer shift
    /// </summary>
    public class UpdateVolunteerShiftDto
    {
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
        [Range(1, 100)]
        public int RequiredVolunteers { get; set; }

        [Required]
        [StringLength(50)]
 public string Status { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for volunteer assignment details
    /// </summary>
    public class VolunteerAssignmentDto
    {
 public int AssignmentId { get; set; }
     public int ShiftId { get; set; }
        public string VolunteerId { get; set; } = string.Empty;
 public string VolunteerName { get; set; } = string.Empty;
        public string VolunteerEmail { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime AssignedAt { get; set; }
     public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public string? Notes { get; set; }
    }

    /// <summary>
    /// DTO for assigning volunteer to shift
    /// </summary>
    public class AssignVolunteerDto
    {
[Required]
        public string VolunteerId { get; set; } = string.Empty;

        public string? Notes { get; set; }
    }

    /// <summary>
    /// DTO for volunteer shift filter
    /// </summary>
    public class VolunteerShiftFilterDto
    {
  public string? SearchTerm { get; set; }
        public string? Status { get; set; }
     public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Location { get; set; }
  public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    }
}
