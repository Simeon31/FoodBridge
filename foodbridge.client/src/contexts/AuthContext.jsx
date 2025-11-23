import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const initializeAuth = async () => {
      try {
        const token = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      console.log('[AuthContext] Initializing auth...', { hasToken: !!token, hasUser: !!storedUser });

        if (token && storedUser) {
          try {
     // Verify token is still valid
      const response = await authService.getCurrentUser();
       console.log('[AuthContext] getCurrentUser response:', response);
    
            if (response.success && response.user) {
  setUser(response.user);
       console.log('[AuthContext] User authenticated:', response.user);
     } else {
      // Token invalid, clear storage
  console.warn('[AuthContext] Token invalid, clearing storage');
           authService.logout();
         setUser(null);
            }
          } catch (err) {
     console.error('[AuthContext] Auth verification error:', err);
            // Only clear if it's an auth error (401), not network errors
            if (err.response?.status === 401) {
   authService.logout();
           setUser(null);
   } else {
    // Network error - keep user logged in with stored data
  console.log('[AuthContext] Network error, using stored user data');
         setUser(storedUser);
            }
  }
        } else {
          console.log('[AuthContext] No stored credentials found');
        }
   } catch (err) {
        console.error('[AuthContext] Initialization error:', err);
      } finally {
  setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (email, password, confirmPassword, firstName, lastName) => {
    try {
      setError(null);
      console.log('[AuthContext] Registering user:', email);
      
    const response = await authService.register(email, password, confirmPassword, firstName, lastName);
   console.log('[AuthContext] Register response:', response);
      
      if (response.success && response.user) {
        setUser(response.user);
   console.log('[AuthContext] Registration successful');
     return { success: true };
      } else {
    const errorMsg = response.message || 'Registration failed';
   setError(errorMsg);
     console.error('[AuthContext] Registration failed:', errorMsg);
 return { success: false, message: errorMsg };
      }
 } catch (err) {
      console.error('[AuthContext] Register error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      setError(null);
      console.log('[AuthContext] Logging in user:', email);
      
    const response = await authService.login(email, password, rememberMe);
 console.log('[AuthContext] Login response:', response);
      
      if (response.success && response.user) {
        setUser(response.user);
        console.log('[AuthContext] Login successful, user:', response.user);
        return { success: true };
      } else {
        const errorMsg = response.message || 'Login failed';
        setError(errorMsg);
     console.error('[AuthContext] Login failed:', errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      console.error('[AuthContext] Login error:', err);
      // Extract message from Error object
      const errorMessage = err.message || 'Login failed. Please check your connection.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
 try {
      console.log('[AuthContext] Logging out user');
      await authService.logout();
      setUser(null);
      setError(null);
    console.log('[AuthContext] Logout successful');
    } catch (err) {
      console.error('[AuthContext] Logout error:', err);
      // Still clear user state even if API call fails
      setUser(null);
    }
  };

  const updateProfile = async (firstName, lastName) => {
    try {
      setError(null);
      console.log('[AuthContext] Updating profile');

   const response = await authService.updateProfile(firstName, lastName);
   
      if (response.success && response.user) {
    setUser(response.user);
        return { success: true };
      } else {
        const errorMsg = response.message || 'Profile update failed';
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
  } catch (err) {
console.error('[AuthContext] Update profile error:', err);
      const errorMessage = err.response?.data?.message || 'Profile update failed';
setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    try {
      setError(null);
      console.log('[AuthContext] Changing password');
      
      const response = await authService.changePassword(currentPassword, newPassword, confirmNewPassword);
      return { success: true, message: response.message };
    } catch (err) {
      console.error('[AuthContext] Change password error:', err);
      const errorMessage = err.response?.data?.message || 'Password change failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
 login,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
