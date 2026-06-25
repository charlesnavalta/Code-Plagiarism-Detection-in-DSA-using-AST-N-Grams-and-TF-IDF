import { useState, useEffect } from 'react';

export const useTheme = () => {
    // 1. Get the current theme from storage (default to dark)
    const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');

    // 2. Listen for the 'storage' event across the whole app
    useEffect(() => {
        const handleThemeChange = () => {
            const updatedTheme = localStorage.getItem('app-theme') || 'dark';
            setTheme(updatedTheme);
        };

        window.addEventListener('storage', handleThemeChange);
        return () => window.removeEventListener('storage', handleThemeChange);
    }, []);

    // 3. Automatically update the HTML root so global CSS works
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    return [theme, setTheme];
};