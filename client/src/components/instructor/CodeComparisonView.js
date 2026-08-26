import React, { useState } from 'react';
import './CodeComparisonView.css'; 
import AnalysisPDFExporter from './AnalysisPDFExporter'; 

// 🌟 IMPORT DRY UTILITIES
import { getPlagiarismDisplayData, getASTBadgeStyle } from '../../utils/theme';

const CodeComparisonView = ({ selectedPair, submissions, onBack }) => {
    const [viewMode, setViewMode] = useState('code'); 
    const [activeMobilePane, setActiveMobilePane] = useState('a'); // 'a' | 'b' | 'stacked'

    // Get smart theme data for the banner
    const themeData = selectedPair ? getPlagiarismDisplayData(selectedPair.plagiarism_type) : null;

    const getCodeByFilename = (label) => {
        const sub = submissions.find(s => `${s.student_name} (${s.filename})` === label);
        return sub && sub.content ? sub.content : "Code content not available. Please check backend.";
    };

    const renderCodeWithHighlights = (code, highlightedLines = []) => {
        if (!code || code.startsWith("Code content not available")) {
            return <code>{code}</code>;
        }

        const lines = code.split('\n');
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
                    hoverText = 'Type 1: Exact / Near-identical copy';
                } else if (matchType === 2) {
                    highlightClass = 'match-type-2';
                    hoverText = 'Type 2: Renamed variables / Literals altered';
                } else if (matchType === 3) {
                    highlightClass = 'match-type-3';
                    hoverText = 'Type 3: Rearranged structure / Reordered statements';
                }
            }
            
            return (
                <div 
                    key={index} 
                    className={`code-line ${highlightClass}`} 
                    data-tooltip={hoverText ? hoverText : undefined}
                >
                    <span className="line-number">{lineNumber}</span>
                    <span className="line-content">{line || ' '}</span>
                </div>
            );
        });
    };

    const renderASTStream = (xaiData) => {
        if (!xaiData || xaiData.length === 0) {
            return (
                <div className="empty-ast">
                    <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginBottom: '8px', opacity: 0.6 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                    </svg>
                    <span>No structural AST tokens extracted.</span>
                </div>
            );
        }
        
        return (
            <div className="ast-pattern-stream">
                {xaiData.map((patternData, patternIndex) => {
                    const realWeight = patternData.weight;
                    const { categoryLabel, badgeColor, badgeBg } = getASTBadgeStyle(realWeight, patternIndex, xaiData.length);

                    return (
                        <div key={`pattern-${patternIndex}`} className="ngram-pattern-card">
                            {/* Sleek Sequence Header */}
                            <div className="pattern-header-row">
                                <div className="pattern-meta-left">
                                    <span className="sequence-badge">Sequence #{patternIndex + 1}</span>
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
                            
                            {/* Connected AST Flow Pipeline */}
                            <div className="pattern-tokens-container">
                                {patternData.sequence.map((token, tokenIndex) => (
                                    <React.Fragment key={`token-${patternIndex}-${tokenIndex}`}>
                                        <div className="ast-token-chip">
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
                })}
            </div>
        );
    };

    return (
        <div className="code-comparison-view fade-in">
            {/* 🌟 1. Responsive Header Controls */}
            <div className="comparison-header-flex">
                <button className="btn-back-link" onClick={onBack}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px', verticalAlign: 'middle', marginTop: '-2px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Analysis Report
                </button>
                
                <div className="view-toggle-group">
                    <button 
                        className={`toggle-btn raw-btn ${viewMode === 'code' ? 'active' : ''}`} 
                        onClick={() => setViewMode('code')}
                    >
                        Raw Source Code
                    </button>
                    
                    <button 
                        className={`toggle-btn xai-btn ${viewMode === 'ast' ? 'active' : ''}`} 
                        onClick={() => setViewMode('ast')}
                    >
                        AST N-Grams (XAI)
                    </button>
                </div>

                <div className="pdf-export-wrapper">
                    <AnalysisPDFExporter selectedPair={selectedPair} />
                </div>
            </div>

            {/* 🌟 2. Responsive Summary Bar */}
            {selectedPair && themeData && (
                <div className="classification-summary-bar">
                    <div className="summary-main-metrics">
                        <div className="metric-block">
                            <span className="metric-label">Overall Similarity</span>
                            <div className="metric-score" style={{ color: themeData.color }}>
                                {selectedPair.score}%
                            </div>
                        </div>
                        <div className="metric-divider"></div>
                        <div className="metric-block">
                            <span className="metric-label">Classification</span>
                            <div className="metric-classification">
                                {selectedPair.plagiarism_type || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {selectedPair.plagiarism_type && selectedPair.plagiarism_type !== 'N/A' && (
                        <div className="summary-sub-metrics">
                            <span className="sub-metric-item"><strong>Raw Identity:</strong> {selectedPair.raw_identity_score}%</span>
                            <span className="sub-metric-item"><strong>Order Alignment:</strong> {selectedPair.order_similarity_score}%</span>
                        </div>
                    )}
                </div>
            )}

            {/* 🌟 3. Mobile View Switcher (For iPhone 13 and Mobile Screens) */}
            {selectedPair && (
                <div className="mobile-pane-switcher">
                    <button 
                        type="button"
                        className={`mobile-pane-tab ${activeMobilePane === 'a' ? 'active' : ''}`}
                        onClick={() => setActiveMobilePane('a')}
                    >
                        <span className="mobile-tab-badge">Source A</span>
                        <span className="mobile-tab-name">{selectedPair.file1}</span>
                    </button>

                    <button 
                        type="button"
                        className={`mobile-pane-tab ${activeMobilePane === 'b' ? 'active' : ''}`}
                        onClick={() => setActiveMobilePane('b')}
                    >
                        <span className="mobile-tab-badge">Source B</span>
                        <span className="mobile-tab-name">{selectedPair.file2}</span>
                    </button>

                    <button 
                        type="button"
                        className={`mobile-pane-tab mobile-tab-split ${activeMobilePane === 'stacked' ? 'active' : ''}`}
                        onClick={() => setActiveMobilePane('stacked')}
                        title="View Both Stacked"
                    >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        <span>Both</span>
                    </button>
                </div>
            )}

            {/* 🌟 4. Responsive Split Screen Container */}
            <div className={`split-screen-container mobile-mode-${activeMobilePane}`}>
                <div className={`code-pane pane-source-a ${activeMobilePane === 'b' ? 'mobile-hidden' : ''}`}>
                    <div className="code-pane-header">
                        <span className="file-badge student-a">{selectedPair.file1}</span>
                    </div>
                    <div className="pane-content-scroll">
                        {viewMode === 'code' ? <pre className="code-block">{renderCodeWithHighlights(getCodeByFilename(selectedPair.file1), selectedPair.lines1)}</pre> : renderASTStream(selectedPair.ast_xai_1)}
                    </div>
                </div>
                
                <div className={`code-pane pane-source-b ${activeMobilePane === 'a' ? 'mobile-hidden' : ''}`}>
                    <div className="code-pane-header">
                        <span className="file-badge student-b">{selectedPair.file2}</span>
                    </div>
                    <div className="pane-content-scroll">
                        {viewMode === 'code' ? <pre className="code-block">{renderCodeWithHighlights(getCodeByFilename(selectedPair.file2), selectedPair.lines2)}</pre> : renderASTStream(selectedPair.ast_xai_2)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeComparisonView;