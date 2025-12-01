import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('[AuthService] Request:', config.method.toUpperCase(), config.url, {
            hasToken: !!token,
            data: config.data
        });
        return config;
    },
    (error) => {
        console.error('[AuthService] Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => {
        console.log('[AuthService] Response:', response.config.url, {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('[AuthService] Response error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });

        if (error.response?.status === 401) {
            // Token expired or invalid
            console.warn('[AuthService] 401 Unauthorized - clearing auth data');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');

            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export const authService = {
    register: async (email, password, confirmPassword, firstName, lastName) => {
        try {
            console.log('[AuthService] Registering:', { email, firstName, lastName });

            const response = await apiClient.post('/auth/register', {
                email,
                password,
                confirmPassword,
                firstName,
                lastName,
            });

            if (response.data.success && response.data.token) {
                console.log('[AuthService] Registration successful, storing token and user');
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            console.error('[AuthService] Register failed:', error);
            throw error;
        }
    },

    login: async (email, password, rememberMe = false) => {
        try {
            console.log('[AuthService] Logging in:', { email, rememberMe });

            const response = await apiClient.post('/auth/login', {
                email,
                password,
                rememberMe,
            });

            if (response.data.success && response.data.token) {
                console.log('[AuthService] Login successful, storing token and user');
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            } else {
                console.warn('[AuthService] Login response missing token or success flag:', response.data);
            }

            return response.data;
        } catch (error) {
            console.error('[AuthService] Login failed:', error);

            // Extract error message from response
            if (error.response?.data) {
                // If backend returns our AuthResponseDto or ApiResponse format
                if (error.response.data.message) {
                    throw new Error(error.response.data.message);
                }
            }

            // Generic error
            throw new Error('Login failed. Please check your credentials and try again.');
        }
    },

    logout: async () => {
        try {
            console.log('[AuthService] Logging out');
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error('[AuthService] Logout API call failed:', error);
            // Continue anyway to clear local storage
        } finally {
            console.log('[AuthService] Clearing local storage');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser: async () => {
        try {
            console.log('[AuthService] Getting current user');
            const response = await apiClient.get('/auth/me');

            if (response.data.success && response.data.user) {
                console.log('[AuthService] Current user retrieved, updating storage');
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            console.error('[AuthService] Get current user failed:', error);
            throw error;
        }
    },

    changePassword: async (currentPassword, newPassword, confirmNewPassword) => {
        try {
            console.log('[AuthService] Changing password');
            const response = await apiClient.post('/auth/change-password', {
                currentPassword,
                newPassword,
                confirmNewPassword,
            });
            return response.data;
        } catch (error) {
            console.error('[AuthService] Change password failed:', error);
            throw error;
        }
    },

    updateProfile: async (firstName, lastName) => {
        try {
            console.log('[AuthService] Updating profile:', { firstName, lastName });
            const response = await apiClient.put('/auth/profile', {
                firstName,
                lastName,
            });

            if (response.data.message === 'Profile updated successfully') {
                console.log('[AuthService] Profile updated, refreshing user data');
                // Refresh user data
                const userResponse = await authService.getCurrentUser();
                return userResponse;
            }

            return response.data;
        } catch (error) {
            console.error('[AuthService] Update profile failed:', error);
            throw error;
        }
    },

    getStoredToken: () => {
        const token = localStorage.getItem('authToken');
        console.log('[AuthService] getStoredToken:', !!token);
        return token;
    },

    getStoredUser: () => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            console.log('[AuthService] getStoredUser: No user in storage');
            return null;
        }

        try {
            const user = JSON.parse(userStr);
            console.log('[AuthService] getStoredUser:', user);
            return user;
        } catch (error) {
            console.error('[AuthService] Failed to parse stored user:', error);
            localStorage.removeItem('user');
            return null;
        }
    },

    isAuthenticated: () => {
        const hasToken = !!localStorage.getItem('authToken');
        console.log('[AuthService] isAuthenticated:', hasToken);
        return hasToken;
    },
};

export default apiClient;
