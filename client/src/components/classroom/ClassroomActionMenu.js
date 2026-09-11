// client/src/components/classroom/ClassroomActionMenu.js
import React, { useState, useRef, useEffect } from 'react';
import './ClassroomActionMenu.css';

const ClassroomActionMenu = ({
    role = 'instructor',
    classroom,
    onEdit,
    onRegenerateCode,
    onViewRoster,
    onDelete,
    onViewClassmates,
    onLeave,
    variant = 'card'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown on outside click or Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
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
        e.preventDefault();
        setIsOpen(prev => !prev);
    };

    const handleAction = (e, callback) => {
        e.stopPropagation();
        e.preventDefault();
        setIsOpen(false);
        if (callback) {
            callback(classroom);
        }
    };

    return (
        <div className={`classroom-menu-container variant-${variant}`} ref={menuRef}>
            <button
                type="button"
                className={`classroom-dots-btn ${isOpen ? 'active' : ''}`}
                onClick={handleToggle}
                aria-label="Classroom options menu"
                aria-haspopup="true"
                aria-expanded={isOpen}
                title="Classroom options"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="19" cy="12" r="1.5"></circle>
                    <circle cx="5" cy="12" r="1.5"></circle>
                </svg>
            </button>

            {isOpen && (
                <div className="classroom-dropdown-menu" role="menu" onClick={(e) => e.stopPropagation()}>
                    {role === 'instructor' && (
                        <>
                            <button
                                type="button"
                                className="dropdown-item"
                                role="menuitem"
                                onClick={(e) => handleAction(e, onEdit)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                <span>Edit Classroom</span>
                            </button>

                            <button
                                type="button"
                                className="dropdown-item"
                                role="menuitem"
                                onClick={(e) => handleAction(e, onViewRoster)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>Student Roster</span>
                            </button>

                            <div className="dropdown-divider" role="separator"></div>

                            <button
                                type="button"
                                className="dropdown-item item-danger"
                                role="menuitem"
                                onClick={(e) => handleAction(e, onDelete)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                <span>Delete Classroom</span>
                            </button>
                        </>
                    )}

                    {role === 'student' && (
                        <>
                            <button
                                type="button"
                                className="dropdown-item"
                                role="menuitem"
                                onClick={(e) => handleAction(e, onViewClassmates)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>View Classmates</span>
                            </button>

                            <div className="dropdown-divider" role="separator"></div>

                            <button
                                type="button"
                                className="dropdown-item item-danger"
                                role="menuitem"
                                onClick={(e) => handleAction(e, onLeave)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                <span>Leave Classroom</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClassroomActionMenu;
