# FoodBridge - Food Donation Management Platform

A modern, full-stack web application for managing food donations, connecting donors with organizations in need.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green)

## ? Features

- ?? **Secure Authentication** - JWT-based authentication system
- ?? **Dashboard Analytics** - Real-time statistics and metrics
- ?? **Modern UI** - Tailwind CSS admin dashboard with responsive design
- ?? **Mobile-First** - Fully responsive across all devices
- ?? **Fast Performance** - Optimized builds with Vite
- ?? **Dark Mode Ready** - Theme support built-in
- ? **Accessible** - WCAG compliant design patterns

## ?? Quick Start

### Prerequisites
- Node.js 20.16+ 
- .NET 8 SDK
- SQL Server
- Visual Studio or VS Code

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/foodbridge.git
   cd foodbridge
   ```

2. **Setup Backend**
   ```bash
   cd FoodBridge.Server
   dotnet restore
   dotnet ef database update
   dotnet run
 ```

3. **Setup Frontend**
   ```bash
   cd foodbridge.client
   npm install
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Test Credentials
- **Email:** `admin@foodbridge.com`
- **Password:** `Admin@123`

## ?? Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in minutes
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Technical details and architecture
- **[Tailwind Integration](TAILWIND_DASHBOARD_INTEGRATION.md)** - UI framework documentation
- **[Visual Guide](VISUAL_GUIDE.md)** - Design system and UI components
- **[Login Troubleshooting](LOGIN_500_ERROR_FIXED.md)** - Common authentication issues

## ??? Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Axios** - HTTP client

### Backend
- **.NET 8** - Web API framework
- **Entity Framework Core** - ORM
- **SQL Server** - Database
- **JWT** - Authentication

## ?? Project Structure

```
FoodBridge/
??? FoodBridge.Server/  # .NET 8 Backend
?   ??? Controllers/  # API endpoints
?   ??? DTOs/      # Data transfer objects
?   ??? Models/   # Entity models
?   ??? Services/ # Business logic
?   ??? Data/        # Database context
?
??? foodbridge.client/          # React Frontend
    ??? src/
    ?   ??? layout/   # Layout components
    ?   ?   ??? AppLayout.jsx
    ?   ?   ??? AppHeader.jsx
    ?   ?   ??? AppSidebar.jsx
    ?   ?   ??? Backdrop.jsx
    ?   ??? pages/              # Page components
    ?   ?   ??? Login.jsx
    ?   ?   ??? Dashboard.jsx
    ?   ?   ??? Register.jsx
 ? ??? contexts/           # React contexts
  ?   ?   ??? AuthContext.jsx
    ?   ?   ??? SidebarContext.jsx
    ?   ??? components/   # Reusable components
    ?   ??? services/           # API services
    ??? tailwind.config.js      # Tailwind configuration
    ??? vite.config.js          # Vite configuration
```

## ?? Screenshots

### Login Page
Modern authentication interface with gradient background and branded design.

### Dashboard
Comprehensive overview with statistics cards and recent activity feed.

### Responsive Design
Fully responsive layout that works seamlessly on mobile, tablet, and desktop.

## ?? Development

### Frontend Development
```bash
cd foodbridge.client
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint # Run ESLint
```

### Backend Development
```bash
cd FoodBridge.Server
dotnet run      # Start API
dotnet build                # Build project
dotnet ef migrations add [Name]     # Create migration
dotnet ef database update   # Apply migrations
dotnet test      # Run tests
```

## ?? Available Scripts

### Frontend
| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint for code quality |

### Backend
| Command | Description |
|---------|-------------|
| `dotnet run` | Start the API server |
| `dotnet build` | Compile the project |
| `dotnet test` | Execute unit tests |
| `dotnet ef migrations add [Name]` | Create new migration |
| `dotnet ef database update` | Apply pending migrations |

## ?? API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token

### Donations
- `GET /api/donations` - List all donations
- `POST /api/donations` - Create donation
- `GET /api/donations/{id}` - Get donation details
- `PUT /api/donations/{id}` - Update donation
- `DELETE /api/donations/{id}` - Delete donation

### Organizations
- `GET /api/organizations` - List organizations
- `POST /api/organizations` - Register organization
- `GET /api/organizations/{id}` - Organization details

*(More endpoints to be documented)*

## ?? Security

- JWT-based authentication
- HTTPS enforcement
- CORS properly configured
- Password hashing with bcrypt
- SQL injection prevention (EF Core)
- XSS protection (React escaping)
- Input validation

## ?? Testing

```bash
# Backend unit tests
cd FoodBridge.Server
dotnet test

# Frontend tests (to be added)
cd foodbridge.client
npm test
```

## ?? Performance

- **Bundle Size:**
  - CSS: 50KB (9.4KB gzipped)
  - JS: 303KB (98KB gzipped)
- **Build Time:** ~2 seconds
- **Load Time:** <500ms (development)

## ?? Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ?? License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ?? Author

- Simeon Markov

## ?? Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) - For the amazing CSS framework
- [Free React Tailwind Admin Dashboard](https://github.com/TailAdmin/free-react-tailwind-admin-dashboard) - For the admin template inspiration
- [React](https://react.dev/) - For the powerful UI library
- [.NET](https://dotnet.microsoft.com/) - For the robust backend framework

## ?? Support

For support, email me or open an issue in the repository.

## ?? Known Issues

- Dark mode toggle not yet implemented (classes ready)
- Search functionality is placeholder
- Notifications system pending
- Some pages are placeholders


---

** For fighting food waste and hunger**

[? Back to top](#-foodbridge---food-donation-management-platform)
