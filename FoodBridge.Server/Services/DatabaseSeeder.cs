using FoodBridge.Server.Data;
using Microsoft.AspNetCore.Identity;

namespace FoodBridge.Server.Services
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            // Create Roles
            string[] roles = { "Admin", "User", "Volunteer", "Donor", "Staff", "Coordinator" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Create Default Admin User
            var adminEmail = "admin@foodbridge.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "User",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin@123");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Create Default Test User
            var testEmail = "user@foodbridge.com";
            var testUser = await userManager.FindByEmailAsync(testEmail);

            if (testUser == null)
            {
                testUser = new ApplicationUser
                {
                    UserName = testEmail,
                    Email = testEmail,
                    FirstName = "Test",
                    LastName = "User",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(testUser, "User@123");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(testUser, "User");
                }
            }

            // Create Default Staff User
            var staffEmail = "staff@foodbridge.com";
            var staffUser = await userManager.FindByEmailAsync(staffEmail);

            if (staffUser == null)
            {
                staffUser = new ApplicationUser
                {
                    UserName = staffEmail,
                    Email = staffEmail,
                    FirstName = "Staff",
                    LastName = "Member",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(staffUser, "Staff@123");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(staffUser, "Staff");
                }
            }

            // Create Default Coordinator User
            var coordinatorEmail = "coordinator@foodbridge.com";
            var coordinatorUser = await userManager.FindByEmailAsync(coordinatorEmail);

            if (coordinatorUser == null)
            {
                coordinatorUser = new ApplicationUser
                {
                    UserName = coordinatorEmail,
                    Email = coordinatorEmail,
                    FirstName = "Coordinator",
                    LastName = "User",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(coordinatorUser, "Coordinator@123");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(coordinatorUser, "Coordinator");
                }
            }

            // Create Default Volunteer User
            var volunteerEmail = "volunteer@foodbridge.com";
            var volunteerUser = await userManager.FindByEmailAsync(volunteerEmail);

            if (volunteerUser == null)
            {
                volunteerUser = new ApplicationUser
                {
                    UserName = volunteerEmail,
                    Email = volunteerEmail,
                    FirstName = "Volunteer",
                    LastName = "User",
                    EmailConfirmed = true,
                    IsActive = true
                };

                var result = await userManager.CreateAsync(volunteerUser, "Volunteer@123");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(volunteerUser, "Volunteer");
                }
            }
        }
    }
}
