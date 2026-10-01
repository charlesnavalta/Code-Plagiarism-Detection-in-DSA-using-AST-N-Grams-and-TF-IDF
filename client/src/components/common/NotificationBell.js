import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService';
import './NotificationBell.css';

// Formats UTC/ISO timestamp to human-friendly relative time (Asia/Manila time)
const formatRelativeTime = (isoString) => {
    if (!isoString) return '';
    // Normalize ISO string: if naive without timezone specifier, append 'Z' for UTC
    const normalizedIso = (typeof isoString === 'string' && !isoString.endsWith('Z') && !isoString.includes('+')) 
        ? `${isoString}Z` 
        : isoString;
    const date = new Date(normalizedIso);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.max(0, Math.floor(diffMs / 1000));
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-PH', { 
        month: 'short', 
        day: 'numeric',
        timeZone: 'Asia/Manila'
    });
};

// Returns type-specific SVG icon
const getNotificationTypeIcon = (type) => {
    switch (type) {
        case 'assignment':
            return (
                <div className="notif-type-icon notif-type-assignment" title="Assignment">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                </div>
            );
        case 'submission':
            return (
                <div className="notif-type-icon notif-type-submission" title="Submission">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                </div>
            );
        case 'resubmit':
            return (
                <div className="notif-type-icon notif-type-resubmit" title="Resubmission Unlocked">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                    </svg>
                </div>
            );
        case 'grade':
            return (
                <div className="notif-type-icon notif-type-grade" title="Grade Posted">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                </div>
            );
        case 'remarks':
            return (
                <div className="notif-type-icon notif-type-remarks" title="Instructor Remarks">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
            );
        case 'audit':
            return (
                <div className="notif-type-icon notif-type-audit" title="Plagiarism Audit">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        <polyline points="9 12 11 14 15 10"></polyline>
                    </svg>
                </div>
            );
        default:
            return (
                <div className="notif-type-icon notif-type-system" title="System Notice">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                </div>
            );
    }
};

const NotificationBell = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filterTab, setFilterTab] = useState('all'); // 'all' | 'unread'
    const containerRef = useRef(null);

    // Fetch user's notifications
    const loadNotifications = useCallback(async () => {
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            // Silently handle if unauthenticated or network error
        }
    }, []);

    // Initial fetch + Periodic polling every 30s
    useEffect(() => {
        loadNotifications();

        const intervalId = setInterval(() => {
            if (document.visibilityState === 'visible') {
                loadNotifications();
            }
        }, 30000);

        const handleCustomRefresh = () => loadNotifications();
        window.addEventListener('refresh-notifications', handleCustomRefresh);
        window.addEventListener('focus', handleCustomRefresh);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('refresh-notifications', handleCustomRefresh);
            window.removeEventListener('focus', handleCustomRefresh);
        };
    }, [loadNotifications]);

    // Close on click outside or Escape
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    const handleItemClick = async (notif) => {
        // Mark as read in state & backend
        if (!notif.is_read) {
            setNotifications((prev) =>
                prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
            try {
                await notificationService.markAsRead(notif.id);
            } catch (_) {}
        }

        setIsOpen(false);

        // Deep link navigation
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const handleMarkAllAsRead = async (e) => {
        e.stopPropagation();
        if (unreadCount === 0) return;

        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);

        try {
            await notificationService.markAllAsRead();
        } catch (_) {
            loadNotifications();
        }
    };

    const handleDelete = async (e, notifId) => {
        e.stopPropagation();
        const targetNotif = notifications.find((n) => n.id === notifId);
        const wasUnread = targetNotif && !targetNotif.is_read;

        setNotifications((prev) => prev.filter((n) => n.id !== notifId));
        if (wasUnread) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        try {
            await notificationService.deleteNotification(notifId);
        } catch (_) {
            loadNotifications();
        }
    };

    const handleClearAll = async (e) => {
        e.stopPropagation();
        if (notifications.length === 0) return;

        setNotifications([]);
        setUnreadCount(0);

        try {
            await notificationService.clearAll();
        } catch (_) {
            loadNotifications();
        }
    };

    const displayedNotifications = notifications.filter((n) => {
        if (filterTab === 'unread') return !n.is_read;
        return true;
    });

    return (
        <div className="notif-center-wrapper" ref={containerRef}>
            {/* Bell Trigger Button */}
            <button
                type="button"
                className={`notif-bell-trigger ${isOpen ? 'active' : ''} ${unreadCount > 0 ? 'has-unread' : ''}`}
                onClick={handleToggle}
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                title="Notifications"
            >
                <div className="bell-icon-wrap">
                    <svg width="19" height="19" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>

                    {unreadCount > 0 && (
                        <span className="notif-badge-pill" aria-hidden="true">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
            </button>

            {/* Notification Dropdown Drawer Panel */}
            {isOpen && (
                <div className="notif-dropdown-drawer fade-in-down" role="region" aria-label="Notifications Panel">
                    {/* Header */}
                    <div className="notif-drawer-header">
                        <div className="notif-header-title-group">
                            <svg className="notif-header-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                            <h3>Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="notif-unread-count-pill">{unreadCount} New</span>
                            )}
                        </div>

                        <div className="notif-header-actions">
                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    className="btn-notif-action"
                                    onClick={handleMarkAllAsRead}
                                    title="Mark all as read"
                                    aria-label="Mark all as read"
                                >
                                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    <span>Read All</span>
                                </button>
                            )}

                            {notifications.length > 0 && (
                                <button
                                    type="button"
                                    className="btn-notif-action notif-clear-btn"
                                    onClick={handleClearAll}
                                    title="Clear all notifications"
                                    aria-label="Clear all notifications"
                                >
                                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    <span>Clear</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Segmented Pills */}
                    <div className="notif-filter-tabs">
                        <button
                            type="button"
                            className={`notif-tab-chip ${filterTab === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterTab('all')}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            type="button"
                            className={`notif-tab-chip ${filterTab === 'unread' ? 'active' : ''}`}
                            onClick={() => setFilterTab('unread')}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>

                    {/* Notification Items List */}
                    <div className="notif-list-scroll">
                        {displayedNotifications.length > 0 ? (
                            displayedNotifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`notif-item-row ${!notif.is_read ? 'is-unread' : 'is-read'} ${notif.link ? 'clickable' : ''}`}
                                    onClick={() => handleItemClick(notif)}
                                >
                                    <div className="notif-item-leading">
                                        {getNotificationTypeIcon(notif.type)}
                                    </div>

                                    <div className="notif-item-body">
                                        <div className="notif-item-title-row">
                                            <span className="notif-item-title">{notif.title}</span>
                                            {!notif.is_read && <span className="notif-unread-dot" title="Unread" />}
                                        </div>
                                        <p className="notif-item-message">{notif.message}</p>
                                        <span className="notif-item-time">{formatRelativeTime(notif.created_at)}</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="notif-item-dismiss-btn"
                                        onClick={(e) => handleDelete(e, notif.id)}
                                        title="Dismiss notification"
                                        aria-label="Dismiss notification"
                                    >
                                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="18" y1="6" x2="6" y2="18"></line>
                                            <line x1="6" y1="6" x2="18" y2="18"></line>
                                        </svg>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="notif-empty-state">
                                <div className="notif-empty-icon-wrap">
                                    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                    </svg>
                                </div>
                                <h4>{filterTab === 'unread' ? 'No Unread Notifications' : 'No Notifications Yet'}</h4>
                                <p>
                                    {filterTab === 'unread'
                                        ? "You've read all your notifications! Check back later."
                                        : 'Alerts for assignments, submissions, and audits will appear here.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
