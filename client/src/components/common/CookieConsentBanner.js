// src/components/common/CookieConsentBanner.js
import React, { useState, useEffect } from 'react';
import './CookieConsentBanner.css';
import TermsAndPrivacyModal from '../../modals/shared/TermsAndPrivacyModal';

const CONSENT_KEY = 'cookie-consent';

const CookieConsentBanner = () => {
    const [visible, setVisible] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // Show banner only if the user has not yet accepted
        if (!localStorage.getItem(CONSENT_KEY)) {
            // Slight delay so the page first paints without the banner
            const t = setTimeout(() => setVisible(true), 800);
            return () => clearTimeout(t);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
    };

    const handleLearnMore = () => {
        setModalOpen(true);
    };

    // When the modal is closed/accepted, also dismiss the banner
    const handleModalAccept = () => {
        localStorage.setItem(CONSENT_KEY, 'accepted');
        setVisible(false);
        setModalOpen(false);
    };

    if (!visible) return null;

    return (
        <>
            <div
                className="cookie-banner"
                role="dialog"
                aria-modal="false"
                aria-label="Cookie consent notice"
                aria-describedby="cookie-banner-desc"
            >
                <div className="cookie-banner-inner">
                    <div className="cookie-banner-icon" aria-hidden="true">🍪</div>
                    <p id="cookie-banner-desc" className="cookie-banner-text">
                        Falsicode uses only strictly necessary browser storage — a session token, your role data, and a theme preference.{' '}
                        <strong>No tracking cookies. No analytics. No ads.</strong>
                    </p>
                    <div className="cookie-banner-actions">
                        <button
                            type="button"
                            className="cookie-btn-learn"
                            onClick={handleLearnMore}
                            aria-label="Learn more about our cookie usage"
                        >
                            Learn More
                        </button>
                        <button
                            type="button"
                            className="cookie-btn-accept"
                            onClick={handleAccept}
                            aria-label="Accept and dismiss cookie notice"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            </div>

            {/* Reuse the legal modal opened to the Cookie Policy tab */}
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
