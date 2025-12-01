using FoodBridge.Server.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FoodBridge.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
                : base(options)
        {
        }

        public DbSet<Donation> Donations { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<DonationAuditTrail> DonationAuditTrails { get; set; }
        public DbSet<DonationItem> DonationItems { get; set; }
        public DbSet<DonationReceipt> DonationReceipts { get; set; }
        public DbSet<Donor> Donors { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<QualityInspection> QualityInspections { get; set; }
        public DbSet<WasteRecord> WasteRecords { get; set; }
        public DbSet<VolunteerShift> VolunteerShifts { get; set; }
        public DbSet<VolunteerAssignment> VolunteerAssignments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Customize Identity table names if needed
            builder.Entity<ApplicationUser>(entity =>
                  {
                      entity.ToTable("Users");
                  });

            builder.Entity<IdentityRole>(entity =>
                 {
                     entity.ToTable("Roles");
                 });

            builder.Entity<IdentityUserRole<string>>(entity =>
               {
                   entity.ToTable("UserRoles");
               });

            builder.Entity<IdentityUserClaim<string>>(entity =>
                {
                    entity.ToTable("UserClaims");
                });

            builder.Entity<IdentityUserLogin<string>>(entity =>
               {
                   entity.ToTable("UserLogins");
               });

            builder.Entity<IdentityRoleClaim<string>>(entity =>
                {
                    entity.ToTable("RoleClaims");
                });

            builder.Entity<IdentityUserToken<string>>(entity =>
                {
                    entity.ToTable("UserTokens");
                });

            // Configure VolunteerShift relationships to prevent cascade conflicts
            builder.Entity<VolunteerShift>(entity =>
   {
       entity.HasOne(vs => vs.Creator)
         .WithMany()
           .HasForeignKey(vs => vs.CreatedBy)
    .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete
   });

            // Configure VolunteerAssignment relationships to prevent cascade conflicts
            builder.Entity<VolunteerAssignment>(entity =>
              {
                  entity.HasOne(va => va.Shift)
      .WithMany(vs => vs.Assignments)
      .HasForeignKey(va => va.ShiftId)
     .OnDelete(DeleteBehavior.Cascade); // Cascade when shift is deleted

                  entity.HasOne(va => va.Volunteer)
           .WithMany()
     .HasForeignKey(va => va.VolunteerId)
    .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete
              });
        }
    }
}
