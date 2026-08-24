// src/modals/shared/TermsAndPrivacyModal.js
import React, { useState, useEffect } from 'react';
import './TermsAndPrivacyModal.css';

const TermsAndPrivacyModal = ({ isOpen, onClose, initialTab = 'terms', onAccept }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    const handleAcceptAndClose = () => {
        if (onAccept) {
            onAccept();
        }
        onClose();
    };

    return (
        <div className="terms-modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className="terms-modal-container fade-in-modal">
                {/* Mobile Drag Indicator */}
                <div className="terms-sheet-handle-bar hide-desktop">
                    <div className="terms-sheet-handle"></div>
                </div>

                {/* Modal Header */}
                <div className="terms-modal-header">
                    <div className="terms-header-info">
                        <div className="terms-brand-badge">
                            <span className="badge-icon">⎔</span> Falsicode Legal & Compliance
                        </div>
                        <h2 className="terms-modal-title">
                            {activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                        </h2>
                        <p className="terms-modal-subtitle">
                            Last Updated: August 2026 &bull; Effective for all Falsicode Academic Users
                        </p>
                    </div>

                    <button type="button" className="terms-btn-close" onClick={onClose} aria-label="Close modal">
                        &times;
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="terms-tab-bar">
                    <button 
                        type="button" 
                        className={`terms-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('terms')}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>Terms of Service</span>
                    </button>
                    <button 
                        type="button" 
                        className={`terms-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('privacy')}
                    >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        <span>Privacy Policy</span>
                    </button>
                </div>

                {/* Modal Scrollable Content Body */}
                <div className="terms-modal-body">
                    {activeTab === 'terms' ? (
                        <div className="terms-content-section">
                            <div className="legal-callout">
                                <div className="callout-icon">ℹ️</div>
                                <div className="callout-text">
                                    <strong>Academic Integrity Agreement:</strong> By registering for and using Falsicode, you agree to uphold academic honesty and adhere to your institution's code of conduct.
                                </div>
                            </div>

                            <section className="legal-article">
                                <h3>1. Acceptance of Terms</h3>
                                <p>
                                    By accessing or registering an account on the Falsicode platform ("Service", "Platform"), you ("User", "Student", or "Instructor") acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree with these terms, you must not access or use the Platform.
                                </p>
                            </section>

                            <section className="legal-article">
                                <h3>2. Platform Overview & Scope of Service</h3>
                                <p>
                                    Falsicode is an educational automated code similarity and plagiarism analysis system specifically engineered for Data Structures and Algorithms (DSA) coursework in Python and Java. The platform utilizes Abstract Syntax Tree (AST) parsing, tokenized N-Grams, and Term Frequency-Inverse Document Frequency (TF-IDF) vector analysis to evaluate structural, semantic, and syntactic patterns in submitted source code.
                                </p>
                            </section>

                            <section className="legal-article">
                                <h3>3. User Accounts & Responsibilities</h3>
                                <ul>
                                    <li><strong>Student Accounts:</strong> Students may register to join classrooms, view assignments, and submit source code for automated analysis. You must provide a valid email address and keep your credentials secure.</li>
                                    <li><strong>Instructor Accounts:</strong> Instructors can create classrooms, manage assignments, and audit similarity reports. Instructor accounts require administrative verification before full privileges are granted.</li>
                                    <li><strong>Account Security:</strong> You are solely responsible for maintaining the confidentiality of your account password and one-time verification codes (OTP). You agree not to share your account with other individuals.</li>
                                </ul>
                            </section>

                            <section className="legal-article">
                                <h3>4. Code Submissions & Intellectual Property</h3>
                                <p>
                                    <strong>Ownership:</strong> Users retain all intellectual property rights in and to the source code they author and upload to the Platform.
                                </p>
                                <p>
                                    <strong>License to Analyze:</strong> By submitting source code to Falsicode, you grant the Platform and your assigned course instructors a non-exclusive, royalty-free license to parse, tokenize, index, and compare your code against other submissions for the purpose of academic evaluation, plagiarism detection, and grading within your course.
                                </p>
                            </section>

                            <section className="legal-article">
                                <h3>5. Plagiarism Reports & Instructor Authority</h3>
                                <p>
                                    Falsicode provides similarity indices, token matrices, and structural diffs to assist educators. The similarity score is an algorithmic measurement of structural and textual overlap and does not constitute a final determination of plagiarism. The final academic judgment and any disciplinary decisions remain strictly with the course instructor and institutional authorities.
                                </p>
                            </section>

                            <section className="legal-article">
                                <h3>6. Acceptable Use & Code of Conduct</h3>
                                <p>You agree NOT to:</p>
                                <ul>
                                    <li>Upload code containing malicious payloads, viruses, or destructive scripts.</li>
                                    <li>Attempt to reverse-engineer, disrupt, or exploit the plagiarism detection algorithms or server infrastructure.</li>
                                    <li>Impersonate other students, instructors, or system administrators.</li>
                                    <li>Submit third-party proprietary software without explicit authorization.</li>
                                </ul>
                            </section>

                            <section className="legal-article">
                                <h3>7. Modifications & Termination</h3>
                                <p>
                                    We reserve the right to modify these Terms of Service or suspend accounts that violate platform policies or academic ethics guidelines. Continued use of the platform following any modifications constitutes acceptance of the updated terms.
                                </p>
                            </section>
                        </div>
                    ) : (
                        <div className="terms-content-section">
                            <div className="legal-callout legal-callout-privacy">
                                <div className="callout-icon">🔒</div>
                                <div className="callout-text">
                                    <strong>Privacy Commitment:</strong> Your source code and personal information are strictly safeguarded and utilized solely for academic assessment within your designated classrooms.
                                </div>
                            </div>

                            <section className="legal-article">
                                <h3>1. Information We Collect</h3>
                                <p>Falsicode collects the following information to facilitate its educational services:</p>
                                <ul>
                                    <li><strong>Account Profile Data:</strong> Username, institutional email address, role designation (Student/Instructor), and encrypted authentication credentials.</li>
                                    <li><strong>Academic Submissions:</strong> Source code files (.py, .java), file metadata, submission timestamps, and assignment associations.</li>
                                    <li><strong>Audit & Similarity Logs:</strong> Structural AST topologies, N-Gram token sequences, TF-IDF vector matrices, and similarity comparison records generated during automated evaluation.</li>
                                    <li><strong>Security Logs:</strong> Timestamped records of login attempts, OTP verification requests, and password modifications.</li>
                                </ul>
                            </section>

                            <section className="legal-article">
                                <h3>2. How We Use Your Information</h3>
                                <p>Collected information is utilized strictly to:</p>
                                <ul>
                                    <li>Process and authenticate your account registration and login via secure email verification codes.</li>
                                    <li>Execute structural and algorithmic plagiarism analysis on submitted DSA code files.</li>
                                    <li>Generate comparative audit reports and visual AST diffs accessible only to authorized instructors.</li>
                                    <li>Send critical account security notices and verification OTPs.</li>
                                </ul>
                            </section>

                            <section className="legal-article">
                                <h3>3. Data Confidentiality & Academic Privacy</h3>
                                <p>
                                    Falsicode adheres to academic privacy standards. <strong>We do NOT sell, rent, or monetize student submissions or personal data with commercial third-party advertisers or AI data scrapers.</strong> Submissions are confined strictly to the classroom environment in which they were submitted.
                                </p>
                            </section>

                            <section className="legal-article">
                                <h3>4. Security & Data Protection</h3>
                                <p>We employ robust technical and organizational security measures:</p>
                                <ul>
                                    <li>Passwords are hashed using industry-standard salted hashing algorithms before database storage.</li>
                                    <li>API communication is protected via JSON Web Tokens (JWT) with restricted lifespans.</li>
                                    <li>Verification codes are generated with high-entropy pseudo-randomization and expire automatically after 10–15 minutes.</li>
                                </ul>
                            </section>

                            <section className="legal-article">
                                <h3>5. Data Retention & User Rights</h3>
                                <p>
                                    Source code submissions and analysis metrics are retained for the duration of the academic term or classroom lifecycle. Users may update their contact email and security credentials through the Profile settings. For complete account deletion or classroom detachment, contact your institutional instructor or system administrator.
                                </p>
                            </section>

                            <section className="legal-article">
                                <h3>6. Contact Information</h3>
                                <p>
                                    If you have questions regarding this Privacy Policy or platform security protocols, please reach out to the Falsicode administrative team at <a href="mailto:falsicode.web@gmail.com" className="terms-email-link">falsicode.web@gmail.com</a>.
                                </p>
                            </section>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="terms-modal-footer">
                    <button type="button" className="terms-btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button type="button" className="terms-btn-primary" onClick={handleAcceptAndClose}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>I Understand & Agree</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsAndPrivacyModal;
