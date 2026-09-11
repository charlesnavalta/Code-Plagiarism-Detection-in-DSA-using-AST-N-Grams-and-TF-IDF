// client/src/components/common/Footer.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TermsAndPrivacyModal from '../../modals/shared/TermsAndPrivacyModal';
import './Footer.css';

// Supported Languages list — cleanly expandable for future additions
const SUPPORTED_LANGUAGES = ['Python', 'Java'];

const Footer = () => {
    const location = useLocation();
    const [legalModalOpen, setLegalModalOpen] = useState(false);
    const [legalModalTab, setLegalModalTab] = useState('terms');

    // Automatically exclude footer on dedicated auth flows
    const hiddenRoutes = ['/login', '/register', '/forgot-password'];
    const isHidden = hiddenRoutes.some(path => location.pathname === path || location.pathname.startsWith(`${path}/`));
    if (isHidden) return null;

    const openLegalModal = (tab = 'terms') => {
        setLegalModalTab(tab);
        setLegalModalOpen(true);
    };

    return (
        <footer className="nexus-footer" role="contentinfo" aria-label="Site Footer">
            <div className="nexus-footer-container">
                {/* --- TOP BRAND & MISSION ROW (AlgoBlocks Inspired) --- */}
                <div className="footer-brand-section">
                    <div className="footer-brand-header">
                        <div className="footer-logo">
                            <span className="footer-logo-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                </svg>
                            </span>
                            <span className="footer-brand-name">Falsicode</span>
                        </div>
                        <span className="brand-badge-pill">Academic & Research Platform</span>
                    </div>

                    <h3 className="footer-brand-tagline">
                        Algorithmic integrity, one syntax tree at a time.
                    </h3>

                    <p className="footer-description">
                        An academic platform for detecting source code plagiarism in Data Structures & Algorithms coursework. Evaluates structural syntax trees (AST), token n-grams, and term frequency metrics to identify renamed identifiers, reordered logic, and algorithmic similarity.
                    </p>
                </div>

                {/* --- 3-COLUMN LINK GRID --- */}
                <div className="footer-grid-section">
                    {/* Column 1: Supported Languages */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">Supported Languages</h4>
                        <ul className="footer-links-list">
                            {SUPPORTED_LANGUAGES.map((lang, idx) => (
                                <li key={idx} className="footer-lang-item">
                                    <span className="lang-name">{lang}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Detection Engine */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">Detection Engine</h4>
                        <ul className="footer-links-list">
                            <li>AST Normalization</li>
                            <li>N-Gram Token Analysis</li>
                            <li>TF-IDF Vectorization</li>
                            <li>Dead Code & Boilerplate Filter</li>
                            <li>Algorithmic Similarity Scoring</li>
                            <li>Side-by-Side Diff Inspection</li>
                        </ul>
                    </div>

                    {/* Column 3: DSA References (W3Schools & Learning Resources) */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">DSA References</h4>
                        <ul className="footer-links-list">
                            <li>
                                <a href="https://www.w3schools.com/dsa/" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    W3Schools DSA Guide
                                </a>
                            </li>
                            <li>
                                <a href="https://www.w3schools.com/dsa/dsa_algo_simple.php" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    Sorting & Search Reference
                                </a>
                            </li>
                            <li>
                                <a href="https://www.w3schools.com/dsa/dsa_theory_trees.php" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    Binary Trees & Graphs
                                </a>
                            </li>
                            <li>
                                <a href="https://www.w3schools.com/dsa/" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    Dynamic Programming
                                </a>
                            </li>
                            <li>
                                <a href="https://www.w3schools.com/python/" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    Python Reference (W3Schools)
                                </a>
                            </li>
                            <li>
                                <a href="https://www.w3schools.com/java/" target="_blank" rel="noopener noreferrer" className="footer-link">
                                    Java Reference (W3Schools)
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Legal & Privacy */}
                    <div className="footer-column">
                        <h4 className="footer-column-title">Legal & Compliance</h4>
                        <ul className="footer-links-list">
                            <li>
                                <button type="button" className="footer-text-btn" onClick={() => openLegalModal('terms')}>
                                    Terms of Service
                                </button>
                            </li>
                            <li>
                                <button type="button" className="footer-text-btn" onClick={() => openLegalModal('privacy')}>
                                    Privacy Policy
                                </button>
                            </li>
                            <li>
                                <button type="button" className="footer-text-btn" onClick={() => openLegalModal('cookies')}>
                                    Cookie Policy
                                </button>
                            </li>
                            <li>
                                <button type="button" className="footer-text-btn" onClick={() => openLegalModal('refund')}>
                                    Refund Policy
                                </button>
                            </li>
                            <li>
                                <a 
                                    href="https://mail.google.com/mail/?view=cm&fs=1&to=falsicode.web@gmail.com&su=Falsicode%20Support%20Inquiry" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="footer-link"
                                >
                                    Contact Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* --- CONNECT & COMMUNITY BAR --- */}
                <div className="footer-connect-bar">
                    <span className="connect-label">Connect with Falsicode</span>
                    <div className="connect-links">
                        <a 
                            href="https://github.com/charlesnavalta/Code-Plagiarism-Detection-in-DSA-using-AST-N-Grams-and-TF-IDF" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="social-pill-btn"
                            aria-label="Falsicode GitHub Repository"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            GitHub
                        </a>
                        <a 
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=falsicode.web@gmail.com&su=Falsicode%20Support%20Inquiry" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-pill-btn"
                            aria-label="Email Support for Falsicode via Gmail"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Gmail Support
                        </a>
                    </div>
                </div>

                {/* --- EDUCATIONAL DISCLAIMER & COPYRIGHT BASE --- */}
                <div className="footer-base-section">
                    <p className="footer-academic-disclaimer">
                        Falsicode is an educational platform built for learning, academic integrity, and research purposes. Similarity metrics and AST comparisons represent structural and token alignment to assist instructors and are not a substitute for human evaluation.
                    </p>
                    <div className="footer-bottom-meta">
                        <span className="footer-copyright">
                            © 2026 Falsicode. All rights reserved. Code Plagiarism Detection in DSA.
                        </span>
                    </div>
                </div>
            </div>

            {/* Legal modal popup triggered by footer legal links */}
            <TermsAndPrivacyModal
                isOpen={legalModalOpen}
                initialTab={legalModalTab}
                onClose={() => setLegalModalOpen(false)}
            />
        </footer>
    );
};

export default Footer;
