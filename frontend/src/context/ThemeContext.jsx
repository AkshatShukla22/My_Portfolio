// frontend/src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const { data } = await api.get('/theme');
      setTheme(data.data);
    } catch (error) {
      console.error('Failed to fetch theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTheme = async (newTheme) => {
    try {
      const { data } = await api.put('/theme', newTheme);
      setTheme(data.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update theme' 
      };
    }
  };

  const resetTheme = async () => {
    try {
      const { data } = await api.post('/theme/reset');
      setTheme(data.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reset theme' 
      };
    }
  };

  const value = {
    theme,
    loading,
    updateTheme,
    resetTheme,
    refreshTheme: fetchTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};