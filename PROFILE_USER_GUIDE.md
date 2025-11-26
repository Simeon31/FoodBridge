# 👤 User Profile - Quick Start Guide

## Overview
The user profile feature allows logged-in users to manage their personal information and account settings.

## Features

### 1. View Profile Information
Navigate to `/profile` or click your avatar → "My Profile" to see:
- Full name
- Email address
- Account status
- Member since date
- Last login
- User roles

### 2. Update Personal Information
1. Go to Profile page
2. Edit **First Name** and/or **Last Name**
3. Click **Update Profile**
4. ✅ Success message appears
5. Your name updates in the header automatically

### 3. Change Password
1. Go to Profile page
2. Enter your **current password**
3. Enter **new password** (minimum 6 characters)
4. **Confirm new password**
5. Click **Change Password**
6. ✅ Success message appears and form clears

## Access Points

### From Header
1. Click your avatar/name in the top right
2. Dropdown menu appears
3. Click **My Profile**

### From Sidebar
1. Look for the Profile menu item with 👤 icon
2. Click **Profile**

### Direct URL
Navigate to: `/profile`

## Field Validation

### Profile Update
- ✅ First Name: Required, max 50 characters
- ✅ Last Name: Required, max 50 characters
- ❌ Email: Cannot be changed (read-only)

### Password Change
- ✅ Current Password: Required
- ✅ New Password: Required, minimum 6 characters
- ✅ Confirm Password: Must match new password

## Error Handling

### Common Errors
| Error | Solution |
|-------|----------|
| "First name and last name are required" | Fill in both fields |
| "All password fields are required" | Complete all password fields |
| "New passwords do not match" | Check confirmation password |
| "New password must be at least 6 characters" | Use longer password |
| "Failed to change password" | Verify current password is correct |

## Visual Feedback

### Loading States
- 🔄 **Updating...** - Profile update in progress
- 🔄 **Changing...** - Password change in progress

### Success Messages
- ✅ **Green Alert** - Operation successful
- Can be dismissed by clicking X

### Error Messages
- ❌ **Red Alert** - Operation failed
- Can be dismissed by clicking X

## Tips

1. **Auto-save**: No auto-save - click button to save changes
2. **Required Fields**: Marked with red asterisk (*)
3. **Read-only Fields**: Grayed out (Email)
4. **Password Security**: Use strong passwords with letters, numbers, symbols
5. **Form Clearing**: Password form clears after successful change

## Keyboard Shortcuts

- `Tab` - Navigate between fields
- `Enter` - Submit form (when focused on input)
- `Esc` - Close dropdown menu

## Mobile Experience

On mobile devices:
- Forms stack vertically
- Full-width buttons
- Touch-friendly inputs
- Responsive cards

## Security Notes

- 🔒 All data transmitted over HTTPS
- 🔑 JWT authentication required
- ✅ Server-side validation
- 🛡️ Password never displayed
- ⚡ Token auto-refreshes

## API Endpoints Used

- `GET /api/auth/me` - Load profile data
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

---

**Last Updated**: December 2024  
**Version**: 1.0.0
