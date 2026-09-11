import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import TermsAndPrivacyModal from '../../modals/shared/TermsAndPrivacyModal';

const LandingPage = () => {
    const navigate = useNavigate();

    // Interactive State for the mockup demonstration
    const [selectedVariant, setSelectedVariant] = useState('original'); // 'original' or 'obfuscated'

    // Legal modal state
    const [legalModalOpen, setLegalModalOpen] = useState(false);
    const [legalModalTab, setLegalModalTab] = useState('terms');

    const openLegal = (tab) => {
        setLegalModalTab(tab);
        setLegalModalOpen(true);
    };

    return (
        <div className="landing-wrapper theme-dark">
            {/* Background Aurora Engine */}
            <div className="aurora-canvas" aria-hidden="true">
                <div className="aurora-blob blob-1"></div>
                <div className="aurora-blob blob-2"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="landing-navbar" aria-label="Main navigation">
                <div className="landing-logo" aria-label="Falsicode home">
                    <span className="logo-icon" aria-hidden="true">⎔</span> Falsicode.
                </div>
                <div className="nav-actions desktop-only">
                    <button
                        className="btn-nav-login"
                        onClick={() => navigate('/login')}
                        aria-label="Sign in to your Falsicode account"
                    >
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="landing-hero split-layout" role="main">

                {/* LEFT COLUMN: Value Proposition */}
                <div className="hero-text-column fade-in-up">
                    <h1 className="hero-title">
                        Beyond Text. <br/>
                        <span className="text-gradient">Analyze the Algorithm.</span>
                    </h1>
                    <p className="hero-subtitle">
                        An advanced structural plagiarism engine for Python and Java. Falsicode uses AST and TF-IDF to expose copied logic even when variables, comments, and formatting are completely disguised.
                    </p>

                    <div className="hero-action-group desktop-only">
                        <button
                            className="btn-primary-large"
                            onClick={() => navigate('/login')}
                            aria-label="Access your Falsicode dashboard"
                        >
                            Access Dashboard
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginLeft: '8px'}} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Interactive Structural Mockup */}
                <div className="hero-graphic-column fade-in-up" style={{ animationDelay: '0.2s' }} aria-label="Interactive code similarity demo">
                    <div className="glass-mockup" role="region" aria-label="Code similarity demonstration mockup">
                        <div className="mockup-header" aria-hidden="true">
                            <div className="mockup-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="mockup-url">falsicode.app/sandbox</div>
                        </div>

                        <div className="mockup-tabs swipe-container" role="tablist" aria-label="Demo code submissions">
                            <button
                                className={`mockup-tab-btn ${selectedVariant === 'original' ? 'active' : ''}`}
                                onClick={() => setSelectedVariant('original')}
                                role="tab"
                                aria-selected={selectedVariant === 'original'}
                                aria-label="View original submission A"
                            >
                                submission_A.py
                            </button>
                            <button
                                className={`mockup-tab-btn ${selectedVariant === 'obfuscated' ? 'active' : ''}`}
                                onClick={() => setSelectedVariant('obfuscated')}
                                role="tab"
                                aria-selected={selectedVariant === 'obfuscated'}
                                aria-label="View obfuscated submission B"
                            >
                                submission_B_obfuscated.py
                            </button>
                        </div>

                        <div className="mockup-body">
                            {selectedVariant === 'original' ? (
                                <div className="mockup-code-block swipe-container" role="tabpanel" aria-label="Original submission source code">
                                    <span className="m-keyword">def</span> <span className="m-func">merge_sort</span>(arr):<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="m-keyword">if</span> len(arr) &gt; 1:<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mid = len(arr) // 2<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left = arr[:mid]
                                </div>
                            ) : (
                                <div className="mockup-code-block swipe-container" role="tabpanel" aria-label="Obfuscated submission source code">
                                    <span className="m-keyword">def</span> <span className="m-func">executeSortProcess</span>(target_list):<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="m-comment"># Replaced labels and spacing entirely</span><br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="m-keyword">if</span> len(target_list) &gt; 1:<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pivot_point = len(target_list) // 2<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;first_half = target_list[:pivot_point]
                                </div>
                            )}

                            <div className="mockup-ast-line" aria-label="AST structural hash topology">
                                <span className="ast-label-text">Structural Hash Topology:</span>
                                <div className="ast-nodes-flex swipe-container" aria-hidden="true">
                                    <span className="ast-node">FunctionDef</span> ➔ <span className="ast-node">If</span> ➔ <span className="ast-node">Assign</span>
                                </div>
                            </div>

                            <div className="mockup-match-box" aria-label="Demo result: 100% structural clone match">
                                <span className="match-label">Structural Clone Matrix</span>
                                {/* Note: "100% Match" is a static demo illustration, not a product guarantee */}
                                <span className="match-percent text-gradient" aria-label="100 percent match in this demo illustration">100% Match</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Legal Footer */}
            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <span className="footer-copyright">© 2026 Falsicode. All rights reserved.</span>
                    <div className="footer-legal-links" aria-label="Legal documents">
                        <button type="button" className="footer-legal-btn" onClick={() => openLegal('privacy')} aria-label="Read our Privacy Policy">Privacy Policy</button>
                        <span className="footer-dot" aria-hidden="true">·</span>
                        <button type="button" className="footer-legal-btn" onClick={() => openLegal('terms')} aria-label="Read our Terms of Service">Terms</button>
                        <span className="footer-dot" aria-hidden="true">·</span>
                        <button type="button" className="footer-legal-btn" onClick={() => openLegal('cookies')} aria-label="Read our Cookie Policy">Cookies</button>
                        <span className="footer-dot" aria-hidden="true">·</span>
                        <button type="button" className="footer-legal-btn" onClick={() => openLegal('refund')} aria-label="Read our Refund Policy">Refund</button>
                        <span className="footer-dot" aria-hidden="true">·</span>
                        <a href="mailto:falsicode.web@gmail.com" className="footer-legal-link" aria-label="Contact Falsicode by email">Contact</a>
                    </div>
                </div>
            </footer>

            {/* 📱 APP-LIKE MOBILE BOTTOM BAR 📱 */}
            <div className="mobile-sticky-action-bar fade-in-up" style={{ animationDelay: '0.4s' }}>
                <button
                    className="btn-primary-large mobile-full-width"
                    onClick={() => navigate('/login')}
                    aria-label="Access your Falsicode dashboard"
                >
                    Access Dashboard
                </button>
                <span className="hero-microcopy" style={{ textAlign: 'center', marginTop: '8px' }}>
                    Secure platform for instructors and students.
                </span>
            </div>

            {/* Legal modal (triggered from footer links) */}
            <TermsAndPrivacyModal
                isOpen={legalModalOpen}
                initialTab={legalModalTab}
                onClose={() => setLegalModalOpen(false)}
            />
        </div>
    );
};

export default LandingPage;