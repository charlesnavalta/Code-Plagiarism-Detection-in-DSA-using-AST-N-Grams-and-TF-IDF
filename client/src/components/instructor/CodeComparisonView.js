import React, { useState } from 'react';
import './CodeComparisonView.css'; 
import AnalysisPDFExporter from './AnalysisPDFExporter'; 

// 🌟 IMPORT DRY UTILITIES
import { getPlagiarismDisplayData, getASTBadgeStyle } from '../../utils/theme';

const CodeComparisonView = ({ selectedPair, submissions, onBack }) => {
    const [viewMode, setViewMode] = useState('code'); 

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
        if (!xaiData || xaiData.length === 0) return <div className="empty-ast">No structural tokens extracted. Please check backend configuration.</div>;
        
        return (
            <div className="ast-pattern-stream">
                {xaiData.map((patternData, patternIndex) => {
                    const realWeight = patternData.weight;
                    const { categoryLabel, badgeColor, badgeBg } = getASTBadgeStyle(realWeight, patternIndex, xaiData.length);

                    return (
                        <div key={`pattern-${patternIndex}`} className="ngram-pattern-box" style={{ borderLeft: `3px solid ${badgeColor}` }}>
                            <div className="pattern-header-row">
                                <div className="pattern-title-wrap">
                                    <div className="pattern-header">Logical Sequence {patternIndex + 1}</div>
                                    <div className="pattern-subtitle" style={{ color: badgeColor }}>
                                        {categoryLabel}
                                    </div>
                                </div>
                                <div className="pattern-weight-badge" style={{ color: badgeColor, backgroundColor: badgeBg, borderColor: badgeBg }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px'}}>
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                                    </svg>
                                    TF-IDF Weight: {realWeight}
                                </div>
                            </div>
                            
                            <div className="pattern-tokens-container">
                                {patternData.sequence.map((token, tokenIndex) => (
                                    <React.Fragment key={`token-${patternIndex}-${tokenIndex}`}>
                                        <div className="ast-token-pill">
                                            <span className="token-index">{patternIndex + tokenIndex + 1}</span>
                                            <span className="token-name">{token}</span>
                                        </div>
                                        
                                        {tokenIndex < patternData.sequence.length - 1 && (
                                            <svg className="pattern-arrow" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                            </svg>
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

            {/* 🌟 3. Responsive Split Screen Container */}
            <div className="split-screen-container">
                <div className="code-pane">
                    <div className="code-pane-header">
                        <span className="file-badge student-a">{selectedPair.file1}</span>
                    </div>
                    <div className="pane-content-scroll">
                        {viewMode === 'code' ? <pre className="code-block">{renderCodeWithHighlights(getCodeByFilename(selectedPair.file1), selectedPair.lines1)}</pre> : renderASTStream(selectedPair.ast_xai_1)}
                    </div>
                </div>
                
                <div className="code-pane">
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