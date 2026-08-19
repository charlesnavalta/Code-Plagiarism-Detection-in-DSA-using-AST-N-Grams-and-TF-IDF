import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    // Mode can be: 'dark', 'light', or 'system'
    const [themePreference, setThemePreference] = useState(() => {
        return localStorage.getItem('app-theme') || 'dark';
    });

    // Resolved theme is strictly 'dark' or 'light'
    const getSystemTheme = () => {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const [resolvedTheme, setResolvedTheme] = useState(() => {
        const saved = localStorage.getItem('app-theme') || 'dark';
        if (saved === 'system') return getSystemTheme();
        return saved;
    });

    // Handle system preference changes dynamically
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleMediaChange = (e) => {
            if (themePreference === 'system') {
                const newSysTheme = e.matches ? 'dark' : 'light';
                setResolvedTheme(newSysTheme);
                document.documentElement.setAttribute('data-theme', newSysTheme);
                document.body.setAttribute('data-theme', newSysTheme);
            }
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleMediaChange);
        } else {
            mediaQuery.addListener(handleMediaChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleMediaChange);
            } else {
                mediaQuery.removeListener(handleMediaChange);
            }
        };
    }, [themePreference]);

    // Apply theme changes to DOM and localStorage
    useEffect(() => {
        let active = themePreference;
        if (themePreference === 'system') {
            active = getSystemTheme();
        }
        setResolvedTheme(active);
        document.documentElement.setAttribute('data-theme', active);
        document.body.setAttribute('data-theme', active);
        localStorage.setItem('app-theme', themePreference);
    }, [themePreference]);

    const setTheme = useCallback((newTheme) => {
        // newTheme can be 'dark', 'light', or 'system'
        setThemePreference(newTheme);
    }, []);

    const cycleTheme = useCallback(() => {
        setThemePreference((prev) => {
            if (prev === 'dark') return 'light';
            if (prev === 'light') return 'system';
            return 'dark';
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ 
            theme: resolvedTheme, 
            themePreference, 
            setTheme, 
            cycleTheme 
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        // Fallback for isolated usages
        const fallbackTheme = localStorage.getItem('app-theme') || 'dark';
        return [fallbackTheme, () => {}];
    }
    return [context.theme, context.setTheme, context.themePreference, context.cycleTheme];
};

export default ThemeContext;
