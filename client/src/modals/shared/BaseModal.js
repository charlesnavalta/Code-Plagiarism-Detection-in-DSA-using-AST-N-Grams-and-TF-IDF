// src/modals/shared/BaseModal.js
import React from 'react';
import './BaseModal.css';

const BaseModal = ({ isOpen, onClose, title, subtitle, children, isDeploying = false, customClass = '' }) => {
    if (!isOpen) return null;

    return (
        <div className="falsicode-hud-overlay">
            {/* 🌟 ADDED: customClass allows specific modals to be wider if needed */}
            <div className={`hud-modal-content fade-in-modal ${customClass}`}>
                <div className="hud-header">
                    <button type="button" className="btn-close-icon" onClick={onClose} disabled={isDeploying}>
                        &times;
                    </button>
                    <h2>{title}</h2>
                    {subtitle && <p className="hud-subtitle">{subtitle}</p>}
                </div>
                {children}
            </div>
        </div>
    );
};

export default BaseModal;