import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [currentToast, setCurrentToast] = useState(null);
    const [isExiting, setIsExiting] = useState(false);
    const transitionTimeoutRef = useRef(null);

    const removeToast = useCallback((id) => {
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        setIsExiting(true);
        transitionTimeoutRef.current = setTimeout(() => {
            setCurrentToast(null);
            setIsExiting(false);
        }, 260);
    }, []);

    const clearToasts = useCallback(() => {
        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        setIsExiting(true);
        transitionTimeoutRef.current = setTimeout(() => {
            setCurrentToast(null);
            setIsExiting(false);
        }, 260);
    }, []);

    const showToast = useCallback((type, message, title, duration = 3000) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast = { id, type, message, title, duration };

        if (transitionTimeoutRef.current) {
            clearTimeout(transitionTimeoutRef.current);
        }

        setCurrentToast((prev) => {
            if (prev) {
                // 🌟 Step 1: Smoothly animate out the first notification
                setIsExiting(true);
                // 🌟 Step 2: Introduce a slight delay (260ms) before the second notification transitions in
                transitionTimeoutRef.current = setTimeout(() => {
                    setIsExiting(false);
                    setCurrentToast(newToast);
                }, 260);
                return prev;
            } else {
                // 🌟 If no notification is active, display immediately
                setIsExiting(false);
                return newToast;
            }
        });

        return id;
    }, []);

    const toast = {
        success: (message, title = "Success", duration = 2800) => showToast('success', message, title, duration),
        error: (message, title = "Error", duration = 3200) => showToast('error', message, title, duration),
        warning: (message, title = "Warning", duration = 3000) => showToast('warning', message, title, duration),
        info: (message, title = "Information", duration = 3000) => showToast('info', message, title, duration),
        remove: removeToast,
        clear: clearToasts
    };

    const toasts = currentToast ? [currentToast] : [];

    return (
        <NotificationContext.Provider value={{ toasts, currentToast, isExiting, toast, removeToast, clearToasts }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useToast must be used within a NotificationProvider');
    }
    return context.toast;
};

export const useNotificationContext = () => useContext(NotificationContext);
