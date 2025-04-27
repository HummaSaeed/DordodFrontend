import React, { createContext, useContext, useState } from 'react';

// Define default theme values
const defaultTheme = {
  colors: {
    primary: '#2C3E50',
    secondary: '#3498db',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    background: '#ffffff',
    text: '#212529'
  },
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.1)',
    lg: '0 8px 16px rgba(0,0,0,0.1)'
  },
  gradients: {
    primary: 'linear-gradient(45deg, #2C3E50, #28a745)',
    secondary: 'linear-gradient(45deg, #3498db, #2ecc71)'
  }
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        background: !isDarkMode ? '#1a1a1a' : '#ffffff',
        text: !isDarkMode ? '#ffffff' : '#212529'
      }
    }));
  };

  const value = {
    theme,
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 