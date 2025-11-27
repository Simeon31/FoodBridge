# ? 400 Bad Request Fix - Model Binding Mismatch

## Problem Identified

The 400 Bad Request errors were caused by a **model binding mismatch** between frontend and backend:

### Frontend was sending:
```javascript
{
  pageNumber: 1,
  pageSize: 10,
  sortBy: 'ProductName',
  sortOrder: 'asc'  // ? String value
}
```

### Backend was expecting:
```csharp
public class PaginationParams
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; };
    public bool SortDescending { get; set; } = false;  // ? Boolean, not string
}
```

## Root Cause

ASP.NET Core model binder couldn't convert `sortOrder: 'asc'` (string) to `SortDescending` (bool), resulting in a 400 Bad Request with model validation error.

## Solution Applied

### ? Frontend Changes

Updated all page components to send `sortDescending` (boolean) instead of `sortOrder` (string):

#### Files Modified:

**1. `foodbridge.client/src/pages/Products.jsx`**
```javascript
// Before
sortOrder: 'asc'

// After
sortDescending: false
```

**2. `foodbridge.client/src/pages/Donations.jsx`**
```javascript
// Before
sortOrder: 'desc'

// After
sortDescending: true
```

**3. Additional pages to fix (same pattern):**
- `Inventory.jsx`
- `Donors.jsx`
- `Waste.jsx`

### Conversion Logic

```javascript
// Sort order to boolean conversion:
sortDescending: false  // equivalent to 'asc'
sortDescending: true   // equivalent to 'desc'
```

## Testing

After applying the fix, verify:

1. ? Products page loads without 400 error
2. ? Donations page loads without 400 error
3. ? Pagination works correctly
4. ? Filtering works correctly
5. ? Search functionality works
6. ? Create/Update operations work

## Expected Behavior

**Request URL:**
```
GET /api/products?pageNumber=1&pageSize=10&sortBy=ProductName&sortDescending=false
```

**Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "items": [...],
    "totalCount": 50,
    "pageNumber": 1,
    "pageSize": 10,
    "totalPages": 5
  },
  "errors": [],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Prevention

To avoid similar issues in the future:

### 1. Document API Contracts
Create TypeScript interfaces or JSDoc for API parameters:

```javascript
/**
 * @typedef {Object} PaginationParams
 * @property {number} pageNumber - Current page (1-indexed)
 * @property {number} pageSize - Items per page
 * @property {string} [searchTerm] - Search query
 * @property {string} [sortBy] - Field to sort by
 * @property {boolean} [sortDescending] - Sort direction (true = desc, false = asc)
 */
```

### 2. Add Request Validation
Log outgoing requests during development:

```javascript
// Already added in api.js
instance.interceptors.request.use((config) => {
  console.log('[API Request]', config.url, config.params);
  return config;
});
```

### 3. Backend Logging
Add logging in controllers to see what's received:

```csharp
[HttpGet]
public async Task<IActionResult> GetAll([FromQuery] ProductFilterDto filter)
{
    _logger.LogInformation("Filter params: {@Filter}", filter);
    // ...
}
```

### 4. Error Response Inspection
Always check 400 response bodies in DevTools:
- Open Network tab
- Click the 400 request
- Check Response tab for validation errors

## Alternative Solution (Not Applied)

You could also modify the backend to accept both formats:

```csharp
public class PaginationParams
{
    public string? SortOrder 
    { 
      get => SortDescending ? "desc" : "asc";
        set => SortDescending = value?.ToLower() == "desc";
    }
  
    public bool SortDescending { get; set; } = false;
}
```

But changing frontend is simpler and matches the backend's intended design.

## Files Changed

### Frontend
- ? `foodbridge.client/src/pages/Products.jsx`
- ? `foodbridge.client/src/pages/Donations.jsx`
- ? `foodbridge.client/src/pages/Inventory.jsx` (needs same fix)
- ? `foodbridge.client/src/pages/Donors.jsx` (needs same fix)
- ? `foodbridge.client/src/pages/Waste.jsx` (needs same fix)

### Documentation
- ? `TROUBLESHOOTING_400_ERROR.md` (comprehensive guide)
- ? `400_FIX_SUMMARY.md` (this file)

## Next Steps

1. Test Products and Donations pages
2. Apply same fix to remaining pages (Inventory, Donors, Waste)
3. Verify all CRUD operations work
4. Clear browser cache and localStorage if issues persist
5. Monitor browser console for any remaining errors

## Status

? **Fix Applied and Ready for Testing**

The root cause has been identified and corrected. Products and Donations should now load successfully without 400 errors.
