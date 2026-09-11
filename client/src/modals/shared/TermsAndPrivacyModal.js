// src/modals/shared/TermsAndPrivacyModal.js
import React, { useState, useEffect } from 'react';
import './TermsAndPrivacyModal.css';

const TAB_LABELS = {
    terms:   'Terms of Service',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
    refund:  'Refund Policy',
};

const TermsAndPrivacyModal = ({ isOpen, onClose, initialTab = 'terms', onAccept }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    const handleAcceptAndClose = () => {
        if (onAccept) onAccept();
        onClose();
    };

    const handlePrint = () => window.print();

    return (
        <div
            className="terms-modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
                            <svg className="badge-legal-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <span>Institutional Legal &amp; Compliance</span>
                        </div>
                        <h2 id="terms-modal-heading" className="terms-modal-title">
                            {TAB_LABELS[activeTab]}
                        </h2>
                        <p className="terms-modal-subtitle">
                            Document Revision 2.5 &bull; Effective Date: September 2026 &bull; Falsicode Academic Platform
                        </p>
                    </div>

                    <button
                        type="button"
                        className="terms-btn-close"
                        onClick={onClose}
                        aria-label="Close legal document modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Navigation Tabs & Actions */}
                <div className="terms-tab-bar" role="tablist" aria-label="Legal documents">
                    <div className="terms-tabs-group">

                        {/* Terms of Service */}
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'terms'}
                            className={`terms-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                            onClick={() => setActiveTab('terms')}
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span>Terms</span>
                        </button>

                        {/* Privacy Policy */}
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'privacy'}
                            className={`terms-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
                            onClick={() => setActiveTab('privacy')}
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4"></path>
                            </svg>
                            <span>Privacy</span>
                        </button>

                        {/* Cookie Policy */}
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'cookies'}
                            className={`terms-tab-btn ${activeTab === 'cookies' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cookies')}
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                                <circle cx="12" cy="12" r="10"></circle>
                                <circle cx="8.5" cy="9" r="1.5" fill="currentColor"></circle>
                                <circle cx="14.5" cy="14" r="1.5" fill="currentColor"></circle>
                                <circle cx="15" cy="8" r="1" fill="currentColor"></circle>
                            </svg>
                            <span>Cookies</span>
                        </button>

                        {/* Refund Policy */}
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'refund'}
                            className={`terms-tab-btn ${activeTab === 'refund' ? 'active' : ''}`}
                            onClick={() => setActiveTab('refund')}
                        >
                            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l4-4M3 10l4 4"></path>
                            </svg>
                            <span>Refund</span>
                        </button>
                    </div>

                    <button
                        type="button"
                        className="terms-btn-print hide-mobile"
                        onClick={handlePrint}
                        aria-label="Print this legal document"
                        title="Print this legal document"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" aria-hidden="true">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        <span>Print</span>
                    </button>
                </div>

                {/* Modal Scrollable Content Body */}
                <div className="terms-modal-body">

                    {/* ─── TERMS OF SERVICE ─── */}
                    {activeTab === 'terms' && (
                        <div className="terms-content-section" role="tabpanel" aria-labelledby="tab-terms">
                            <div className="legal-formal-notice">
                                <div className="notice-icon-box">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="16" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                    </svg>
                                </div>
                                <div className="notice-content">
                                    <strong>Academic Honor &amp; Code Integrity Notice:</strong> By utilizing the Falsicode platform, all registered students and instructors covenant to maintain stringent adherence to their institution's academic honesty regulations and the ethical standards governing computer science pedagogy.
                                </div>
                            </div>

                            <article className="legal-section">
                                <h3 className="section-title">1. Binding Agreement &amp; Scope</h3>
                                <p>
                                    These Terms of Service ("Agreement") constitute a legally binding contract between the user ("User", "Student", or "Instructor") and the Falsicode Platform Administration ("Falsicode", "We", "Us"). By registering an account, authenticating credentials, or uploading any source code artifact, the User unequivocally accepts and agrees to be bound by all terms, conditions, and notices contained herein.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">2. Nature of the Analytical Service</h3>
                                <p>
                                    Falsicode provides a <strong>free, non-commercial</strong> automated educational platform for evaluating source code similarity in Data Structures and Algorithms (DSA) coursework. The platform operates computational pipelines comprising:
                                </p>
                                <ul>
                                    <li><strong>Abstract Syntax Tree (AST) Parsing:</strong> Structural and topological syntax tree mapping to detect structural permutations, block re-orderings, and renamed identifiers.</li>
                                    <li><strong>Tokenized N-Gram Processing:</strong> Contiguous lexical sub-sequence vectorization.</li>
                                    <li><strong>TF-IDF Vector Analysis:</strong> Term Frequency-Inverse Document Frequency weighting for syntactic token distribution comparisons.</li>
                                </ul>
                                <p>All similarity percentages and match scores displayed are <strong>illustrative algorithmic outputs only</strong> and do not constitute a legal finding of any kind.</p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">3. Intellectual Property Rights &amp; Educational License</h3>
                                <p>
                                    <strong>Author Ownership:</strong> The author retains full proprietary copyright over original source code submitted to the Platform.
                                </p>
                                <p>
                                    <strong>Limited Educational License:</strong> By submitting code, the User grants Falsicode and authorized course instructors a non-exclusive, non-transferable, royalty-free license to parse, index, store, and execute automated similarity comparisons against internal classroom corpora for grading and academic auditing purposes only.
                                </p>
                                <p>
                                    <strong>No Commercial Use:</strong> Falsicode does not sell, license, or commercialize submitted student source code to any third party.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">4. Algorithmic Nature of Plagiarism Metrics &amp; Instructor Discretion</h3>
                                <p>
                                    Plagiarism and similarity percentages generated by Falsicode represent automated mathematical correlations. They serve exclusively as pedagogical diagnostic instruments and do <em>not</em> constitute a definitive legal finding of intellectual theft. The final determination of academic misconduct remains exclusively under the discretionary authority of the course instructor and institutional disciplinary committees.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">5. User Authentication &amp; Account Security Obligations</h3>
                                <p>
                                    Users must provide an authentic institutional or personal email address and maintain strict confidentiality over their login credentials and One-Time Passwords (OTP). Users agree not to transfer, delegate, or share account access with any third party.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">6. Prohibited Activities</h3>
                                <p>Users are strictly prohibited from:</p>
                                <ul>
                                    <li>Uploading source files containing malicious payloads, executable exploits, or unauthorized binary structures.</li>
                                    <li>Attempting denial-of-service, vulnerability fuzzing, or unauthorized extraction of peer student corpora.</li>
                                    <li>Reverse-engineering the similarity index algorithms for the purpose of circumventing academic evaluation.</li>
                                    <li>Impersonating another student, instructor, or administrator on the platform.</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">7. No Fees &amp; No Financial Transactions</h3>
                                <p>
                                    Falsicode is a <strong>completely free academic platform</strong>. There are no subscription fees, usage charges, or premium tiers. No financial transactions of any kind are processed through this platform. Because no payments are collected, no refund policy applies to monetary charges. See the <button type="button" className="legal-tab-inline-link" onClick={() => setActiveTab('refund')}>Refund Policy</button> for full details.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">8. Analytics &amp; Tracking Disclosure</h3>
                                <p>
                                    Falsicode does <strong>not</strong> use any third-party analytics services (e.g., Google Analytics, Meta Pixel, Mixpanel), advertising trackers, or behavioral profiling tools. The only data stored locally in your browser is a session authentication token and a theme preference setting. See our <button type="button" className="legal-tab-inline-link" onClick={() => setActiveTab('cookies')}>Cookie Policy</button> for full details.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">9. Warranty Disclaimer &amp; Limitation of Liability</h3>
                                <p>
                                    The Platform is provided strictly on an "AS IS" and "AS AVAILABLE" basis. Falsicode disclaims all warranties, express or implied, including fitness for a particular academic purpose. In no event shall the platform administrators be liable for indirect, incidental, or consequential damages resulting from platform downtime or data evaluation metrics.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">10. Governing Law</h3>
                                <p>
                                    These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, including but not limited to Republic Act No. 10173 (Data Privacy Act of 2012). Any disputes arising from the use of this platform shall be subject to the exclusive jurisdiction of Philippine courts.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">11. Contact</h3>
                                <p>
                                    For legal inquiries or Terms-related concerns, contact us at: <a href="mailto:falsicode.web@gmail.com" className="legal-inline-link">falsicode.web@gmail.com</a>
                                </p>
                            </article>
                        </div>
                    )}

                    {/* ─── PRIVACY POLICY ─── */}
                    {activeTab === 'privacy' && (
                        <div className="terms-content-section" role="tabpanel" aria-labelledby="tab-privacy">
                            <div className="legal-formal-notice notice-privacy">
                                <div className="notice-icon-box">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
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
                                    <li><strong>Identity &amp; Account Credentials:</strong> Username, institutional or personal email address, role designation (Student/Instructor), and cryptographically salted password hashes.</li>
                                    <li><strong>Coursework Artifacts:</strong> Submitted program files (.py, .java), submission timestamps, assignment identifiers, and file metadata.</li>
                                    <li><strong>Analytical Metrics:</strong> AST node distributions, N-Gram token hashes, and TF-IDF comparison indices produced during classroom analysis.</li>
                                    <li><strong>Audit Logs:</strong> Authentication timestamps, IP session addresses, and OTP verification records.</li>
                                    <li><strong>Browser Storage:</strong> A JWT authentication token and a theme preference key stored in <code>localStorage</code>. No tracking cookies are set.</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">2. Lawful Basis and Purpose of Data Processing</h3>
                                <p>Processing is performed strictly to:</p>
                                <ul>
                                    <li>Authenticate user identity and verify enrollment in respective classroom units (lawful basis: contractual necessity).</li>
                                    <li>Perform computational AST and statistical similarity comparisons against assignment submissions (lawful basis: legitimate educational interest).</li>
                                    <li>Generate comparative structural reports accessible only to authorized instructors of the course.</li>
                                    <li>Maintain system security, detect fraudulent access, and prevent unauthorized service manipulation.</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">3. Data Confidentiality &amp; Strict Non-Disclosure</h3>
                                <p>
                                    Submissions are quarantined within the scope of the instructor's classroom. Falsicode does not share student data across unauthorized external domains, third-party commercial data brokers, advertisers, or AI training datasets.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">4. No Analytics or Advertising Trackers</h3>
                                <p>
                                    Falsicode does not integrate any third-party analytics, behavioral tracking, or advertising scripts. No cookies are used for profiling, retargeting, or marketing. See the <button type="button" className="legal-tab-inline-link" onClick={() => setActiveTab('cookies')}>Cookie Policy</button> for a complete list of browser storage in use.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">5. Technical &amp; Organizational Security Measures</h3>
                                <p>We employ security controls including:</p>
                                <ul>
                                    <li>Salted password hashing preventing credential reconstruction.</li>
                                    <li>Short-lived JSON Web Tokens (JWT) for session authentication.</li>
                                    <li>Time-limited, single-use One-Time Passwords (OTP) expiring within 10 minutes.</li>
                                    <li>Restricted server file storage permissions with isolation between classroom directories.</li>
                                    <li>HTTPS-enforced communication between the frontend and backend API.</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">6. Data Retention &amp; User Rights (RA 10173 / GDPR-aligned)</h3>
                                <p>
                                    Academic submission artifacts are retained for the duration of the classroom lifecycle or academic semester. Under the Philippine Data Privacy Act of 2012 (RA 10173), you have the right to:
                                </p>
                                <ul>
                                    <li><strong>Access</strong> — Request a copy of the personal data we hold about you.</li>
                                    <li><strong>Correction</strong> — Request correction of inaccurate data.</li>
                                    <li><strong>Erasure</strong> — Request deletion of your data where legally permissible.</li>
                                    <li><strong>Portability</strong> — Request your data in a structured, machine-readable format.</li>
                                    <li><strong>Objection</strong> — Object to processing not covered by legitimate academic interest.</li>
                                </ul>
                                <p>
                                    To exercise any of these rights, contact us at <a href="mailto:falsicode.web@gmail.com" className="legal-inline-link">falsicode.web@gmail.com</a>.
                                </p>
                            </article>
                        </div>
                    )}

                    {/* ─── COOKIE POLICY ─── */}
                    {activeTab === 'cookies' && (
                        <div className="terms-content-section" role="tabpanel" aria-labelledby="tab-cookies">
                            <div className="legal-formal-notice notice-cookies">
                                <div className="notice-icon-box">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <circle cx="8.5" cy="9" r="1.5" fill="currentColor"></circle>
                                        <circle cx="14.5" cy="14" r="1.5" fill="currentColor"></circle>
                                        <circle cx="15" cy="8" r="1" fill="currentColor"></circle>
                                    </svg>
                                </div>
                                <div className="notice-content">
                                    <strong>Plain-language summary:</strong> Falsicode uses <em>only</em> strictly necessary functional storage in your browser. We do not use advertising cookies, analytics cookies, or any third-party tracking scripts of any kind.
                                </div>
                            </div>

                            <article className="legal-section">
                                <h3 className="section-title">1. What Are Cookies &amp; Browser Storage?</h3>
                                <p>
                                    "Cookies" are small text files stored by a website in your browser. Falsicode does not use traditional HTTP cookies. Instead, it uses the browser's <code>localStorage</code> API — a similar mechanism — to store essential operational data. No data is transmitted to third parties via this storage.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">2. Storage Items We Use</h3>
                                <p>The following items are the <strong>only</strong> data stored in your browser:</p>
                                <ul>
                                    <li>
                                        <strong><code>token</code></strong> — Your JSON Web Token (JWT) authentication credential. This allows you to remain logged in across page refreshes. It expires automatically and is cleared on logout.
                                        <br /><em>Category: Strictly Necessary / Functional</em>
                                    </li>
                                    <li>
                                        <strong><code>user</code></strong> — A JSON object containing your username, role, and user ID. Used to render role-appropriate UI without requiring an extra network call.
                                        <br /><em>Category: Strictly Necessary / Functional</em>
                                    </li>
                                    <li>
                                        <strong><code>app-theme</code></strong> — Your chosen color theme preference (dark / light / system). Used to restore your preferred appearance on return visits.
                                        <br /><em>Category: Preference / Functional</em>
                                    </li>
                                    <li>
                                        <strong><code>cookie-consent</code></strong> — A flag recording that you have acknowledged this Cookie Policy. Used to hide the consent banner on subsequent visits.
                                        <br /><em>Category: Strictly Necessary / Consent Record</em>
                                    </li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">3. What We Do NOT Use</h3>
                                <ul>
                                    <li>No Google Analytics, Google Tag Manager, or any Google tracking product.</li>
                                    <li>No Meta (Facebook) Pixel or social media tracking.</li>
                                    <li>No advertising networks or retargeting scripts.</li>
                                    <li>No heat-mapping or session-recording tools (e.g., Hotjar, FullStory).</li>
                                    <li>No third-party CDN scripts injected at runtime.</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">4. How to Clear Browser Storage</h3>
                                <p>
                                    You may clear all Falsicode-related browser storage at any time through your browser's developer tools or settings. Clearing the <code>token</code> and <code>user</code> keys will log you out of the platform. Clearing <code>app-theme</code> will reset your theme preference to the default (dark mode).
                                </p>
                                <p>
                                    Most browsers: <strong>Settings → Privacy &amp; Security → Clear browsing data → Site data</strong>.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">5. Policy Updates</h3>
                                <p>
                                    If we ever introduce additional storage or tracking, this Cookie Policy will be updated and users will be notified via the consent banner before any new storage items are set. Last updated: September 2026.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">6. Contact</h3>
                                <p>
                                    For questions about our cookie or storage practices, contact us at <a href="mailto:falsicode.web@gmail.com" className="legal-inline-link">falsicode.web@gmail.com</a>.
                                </p>
                            </article>
                        </div>
                    )}

                    {/* ─── REFUND POLICY ─── */}
                    {activeTab === 'refund' && (
                        <div className="terms-content-section" role="tabpanel" aria-labelledby="tab-refund">
                            <div className="legal-formal-notice notice-refund">
                                <div className="notice-icon-box">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l4-4M3 10l4 4"></path>
                                    </svg>
                                </div>
                                <div className="notice-content">
                                    <strong>Plain-language summary:</strong> Falsicode is entirely free. There are no fees, subscriptions, or in-app purchases of any kind. As no payments are collected, no refund requests are applicable.
                                </div>
                            </div>

                            <article className="legal-section">
                                <h3 className="section-title">1. Free Academic Platform</h3>
                                <p>
                                    Falsicode is a <strong>free, non-commercial academic tool</strong> developed for educational institutions. Access to all features — including account registration, classroom creation, assignment management, and code similarity analysis — is provided at no cost to students or instructors.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">2. No Financial Transactions</h3>
                                <p>
                                    Falsicode does not process, collect, or store any payment information. There are no:
                                </p>
                                <ul>
                                    <li>Subscription fees</li>
                                    <li>One-time purchase charges</li>
                                    <li>Usage-based billing</li>
                                    <li>Premium tier upgrades</li>
                                    <li>In-app purchases or credits</li>
                                </ul>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">3. Refund Policy Statement</h3>
                                <p>
                                    Because no monetary transactions occur through this platform, <strong>no refund policy is applicable</strong>. If you believe you have been charged in error (e.g., by a third-party reseller or institution misrepresenting this service), please contact your institution's administration directly, and also notify us at <a href="mailto:falsicode.web@gmail.com" className="legal-inline-link">falsicode.web@gmail.com</a> so we can investigate.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">4. Future Commercial Plans</h3>
                                <p>
                                    If Falsicode introduces any paid features in the future, this Refund Policy will be updated prior to any monetization, and users will be clearly notified before any charges are incurred. A full refund policy covering cancellations, pro-rated credits, and dispute resolution will be published at that time.
                                </p>
                            </article>

                            <article className="legal-section">
                                <h3 className="section-title">5. Contact</h3>
                                <p>
                                    For billing-related questions or concerns, contact us at <a href="mailto:falsicode.web@gmail.com" className="legal-inline-link">falsicode.web@gmail.com</a>.
                                </p>
                            </article>
                        </div>
                    )}

                </div>

                {/* Modal Footer */}
                <div className="terms-modal-footer">
                    <button type="button" className="terms-btn-secondary" onClick={onClose}>
                        Decline &amp; Close
                    </button>
                    <button type="button" className="terms-btn-primary" onClick={handleAcceptAndClose}>
                        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Acknowledge &amp; Accept Terms</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsAndPrivacyModal;
