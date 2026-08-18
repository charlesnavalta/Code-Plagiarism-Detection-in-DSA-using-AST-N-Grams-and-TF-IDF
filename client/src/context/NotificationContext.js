import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((type, message, title, duration = 3000) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast = { id, type, message, title, duration };
        setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 active
        return id;
    }, []);

    const toast = {
        success: (message, title = "Success", duration = 2800) => showToast('success', message, title, duration),
        error: (message, title = "Error", duration = 3200) => showToast('error', message, title, duration),
        warning: (message, title = "Warning", duration = 3000) => showToast('warning', message, title, duration),
        info: (message, title = "Information", duration = 3000) => showToast('info', message, title, duration),
        remove: removeToast
    };

    return (
        <NotificationContext.Provider value={{ toasts, toast, removeToast }}>
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
