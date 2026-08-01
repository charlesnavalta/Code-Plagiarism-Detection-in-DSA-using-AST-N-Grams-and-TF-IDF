import React from 'react';
import './AuthButton.css';

const AuthButton = ({ children, loading, loadingText, type = "submit", variant = "primary", disabled, onClick, ...props }) => {
    return (
        <button 
            type={type} 
            className={`auth-submit-btn btn-${variant}`} 
            disabled={loading || disabled}
            onClick={onClick}
            {...props}
        >
            {loading ? loadingText : children}
        </button>
    );
};

export default AuthButton;