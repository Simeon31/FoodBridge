# ?? FoodBridge Architecture Guide for Junior Developers

**A Senior Developer's Guide to Understanding the Codebase**

---

## ?? Quick Navigation

- [Big Picture](#-big-picture-how-our-application-works)
- [Project Structure](#-project-structure-breakdown)
- [Data Flow](#-how-data-flows-a-real-example)
- [Common Scenarios](#-common-scenarios-where-to-make-changes)
- [Frontend Architecture](#-frontend-architecture-deep-dive)
- [Security](#-security-architecture)
- [Testing](#-testing-your-changes)
- [Common Mistakes](#-common-mistakes-to-avoid)
- [Development Workflow](#-your-development-workflow)
- [Quick Reference](#-quick-reference)

---

## ??? Big Picture: How Our Application Works

Think of our application like a restaurant:

| Component | Analogy | Purpose |
|-----------|---------|---------|
| **Frontend (React)** | Dining room | Where users interact |
| **Backend (.NET API)** | Kitchen | Where requests are processed |
| **DTOs** | Menu | What customers order and receive |
| **Database** | Pantry | Where data is stored |
| **Entities** | Ingredients | Actual data in storage |

### Architecture Diagram

```
???????????????????????????????????????????????????????????????
?     USER'S BROWSER              ?
?   (React Application)       ?
???????????????????????????????????????????????????????????????
       ? HTTP Requests (JSON)
         ?
???????????????????????????????????????????????????????????????
?           API LAYER (Controllers)             ?
?     "The Waiter - Takes orders, serves food"           ?
?        Uses DTOs for communication     ?
???????????????????????????????????????????????????????????????
       ?
             ?
???????????????????????????????????????????????????????????????
?          BUSINESS LOGIC (Services)    ?
? "The Chef - Processes requests"     ?
?         Orchestrates data and logic        ?
???????????????????????????????????????????????????????????????
      ?
         ?
???????????????????????????????????????????????????????????????
?DATA LAYER (Entities)       ?
?          "The Pantry - Where data lives"          ?
?    ApplicationUser, FoodItem, etc.       ?
???????????????????????????????????????????????????????????????
            ?
    ?
???????????????????????????????????????????????????????????????
?       DATABASE (SQL Server)      ?
?          "The Storage - Persistent data"              ?
???????????????????????????????????????????????????????????????
```

---

## ?? Project Structure Breakdown

### Backend: FoodBridge.Server ??

```
FoodBridge.Server/
??? Controllers/   # ?? Entry points - API endpoints
?   ??? AuthController.cs # Handles /api/auth/* endpoints
?
??? DTOs/           # ?? Data Transfer Objects
?   ??? Auth/       # Authentication DTOs
?   ?   ??? LoginDto.cs        # Login request
?   ?   ??? RegisterDto.cs   # Registration request
?   ?   ??? UserDto.cs         # User response
?   ?   ??? AuthResponseDto.cs # Auth response
?   ??? Common/      # Shared DTOs
?       ??? ApiResponse.cs     # Standard response wrapper
?
??? Services/         # ?? Business Logic
?   ??? AuthenticationService.cs# Login/register logic
?   ??? DatabaseSeeder.cs         # Test data creation
?
??? Mappings/    # ?? DTO ? Entity converters
?   ??? MappingExtensions.cs  # Conversion methods
?
??? Data/          # ??? Database code
?   ??? ApplicationUser.cs      # User entity
?   ??? ApplicationDbContext.cs # DB connection
?
??? Migrations/           # ?? Database version history
```

### Frontend: foodbridge.client ??

```
foodbridge.client/
??? src/
?   ??? pages/            # ?? Full page components
?   ?   ??? Login.jsx         # Login page
?   ?   ??? Register.jsx      # Registration page
?   ?   ??? Dashboard.jsx     # User dashboard
?   ?
?   ??? services/         # ?? API communication
?   ? ??? authService.js    # Backend API calls
?   ?
???? contexts/         # ?? Global state
?   ?   ??? AuthContext.jsx   # User login state
?   ?
?   ??? components/       # ?? Reusable components
?   ???? ProtectedRoute.jsx # Route guard
?   ?
?   ??? App.jsx           # ?? Root component
?
??? vite.config.js    # ?? Build configuration
```

---

## ?? How Data Flows: A Real Example

### User Login Journey

#### **Step 1: User Clicks "Login"** ??
**File**: `foodbridge.client/src/pages/Login.jsx`

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login(formData.email, formData.password);
  
  if (result.success) {
    navigate('/dashboard');
  }
};
```

#### **Step 2: Context Manages State** ??
**File**: `foodbridge.client/src/contexts/AuthContext.jsx`

```javascript
const login = async (email, password) => {
  const response = await authService.login(email, password);
  
  if (response.success) {
    setUser(response.user);
    return { success: true };
  }
};
```

#### **Step 3: Service Makes API Call** ??
**File**: `foodbridge.client/src/services/authService.js`

```javascript
login: async (email, password, rememberMe) => {
  const response = await apiClient.post('/auth/login', {
    email, password, rememberMe
  });
  
  localStorage.setItem('authToken', response.data.token);
  return response.data;
}
```

#### **Step 4: Controller Receives Request** ??
**File**: `FoodBridge.Server/Controllers/AuthController.cs`

```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
{
    if (!ModelState.IsValid) {
    return BadRequest("Invalid data");
    }
    
    var result = await _authService.LoginAsync(dto);
    
    if (result.Success) {
        return Ok(result);
    }
  return Unauthorized(result);
}
```

#### **Step 5: Service Processes Logic** ??
**File**: `FoodBridge.Server/Services/AuthenticationService.cs`

```csharp
public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
{
    var user = await _userManager.FindByEmailAsync(dto.Email);
    if (user == null) {
        return new AuthResponseDto { 
            Success = false, 
        Message = "Invalid credentials" 
        };
    }
    
    var result = await _signInManager.CheckPasswordSignInAsync(
        user, dto.Password, false);
    
    var token = await GenerateJwtToken(user);
    var userRoles = await _userManager.GetRolesAsync(user);
    
    return new AuthResponseDto {
        Success = true,
  Token = token,
      User = user.ToDto(userRoles)
    };
}
```

#### **Step 6: Mapping Converts Data** ??
**File**: `FoodBridge.Server/Mappings/MappingExtensions.cs`

```csharp
public static UserDto ToDto(this ApplicationUser user, IList<string> roles)
{
    return new UserDto {
        Id = user.Id,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Roles = roles.ToList()
        // ?? Never expose: PasswordHash, SecurityStamp
    };
}
```

---

## ?? Common Scenarios: Where to Make Changes

### Scenario 1: Add New Field to User Profile

**Example**: Add "Phone Number"

| Step | File | Action |
|------|------|--------|
| 1 | `ApplicationUser.cs` | Add property |
| 2 | Terminal | Create migration |
| 3 | `UserDto.cs` | Add to DTO |
| 4 | `MappingExtensions.cs` | Update mapping |
| 5 | `UpdateProfileDto.cs` | Add if editable |
| 6 | `Register.jsx` or Profile page | Add UI field |

**Detailed Example**:

```csharp
// 1. ApplicationUser.cs
public string? PhoneNumber { get; set; }

// 2. Terminal
dotnet ef migrations add AddPhoneNumber
dotnet ef database update

// 3. UserDto.cs
public string? PhoneNumber { get; set; }

// 4. MappingExtensions.cs
PhoneNumber = user.PhoneNumber,

// 5. UpdateProfileDto.cs
public string? PhoneNumber { get; set; }

// 6. Register.jsx
<input type="tel" name="phoneNumber" />
```

### Scenario 2: Add New API Endpoint

**Example**: Forgot Password

| Step | File | Action |
|------|------|--------|
| 1 | Create `ForgotPasswordDto.cs` | Define input |
| 2 | `IAuthenticationService` | Add interface method |
| 3 | `AuthenticationService.cs` | Implement logic |
| 4 | `AuthController.cs` | Add endpoint |
| 5 | `authService.js` | Add API call |
| 6 | Create `ForgotPassword.jsx` | Add UI page |
| 7 | `App.jsx` | Add route |

---

## ?? Frontend Architecture Deep Dive

### Component Communication

```
App.jsx
  ?
  ??? AuthProvider (Global State)
  ?  ?
  ?     ??? Provides: user, login(), logout()
  ?     ??? Used by: All components
  ?
  ??? Router
        ?
        ??? Login Page
        ?  ??? Uses: login() from context
        ?
   ??? Register Page
  ?     ??? Uses: register() from context
        ?
        ??? Dashboard (Protected)
            ??? Checks: isAuthenticated
```

### State Management Pattern

```javascript
// 1. Component calls context
const { login } = useAuth();
login(email, password);

// 2. Context manages state
const [user, setUser] = useState(null);
const login = async (email, password) => {
  const response = await authService.login(email, password);
  setUser(response.user);
};

// 3. All components access
const { user } = useAuth();
```

---

## ?? Security Architecture

### Authentication Flow

```
1. User logs in
   ??? Backend generates JWT
       ??? Token contains: userId, email, roles, expiration
       
2. Token stored in browser
   ??? localStorage.setItem('authToken', token)
   
3. Every API request includes token
   ??? Authorization: Bearer TOKEN
   
4. Backend validates token
   ??? Checks signature, expiration
   
5. If valid, allows request
   ??? If invalid, returns 401
```

### Why Use DTOs?

```csharp
// ? BAD: Exposing entity
return Ok(user); // Contains PasswordHash!

// ? GOOD: Using DTO
return Ok(user.ToDto(roles)); // Safe properties only
```

**DTOs prevent:**
- Password exposure
- Over-posting attacks
- Internal structure leaks

---

## ?? Testing Your Changes

### Backend

```sh
# Build
cd FoodBridge.Server
dotnet build

# Run
dotnet run --launch-profile https

# Test in Swagger
https://localhost:7066/swagger
```

### Frontend

```sh
# Start dev server
cd foodbridge.client
npm run dev

# Open browser
http://localhost:5173

# Check console (F12)
```

---

## ?? Common Mistakes to Avoid

### 1. Don't Expose Entities

```csharp
// ? NEVER
public IActionResult GetUser() {
    return Ok(applicationUser);
}

// ? ALWAYS
public IActionResult GetUser() {
    return Ok(user.ToDto(roles));
}
```

### 2. Always Validate

```csharp
// ? NO VALIDATION
public IActionResult Create(CreateDto dto) { }

// ? WITH VALIDATION
public IActionResult Create(CreateDto dto) {
    if (!ModelState.IsValid) {
        return BadRequest(ModelState);
    }
}
```

### 3. Don't Hardcode URLs

```javascript
// ? HARDCODED
fetch('https://localhost:7066/api/auth/login');

// ? USE CONFIG
apiClient.post('/auth/login');
```

### 4. Handle Errors

```javascript
// ? NO ERROR HANDLING
const result = await authService.login(email, password);
setUser(result.user);

// ? WITH ERROR HANDLING
try {
  const result = await authService.login(email, password);
  if (result.success) {
    setUser(result.user);
  } else {
    setError(result.message);
  }
} catch (error) {
  setError('Network error');
}
```

---

## ?? Your Development Workflow

### Adding a New Feature

1. ? **Understand requirement** - What does user need?
2. ? **Plan changes** - Which files to modify?
3. ? **Database** (if needed) - Entity, migration
4. ? **DTOs** - Input/output objects
5. ? **Mappings** - Entity ? DTO
6. ? **Service** - Business logic
7. ? **Controller** - API endpoint
8. ? **Frontend service** - API call
9. ? **UI** - Page/component
10. ? **Test** - Backend & frontend

---

## ?? Quick Reference

### File Modification Guide

| Task | Files to Modify |
|------|-----------------|
| Add user property | `ApplicationUser.cs` ? Migration ? `UserDto.cs` ? `MappingExtensions.cs` |
| Add API endpoint | `Controller.cs` ? `Service.cs` ? `Interface` |
| Add validation | `Dto.cs` (add attributes) |
| Change UI | `Page.jsx` |
| Fix login bug | `Login.jsx` ? `AuthContext.jsx` ? `authService.js` ? `AuthController.cs` |
| Add new page | Create `Page.jsx` ? Add route in `App.jsx` |

### Important Files

```
Authentication Flow:
??? Frontend: Login.jsx ? AuthContext.jsx ? authService.js
??? Backend: AuthController.cs ? AuthenticationService.cs

Configuration:
??? Backend: Program.cs, appsettings.json
??? Frontend: vite.config.js, .env

Documentation:
??? docs/ - Always check here first!
```

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@foodbridge.com | Admin@123 |
| Donor | donor@foodbridge.com | Donor@123 |
| Recipient | recipient@foodbridge.com | Recipient@123 |
| Volunteer | volunteer@foodbridge.com | Volunteer@123 |

---

## ?? Pro Tips

1. **Read docs first** ? `docs/README.md`
2. **Follow patterns** ? Consistency is key
3. **Use logging** ? `console.log()` and `_logger.Log()`
4. **Test incrementally** ? Don't wait till the end
5. **Ask for help** ? After 30 minutes of being stuck
6. **Keep DTOs simple** ? Data only, no logic
7. **Validate early** ? At DTO level
8. **Never trust input** ? Always validate backend

---

## ?? Your First Task Checklist

- [ ] Clone repository
- [ ] Read `README.md`
- [ ] Read `docs/DTO_QUICK_REFERENCE.md`
- [ ] Run backend (`dotnet run`)
- [ ] Run frontend (`npm run dev`)
- [ ] Login with test credentials
- [ ] Open Swagger UI
- [ ] Explore the code files
- [ ] Try adding a simple field
- [ ] Ask questions!

---

## ?? You're Ready!

You now understand:
- ? Project structure
- ? Data flow
- ? Where to make changes
- ? How to test
- ? Common patterns

**Remember**: Every senior was once a junior. Don't be afraid to ask questions and make mistakes!

---

## ?? Need Help?

- **Quick Reference**: [DTO_QUICK_REFERENCE.md](./DTO_QUICK_REFERENCE.md)
- **Architecture**: [DTO_ARCHITECTURE.md](./DTO_ARCHITECTURE.md)
- **Troubleshooting**: [AUTHENTICATION_TROUBLESHOOTING.md](./AUTHENTICATION_TROUBLESHOOTING.md)
- **Testing**: [DTO_TESTING_CHECKLIST.md](./DTO_TESTING_CHECKLIST.md)

---

**Project**: FoodBridge  
**Version**: 2.0.0  
**Last Updated**: November 2024  
**Audience**: Junior Developers  

**Good luck, and happy coding! ??**
