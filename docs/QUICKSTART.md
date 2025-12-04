# FoodBridge Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Start the Backend
```bash
cd FoodBridge.Server
dotnet run
```
Backend running at `https://localhost:7119`

### Step 2: Start the Frontend
```bash
cd foodbridge.client
npm run dev
```
Frontend running at `http://localhost:5173`

### Step 3: Login or Register
Open `http://localhost:5173` in your browser.

---

## Test Accounts (Development Only)

The following test accounts are automatically created in development mode:

### Admin Account
- **Email**: `admin@foodbridge.com`
- **Password**: `Admin@123`
- **Role**: Admin

### User Account
- **Email**: `user@foodbridge.com`
- **Password**: `User@123`
- **Role**: User

---

## Available Routes

- `/login` - User login
- `/register` - New user registration
- `/dashboard` - Protected user dashboard (requires authentication)

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Change password (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)

---

## Configuration

### Database Connection
Edit `FoodBridge.Server/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=FoodBridge;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### JWT Settings (CHANGE IN PRODUCTION!)
```json
{
  "Jwt": {
    "Key": "YourSuperSecretKeyForJWTTokenGeneration32CharactersMinimum!",
    "Issuer": "FoodBridge",
    "Audience": "FoodBridgeClient"
  }
}
```

---

## Documentation

For detailed information, see:
- **AUTHENTICATION_README.md** - Complete authentication documentation
- **API Documentation** - Available at `https://localhost:7119/swagger` when running

---

## Troubleshooting

### Backend won't start
- Check if SQL Server is running
- Verify connection string in appsettings.json
- Run: `dotnet ef database update`

### Frontend won't start
- Run: `npm install` in foodbridge.client folder
- Check if ports 5173 is available

### Login not working
- Check browser console for errors
- Verify backend is running
- Clear browser localStorage and cookies

### CORS errors
- Verify both frontend and backend URLs in Program.cs
- Check vite.config.js proxy settings

---

## Project Structure

```
FoodBridge/
├── FoodBridge.Server/  # .NET 8 Backend
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Services/
│   └── Program.cs
├── foodbridge.client/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── AUTHENTICATION_README.md    # Detailed docs
```

---

## Support

For issues or questions:
1. Check AUTHENTICATION_README.md
2. Review error logs in console
3. Check Swagger API documentation

---