// src/components/common/SessionTimeoutManager.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '../../context/NotificationContext';
import './SessionTimeoutManager.css';

// 30 Minutes total idle timeout
const TOTAL_IDLE_TIMEOUT_MS = 30 * 60 * 1000;
// Warning prompt appears 2 minutes before total logout (120 seconds countdown)
const WARNING_WINDOW_MS = 2 * 60 * 1000;

const SessionTimeoutManager = () => {
    const toast = useToast();
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(120);

    const lastActivityRef = useRef(Date.now());
    const warningIntervalRef = useRef(null);
    const checkIntervalRef = useRef(null);

    const isAuthenticated = () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return Boolean(token);
    };

    const isAuthPage = () => {
        const path = window.location.pathname;
        return path === '/login' || path === '/register' || path === '/forgot-password' || path === '/verify-otp';
    };

    const handlePerformLogout = useCallback((isManual = false) => {
        setIsWarningOpen(false);
        if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
        if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');

        if (!isManual) {
            toast.warning("Your session has expired due to 30 minutes of inactivity. Please log in again.", "Session Timed Out");
        }

        window.location.href = '/login';
    }, [toast]);

    const resetActivityTimer = useCallback(() => {
        lastActivityRef.current = Date.now();
        if (isWarningOpen) {
            setIsWarningOpen(false);
            if (warningIntervalRef.current) {
                clearInterval(warningIntervalRef.current);
                warningIntervalRef.current = null;
            }
        }
    }, [isWarningOpen]);

    // Track user activity across mouse, keyboard, touch, and scrolls
    useEffect(() => {
        let lastThrottle = 0;
        const handleUserActivity = () => {
            const now = Date.now();
            if (now - lastThrottle > 1000) {
                lastThrottle = now;
                // If warning is not visible, record user activity
                if (!isWarningOpen) {
                    lastActivityRef.current = now;
                }
            }
        };

        const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
        activityEvents.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));

        return () => {
            activityEvents.forEach(evt => window.removeEventListener(evt, handleUserActivity));
        };
    }, [isWarningOpen]);

    // Interval to monitor inactivity
    useEffect(() => {
        const checkIdleStatus = () => {
            if (!isAuthenticated() || isAuthPage()) {
                return;
            }

            const elapsed = Date.now() - lastActivityRef.current;
            const timeUntilExpiry = TOTAL_IDLE_TIMEOUT_MS - elapsed;

            if (timeUntilExpiry <= 0) {
                handlePerformLogout(false);
            } else if (timeUntilExpiry <= WARNING_WINDOW_MS && !isWarningOpen) {
                setIsWarningOpen(true);
                const initialSeconds = Math.max(1, Math.floor(timeUntilExpiry / 1000));
                setSecondsRemaining(initialSeconds);
            }
        };

        checkIntervalRef.current = setInterval(checkIdleStatus, 2000);

        return () => {
            if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
        };
    }, [isWarningOpen, handlePerformLogout]);

    // Countdown timer inside the warning popup
    useEffect(() => {
        if (!isWarningOpen) return;

        warningIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - lastActivityRef.current;
            const remainingMs = TOTAL_IDLE_TIMEOUT_MS - elapsed;
            const remainingSec = Math.floor(remainingMs / 1000);

            if (remainingSec <= 0) {
                clearInterval(warningIntervalRef.current);
                handlePerformLogout(false);
            } else {
                setSecondsRemaining(remainingSec);
            }
        }, 1000);

        return () => {
            if (warningIntervalRef.current) clearInterval(warningIntervalRef.current);
        };
    }, [isWarningOpen, handlePerformLogout]);

    if (!isWarningOpen || !isAuthenticated() || isAuthPage()) {
        return null;
    }

    const formatCountdown = (totalSec) => {
        const minutes = Math.floor(totalSec / 60);
        const seconds = totalSec % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className="session-warning-overlay" role="alertdialog" aria-modal="true">
            <div className="session-warning-card">
                <div className="session-warning-icon-badge">
                    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                </div>

                <h3 className="session-warning-title">Session Expiring Soon</h3>
                <p className="session-warning-desc">
                    You have been inactive for a while. For your account security, you will be automatically logged out unless you continue.
                </p>

                <div className="session-timer-clock">
                    <span className="session-clock-digit">{formatCountdown(secondsRemaining)}</span>
                    <span className="session-clock-unit">remaining</span>
                </div>

                <div className="session-warning-actions">
                    <button 
                        type="button" 
                        className="btn-session-stay" 
                        onClick={resetActivityTimer}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Stay Logged In
                    </button>
                    <button 
                        type="button" 
                        className="btn-session-logout" 
                        onClick={() => handlePerformLogout(true)}
                    >
                        Log Out Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionTimeoutManager;
