# ?? Troubleshooting 400 Bad Request on /api/products

## Problem
GET request to `/api/products?pageNumber=1&pageSize=10&sortBy=ProductName&sortOrder=asc` returns 400 Bad Request.

## Root Cause Analysis

### Likely Issues (in order of probability)

#### 1. **Model Binding Mismatch** (Most Likely)
The ProductFilterDto expects certain property names but receives others.

**Backend expects:**
```csharp
public class ProductFilterDto : PaginationParams
{
    public string Category { get; set; }
    public bool? IsPerishable { get; set; }
    public bool? IsActive { get; set; }
    public string SearchTerm { get; set; }
  public string SortBy { get; set; } = "ProductName";
    public string SortOrder { get; set; } = "asc";
}

public class PaginationParams
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false; // ?? NOTE: SortDescending, not SortOrder
}
```

**Frontend sends:**
- `sortOrder=asc` but backend expects `sortDescending=false`

#### 2. **Case Sensitivity**
ASP.NET Core model binding is case-insensitive by default, so this is less likely.

#### 3. **Proxy Configuration**
The vite proxy target uses `127.0.0.1` which might have SSL cert issues.

#### 4. **Empty String Parameters**
Previously sending `searchTerm=` could cause issues (fixed with `cleanParams`).

---

## Solution Approach

### Step 1: Check Response Body
First, see what the server is actually saying:

**Action:** Open browser DevTools ? Network tab ? Click the 400 request ? Response tab

Look for:
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
"title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "SortDescending": ["The value 'asc' is not valid for SortDescending."]
  }
}
```

### Step 2: Fix Model Binding Mismatch

**Option A: Frontend sends what backend expects**

Update query params to use `sortDescending` instead of `sortOrder`:

```javascript
// In Products.jsx (and other pages)
const fetchProducts = async () => {
  try {
  const response = await productsAPI.getAll({
      pageNumber,
      pageSize,
      searchTerm,
    category: categoryFilter,
      sortBy: 'ProductName',
      sortDescending: false // Changed from sortOrder: 'asc'
    });
    // ...
  }
};
```

**Option B: Backend accepts sortOrder** (Recommended)

Change `PaginationParams` to handle both:

```csharp
public class PaginationParams
{
    private const int MaxPageSize = 100;
    private int _pageSize = 10;

    public int PageNumber { get; set; } = 1;
    public int PageSize
    {
      get => _pageSize;
set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }

    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; }
    
 // Accept sortOrder (asc/desc) and convert to bool
    private string? _sortOrder;
    public string? SortOrder 
    { 
        get => SortDescending ? "desc" : "asc";
 set 
        {
            _sortOrder = value;
    SortDescending = value?.ToLower() == "desc";
     }
    }
    
    public bool SortDescending { get; set; } = false;
}
```

### Step 3: Fix Proxy Target

Change vite.config.js to use `localhost` instead of `127.0.0.1`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
 '/api': {
     target: 'https://localhost:7066', // Changed from 127.0.0.1
  changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### Step 4: Add Backend Logging

Temporarily add logging to ProductsController to see what's received:

```csharp
[HttpGet]
public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto filter)
{
    try
    {
   _logger.LogInformation("Received ProductFilter: {@Filter}", filter);
        
     if (!ModelState.IsValid)
        {
_logger.LogWarning("ModelState Invalid: {@Errors}", ModelState);
 return BadRequest(ModelState);
        }
        
        var result = await _productService.GetAllAsync(filter);
        return Ok(ApiResponse<PagedResultDto<ProductDto>>.SuccessResponse(result));
 }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Error retrieving products");
      return StatusCode(500, ApiResponse.ErrorResponse("An error occurred"));
    }
}
```

### Step 5: Test Direct API Call

Bypass frontend and test backend directly:

```bash
# Using curl (with your actual token)
curl -k -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  "https://localhost:7066/api/products?pageNumber=1&pageSize=10&sortBy=ProductName&sortDescending=false"

# Or using PowerShell
$headers = @{ Authorization = "Bearer YOUR_TOKEN_HERE" }
Invoke-RestMethod -Uri "https://localhost:7066/api/products?pageNumber=1&pageSize=10&sortBy=ProductName&sortDescending=false" -Headers $headers -SkipCertificateCheck
```

If this works, the issue is in the frontend/proxy. If it fails, the issue is backend validation.

---

## Quick Fix Implementation

### Recommended: Update Frontend to Match Backend

**File: `foodbridge.client/src/pages/Products.jsx`**

```javascript
const fetchProducts = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await productsAPI.getAll({
 pageNumber,
      pageSize,
      searchTerm,
      category: categoryFilter,
      sortBy: 'ProductName',
      sortDescending: false // ? Changed from sortOrder: 'asc'
    });

    if (response.success) {
      setProducts(response.data.items);
      setTotalPages(response.data.totalPages);
      setTotalCount(response.data.totalCount);
    }
  } catch (err) {
    console.error('Fetch products error:', err);
    setError(err.response?.data?.message || 'Failed to load products');
  } finally {
    setLoading(false);
  }
};
```

**Apply same fix to:**
- `Donations.jsx`
- `Inventory.jsx`
- `Donors.jsx`
- `Waste.jsx`

---

## Alternative: Backend Change (More Flexible)

If you want to keep `sortOrder` in frontend, update backend:

**File: `FoodBridge.Server/DTOs/Common/PaginationDto.cs`**

```csharp
public class PaginationParams
{
    private const int MaxPageSize = 100;
    private int _pageSize = 10;

    public int PageNumber { get; set; } = 1;

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
    }

    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; }
    
    // Support both sortOrder (string) and sortDescending (bool)
    private string? _sortOrder = "asc";
    
    [JsonIgnore]
    public bool SortDescending { get; set; } = false;
    
  public string? SortOrder 
    { 
     get => SortDescending ? "desc" : "asc";
        set 
{
            _sortOrder = value?.ToLower();
    SortDescending = _sortOrder == "desc";
    }
    }
}
```

---

## Testing Checklist

After applying fix:

- [ ] Clear browser cache and localStorage
- [ ] Restart Vite dev server (`npm run dev`)
- [ ] Restart .NET backend (`dotnet run`)
- [ ] Check browser Network tab for request URL
- [ ] Verify response is 200 with data
- [ ] Test pagination (next/previous)
- [ ] Test search functionality
- [ ] Test category filter
- [ ] Test sorting (if UI supports it)

---

## Prevention

### Add Request/Response Logging

**File: `foodbridge.client/src/services/api.js`**

```javascript
instance.interceptors.request.use(
 (config) => {
   const token = localStorage.getItem('authToken');
   if (token) config.headers.Authorization = `Bearer ${token}`;
   
   // Log outgoing request
   console.log('[API Request]', config.method.toUpperCase(), config.url, {
  params: config.params,
 data: config.data
   });
   
   return config;
 },
 (error) => Promise.reject(error)
);

instance.interceptors.response.use(
 (response) => {
   console.log('[API Response]', response.config.url, {
     status: response.status,
     data: response.data
   });
   return response;
 },
 (error) => {
   console.error('[API Error]', error.config?.url, {
     status: error.response?.status,
     data: error.response?.data,
     message: error.message
   });
   
   if (error.response?.status === 401) {
     localStorage.removeItem('authToken');
     localStorage.removeItem('user');
     if (!window.location.pathname.includes('/login')) {
       window.location.href = '/login';
  }
   }
   return Promise.reject(error);
 }
);
```

---

## Expected Outcome

After fix, you should see:
```
[API Request] GET /products { params: { pageNumber: 1, pageSize: 10, sortBy: 'ProductName', sortDescending: false } }
[API Response] /products { status: 200, data: { Success: true, Data: { Items: [...], TotalCount: 10 } } }
```

And products will load successfully in the UI.

---

**Next Steps:**
1. Check the 400 response body in DevTools
2. Apply the frontend fix (change `sortOrder` to `sortDescending`)
3. Report back if issue persists with the actual error message
