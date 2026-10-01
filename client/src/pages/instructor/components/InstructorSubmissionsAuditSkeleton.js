import React from 'react';
import InstructorWrapper from './InstructorWrapper';
import { useTheme } from '../../../hooks/useTheme';
import './InstructorSubmissionsAuditSkeleton.css';

const InstructorSubmissionsAuditSkeleton = () => {
    const [theme] = useTheme();

    return (
        <InstructorWrapper>
            <div className={`instructor-audit-page ${theme} audit-skeleton-page`}>
                <div className="audit-page-container">

                    {/* --- TOP CINEMATIC BANNER SKELETON --- */}
                    <header className="cinematic-banner-shared spatial-card audit-hero-banner audit-skel-hero">
                        <div className="header-inner">
                            <div className="top-meta">
                                <div className="skeleton-box audit-skel-back-btn"></div>
                                <div className="audit-header-actions">
                                    <div className="skeleton-box audit-skel-run-btn"></div>
                                </div>
                            </div>

                            <div className="audit-hero-info">
                                <div className="skeleton-box audit-skel-title"></div>
                            </div>

                            <div className="stat-badges">
                                <div className="skeleton-box audit-skel-badge audit-skel-badge-lang"></div>
                                <div className="skeleton-box audit-skel-badge audit-skel-badge-subs"></div>
                                <div className="skeleton-box audit-skel-badge audit-skel-badge-pairs"></div>
                            </div>
                        </div>
                    </header>

                    {/* --- STICKY CONTROLS BAR SKELETON (Tabs + Search) --- */}
                    <div className="audit-sticky-controls-bar audit-skel-controls-bar">
                        <div className="audit-page-tabs-bar">
                            <div className="audit-segmented-tabs">
                                <div className="skeleton-box audit-skel-tab active-skel"></div>
                                <div className="skeleton-box audit-skel-tab"></div>
                                <div className="skeleton-box audit-skel-tab"></div>
                            </div>
                        </div>

                        <div className="audit-search-toolbar">
                            <div className="skeleton-box audit-skel-search-bar"></div>
                        </div>
                    </div>

                    {/* --- MAIN AUDIT WORKSPACE CARD SKELETON --- */}
                    <main className="audit-workspace-card spatial-card audit-skel-workspace">
                        <div className="audit-tab-body">
                            <div className="submissions-audit-list">

                                {/* Desktop Table View (>= 1024px) */}
                                <div className="desktop-table-container">
                                    <table className="falsicode-table-hud audit-skel-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '40px' }}></th>
                                                <th>STUDENT IDENTITY</th>
                                                <th>SOURCE FILE</th>
                                                <th className="th-actions">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                { nameW: 130, fileW: 160, stateW: 110 },
                                                { nameW: 155, fileW: 175, stateW: 105 },
                                                { nameW: 120, fileW: 150, stateW: 115 },
                                                { nameW: 165, fileW: 180, stateW: 110 },
                                                { nameW: 140, fileW: 165, stateW: 105 },
                                                { nameW: 150, fileW: 170, stateW: 110 }
                                            ].map((row, idx) => (
                                                <tr key={idx} className="submission-card-row-skel">
                                                    <td className="status-cell">
                                                        <div className="skeleton-box audit-skel-dot"></div>
                                                    </td>
                                                    <td className="td-student">
                                                        <div className="hud-stu-cell">
                                                            <div className="skeleton-box audit-skel-avatar"></div>
                                                            <div className="stu-info-meta">
                                                                <div className="skeleton-box audit-skel-text" style={{ width: `${row.nameW}px`, height: '16px' }}></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="td-file">
                                                        <div className="file-chip-wrapper" style={{ gap: '10px', alignItems: 'center' }}>
                                                            <div className="skeleton-box audit-skel-code-pill" style={{ width: `${row.fileW}px`, height: '28px' }}></div>
                                                            <div className="skeleton-box audit-skel-state-pill" style={{ width: `${row.stateW}px`, height: '24px' }}></div>
                                                        </div>
                                                    </td>
                                                    <td className="td-action">
                                                        <div className="grade-input-group" style={{ gap: '8px', alignItems: 'center' }}>
                                                            <div className="grade-field-row" style={{ gap: '6px' }}>
                                                                <div className="skeleton-box audit-skel-grade-field"></div>
                                                                <div className="skeleton-box audit-skel-save-btn"></div>
                                                            </div>
                                                            <div className="skeleton-box audit-skel-feedback-btn"></div>
                                                            <div className="skeleton-box audit-skel-resubmit-btn"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile & Tablet Responsive Cards (< 1024px) */}
                                <div className="mobile-tablet-card-container">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={item} className="submission-responsive-card audit-skel-card">
                                            <div className="card-identity-header">
                                                <div className="student-profile-badge">
                                                    <div className="skeleton-box audit-skel-avatar"></div>
                                                    <div className="stu-info-meta">
                                                        <div className="skeleton-box audit-skel-text" style={{ width: '130px', height: '16px' }}></div>
                                                    </div>
                                                </div>
                                                <div className="skeleton-box audit-skel-state-pill" style={{ width: '95px', height: '22px' }}></div>
                                            </div>

                                            <div style={{ margin: '12px 0' }}>
                                                <div className="skeleton-box audit-skel-code-pill" style={{ width: '100%', height: '32px' }}></div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' }}>
                                                <div className="skeleton-box audit-skel-grade-field" style={{ width: '80px', height: '36px' }}></div>
                                                <div className="skeleton-box audit-skel-feedback-btn" style={{ flex: '1 1 90px', height: '36px' }}></div>
                                                <div className="skeleton-box audit-skel-resubmit-btn" style={{ flex: '1 1 120px', height: '36px' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </main>

                </div>
            </div>
        </InstructorWrapper>
    );
};

export default InstructorSubmissionsAuditSkeleton;
