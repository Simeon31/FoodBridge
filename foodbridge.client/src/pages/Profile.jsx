import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const Profile = () => {
    const { user, updateProfile, changePassword } = useAuth();

    // Profile Info State
    const [profileForm, setProfileForm] = useState({
     firstName: '',
        lastName: '',
    });

    // Password Change State
    const [passwordForm, setPasswordForm] = useState({
     currentPassword: '',
    newPassword: '',
      confirmNewPassword: '',
    });

    // Loading and Error States
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setProfileForm({
          firstName: user.firstName || '',
                lastName: user.lastName || '',
 });
        }
    }, [user]);

    // Handle Profile Form Changes
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
     setProfileForm(prev => ({
            ...prev,
       [name]: value
        }));
        // Clear messages when user starts typing
        setProfileError('');
      setProfileSuccess('');
    };

    // Handle Password Form Changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
       ...prev,
            [name]: value
        }));
        // Clear messages when user starts typing
  setPasswordError('');
        setPasswordSuccess('');
    };

    // Handle Profile Update
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        setProfileSuccess('');

        try {
       // Validate
          if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
    setProfileError('First name and last name are required');
    setProfileLoading(false);
    return;
  }

    // Update profile using AuthContext
            const response = await updateProfile(
    profileForm.firstName.trim(),
  profileForm.lastName.trim()
        );

 if (response.success) {
   setProfileSuccess('Profile updated successfully!');
            } else {
           setProfileError(response.message || 'Failed to update profile');
  }
        } catch (error) {
     console.error('Profile update error:', error);
 setProfileError(
    error.response?.data?.message ||
         error.message ||
                'Failed to update profile. Please try again.'
  );
  } finally {
     setProfileLoading(false);
   }
    };

  // Handle Password Change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
    setPasswordError('');
  setPasswordSuccess('');

    try {
      // Validate
            if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
  setPasswordError('All password fields are required');
     setPasswordLoading(false);
  return;
       }

     if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
   setPasswordError('New passwords do not match');
              setPasswordLoading(false);
    return;
   }

   if (passwordForm.newPassword.length < 6) {
     setPasswordError('New password must be at least 6 characters long');
       setPasswordLoading(false);
          return;
       }

   // Change password using AuthContext
  const response = await changePassword(
     passwordForm.currentPassword,
         passwordForm.newPassword,
      passwordForm.confirmNewPassword
            );

            if (response.success) {
       setPasswordSuccess('Password changed successfully!');
             // Clear form
                setPasswordForm({
           currentPassword: '',
         newPassword: '',
     confirmNewPassword: '',
             });
            } else {
    setPasswordError(response.message || 'Failed to change password');
     }
        } catch (error) {
    console.error('Password change error:', error);
          setPasswordError(
            error.response?.data?.message ||
          error.message ||
                'Failed to change password. Please check your current password.'
  );
     } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-black dark:text-white">Profile Settings</h1>
                <p className="mt-2 text-bodydark2">Manage your account settings and preferences</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Personal Information Card */}
                <Card>
                    <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
                        Personal Information
                    </h2>

                    {profileError && (
                        <Alert
                            variant="danger"
                            className="mb-4"
                            onClose={() => setProfileError('')}
                        >
                            {profileError}
                        </Alert>
                    )}

                    {profileSuccess && (
                        <Alert
                            variant="success"
                            className="mb-4"
                            onClose={() => setProfileSuccess('')}
                        >
                            {profileSuccess}
                        </Alert>
                    )}

                    <form onSubmit={handleProfileSubmit}>
                        <div className="mb-4.5">
                            <Input
                                label="Email Address"
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="bg-gray-100 dark:bg-boxdark-2"
                                icon={
                                    <svg
                                        className="fill-current opacity-70"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M3.33341 4.16667C2.87508 4.16667 2.50008 4.54167 2.50008 5V15C2.50008 15.4583 2.87508 15.8333 3.33341 15.8333H16.6667C17.1251 15.8333 17.5001 15.4583 17.5001 15V5C17.5001 4.54167 17.1251 4.16667 16.6667 4.16667H3.33341ZM3.33341 5.83333H16.6667V6.66667L10.0001 10.8333L3.33341 6.66667V5.83333ZM3.33341 8.33333L10.0001 12.5L16.6667 8.33333V15H3.33341V8.33333Z" />
                                    </svg>
                                }
                            />
                            <p className="mt-1 text-sm text-bodydark2">Email cannot be changed</p>
                        </div>

                        <div className="mb-4.5">
                            <Input
                                label="First Name"
                                type="text"
                                name="firstName"
                                value={profileForm.firstName}
                                onChange={handleProfileChange}
                                placeholder="Enter your first name"
                                required
                                icon={
                                    <svg
                                        className="fill-current"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M10 0C7.79 0 6 1.79 6 4C6 6.21 7.79 8 10 8C12.21 8 14 6.21 14 4C14 1.79 12.21 0 10 0ZM10 10C6.67 10 0 11.67 0 15V18C0 19.1 0.9 20 2 20H18C19.1 20 20 19.1 20 18V15C20 11.67 13.33 10 10 10Z" />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="mb-6">
                            <Input
                                label="Last Name"
                                type="text"
                                name="lastName"
                                value={profileForm.lastName}
                                onChange={handleProfileChange}
                                placeholder="Enter your last name"
                                required
                                icon={
                                    <svg
                                        className="fill-current"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M10 0C7.79 0 6 1.79 6 4C6 6.21 7.79 8 10 8C12.21 8 14 6.21 14 4C14 1.79 12.21 0 10 0ZM10 10C6.67 10 0 11.67 0 15V18C0 19.1 0.9 20 2 20H18C19.1 20 20 19.1 20 18V15C20 11.67 13.33 10 10 10Z" />
                                    </svg>
                                }
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={profileLoading}
                        >
                            {profileLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : (
                                'Update Profile'
                            )}
                        </Button>
                    </form>
                </Card>

                {/* Change Password Card */}
                <Card>
                    <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
                        Change Password
                    </h2>

                    {passwordError && (
                        <Alert
                            variant="danger"
                            className="mb-4"
                            onClose={() => setPasswordError('')}
                        >
                            {passwordError}
                        </Alert>
                    )}

                    {passwordSuccess && (
                        <Alert
                            variant="success"
                            className="mb-4"
                            onClose={() => setPasswordSuccess('')}
                        >
                            {passwordSuccess}
                        </Alert>
                    )}

                    <form onSubmit={handlePasswordSubmit}>
                        <div className="mb-4.5">
                            <Input
                                label="Current Password"
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter current password"
                                required
                                icon={
                                    <svg
                                        className="fill-current"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V9C17 7.9 16.1 7 15 7ZM9 2C10.66 2 12 3.34 12 5V7H6V5C6 3.34 7.34 2 9 2ZM15 19H3V9H15V19ZM9 13C8.45 13 8 12.55 8 12C8 11.45 8.45 11 9 11C9.55 11 10 11.45 10 12C10 12.55 9.55 13 9 13Z" />
                                    </svg>
                                }
                            />
                        </div>

                        <div className="mb-4.5">
                            <Input
                                label="New Password"
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter new password"
                                required
                                icon={
                                    <svg
                                        className="fill-current"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V9C17 7.9 16.1 7 15 7ZM9 2C10.66 2 12 3.34 12 5V7H6V5C6 3.34 7.34 2 9 2ZM15 19H3V9H15V19ZM9 13C8.45 13 8 12.55 8 12C8 11.45 8.45 11 9 11C9.55 11 10 11.45 10 12C10 12.55 9.55 13 9 13Z" />
                                    </svg>
                                }
                            />
                            <p className="mt-1 text-sm text-bodydark2">Must be at least 6 characters</p>
                        </div>

                        <div className="mb-6">
                            <Input
                                label="Confirm New Password"
                                type="password"
                                name="confirmNewPassword"
                                value={passwordForm.confirmNewPassword}
                                onChange={handlePasswordChange}
                                placeholder="Confirm new password"
                                required
                                icon={
                                    <svg
                                        className="fill-current"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M15 7H14V5C14 2.24 11.76 0 9 0C6.24 0 4 2.24 4 5V7H3C1.9 7 1 7.9 1 9V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V9C17 7.9 16.1 7 15 7ZM9 2C10.66 2 12 3.34 12 5V7H6V5C6 3.34 7.34 2 9 2ZM15 19H3V9H15V19ZM9 13C8.45 13 8 12.55 8 12C8 11.45 8.45 11 9 11C9.55 11 10 11.45 10 12C10 12.55 9.55 13 9 13Z" />
                                    </svg>
                                }
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={passwordLoading}
                        >
                            {passwordLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Changing...
                                </span>
                            ) : (
                                'Change Password'
                            )}
                        </Button>
                    </form>
                </Card>
            </div>

            {/* Account Information Card */}
            <Card className="mt-6">
                <h2 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Account Information
                </h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border border-stroke bg-gray p-4 dark:border-strokedark dark:bg-meta-4">
                        <p className="text-sm text-bodydark2">Full Name</p>
                        <p className="mt-1 text-lg font-semibold text-black dark:text-white">
                            {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Not set'}
                        </p>
                    </div>

                    <div className="rounded-lg border border-stroke bg-gray p-4 dark:border-strokedark dark:bg-meta-4">
                        <p className="text-sm text-bodydark2">Email Address</p>
                        <p className="mt-1 text-lg font-semibold text-black dark:text-white">
                            {user?.email || 'Not set'}
                        </p>
                    </div>

                    <div className="rounded-lg border border-stroke bg-gray p-4 dark:border-strokedark dark:bg-meta-4">
                        <p className="text-sm text-bodydark2">Account Status</p>
                        <p className="mt-1 text-lg font-semibold text-success">
                            {user?.isActive ? 'Active' : 'Inactive'}
                        </p>
                    </div>

                    <div className="rounded-lg border border-stroke bg-gray p-4 dark:border-strokedark dark:bg-meta-4">
                        <p className="text-sm text-bodydark2">Member Since</p>
                        <p className="mt-1 text-lg font-semibold text-black dark:text-white">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>

                    <div className="rounded-lg border border-stroke bg-gray p-4 dark:border-strokedark dark:bg-meta-4">
                        <p className="text-sm text-bodydark2">Last Login</p>
                        <p className="mt-1 text-lg font-semibold text-black dark:text-white">
                            {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>

                    <div className="rounded-lg border border-stroke bg-gray p-4 dark:border-strokedark dark:bg-meta-4">
                        <p className="text-sm text-bodydark2">Roles</p>
                        <p className="mt-1 text-lg font-semibold text-black dark:text-white">
                            {user?.roles?.length > 0 ? user.roles.join(', ') : 'User'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
