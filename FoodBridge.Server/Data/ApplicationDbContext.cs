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
        public DbSet<DonationDisposition> DonationDispositions { get; set; }
        public DbSet<DonationItem> DonationItems { get; set; }
        public DbSet<DonationReceipt> DonationReceipts { get; set; }
        public DbSet<Donor> Donors { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<QualityInspection> QualityInspections { get; set; }
        public DbSet<WasteRecord> WasteRecords { get; set; }

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
        }
    }
}
