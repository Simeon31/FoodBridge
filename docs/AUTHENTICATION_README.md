# FoodBridge Authentication Setup

## Overview
FoodBridge now includes a complete authentication system using Microsoft Identity and JWT tokens for secure user management.

## Features Implemented

### Backend (ASP.NET Core 8)
- ✅ **Microsoft Identity Integration** - Full user authentication with ASP.NET Core Identity
- ✅ **JWT Token Authentication** - Secure stateless authentication
- ✅ **Entity Framework Core** - SQL Server database integration
- ✅ **User Registration & Login** - Complete authentication flow
- ✅ **Password Management** - Secure password hashing and validation
- ✅ **Profile Management** - Update user information
- ✅ **Role-Based Authorization** - Ready for role management (optional)

### Frontend (React + Vite)
- ✅ **React Context API** - Global authentication state management
- ✅ **Protected Routes** - Route guards for authenticated pages
- ✅ **Login & Registration Pages** - Professional UI components
- ✅ **Dashboard** - User profile and quick actions
- ✅ **Axios Integration** - API communication with interceptors
- ✅ **Token Management** - Automatic token refresh and storage
- ✅ **React Router** - Client-side routing

## Database Schema

The following tables are created automatically:
- `Users` - Application users with custom fields (FirstName, LastName, CreatedAt, etc.)
- `Roles` - User roles for authorization
- `UserRoles` - Many-to-many relationship between users and roles
- `UserClaims` - Additional user claims
- `UserLogins` - External login providers
- `UserTokens` - Authentication tokens
- `RoleClaims` - Role-based claims

## API Endpoints

### Authentication (`/api/auth`)
- **POST** `/register` - Register a new user
- **POST** `/login` - Login with email and password
- **GET** `/me` - Get current authenticated user info
- **POST** `/change-password` - Change user password
- **PUT** `/profile` - Update user profile
- **POST** `/logout` - Logout (clear client-side token)

### Request/Response Examples

#### Register
```json
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "Password123",
  "rememberMe": false
}
```

#### Response
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiration": "2024-01-10T12:00:00Z",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": []
  }
}
```

## Configuration

### Backend Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=FoodBridge;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyForJWTTokenGeneration32CharactersMinimum!",
    "Issuer": "FoodBridge",
    "Audience": "FoodBridgeClient"
  }
}
```

⚠️ **IMPORTANT**: Change the JWT Key in production to a strong, unique secret!

### Frontend Configuration (.env)
```env
VITE_API_URL=/api
```

## Running the Application

### 1. Start the Backend
```bash
cd FoodBridge.Server
dotnet run
```
Backend will run on: `https://localhost:7119`

### 2. Start the Frontend
```bash
cd foodbridge.client
npm install
npm run dev
```
Frontend will run on: `http://localhost:5173`

### 3. Access the Application
- Open your browser to `http://localhost:5173`
- You'll be redirected to `/login`
- Register a new account or login with existing credentials
- After authentication, you'll see the Dashboard

## Password Requirements
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- Special characters optional (can be configured)

## Security Features

1. **Password Hashing** - All passwords are hashed using ASP.NET Core Identity
2. **JWT Tokens** - Secure, stateless authentication with 7-day expiration
3. **HTTPS Enforcement** - All API calls use HTTPS in production
4. **CORS Protection** - Configured to only allow specific origins
5. **Request Validation** - Model validation on all endpoints
6. **Token Storage** - Tokens stored in localStorage with auto-cleanup on expiration

## Architecture & Best Practices

### DRY Principle
- Reusable authentication service (`AuthenticationService`)
- Centralized API client with interceptors
- Shared authentication context
- Component-based UI design

### Separation of Concerns
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and data manipulation
- **Models/DTOs**: Data transfer objects
- **Context**: React state management
- **Components**: Reusable UI elements

### Security Best Practices
- Passwords never stored in plain text
- JWT tokens with expiration
- Automatic token cleanup on logout
- Protected routes on frontend
- `[Authorize]` attributes on sensitive endpoints
- CORS configured properly

## Next Steps

### Recommended Enhancements
1. **Email Confirmation** - Enable email verification for new accounts
2. **Password Reset** - Add forgot password functionality
3. **Two-Factor Authentication** - Enhance security with 2FA
4. **Refresh Tokens** - Implement token refresh mechanism
5. **Role Management** - Add admin panel for role assignment
6. **Social Login** - Google, Microsoft, Facebook integration
7. **User Activity Logging** - Track login attempts and activities

### Adding Roles
To add a user to a role:
```csharp
await _userManager.AddToRoleAsync(user, "Admin");
```

Create roles in `Program.cs` on startup:
```csharp
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    
    if (!await roleManager.RoleExistsAsync("Admin"))
 await roleManager.CreateAsync(new IdentityRole("Admin"));
    
    if (!await roleManager.RoleExistsAsync("User"))
    await roleManager.CreateAsync(new IdentityRole("User"));
}
```

## Troubleshooting

### Issue: Database connection failed
- Verify the connection string in `appsettings.json`
- Ensure SQL Server is running
- Check server name and database name

### Issue: CORS errors
- Verify frontend URL matches CORS policy in `Program.cs`
- Check that both frontend and backend are running

### Issue: JWT token invalid
- Ensure JWT Key, Issuer, and Audience match in both configuration and code
- Check token hasn't expired
- Verify token is being sent in Authorization header

### Issue: 401 Unauthorized
- Check if token exists in localStorage
- Verify token hasn't expired
- Ensure `[Authorize]` attribute is properly configured

## File Structure

```
FoodBridge.Server/
├── Controllers/
│   └── AuthController.cs          # Authentication endpoints
├── Data/
│   ├── ApplicationDbContext.cs    # EF Core DbContext
│   └── ApplicationUser.cs # Extended IdentityUser
├── Models/
│   └── AuthenticationModels.cs    # DTOs for auth requests/responses
├── Services/
│   └── AuthenticationService.cs   # Authentication business logic
├── Migrations/    # EF Core migrations
├── Program.cs    # Application startup & configuration
└── appsettings.json     # Configuration settings

foodbridge.client/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx    # Route guard component
│   ├── contexts/
│   │   └── AuthContext.jsx       # Authentication state management
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration page
│   │   ├── Dashboard.jsx   # Protected dashboard
│   │   ├── AuthPages.css         # Auth pages styling
│   │   └── Dashboard.css         # Dashboard styling
│   ├── services/
│   │   └── authService.js        # API service for authentication
│   ├── App.jsx             # Main app with routing
│   └── main.jsx     # App entry point
├── .env        # Environment variables
└── vite.config.js    # Vite configuration with proxy

```

## Support
For issues or questions about authentication, please refer to:
- [ASP.NET Core Identity Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity)
- [JWT Authentication in .NET](https://docs.microsoft.com/en-us/aspnet/core/security/authentication/jwt-authn)
- [React Context API](https://react.dev/reference/react/useContext)

---