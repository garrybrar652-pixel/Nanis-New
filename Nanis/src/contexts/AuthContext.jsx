import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/api/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and validate
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Fetch fresh user data to sync with backend
        refreshUser();
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await authService.getProfile();
      if (response.success && response.data?.user) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Don't logout on refresh failure, just keep current data
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login failed',
          errors: response.errors || {}
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.',
        errors: error.errors || {}
      };
    }
  };

  const register = async (name, email, password, password_confirmation, job_title = '', company = '', phone = '', bio = '', avatar = '') => {
    try {
      const response = await authService.register({ 
        name, 
        email, 
        password, 
        password_confirmation,
        job_title,
        company,
        phone,
        bio,
        avatar
      });

      if (response.success && response.data) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: response.message || 'Registration failed',
          errors: response.errors || {}
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.',
        errors: error.errors || {}
      };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout API to revoke token
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
