# FoodBridge - Quick Start Guide ??

## Prerequisites
- ? Node.js 20.16+ installed
- ? .NET 8 SDK installed
- ? SQL Server running
- ? Visual Studio or VS Code

## Getting Started in 3 Steps

### Step 1: Start the Backend (API)

**Option A: Using Visual Studio**
1. Open `FoodBridge.sln` in Visual Studio
2. Press `F5` or click "Start Debugging"
3. Backend will run on: `https://localhost:7066`

**Option B: Using Command Line**
```bash
cd FoodBridge.Server
dotnet run
```

**Expected Output:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:7066
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
```

### Step 2: Start the Frontend (React)

Open a new terminal and run:

```bash
cd foodbridge.client
npm install  # First time only
npm run dev
```

**Expected Output:**
```
  VITE v7.1.12  ready in 245 ms

  ?  Local:   http://localhost:5173/
  ?  Network: use --host to expose
  ?  press h + enter to show help
```

### Step 3: Open Your Browser

Navigate to: **http://localhost:5173**

## Login

You'll see the modern login page. Use these test credentials:

**Admin Account:**
- Email: `admin@foodbridge.com`
- Password: `Admin@123`

**User Account:**
- Email: `user@foodbridge.com`
- Password: `User@123`

## What You'll See

After logging in, you'll be redirected to the Dashboard with:

1. **Top Navigation Bar** (Header)
   - Search bar
   - Notifications icon
   - User profile
   - Logout button

2. **Left Sidebar** (Collapsible)
   - Dashboard (active)
   - Donations
   - Requests
   - Organizations
   - Profile
   
3. **Main Content Area** (Dashboard)
   - 4 statistics cards:
     - Total Donations: 1,234 (+12%)
     - Active Requests: 87 (+5%)
     - Organizations: 45 (+2%)
     - Completed: 892 (+18%)
   - Recent Activity list

## Testing the Interface

### Desktop Features
1. **Sidebar Collapse/Expand**
   - Click the arrow button in the sidebar to collapse/expand
   - Hover over collapsed sidebar to temporarily expand

2. **Navigation**
   - Click menu items in the sidebar to navigate
   - Active page is highlighted in blue

3. **User Menu**
   - Click logout button to sign out
   - Click notification bell (demo)

### Mobile Features
1. **Responsive Layout**
   - Resize browser to mobile width
   - Sidebar becomes a drawer (hidden by default)

2. **Mobile Menu**
   - Click hamburger icon (?) to open sidebar
   - Click backdrop (dark overlay) to close
   - Click menu item to navigate and close drawer

## Troubleshooting

### Backend Issues

**Problem:** Backend won't start
```bash
# Check if SQL Server is running
# Verify connection string in appsettings.json
cd FoodBridge.Server
dotnet ef database update
```

**Problem:** 500 Error on login
- Verify JWT configuration in `appsettings.json`:
```json
"Jwt": {
  "Key": "YourSuperSecretKeyForFoodBridgeApplicationMinimum32CharactersLong!@#$%",
  "Issuer": "FoodBridge",
  "Audience": "FoodBridgeClient"
}
```

**Problem:** Database connection error
- Check SQL Server is running
- Verify connection string in `appsettings.json`
- Run migrations: `dotnet ef database update`

### Frontend Issues

**Problem:** npm install fails
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

**Problem:** Frontend won't connect to backend
- Check `vite.config.js` proxy settings:
```javascript
proxy: {
  '/api': {
    target: 'https://127.0.0.1:7066',
    changeOrigin: true,
    secure: false,
  }
}
```
- Verify backend is running on port 7066
- Check browser console for CORS errors

**Problem:** Login fails with 401
- Verify test credentials
- Check backend console for authentication errors
- Ensure database has seed data

**Problem:** Styles not loading
```bash
# Rebuild Tailwind CSS
cd foodbridge.client
npm run build
npm run dev
```

### Common Errors

**CORS Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Backend CORS is configured, but verify `Program.cs` has CORS middleware before authentication.

**Network Error:**
```
ERR_CONNECTION_REFUSED
```
**Solution:** Backend is not running. Start backend first.

**401 Unauthorized:**
```
Login failed: Unauthorized
```
**Solution:** Check credentials or verify JWT configuration.

## Development Workflow

### Making Changes

**Frontend Changes:**
1. Edit files in `foodbridge.client/src/`
2. Vite hot-reloads automatically
3. Check browser for changes

**Backend Changes:**
1. Edit files in `FoodBridge.Server/`
2. Stop and restart debugger (or use hot reload in VS)
3. Check API response in browser network tab

### Adding New Pages

1. **Create page component:**
```jsx
// foodbridge.client/src/pages/NewPage.jsx
const NewPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold">New Page</h1>
    </div>
  );
};
export default NewPage;
```

2. **Add route in App.jsx:**
```jsx
import NewPage from './pages/NewPage';

// Inside AppLayout routes:
<Route path="/newpage" element={<NewPage />} />
```

3. **Add sidebar menu item in AppSidebar.jsx:**
```jsx
const menuItems = [
  // ...existing items
  {
    title: 'New Page',
    path: '/newpage',
    icon: (/* SVG icon */),
  },
];
```

## Project Structure

```
FoodBridge/
??? FoodBridge.Server/   # .NET 8 Backend
?   ??? Controllers/          # API endpoints
?   ??? DTOs/         # Data transfer objects
?   ??? Services/               # Business logic
?   ??? appsettings.json   # Configuration
?
??? foodbridge.client/    # React Frontend
    ??? src/
    ?   ??? layout/    # Layout components
    ?   ??? pages/      # Page components
    ?   ??? contexts/ # React contexts
    ?   ??? components/         # Reusable components
 ?   ??? services/    # API services
    ??? tailwind.config.js   # Tailwind config
  ??? vite.config.js  # Vite config
```

## Next Steps

Now that your application is running:

1. ? Explore the dashboard interface
2. ? Test responsive design (resize browser)
3. ? Try logging in and out
4. ? Navigate between menu items
5. ?? Start building your features!

### Suggested First Features to Build:

1. **Donations Page**
   - List all donations
   - Add new donation form
   - View donation details

2. **Requests Page**
   - List active requests
   - Match requests with donations
   - Update request status

3. **Organizations Page**
   - Directory of organizations
   - Organization profiles
   - Registration workflow

4. **Profile Page**
   - View user information
   - Edit profile
   - Change password

## Useful Commands

```bash
# Frontend
cd foodbridge.client
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint     # Run ESLint

# Backend
cd FoodBridge.Server
dotnet run     # Start API
dotnet build         # Build project
dotnet test          # Run tests
dotnet ef migrations add [Name]   # Create migration
dotnet ef database update         # Apply migrations
```

## Getting Help

If you encounter issues:

1. Check the console output (both frontend and backend)
2. Review browser Network tab for API calls
3. Check `LOGIN_500_ERROR_FIXED.md` for JWT configuration
4. Review `TAILWIND_DASHBOARD_INTEGRATION.md` for implementation details
5. Verify all dependencies are installed

---

## Success Checklist ?

Before proceeding with development, verify:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access http://localhost:5173
- [ ] Login page displays correctly
- [ ] Can log in with test credentials
- [ ] Dashboard displays with stats
- [ ] Sidebar navigation works
- [ ] Mobile responsive menu works
- [ ] Can log out successfully

If all checked, you're ready to build! ??

---

**Happy Coding!** ??

For detailed implementation information, see `TAILWIND_DASHBOARD_INTEGRATION.md`
