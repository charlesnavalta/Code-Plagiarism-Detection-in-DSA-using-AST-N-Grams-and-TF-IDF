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

    const handlePrint = () => {
        window.print();
    };

    return (
        <div 
            className="terms-modal-overlay" 
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-heading"
        >
            <div className="terms-modal-container fade-in-modal">
                {/* Mobile Drag Indicator */}
                <div className="terms-sheet-handle-bar hide-desktop">
                    <div className="terms-sheet-handle"></div>
                </div>

                {/* Modal Header */}
                <div className="terms-modal-header">
                    <div className="terms-header-info">
                        <div className="terms-brand-badge">
                            <svg className="badge-legal-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <span>Institutional Legal & Compliance</span>
                        </div>
                        <h2 id="terms-modal-heading" className="terms-modal-title">
                            {activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                        </h2>
                        <p className="terms-modal-subtitle">
                            Document Revision 2.4 &bull; Effective Date: August 2026 &bull; Falsicode Academic Platform
                        </p>
                    </div>

                    <button 
                        type="button" 
                        className="terms-btn-close" 
                        onClick={onClose} 
                        aria-label="Close legal modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Navigation Tabs & Actions */}
                <div className="terms-tab-bar">
                    <div className="terms-tabs-group">
                        <button 
                            type="button" 
                            className={`terms-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                            onClick={() => setActiveTab('terms')}
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span>Terms of Service</span>
                        </button>
                        <button 
                            type="button" 
                            className={`terms-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
                            onClick={() => setActiveTab('privacy')}
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4"></path>
                            </svg>
                            <span>Privacy Policy</span>
                        </button>
                    </div>

                    <button 
                        type="button" 
                        className="terms-btn-print hide-mobile" 
                        onClick={handlePrint}
                        title="Print this legal document"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        <span>Print</span>
                    </button>
                </div>

                {/* Modal Scrollable Content Body */}
                <div className="terms-modal-body">
                    {activeTab === 'terms' ? (
                        <div className="terms-content-section">
                            <div className="legal-formal-notice">
                                <div className="notice-icon-box">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </div>
                                <div className="notice-content">
                                    <strong>Academic Honor & Code Integrity Notice:</strong> By utilizing the Falsicode platform, all registered students and instructors covenant to maintain stringent adherence to their institution's academic honesty regulations and the ethical standards governing computer science pedagogy.
                                </div>
                            </div>

                            <article className="legal-section">
                                <h3 className="section-title">1. Binding Agreement & Scope</h3>
                                <p>
                                    These Terms of Service ("Agreement") constitute a legally binding contract between the user ("User", "Student", or "Instructor") and the Falsicode Platform Administration ("Falsicode", "We", "Us"). By registering an account, authenticating credentials, or uploading any source code artifact, the User unequivocally accepts and agrees to be bound by all terms, conditions, and notices contained herein.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">2. Nature of the Analytical Service</h3>
                                <p>
                                    Falsicode provides an automated educational platform for evaluating source code similarity in Data Structures and Algorithms (DSA) coursework. The platform operates computational pipelines comprising:
                                </p>
                                <ul>
                                    <li><strong>Abstract Syntax Tree (AST) Parsing:</strong> Structural and topological syntax tree mapping to detect structural permutations, block re-orderings, and renamed identifiers.</li>
                                    <li><strong>Tokenized N-Gram Processing:</strong> Contiguous lexical sub-sequence vectorization.</li>
                                    <li><strong>TF-IDF Vector Analysis:</strong> Term Frequency-Inverse Document Frequency weighting for syntactic token distribution comparisons.</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">3. Intellectual Property Rights & Educational License</h3>
                                <p>
                                    <strong>Author Ownership:</strong> The author retains full proprietary copyright over original source code submitted to the Platform.
                                </p>
                                <p>
                                    <strong>Limited Educational License:</strong> By submitting code, the User grants Falsicode and authorized course instructors a non-exclusive, non-transferable, royalty-free license to parse, index, store, and execute automated similarity comparisons against internal classroom corpora for grading and academic auditing.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">4. Algorithmic Nature of Plagiarism Metrics & Instructor Discretion</h3>
                                <p>
                                    Plagiarism and similarity percentages generated by Falsicode represent automated mathematical correlations. They serve exclusively as pedagogical diagnostic instruments and do <em>not</em> constitute a definitive legal finding of intellectual theft. The final determination of academic misconduct remains exclusively under the discretionary authority of the course instructor and institutional disciplinary committees.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">5. User Authentication & Account Security Obligations</h3>
                                <p>
                                    Users must provide an authentic institutional email address and maintain strict confidentiality over their login credentials and One-Time Passwords (OTP). Users agree not to transfer, delegate, or share account access with any third party.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">6. Prohibited Activities</h3>
                                <p>Users are strictly prohibited from:</p>
                                <ul>
                                    <li>Uploading source files containing malicious payloads, executable exploits, or unauthorized binary structures.</li>
                                    <li>Attempting denial-of-service, vulnerability fuzzing, or unauthorized extraction of peer student corpora.</li>
                                    <li>Reverse-engineering the similarity index algorithms for the purpose of circumventing academic evaluation.</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">7. Warranty Disclaimer & Limitation of Liability</h3>
                                <p>
                                    The Platform is provided strictly on an "AS IS" and "AS AVAILABLE" basis. Falsicode disclaims all warranties, express or implied, including fitness for a particular academic purpose. In no event shall the platform administrators be liable for indirect, incidental, or consequential damages resulting from platform downtime or data evaluation metrics.
                                </p>
                            </article>
                        </div>
                    ) : (
                        <div className="terms-content-section">
                            <div className="legal-formal-notice notice-privacy">
                                <div className="notice-icon-box">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0110 0v4"></path>
                                    </svg>
                                </div>
                                <div className="notice-content">
                                    <strong>Academic Privacy Covenant:</strong> Falsicode maintains strict data confidentiality standards. Student source code and personal identifiers are never commercialized, sold, or shared with third-party advertisers or external foundation models.
                                </div>
                            </div>

                            <article className="legal-section">
                                <h3 className="section-title">1. Categories of Information Collected</h3>
                                <p>Falsicode processes the following categories of data solely to fulfill educational services:</p>
                                <ul>
                                    <li><strong>Identity & Account Credentials:</strong> Full name, institutional email address, role designation (Student/Instructor), and cryptographically salted password hashes.</li>
                                    <li><strong>Coursework Artifacts:</strong> Submitted program files (.py, .java), submission timestamps, assignment identifiers, and file metadata.</li>
                                    <li><strong>Analytical Metrics:</strong> AST node distributions, N-Gram token hashes, and TF-IDF comparison indices produced during classroom analysis.</li>
                                    <li><strong>Audit Logs:</strong> Authentication timestamps, IP session addresses, and OTP verification records.</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">2. Lawful Basis and Purpose of Data Processing</h3>
                                <p>Processing is performed strictly to:</p>
                                <ul>
                                    <li>Authenticate user identity and verify enrollment in respective classroom units.</li>
                                    <li>Perform computational AST and statistical similarity comparisons against assignment submissions.</li>
                                    <li>Generate comparative structural reports accessible only to authorized instructors of the course.</li>
                                    <li>Maintain system security, detect fraudulent access, and prevent unauthorized service manipulation.</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">3. Data Confidentiality & Strict Non-Disclosure</h3>
                                <p>
                                    Submissions are quarantined within the scope of the instructor's classroom. Falsicode does not share student data across unauthorized external domains or third-party commercial data brokers.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">4. Technical & Organizational Security Measures</h3>
                                <p>We employ enterprise-grade security controls including:</p>
                                <ul>
                                    <li>Salted password encryption preventing credential reconstruction.</li>
                                    <li>Short-lived JSON Web Tokens (JWT) for session authentication.</li>
                                    <li>Time-limited, single-use One-Time Passwords (OTP) expiring within 10 minutes.</li>
                                    <li>Restricted server file storage permissions with isolation between classroom directories.</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">5. Data Retention & User Rights</h3>
                                <p>
                                    Academic submission artifacts are retained for the duration of the classroom lifecycle or academic semester. Users may request verification of stored records or profile modifications via their designated instructor or institutional administrator at <a href="mailto:falsicode.web@gmail.com" className="legal-inline-link">falsicode.web@gmail.com</a>.
                                </p>
                            </article>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="terms-modal-footer">
                    <button type="button" className="terms-btn-secondary" onClick={onClose}>
                        Decline & Close
                    </button>
                    <button type="button" className="terms-btn-primary" onClick={handleAcceptAndClose}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Acknowledge & Accept Terms</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsAndPrivacyModal;
