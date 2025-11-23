# ?? Login 401 Error - Troubleshooting Guide

## ?? Current Issue
Getting **401 Unauthorized** when trying to login with `admin@foodbridge.com` / `Admin@123`

## ? What We've Fixed
1. ? Improved error handling in `authService.js`
2. ? Better error message display in `AuthContext.jsx`
3. ? Backend is running on port 7066

## ?? **SOLUTION: Restart Backend to Seed Database**

The database might not have the admin user. Follow these steps:

### **Step 1: Stop the Backend**
```sh
# Press Ctrl+C in the terminal running the backend
```

### **Step 2: Delete the Database (Fresh Start)**
```sh
cd FoodBridge.Server

# Delete the database
dotnet ef database drop --force

# Create fresh database with migrations
dotnet ef database update
```

### **Step 3: Start Backend** (This will seed the database)
```sh
dotnet run --launch-profile https
```

**Look for this in the console:**
```
info: Microsoft.Hosting.Lifetime[14]
Now listening on: https://localhost:7066
```

**The seeder should run automatically** because in `Program.cs` we have:
```csharp
if (app.Environment.IsDevelopment())
{
    await DatabaseSeeder.SeedAsync(services);
}
```

### **Step 4: Test Login**

Now try logging in again with:
- **Email**: `admin@foodbridge.com`
- **Password**: `Admin@123`

## ?? Alternative: Check If User Exists

If you don't want to drop the database, you can check if the user exists:

### **Option A: Use Swagger**
1. Go to `https://localhost:7066/swagger`
2. Try the `/api/auth/register` endpoint with new credentials
3. Then login with those credentials

### **Option B: Register a New User**
1. Go to `http://localhost:5173/register`
2. Create a new account
3. Login with that account

## ?? Common Causes of 401 Error

| Cause | Solution |
|-------|----------|
| User doesn't exist in database | Drop and recreate database |
| Wrong password | Check password: `Admin@123` (case-sensitive!) |
| Database not seeded | Restart backend in Development mode |
| Backend not running | Check `netstat -ano \| findstr :7066` |
| Wrong email | Check email: `admin@foodbridge.com` |

## ?? Quick Test Script

Run this to verify:

```sh
# 1. Check backend is running
netstat -ano | findstr :7066

# 2. Stop backend (Ctrl+C)

# 3. Drop database
cd FoodBridge.Server
dotnet ef database drop --force

# 4. Recreate database
dotnet ef database update

# 5. Start backend (seeds automatically)
dotnet run --launch-profile https

# 6. Test login at http://localhost:5173/login
```

## ? Expected Result

After restarting the backend, you should see better error messages like:
- "Invalid email or password" (if credentials are wrong)
- "Your account has been deactivated" (if account is inactive)
- Successful login with token (if credentials are correct)

## ?? Still Not Working?

1. **Check backend console logs** - Look for errors during seeding
2. **Check browser Network tab** - Look at the response body of the 401 error
3. **Try registering** a new user first
4. **Check `appsettings.json`** - Verify database connection string

## ?? Next Steps

1. Restart backend as described above
2. Try logging in
3. Check browser console for the improved error messages
4. If still failing, check the backend console logs

---

**Last Updated**: Now
**Status**: Awaiting backend restart and database reseed
