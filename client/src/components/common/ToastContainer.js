import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNotificationContext } from '../../context/NotificationContext';
import './Toast.css';

const ToastItem = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const dismissedRef = useRef(false);

    const handleDismiss = useCallback(() => {
        if (dismissedRef.current) return;
        dismissedRef.current = true;
        setIsExiting(true);
        setTimeout(() => {
            onRemove(toast.id);
        }, 280);
    }, [onRemove, toast.id]);

    useEffect(() => {
        if (isPaused) return;
        const timer = setTimeout(() => {
            handleDismiss();
        }, toast.duration);

        return () => clearTimeout(timer);
    }, [isPaused, toast.duration, handleDismiss]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                );
            case 'error':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                );
            case 'info':
            default:
                return (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                );
        }
    };

    return (
        <div 
            className={`toast-item toast-${toast.type} ${isExiting ? 'exiting' : ''}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="toast-icon-wrapper">
                {getIcon()}
            </div>
            
            <div className="toast-content">
                {toast.title && <div className="toast-title">{toast.title}</div>}
                <div className="toast-message">{toast.message}</div>
            </div>

            <button className="toast-close-btn" onClick={handleDismiss} aria-label="Close notification">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div className="toast-progress-track">
                <div 
                    className="toast-progress-bar"
                    style={{ 
                        animationDuration: `${toast.duration}ms`,
                        animationPlayState: isPaused ? 'paused' : 'running'
                    }}
                    onAnimationEnd={handleDismiss}
                />
            </div>
        </div>
    );
};

const ToastContainer = () => {
    const context = useNotificationContext();
    if (!context || !context.toasts || context.toasts.length === 0) return null;

    return (
        <div className="toast-container" aria-live="polite" aria-atomic="true">
            {context.toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={context.removeToast} />
            ))}
        </div>
    );
};

export default ToastContainer;
