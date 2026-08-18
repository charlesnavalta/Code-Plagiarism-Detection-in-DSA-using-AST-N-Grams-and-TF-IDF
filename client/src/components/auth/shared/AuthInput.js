import React, { useState } from 'react';
import './AuthInput.css';

const AuthInput = ({ type, placeholder, value, onChange, icon, name, autoComplete, required, extraStyles, maxLength, minLength }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const currentType = isPasswordType && showPassword ? 'text' : type;

    return (
        <div className="auth-input-group">
            <div className="auth-input-wrapper">
                {icon && <span className="auth-input-icon">{icon}</span>}
                
                <input 
                    type={currentType}
                    name={name}
                    autoComplete={autoComplete}
                    placeholder={placeholder} 
                    className="auth-styled-input"
                    value={value}
                    onChange={onChange}
                    required={required}
                    maxLength={maxLength}
                    minLength={minLength}
                    style={{
                        paddingLeft: icon ? '40px' : '12px',
                        paddingRight: isPasswordType ? '40px' : '12px',
                        ...extraStyles
                    }}
                />
                
                {isPasswordType && (
                    <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AuthInput;