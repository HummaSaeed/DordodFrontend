import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#28a745');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const theme = {
    colors: {
      primary: primaryColor,
      background: isDarkMode ? '#1a1a1a' : '#ffffff',
      text: isDarkMode ? '#ffffff' : '#333333',
    },
    // ... other theme properties
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleDarkMode, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}; 