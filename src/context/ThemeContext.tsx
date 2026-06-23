import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'cosmic' | 'neon-purple' | 'lava-red' | 'ocean-blue' | 'emerald-green';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeStyles = {
  cosmic: {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    accent: '#EC4899',
    background: 'linear-gradient(135deg, #020617 0%, #0F172A 100%)',
  },
  'neon-purple': {
    primary: '#A855F7',
    secondary: '#D946EF',
    accent: '#F43F5E',
    background: 'linear-gradient(135deg, #0A0A0A 0%, #1E1B4B 100%)',
  },
  'lava-red': {
    primary: '#EF4444',
    secondary: '#F97316',
    accent: '#DC2626',
    background: 'linear-gradient(135deg, #1A0B0B 0%, #2D0A0A 100%)',
  },
  'ocean-blue': {
    primary: '#06B6D4',
    secondary: '#3B82F6',
    accent: '#0EA5E9',
    background: 'linear-gradient(135deg, #0B1A2D 0%, #0F2B3D 100%)',
  },
  'emerald-green': {
    primary: '#10B981',
    secondary: '#34D399',
    accent: '#059669',
    background: 'linear-gradient(135deg, #0B1D15 0%, #0A2B1F 100%)',
  },
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'cosmic';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const styles = themeStyles[theme];
    document.documentElement.style.setProperty('--theme-primary', styles.primary);
    document.documentElement.style.setProperty('--theme-secondary', styles.secondary);
    document.documentElement.style.setProperty('--theme-accent', styles.accent);
    document.body.style.background = styles.background;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
