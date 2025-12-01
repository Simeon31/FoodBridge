using System.ComponentModel.DataAnnotations;

namespace FoodBridge.Server.DTOs.Donations
{
    /// <summary>
    /// DTO for creating a new donor
    /// </summary>
    public class CreateDonorDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
    public string DonorType { get; set; } // Individual, Business, Organization

      [StringLength(255)]
      [EmailAddress]
        public string Email { get; set; }

        [StringLength(20)]
        [Phone]
 public string PhoneNumber { get; set; }

 [StringLength(500)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(10)]
        public string PostalCode { get; set; }
    }

    /// <summary>
    /// DTO for updating an existing donor
    /// </summary>
  public class UpdateDonorDto
    {
        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
 public string DonorType { get; set; }

        [StringLength(255)]
        [EmailAddress]
     public string Email { get; set; }

        [StringLength(20)]
[Phone]
        public string PhoneNumber { get; set; }

        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        [StringLength(10)]
 public string PostalCode { get; set; }

  public bool IsActive { get; set; }
  }

    /// <summary>
    /// DTO for returning donor details
/// </summary>
    public class DonorDto
    {
   public int DonorId { get; set; }
        public string Name { get; set; }
        public string DonorType { get; set; }
    public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
   public string City { get; set; }
  public string PostalCode { get; set; }
      public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int TotalDonations { get; set; }
public DateTime? LastDonationDate { get; set; }
    }

    /// <summary>
    /// DTO for donor list view (summary)
    /// </summary>
    public class DonorSummaryDto
  {
        public int DonorId { get; set; }
   public string Name { get; set; }
        public string DonorType { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
        public bool IsActive { get; set; }
        public int TotalDonations { get; set; }
        public DateTime? LastDonationDate { get; set; }
    }
}
