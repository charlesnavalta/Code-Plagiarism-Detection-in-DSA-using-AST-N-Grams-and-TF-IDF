// src/modals/shared/BaseModal.js
import React from 'react';
import './BaseModal.css';

const BaseModal = ({ 
    isOpen, 
    onClose, 
    title, 
    subtitle, 
    children, 
    isDeploying = false, 
    isLoading = false,
    skeletonComponent = null,
    customClass = '' 
}) => {
    if (!isOpen) return null;

    return (
        <div className="falsicode-hud-overlay" onClick={(e) => {
            if (e.target === e.currentTarget && !isDeploying) onClose();
        }}>
            {/* 🌟 customClass allows specific modals to be wider if needed */}
            <div className={`hud-modal-content fade-in-modal ${customClass}`}>
                {/* 🌟 Mobile Top Sheet Handle Indicator */}
                <div className="hud-sheet-handle-bar hide-desktop">
                    <div className="hud-sheet-handle"></div>
                </div>

                <div className="hud-header">
                    <button type="button" className="btn-close-icon" onClick={onClose} disabled={isDeploying}>
                        &times;
                    </button>
                    <h2>{title}</h2>
                    {subtitle && <p className="hud-subtitle">{subtitle}</p>}
                </div>
                
                {isLoading && skeletonComponent ? (
                    <div className="hud-modal-body">
                        {skeletonComponent}
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default BaseModal;