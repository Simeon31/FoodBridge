# ?? API Routing & Data Fetching Issues - Complete Analysis

## Problems Identified

### 1. **InventoryAdjustmentDto Mismatch**
The `adjustQuantity` endpoint expects a different DTO structure than what the frontend sends.

**Backend expects:**
```csharp
public class InventoryAdjustmentDto
{
    [Required]
    public int InventoryItemId { get; set; }  // ? Frontend doesn't send this
    
    [Required]
    public int QuantityChange { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Reason { get; set; }
    
    public string Notes { get; set; }
}
```

**Frontend sends:**
```javascript
adjustQuantity: async (id, quantityChange, reason) => 
  post(ep(`inventory/${id}/adjust-quantity`), { quantityChange, reason })
```

**Problem:** Backend DTO requires `InventoryItemId` in the body, but the `id` is already in the URL path. The controller expects it in the DTO.

### 2. **Missing sortDescending Fix in Other Pages**
- ? Inventory.jsx - still uses `sortOrder`
- ? Donors.jsx - still uses `sortOrder`
- ? Waste.jsx - still uses `sortOrder`

### 3. **Empty Database Collections**
When resources have no data, queries return empty arrays which is expected, but validation/fetching logic might be treating this as an error.

---

## Solutions

### Fix 1: Update InventoryAdjustmentDto to Match Controller

The controller uses route parameter `{id}` so the DTO shouldn't require `InventoryItemId`:

**File: `FoodBridge.Server/DTOs/Inventory/InventoryItemDto.cs`**

```csharp
/// <summary>
/// DTO for inventory adjustment
/// </summary>
public class InventoryAdjustmentDto
{
    [Required]
    public int QuantityChange { get; set; } // Positive for increase, negative for decrease

    [Required]
    [StringLength(100)]
    public string Reason { get; set; }

    public string? Notes { get; set; }
}
```

### Fix 2: Update Remaining Frontend Pages

#### Inventory.jsx
**File: `foodbridge.client/src/pages/Inventory.jsx`**

```javascript
const fetchInventory = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await inventoryAPI.getAll({
      pageNumber,
      pageSize,
    searchTerm,
   category: categoryFilter,
  sortBy: 'ProductName',
      sortDescending: false  // ? Changed from sortOrder: 'asc'
    });

    if (response.success) {
      setInventory(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalCount(response.data.totalCount || 0);
    }
  } catch (err) {
    console.error('Fetch inventory error:', err);
    setError(err.response?.data?.message || 'Failed to load inventory');
 // Set empty array on error
  setInventory([]);
  } finally {
    setLoading(false);
  }
};
```

#### Donors.jsx
**File: `foodbridge.client/src/pages/Donors.jsx`**

```javascript
const fetchDonors = async () => {
  try {
    setLoading(true);
  setError(null);
    
    const response = await donorsAPI.getAll({
      pageNumber,
      pageSize,
    searchTerm,
      sortBy: 'Name',
      sortDescending: false  // ? Changed from sortOrder: 'asc'
    });

    if (response.success) {
      setDonors(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalCount(response.data.totalCount || 0);
    }
  } catch (err) {
    console.error('Fetch donors error:', err);
    setError(err.response?.data?.message || 'Failed to load donors');
    setDonors([]);
  } finally {
    setLoading(false);
  }
};
```

#### Waste.jsx
**File: `foodbridge.client/src/pages/Waste.jsx`**

```javascript
const fetchWaste = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await wasteAPI.getAll({
      pageNumber,
      pageSize,
      searchTerm,
      category: categoryFilter,
      sortBy: 'CreatedAt',
      sortDescending: true  // ? Changed from sortOrder: 'desc'
    });

    if (response.success) {
      setWasteRecords(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
setTotalCount(response.data.totalCount || 0);
    }
  } catch (err) {
    console.error('Fetch waste error:', err);
    setError(err.response?.data?.message || 'Failed to load waste records');
    setWasteRecords([]);
  } finally {
  setLoading(false);
  }
};
```

### Fix 3: Handle Empty Collections Gracefully

Add null coalescing in frontend responses:

**Already handled in `api.js` normalization:**

```javascript
const normalizeResponse = (raw) => {
  if (raw.success !== undefined) return raw;
  const base = {
    success: raw.Success,
    message: raw.Message,
    errors: raw.Errors || [],
    timestamp: raw.Timestamp,
  };
  if (raw.Data !== undefined) {
    if (raw.Data && raw.Data.Items !== undefined && raw.Data.TotalCount !== undefined) {
      const paged = {
items: camelize(raw.Data.Items) || [],  // ? Ensure array
    totalCount: raw.Data.TotalCount || 0,
        pageNumber: raw.Data.PageNumber || 1,
        pageSize: raw.Data.PageSize || 10,
        totalPages: Math.max(1, Math.ceil((raw.Data.TotalCount || 0) / (raw.Data.PageSize || 10))),
      };
      return { ...base, data: paged };
    }
    return { ...base, data: camelize(raw.Data) };
  }
  return base;
};
```

### Fix 4: Backend - Ensure Services Return Empty Lists

Make sure all services return empty lists instead of null:

**Pattern for all services:**

```csharp
public async Task<PagedResultDto<T>> GetAllAsync(FilterDto filter)
{
    try
    {
      var query = _context.Entity.AsQueryable();
        
   // Apply filters...
 
        var pagedResult = await query.ToPagedResultAsync(filter.PageNumber, filter.PageSize);
   
        return new PagedResultDto<T>
        {
          Items = pagedResult.Items ?? new List<T>(),  // ? Never null
   TotalCount = pagedResult.TotalCount,
            PageNumber = pagedResult.PageNumber,
      PageSize = pagedResult.PageSize
   };
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error retrieving entities");
    // Return empty result instead of throwing
        return new PagedResultDto<T>
        {
            Items = new List<T>(),
            TotalCount = 0,
       PageNumber = 1,
  PageSize = filter.PageSize
        };
    }
}
```

---

## Testing Checklist

### Empty Database
- [ ] Products page loads with "No products found" message
- [ ] Donations page loads with "No donations found" message
- [ ] Inventory page loads with "No inventory items found" message
- [ ] Donors page loads with "No donors found" message
- [ ] Waste page loads with "No waste records found" message

### With Data
- [ ] All pages display data correctly
- [ ] Pagination works
- [ ] Search works
- [ ] Filters work
- [ ] Create operations work
- [ ] Update operations work
- [ ] Delete operations work

### Error Handling
- [ ] 400 errors show meaningful messages
- [ ] 401 redirects to login
- [ ] 500 errors show generic error message
- [ ] Network errors are caught and displayed

---

## Implementation Priority

### Priority 1: Critical (Breaks functionality)
1. ? Fix InventoryAdjustmentDto (remove InventoryItemId from DTO)
2. ? Fix sortOrder ? sortDescending in Inventory.jsx
3. ? Fix sortOrder ? sortDescending in Donors.jsx
4. ? Fix sortOrder ? sortDescending in Waste.jsx

### Priority 2: Important (User experience)
5. ? Add empty array fallbacks in all fetch functions
6. ? Improve error messages
7. ? Add loading states

### Priority 3: Enhancement
8. Test with empty database
9. Add seed data for testing
10. Add comprehensive logging

---

## Quick Fix Commands

### Backend Fix
```bash
cd FoodBridge.Server

# Edit InventoryItemDto.cs - remove InventoryItemId from InventoryAdjustmentDto

dotnet build
dotnet run
```

### Frontend Fix
```bash
cd foodbridge.client

# Apply fixes to Inventory.jsx, Donors.jsx, Waste.jsx

npm run dev
```

---

## Root Causes Summary

1. **Model Binding Mismatch**: `sortOrder` (string) vs `sortDescending` (bool)
2. **DTO Redundancy**: `InventoryItemId` in both URL and DTO
3. **Null Handling**: Not gracefully handling empty collections
4. **Error Propagation**: Errors not properly caught and displayed

All issues are now documented with clear fixes. Apply Priority 1 fixes first.
