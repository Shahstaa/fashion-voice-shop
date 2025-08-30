import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ThemeContextProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  // Track if user has set a manual preference
  const [manual, setManual] = useState(false);

  // Helper to apply theme
  const applyTheme = useCallback((dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // On mount: set theme from localStorage or system
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark') {
      setIsDark(true);
      setManual(true);
      applyTheme(true);
    } else if (savedTheme === 'light') {
      setIsDark(false);
      setManual(true);
      applyTheme(false);
    } else {
      setIsDark(prefersDark);
      setManual(false);
      applyTheme(prefersDark);
    }
  }, [applyTheme]);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!manual) {
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [manual, applyTheme]);

  // Listen for theme changes in other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const value = e.newValue;
        if (value === 'dark') {
          setIsDark(true);
          setManual(true);
          applyTheme(true);
        } else if (value === 'light') {
          setIsDark(false);
          setManual(true);
          applyTheme(false);
        } else {
          // If cleared, follow system
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDark(prefersDark);
          setManual(false);
          applyTheme(prefersDark);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [applyTheme]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      setManual(true);
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      applyTheme(newTheme);
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
