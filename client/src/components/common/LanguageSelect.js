import React, { useState, useRef, useEffect } from 'react';
import './LanguageSelect.css';

const LANGUAGES = [
    {
        id: 'python',
        name: 'Python',
        ext: '.py',
        badgeClass: 'badge-python',
        description: 'AST Syntax Tree + N-Grams',
        icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="lang-icon-svg">
                <path d="M11.914 2C6.732 2 7.054 4.25 7.054 4.25l.006 2.333h4.94v.7H5.06S2 7.03 2 12.21c0 5.183 2.673 5.018 2.673 5.018h1.593v-2.247s-.086-2.673 2.628-2.673h4.509s2.541.042 2.541-2.497V4.542S16.292 2 11.914 2zm-2.82 1.488a.94.94 0 110 1.88.94.94 0 010-1.88z" fill="#3b82f6"/>
                <path d="M12.086 22c5.182 0 4.86-2.25 4.86-2.25l-.006-2.333h-4.94v-.7h6.94s3.06.253 3.06-4.927c0-5.183-2.673-5.018-2.673-5.018h-1.593v2.247s.086 2.673-2.628 2.673H10.6s-2.541-.042-2.541 2.497v4.961S7.708 22 12.086 22zm2.82-1.488a.94.94 0 110-1.88.94.94 0 010 1.88z" fill="#eab308"/>
            </svg>
        )
    },
    {
        id: 'java',
        name: 'Java',
        ext: '.java',
        badgeClass: 'badge-java',
        description: 'Javalang Parsing + TF-IDF',
        icon: (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="lang-icon-svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="#f97316"/>
                <line x1="6" y1="1" x2="6" y2="4" stroke="#ef4444" strokeLinecap="round"/>
                <line x1="10" y1="1" x2="10" y2="4" stroke="#ef4444" strokeLinecap="round"/>
                <line x1="14" y1="1" x2="14" y2="4" stroke="#ef4444" strokeLinecap="round"/>
            </svg>
        )
    }
];

const LanguageSelect = ({ value = 'python', onChange, id = 'assign-lang-select', name = 'language', label = 'Programming Language', disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = LANGUAGES.find(lang => lang.id === (value || '').toLowerCase()) || LANGUAGES[0];

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSelect = (langId) => {
        if (disabled) return;
        setIsOpen(false);
        if (onChange) {
            onChange({
                target: {
                    name,
                    value: langId
                }
            });
        }
    };

    return (
        <div className="custom-lang-select-group" ref={dropdownRef}>
            {label && <label htmlFor={id} className="custom-lang-label">{label}</label>}

            <div className={`custom-lang-select-wrapper ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}>
                {/* Trigger Button */}
                <button
                    type="button"
                    id={id}
                    className="custom-lang-trigger"
                    onClick={() => !disabled && setIsOpen(prev => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    disabled={disabled}
                >
                    <div className="custom-lang-trigger-left">
                        <div className="custom-lang-icon-wrap">
                            {selectedOption.icon}
                        </div>
                        <span className="custom-lang-name">{selectedOption.name}</span>
                        <span className={`custom-lang-ext-badge ${selectedOption.badgeClass}`}>
                            {selectedOption.ext}
                        </span>
                    </div>

                    <div className="custom-lang-chevron">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>

                {/* Dropdown Options List */}
                {isOpen && (
                    <div className="custom-lang-dropdown-menu" role="listbox" tabIndex={-1}>
                        <div className="custom-lang-menu-header">
                            <span>Select Target Compiler & Parser</span>
                        </div>
                        {LANGUAGES.map((lang) => {
                            const isSelected = lang.id === selectedOption.id;
                            return (
                                <button
                                    key={lang.id}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`custom-lang-option ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelect(lang.id)}
                                >
                                    <div className="custom-lang-option-left">
                                        <div className="custom-lang-option-icon">
                                            {lang.icon}
                                        </div>
                                        <div className="custom-lang-option-text">
                                            <div className="custom-lang-option-title-row">
                                                <strong className="custom-lang-option-title">{lang.name}</strong>
                                                <span className={`custom-lang-ext-badge ${lang.badgeClass}`}>
                                                    {lang.ext}
                                                </span>
                                            </div>
                                            <span className="custom-lang-option-sub">{lang.description}</span>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="custom-lang-check-icon">
                                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Hidden Input for Form Submissions */}
                <input type="hidden" name={name} value={selectedOption.id} />
            </div>
        </div>
    );
};

export default LanguageSelect;
