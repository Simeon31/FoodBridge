# ?? Quick Fix Reference Card

## The Problem
```
GET /api/products?...&sortOrder=asc
Response: 400 Bad Request
```

## The Cause
```javascript
// Frontend sent:
sortOrder: 'asc'  // ? Wrong

// Backend expected:
sortDescending: false  // ? Correct
```

## The Fix

### Products.jsx
```javascript
const response = await productsAPI.getAll({
  pageNumber,
  pageSize,
  searchTerm,
  category: categoryFilter,
  sortBy: 'ProductName',
  sortDescending: false  // ? Changed from sortOrder: 'asc'
});
```

### Donations.jsx
```javascript
const response = await donationsAPI.getAll({
  pageNumber,
  pageSize,
  searchTerm,
  status: statusFilter,
  sortBy: 'DonationDate',
  sortDescending: true  // ? Changed from sortOrder: 'desc'
});
```

## Conversion Table
| Old (String) | New (Boolean) |
|--------------|---------------|
| `sortOrder: 'asc'` | `sortDescending: false` |
| `sortOrder: 'desc'` | `sortDescending: true` |

## Test Checklist
- [ ] Products page loads (no 400)
- [ ] Donations page loads (no 400)
- [ ] Pagination works
- [ ] Search works
- [ ] Create/Edit works

## If Still Failing
1. Check Network tab ? Response body
2. Clear localStorage: `localStorage.clear()`
3. Restart Vite: `npm run dev`
4. Restart backend: `dotnet run`
5. Check backend logs for errors

## Files to Update
- [x] Products.jsx
- [x] Donations.jsx
- [ ] Inventory.jsx (apply same pattern)
- [ ] Donors.jsx (apply same pattern)
- [ ] Waste.jsx (apply same pattern)

---
**Status:** ? Fix applied to Products & Donations
