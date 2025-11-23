# Login 500 Error - Fixed! ?

## Problem
The login endpoint was returning **500 Internal Server Error** due to a missing JWT Key in `appsettings.json`.

## Root Cause
The `Jwt:Key` configuration was empty:
```json
"Jwt": {
  "Key": "",  // ? EMPTY - Caused 500 error
  "Issuer": "FoodBridge",
  "Audience": "FoodBridgeClient"
}
```

## Solution Applied
Updated `appsettings.json` with a secure JWT key:
```json
"Jwt": {
  "Key": "YourSuperSecretKeyForFoodBridgeApplicationMinimum32CharactersLong!@#$%",
  "Issuer": "FoodBridge",
  "Audience": "FoodBridgeClient"
}
```

## Test Credentials
- **Email:** `admin@foodbridge.com`
- **Password:** `Admin@123`

OR

- **Email:** `user@foodbridge.com`
- **Password:** `User@123`

## How to Test
1. **Stop the backend server** if it's running (Ctrl+C in Visual Studio or stop debugging)
2. **Restart the backend** - Press F5 or run the FoodBridge.Server project
3. **Ensure the frontend is running:**
   ```powershell
   cd foodbridge.client
   npm run dev
   ```
4. **Try logging in** with the credentials above

## What Was Fixed
? Added secure JWT Key to configuration  
? Database migrations are up to date  
? Database seeder will create admin and test users on startup  
? Build successful  

## If Login Still Fails

### Check Backend Console Output
Look for any errors in the Visual Studio Output window or console where the backend is running.

### Verify Backend is Running
The backend should be running on: `https://localhost:7108` or similar

### Verify Frontend API Configuration
Check `foodbridge.client/vite.config.js` has correct proxy settings:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://localhost:7108',  // Your backend URL
      changeOrigin: true,
      secure: false
    }
  }
}
```

### Database Connection
If you see database connection errors:
1. Verify SQL Server is running
2. Check connection string in `appsettings.json`:
   ```
   Server=SIMEON_M\\MSSQLSERVER01;Database=FoodBridge;Trusted_Connection=True;TrustServerCertificate=True
   ```
3. Run migrations again:
   ```powershell
   cd FoodBridge.Server
   dotnet ef database update
   ```

## Security Note ??
In production, the JWT Key should be:
- Stored in environment variables or Azure Key Vault
- At least 32 characters long
- Never committed to source control
- Unique and randomly generated

## Next Steps
After successful login, you should:
1. See a JWT token stored in localStorage
2. Be redirected to the dashboard
3. Have access to authenticated endpoints
