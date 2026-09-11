// client/src/components/common/CookieConsentBanner.js
import React, { useState, useEffect } from 'react';
import './CookieConsentBanner.css';
import TermsAndPrivacyModal from '../../modals/shared/TermsAndPrivacyModal';

const CONSENT_KEY = 'cookie-consent';

const CookieConsentBanner = () => {
    const [visible, setVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // Show banner only if the user has not yet acknowledged
        if (!localStorage.getItem(CONSENT_KEY)) {
            const timer = setTimeout(() => setVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
    };

    const handleLearnMore = () => {
        setModalOpen(true);
    };

    const handleModalAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
        setModalOpen(false);
    };

    if (!visible) return null;

    return (
        <>
            <aside
                className="cookie-floating-card"
                role="region"
                aria-label="Storage and privacy notice"
                aria-describedby="cookie-card-desc"
            >
                <div className="cookie-card-header">
                    <div className="cookie-header-title">
                        <span className="cookie-icon-wrapper" aria-hidden="true">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                        </span>
                        <span className="cookie-title-text">Storage & Privacy</span>
                    </div>
                    <button
                        type="button"
                        className="cookie-dismiss-btn"
                        onClick={handleAccept}
                        aria-label="Dismiss notice"
                        title="Dismiss"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <p id="cookie-card-desc" className="cookie-card-text">
                    Falsicode uses only strictly necessary browser storage for session authentication and theme settings.{' '}
                    <strong>No tracking cookies, analytics, or advertising.</strong>
                </p>

                <div className="cookie-card-actions">
                    <button
                        type="button"
                        className="cookie-btn-link"
                        onClick={handleLearnMore}
                    >
                        Cookie Policy
                    </button>
                    <button
                        type="button"
                        className="cookie-btn-confirm"
                        onClick={handleAccept}
                    >
                        Got it
                    </button>
                </div>
            </aside>

            {/* Legal modal opened to the Cookie Policy tab */}
            <TermsAndPrivacyModal
                isOpen={modalOpen}
                initialTab="cookies"
                onClose={() => setModalOpen(false)}
                onAccept={handleModalAccept}
            />
        </>
    );
};

export default CookieConsentBanner;
