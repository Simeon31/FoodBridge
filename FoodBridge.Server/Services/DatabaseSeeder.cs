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
            string[] roles = { "Admin", "User", "Volunteer", "Donor" };

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
        }
    }
}
