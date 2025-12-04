# FoodBridge Authentication Troubleshooting Guide

## Changes Made to Fix Login/Registration Issues

### 1. **Frontend Configuration**
- Updated Vite proxy to use IPv4 address (`127.0.0.1:7066`) instead of `localhost`
- Enhanced AuthContext with comprehensive logging and error handling
- Improved authService with request/response interceptors and detailed logging
- Added authentication state management improvements
- Enhanced Login and Register pages with better error handling

### 2. **Key Issues Fixed**

#### **Network Connection Issues**
- **Problem**: ECONNREFUSED errors due to proxy misconfiguration
- **Solution**: Updated proxy target from `https://localhost:7119` to `https://127.0.0.1:7066`

#### **State Management Issues**
- **Problem**: User state not properly persisting or updating
- **Solution**: 
  - Added comprehensive logging throughout the auth flow
  - Improved error handling in AuthContext
  - Better token and user storage management
  - Added network error handling (keeps user logged in on network errors)

#### **Silent Failures**
- **Problem**: Errors not being displayed to users
- **Solution**: 
  - Enhanced error messages in all components
  - Added console logging for debugging
  - Improved error propagation from services to UI

## How to Test

### Step 1: Start the Backend
```bash
cd FoodBridge.Server
dotnet run --launch-profile https
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
  Now listening on: https://localhost:7066
      Now listening on: http://localhost:5231
```

### Step 2: Start the Frontend
```bash
cd foodbridge.client
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  Local:   http://localhost:5173/
```

### Step 3: Test Login with Seeded Data

Open browser to `http://localhost:5173/login`

**Test Credentials** (from DatabaseSeeder.cs):
```
Email: admin@foodbridge.com
Password: Admin@123
```

### Step 4: Check Browser Console

You should see detailed logs like:
```
[AuthService] API Base URL: /api
[AuthContext] Initializing auth...
[AuthService] Logging in: { email: 'admin@foodbridge.com', rememberMe: false }
[AuthService] Request: POST /api/auth/login { hasToken: false, data: {...} }
[AuthService] Response: /api/auth/login { status: 200, data: {...} }
[AuthContext] Login successful, user: { id: '...', email: '...', ... }
```

## Debugging Steps

### 1. Check if Backend is Running
```bash
# Windows
netstat -ano | findstr :7066

# Should show something like:
# TCP    0.0.0.0:7066    0.0.0.0:0   LISTENING     12345 (Your port)
```

### 2. Check Database Connection
```bash
cd FoodBridge.Server
dotnet ef database update
```

### 3. Test Backend API Directly
```bash
# Test registration
curl -X POST https://localhost:7066/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123","confirmPassword":"Test@123","firstName":"Test","lastName":"User"}' \
  -k

# Test login
curl -X POST https://localhost:7066/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@foodbridge.com","password":"Admin@123"}' \
  -k
```

### 4. Check Browser Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Try to login
4. Look for the `/api/auth/login` request
5. Check:
   - **Status Code**: Should be 200
   - **Response**: Should contain `success: true`, `token`, and `user` object
   - **Request Headers**: Should have correct `Content-Type`

### 5. Check Local Storage
1. Open Developer Tools (F12)
2. Go to Application tab
3. Check Local Storage
4. After successful login, you should see:
   - `authToken`: JWT token string
   - `user`: JSON object with user info

## Common Issues and Solutions

### Issue 1: "Cannot connect to server"
**Symptoms**: ECONNREFUSED, ERR_CONNECTION_REFUSED
**Solutions**:
- Ensure backend is running on port 7066
- Check Windows Firewall isn't blocking the port
- Verify `vite.config.js` has correct proxy configuration

### Issue 2: "Invalid email or password"
**Symptoms**: 401 Unauthorized, login fails with valid credentials
**Solutions**:
- Check database has been seeded (run DatabaseSeeder)
- Verify password meets requirements (uppercase, lowercase, digit, min 6 chars)
- Check SQL Server is running
- Review backend logs for authentication errors

### Issue 3: "User not authenticated after login"
**Symptoms**: Redirects back to login, token not persisting
**Solutions**:
- Check browser console for localStorage errors
- Verify JWT configuration in `appsettings.json`
- Clear browser cache and localStorage
- Check token expiration (7 days by default)

### Issue 4: CORS Errors
**Symptoms**: "blocked by CORS policy"
**Solutions**:
- Verify CORS configuration in `Program.cs` includes `http://localhost:5173`
- Check `app.UseCors("AllowReactApp")` is before `app.UseAuthorization()`
- Restart backend server after CORS changes

### Issue 5: "Registration failed" with valid data
**Symptoms**: Registration form submits but fails
**Solutions**:
- Check password meets all requirements
- Verify email is unique (not already registered)
- Check firstName and lastName are provided
- Review backend validation logs

## Checklist for Fresh Setup

- [ ] SQL Server is running
- [ ] Database "FoodBridge" exists
- [ ] Migrations have been applied (`dotnet ef database update`)
- [ ] Database is seeded (admin@foodbridge.com exists)
- [ ] Backend is running on port 7066
- [ ] Frontend is running on port 5173
- [ ] Vite proxy is configured for `127.0.0.1:7066`
- [ ] Browser has no cached auth data (clear localStorage if needed)

## Success Indicators

Backend starts without errors
Frontend connects successfully (no ECONNREFUSED)
Login page displays without errors
Can login with admin@foodbridge.com / Admin@123
Dashboard displays user information
Logout works and redirects to login
Can register new users
Browser console shows detailed logs
Network tab shows 200 OK responses

## Additional Help

If issues persist after following this guide:

1. **Check all console logs** - Both frontend (browser) and backend (.NET)
2. **Verify all configuration files** - appsettings.json, vite.config.js, .env
3. **Test API independently** - Use Swagger UI at `https://localhost:7066/swagger`
4. **Check database** - Verify user exists with correct password hash
5. **Review error messages** - Enhanced logging now provides detailed error information

## Test Accounts (from DatabaseSeeder)

| Email | Password | Role |
|-------|----------|------|
| admin@foodbridge.com | Admin@123 | Admin |
| donor@foodbridge.com | Donor@123 | Donor |
| recipient@foodbridge.com | Recipient@123 | Recipient |
| volunteer@foodbridge.com | Volunteer@123 | Volunteer |
