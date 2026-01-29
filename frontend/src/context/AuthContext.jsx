import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    if (token) {
      // Verify token is still valid
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      // Check if token is expired (24 hours)
      const decodedToken = atob(token);
      const [prefix, timestamp] = decodedToken.split(':');
      
      if (prefix === 'admin') {
        const tokenAge = Date.now() - parseInt(timestamp);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (tokenAge < maxAge) {
          // Token is valid, set user
          setUser({ role: 'admin' });
          // Set authorization header for all future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Token expired
          logout();
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token verification error:', error);
      logout();
    }
    setLoading(false);
  };

  const login = async (password) => {
    try {
      const { data } = await api.post('/auth/verify', { password });
      
      if (data.success) {
        const newToken = data.token;
        localStorage.setItem('adminToken', newToken);
        setToken(newToken);
        setUser({ role: 'admin' });
        
        // Set authorization header for all future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        return { success: true };
      }
      
      return { 
        success: false, 
        message: data.message || 'Authentication failed' 
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid password' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const { data } = await api.put('/auth/change-password', { 
        currentPassword, 
        newPassword 
      });
      
      return { 
        success: true, 
        message: data.message || 'Password changed successfully',
        newPasswordHash: data.newPasswordHash // For updating .env
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to change password' 
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    changePassword,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};