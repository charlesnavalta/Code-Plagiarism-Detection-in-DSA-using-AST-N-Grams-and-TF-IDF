import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import { useToast } from '../../context/NotificationContext';
import api from '../../services/api';
import InstructorWrapper from './components/InstructorWrapper';
import AnalysisPDFExporter from '../../components/instructor/AnalysisPDFExporter';
import { getPlagiarismDisplayData, getASTBadgeStyle } from '../../utils/theme';
import { formatLanguageDisplay } from '../../utils/fileUtils';
import './InstructorComparisonView.css';

const InstructorComparisonView = () => {
    const { id, assignmentId } = useParams();
    const classId = id;
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [theme] = useTheme();
    const pageRef = useRef(null);
    const handleMouseMove = useSpatialSpotlight(pageRef);

    // Synchronized scroll refs
    const paneARef = useRef(null);
    const paneBRef = useRef(null);
    const isSyncingScroll = useRef(false);

    // Initial state passed via React Router navigation state if available
    const navState = useMemo(() => location.state || {}, [location.state]);

    const [assignment, setAssignment] = useState(navState.assignment || null);
    const [submissions, setSubmissions] = useState(navState.submissions || []);
    const [allPairs, setAllPairs] = useState(navState.allPairs || (navState.selectedPair ? [navState.selectedPair] : []));
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [loading, setLoading] = useState(!navState.selectedPair);
    const [viewMode, setViewMode] = useState('code'); // 'code' | 'ast'
    const [syncScroll, setSyncScroll] = useState(true);
    const [activeMobilePane, setActiveMobilePane] = useState('a'); // 'a' | 'b' | 'stacked'

    // If navigated with a specific selectedPair index or object
    useEffect(() => {
        if (navState.selectedPair && navState.allPairs) {
            const foundIdx = navState.allPairs.findIndex(
                p => p.file1 === navState.selectedPair.file1 && p.file2 === navState.selectedPair.file2
            );
            if (foundIdx !== -1) setCurrentPairIndex(foundIdx);
        }
    }, [navState]);

    // Fallback Fetcher: If user navigated directly or refreshed the URL
    useEffect(() => {
        if (!navState.selectedPair) {
            const loadComparisonData = async () => {
                setLoading(true);
                try {
                    // Fetch assignment details, submissions, and execute analysis
                    const [assignRes, subsRes, analysisRes] = await Promise.all([
                        api.get(`/classrooms/${classId}/assignments/${assignmentId}`),
                        api.get(`/classrooms/${classId}/assignments/${assignmentId}/submissions`),
                        api.post(`/analyze/${assignmentId}`)
                    ]);

                    setAssignment(assignRes.data);
                    setSubmissions(subsRes.data || []);
                    const pairs = analysisRes.data?.results || [];
                    setAllPairs(pairs);

                    // If URL has search query ?f1=...&f2=...
                    const params = new URLSearchParams(location.search);
                    const qf1 = params.get('f1');
                    const qf2 = params.get('f2');
                    if (qf1 && qf2 && pairs.length > 0) {
                        const matchIdx = pairs.findIndex(p => 
                            (p.file1.includes(qf1) && p.file2.includes(qf2)) ||
                            (p.file1.includes(qf2) && p.file2.includes(qf1))
                        );
                        if (matchIdx !== -1) setCurrentPairIndex(matchIdx);
                    }
                } catch (err) {
                    console.error("Failed to load comparison workspace data:", err);
                    toast.error("Could not retrieve comparison data.", "Workspace Error");
                } finally {
                    setLoading(false);
                }
            };

            loadComparisonData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classId, assignmentId]);

    const selectedPair = allPairs[currentPairIndex] || null;
    const themeData = selectedPair ? getPlagiarismDisplayData(selectedPair.plagiarism_type) : null;

    // Helper to resolve code content
    const getCodeByFilename = (label) => {
        if (!submissions || !label) return "Code content not available.";
        let sub = submissions.find(s => `${s.student_name} (${s.filename})` === label);
        if (sub && (sub.content || sub.raw_code)) return sub.content || sub.raw_code;

        sub = submissions.find(s => s.filename === label || s.name === label || s.student_name === label);
        if (sub && (sub.content || sub.raw_code)) return sub.content || sub.raw_code;

        sub = submissions.find(s => label.includes(s.filename || '') || (s.name && label.includes(s.name)));
        if (sub && (sub.content || sub.raw_code)) return sub.content || sub.raw_code;

        return "Code content not available. Please check the backend.";
    };

    const rawCodeA = selectedPair ? getCodeByFilename(selectedPair.file1) : "";
    const rawCodeB = selectedPair ? getCodeByFilename(selectedPair.file2) : "";

    // Synchronized scroll handlers
    const handleScrollA = () => {
        if (!syncScroll || isSyncingScroll.current) return;
        isSyncingScroll.current = true;
        if (paneARef.current && paneBRef.current) {
            paneBRef.current.scrollTop = paneARef.current.scrollTop;
            paneBRef.current.scrollLeft = paneARef.current.scrollLeft;
        }
        requestAnimationFrame(() => { isSyncingScroll.current = false; });
    };

    const handleScrollB = () => {
        if (!syncScroll || isSyncingScroll.current) return;
        isSyncingScroll.current = true;
        if (paneARef.current && paneBRef.current) {
            paneARef.current.scrollTop = paneBRef.current.scrollTop;
            paneARef.current.scrollLeft = paneBRef.current.scrollLeft;
        }
        requestAnimationFrame(() => { isSyncingScroll.current = false; });
    };

    // Copy to clipboard
    const handleCopyCode = (code, sourceName) => {
        navigator.clipboard.writeText(code);
        toast.success(`Copied ${sourceName} source code to clipboard!`, "Copied");
    };

    // Code highlights renderer
    const renderCodeWithHighlights = (code, highlightedLines = [], overallType = '') => {
        if (!code || code.startsWith("Code content not available")) {
            return <code>{code}</code>;
        }

        const lines = code.split('\n');
        const isMixedAttack = (overallType || '').includes('Type 3');

        return lines.map((line, index) => {
            const lineNumber = index + 1;
            const match = highlightedLines.find(m => {
                if (typeof m === 'number') return m === lineNumber;
                return m.line === lineNumber;
            });

            let highlightClass = '';
            let hoverText = '';

            if (match) {
                const matchType = typeof match === 'number' ? 1 : match.type;
                if (matchType === 1) {
                    highlightClass = 'match-type-1';
                    hoverText = 'Type 1: Verbatim / Exact copy';
                } else if (matchType === 2) {
                    highlightClass = 'match-type-2';
                    hoverText = isMixedAttack
                        ? 'Type 2 (within Type 3): Renamed identifier'
                        : 'Type 2: Renamed variables / Literals altered';
                } else if (matchType === 3) {
                    highlightClass = 'match-type-3';
                    hoverText = 'Type 3: Rearranged structure / Reordered statements';
                }
            }

            return (
                <div
                    key={index}
                    className={`code-line ${highlightClass}`}
                    data-tooltip={hoverText || undefined}
                >
                    <span className="line-number">{lineNumber}</span>
                    <span className="line-content">{line || ' '}</span>
                </div>
            );
        });
    };

    // AST XAI N-Gram pattern renderer
    const renderASTStream = (xaiData = [], uniqueData = []) => {
        const hasShared = xaiData && xaiData.length > 0;
        const hasUnique = uniqueData && uniqueData.length > 0;

        if (!hasShared && !hasUnique) {
            return (
                <div className="empty-ast">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginBottom: '8px', opacity: 0.6 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    <span>No structural AST tokens extracted.</span>
                </div>
            );
        }

        const renderPatternCard = (patternData, patternIndex, isShared) => {
            const realWeight = patternData.weight;
            const { categoryLabel, badgeColor, badgeBg } = isShared
                ? getASTBadgeStyle(realWeight, patternIndex, xaiData.length)
                : { categoryLabel: 'Only in This File', badgeColor: '#94a3b8', badgeBg: 'rgba(148,163,184,0.12)' };

            return (
                <div
                    key={`${isShared ? 'shared' : 'unique'}-${patternIndex}`}
                    className={`ngram-pattern-card ${!isShared ? 'ngram-pattern-card-unique' : ''}`}
                >
                    <div className="pattern-header-row">
                        <div className="pattern-meta-left">
                            <span className="sequence-badge">
                                {isShared ? `Sequence #${patternIndex + 1}` : `Unique #${patternIndex + 1}`}
                            </span>
                            <span className="category-status-pill" style={{ color: badgeColor, backgroundColor: badgeBg }}>
                                <span className="category-status-dot" style={{ backgroundColor: badgeColor }}></span>
                                {categoryLabel}
                            </span>
                        </div>
                        <div className="pattern-weight-chip">
                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                            </svg>
                            <span>TF-IDF: <strong>{realWeight}</strong></span>
                        </div>
                    </div>

                    <div className="pattern-tokens-container">
                        {patternData.sequence.map((token, tokenIndex) => (
                            <React.Fragment key={`token-${patternIndex}-${tokenIndex}`}>
                                <div className={`ast-token-chip ${!isShared ? 'ast-token-chip-unique' : ''}`}>
                                    <span className="token-step">{tokenIndex + 1}</span>
                                    <span className="token-name">{token}</span>
                                </div>
                                {tokenIndex < patternData.sequence.length - 1 && (
                                    <div className="pattern-flow-arrow">
                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                        </svg>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            );
        };

        return (
            <div className="ast-pattern-stream">
                {hasShared && (
                    <>
                        <div className="ast-section-header ast-section-matched">
                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Matched Patterns — {xaiData.length} shared structural blocks
                        </div>
                        {xaiData.map((p, idx) => renderPatternCard(p, idx, true))}
                    </>
                )}

                {hasUnique && (
                    <>
                        <div className="ast-section-header ast-section-unique">
                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Unique Patterns — {uniqueData.length} distinctive blocks
                        </div>
                        {uniqueData.map((p, idx) => renderPatternCard(p, idx, false))}
                    </>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <InstructorWrapper>
                <div className={`instructor-compare-page ${theme}`} ref={pageRef}>
                    <div className="compare-loading-wrapper">
                        <div className="compare-spinner"></div>
                        <h2>Loading Forensic Comparison Workspace...</h2>
                        <p>Processing AST structural trees and TF-IDF alignment vectors.</p>
                    </div>
                </div>
            </InstructorWrapper>
        );
    }

    if (!selectedPair) {
        return (
            <InstructorWrapper>
                <div className={`instructor-compare-page ${theme}`} ref={pageRef}>
                    <div className="compare-empty-wrapper spatial-card">
                        <h2>No Comparison Pair Found</h2>
                        <p>No comparison data is currently active for this assignment.</p>
                        <button className="neo-back-btn" onClick={() => navigate(`/instructor/class/${classId}/assignment/${assignmentId}/audit`)}>
                            ← Return to Audit Workspace
                        </button>
                    </div>
                </div>
            </InstructorWrapper>
        );
    }

    return (
        <InstructorWrapper>
            <div className={`instructor-compare-page ${theme}`} ref={pageRef} onMouseMove={handleMouseMove}>
                <div className="compare-viewport-wrapper">
                    
                    {/* --- TOP CINEMATIC CONTROLS BAR --- */}
                    <header className="compare-navbar-hud spatial-card fade-in-down">
                        <div className="hud-left-cluster">
                            <button
                                type="button"
                                className="neo-back-btn"
                                onClick={() => navigate(`/instructor/class/${classId}/assignment/${assignmentId}/audit`)}
                            >
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '5px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Audit
                            </button>

                            <div className="assignment-badge-wrap">
                                <span className="assignment-title-tag">
                                    {assignment?.title || 'Assignment Audit'}
                                </span>
                                {assignment?.language && (
                                    <span className="lang-tag-chip">
                                        {formatLanguageDisplay(assignment.language)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Center: Pair Switcher Dropdown */}
                        {allPairs.length > 1 && (
                            <div className="hud-center-cluster">
                                <div className="pair-switcher-box">
                                    <label htmlFor="pair-select" className="pair-select-label">
                                        PAIR {currentPairIndex + 1} OF {allPairs.length}:
                                    </label>
                                    <select
                                        id="pair-select"
                                        className="pair-select-dropdown"
                                        value={currentPairIndex}
                                        onChange={(e) => setCurrentPairIndex(Number(e.target.value))}
                                    >
                                        {allPairs.map((p, idx) => (
                                            <option key={idx} value={idx}>
                                                #{idx + 1}: {p.file1} vs {p.file2} ({p.score}% · {p.plagiarism_type})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Right: Actions Cluster */}
                        <div className="hud-right-cluster">
                            <div className="view-mode-pill-toggle">
                                <button
                                    type="button"
                                    className={`pill-btn ${viewMode === 'code' ? 'active' : ''}`}
                                    onClick={() => setViewMode('code')}
                                >
                                    Raw Source Diff
                                </button>
                                <button
                                    type="button"
                                    className={`pill-btn ${viewMode === 'ast' ? 'active' : ''}`}
                                    onClick={() => setViewMode('ast')}
                                >
                                    AST N-Grams (XAI)
                                </button>
                            </div>

                            {viewMode === 'code' && (
                                <button
                                    type="button"
                                    className={`btn-sync-scroll ${syncScroll ? 'active' : ''}`}
                                    onClick={() => setSyncScroll(!syncScroll)}
                                    title={syncScroll ? "Synchronized Scrolling Enabled" : "Independent Scrolling"}
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    <span>Sync</span>
                                </button>
                            )}

                            <div className="pdf-exporter-wrap">
                                <AnalysisPDFExporter selectedPair={selectedPair} />
                            </div>
                        </div>
                    </header>

                    {/* --- FORENSIC VERDICT & EVIDENCE HERO BAR --- */}
                    <div className="compare-verdict-banner spatial-card">
                        <div className="verdict-banner-left">
                            <div className="score-hero-block">
                                <span className="score-hero-label">SIMILARITY INDEX</span>
                                <div className="score-hero-val" style={{ color: themeData?.color || '#3b82f6' }}>
                                    {selectedPair.score}%
                                </div>
                            </div>
                            <div className="verdict-divider"></div>
                            <div className="classification-hero-block">
                                <span className="classification-label">CLONE CLASSIFICATION</span>
                                <span className={`badge-pill ${themeData?.badgeClass || 'badge-safe'}`}>
                                    {themeData?.label || selectedPair.plagiarism_type}
                                </span>
                            </div>
                        </div>

                        <div className="verdict-banner-right">
                            <div className="forensic-kpi-chip">
                                <span className="kpi-chip-label">Raw Identity</span>
                                <strong className="kpi-chip-val">{selectedPair.raw_identity_score !== undefined ? `${selectedPair.raw_identity_score}%` : `${selectedPair.score}%`}</strong>
                            </div>
                            <div className="forensic-kpi-chip">
                                <span className="kpi-chip-label">Order Alignment</span>
                                <strong className="kpi-chip-val">{selectedPair.order_similarity_score !== undefined ? `${selectedPair.order_similarity_score}%` : '100%'}</strong>
                            </div>
                            <div className="forensic-kpi-chip">
                                <span className="kpi-chip-label">Compromised Lines</span>
                                <strong className="kpi-chip-val text-danger">
                                    {(selectedPair.lines1?.length || 0) + (selectedPair.lines2?.length || 0)} lines
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* --- MOBILE PANE SELECTOR TABS (App-mode) --- */}
                    <div className="mobile-pane-selector">
                        <button
                            type="button"
                            className={`mobile-tab-btn ${activeMobilePane === 'a' ? 'active' : ''}`}
                            onClick={() => setActiveMobilePane('a')}
                        >
                            Source A: {selectedPair.file1}
                        </button>
                        <button
                            type="button"
                            className={`mobile-tab-btn ${activeMobilePane === 'b' ? 'active' : ''}`}
                            onClick={() => setActiveMobilePane('b')}
                        >
                            Source B: {selectedPair.file2}
                        </button>
                        <button
                            type="button"
                            className={`mobile-tab-btn ${activeMobilePane === 'stacked' ? 'active' : ''}`}
                            onClick={() => setActiveMobilePane('stacked')}
                        >
                            Stacked
                        </button>
                    </div>

                    {/* --- 2-COLUMN FULL-PAGE WORKSPACE --- */}
                    <main className={`compare-dual-workspace mobile-${activeMobilePane}`}>
                        
                        {/* LEFT COLUMN: FILE 1 */}
                        <div className={`code-pane-box pane-a ${activeMobilePane === 'b' ? 'mobile-pane-hidden' : ''}`}>
                            <div className="pane-header-bar">
                                <div className="pane-title-group">
                                    <span className="source-indicator source-a">SOURCE A</span>
                                    <strong className="pane-filename" title={selectedPair.file1}>
                                        {selectedPair.file1}
                                    </strong>
                                </div>
                                <div className="pane-actions-group">
                                    <span className="line-count-note">
                                        {rawCodeA.split('\n').length} lines · {selectedPair.lines1?.length || 0} flagged
                                    </span>
                                    <button
                                        type="button"
                                        className="btn-pane-action"
                                        onClick={() => handleCopyCode(rawCodeA, selectedPair.file1)}
                                        title="Copy source code"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div 
                                className="pane-scroll-viewport" 
                                ref={paneARef}
                                onScroll={handleScrollA}
                            >
                                {viewMode === 'code' ? (
                                    <pre className="code-viewer-block">
                                        {renderCodeWithHighlights(rawCodeA, selectedPair.lines1, selectedPair.plagiarism_type)}
                                    </pre>
                                ) : (
                                    renderASTStream(selectedPair.ast_xai_1, selectedPair.ast_unique_1 || [])
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: FILE 2 */}
                        <div className={`code-pane-box pane-b ${activeMobilePane === 'a' ? 'mobile-pane-hidden' : ''}`}>
                            <div className="pane-header-bar">
                                <div className="pane-title-group">
                                    <span className="source-indicator source-b">SOURCE B</span>
                                    <strong className="pane-filename" title={selectedPair.file2}>
                                        {selectedPair.file2}
                                    </strong>
                                </div>
                                <div className="pane-actions-group">
                                    <span className="line-count-note">
                                        {rawCodeB.split('\n').length} lines · {selectedPair.lines2?.length || 0} flagged
                                    </span>
                                    <button
                                        type="button"
                                        className="btn-pane-action"
                                        onClick={() => handleCopyCode(rawCodeB, selectedPair.file2)}
                                        title="Copy source code"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div 
                                className="pane-scroll-viewport" 
                                ref={paneBRef}
                                onScroll={handleScrollB}
                            >
                                {viewMode === 'code' ? (
                                    <pre className="code-viewer-block">
                                        {renderCodeWithHighlights(rawCodeB, selectedPair.lines2, selectedPair.plagiarism_type)}
                                    </pre>
                                ) : (
                                    renderASTStream(selectedPair.ast_xai_2, selectedPair.ast_unique_2 || [])
                                )}
                            </div>
                        </div>

                    </main>

                </div>
            </div>
        </InstructorWrapper>
    );
};

export default InstructorComparisonView;
