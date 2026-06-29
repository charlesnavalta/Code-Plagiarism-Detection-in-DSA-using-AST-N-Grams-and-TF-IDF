import React, { useState } from 'react';
import './CodeComparisonView.css'; 
import AnalysisPDFExporter from './AnalysisPDFExporter'; 

const CodeComparisonView = ({ selectedPair, submissions, onBack }) => {
    const [viewMode, setViewMode] = useState('code'); 

    const getCodeByFilename = (label) => {
        const sub = submissions.find(s => `${s.student_name} (${s.filename})` === label);
        return sub && sub.content ? sub.content : "Code content not available. Please check backend.";
    };

    // --- RENDER HELPERS ---
    const renderCodeWithHighlights = (code, highlightedLines = []) => {
        if (!code || code.startsWith("Code content not available")) {
            return <code>{code}</code>;
        }

        const lines = code.split('\n');
        return lines.map((line, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightedLines.includes(lineNumber);
            
            return (
                <div key={index} className={`code-line ${isHighlighted ? 'highlight-plagiarism' : ''}`}>
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
                    let categoryLabel = "High Suspicion (Copied Logic)";
                    let badgeColor = "#ef4444"; 
                    let badgeBg = "rgba(239, 68, 68, 0.1)";

                    if (xaiData.length === 30) {
                        if (patternIndex >= 20 && patternIndex <= 24) {
                            categoryLabel = "Average Structural Overlap";
                            badgeColor = "#f97316"; 
                            badgeBg = "rgba(249, 115, 22, 0.1)";
                        } else if (patternIndex >= 25) {
                            categoryLabel = "Common Boilerplate (Ignored)";
                            badgeColor = "#10b981"; 
                            badgeBg = "rgba(16, 185, 129, 0.1)";
                        }
                    } else {
                        if (realWeight < 65 && realWeight >= 30) {
                            categoryLabel = "Average Structural Overlap";
                            badgeColor = "#f97316"; 
                            badgeBg = "rgba(249, 115, 22, 0.1)";
                        } else if (realWeight < 30) {
                            categoryLabel = "Common Boilerplate (Ignored)";
                            badgeColor = "#10b981"; 
                            badgeBg = "rgba(16, 185, 129, 0.1)";
                        }
                    }

                    return (
                        <div key={`pattern-${patternIndex}`} className="ngram-pattern-box" style={{ borderLeft: `3px solid ${badgeColor}` }}>
                            <div className="pattern-header-row">
                                <div>
                                    <div className="pattern-header">Logical Sequence {patternIndex + 1}</div>
                                    <div style={{ fontSize: '11px', color: badgeColor, marginTop: '4px', fontWeight: '600', letterSpacing: '0.5px' }}>
                                        {categoryLabel}
                                    </div>
                                </div>
                                <div className="pattern-weight-badge" style={{ color: badgeColor, backgroundColor: badgeBg, borderColor: badgeBg }} title="Term Frequency - Inverse Document Frequency Score">
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
            <div className="comparison-header-flex">
                <button className="btn-back-link" onClick={onBack}>
                    ← Back to Analysis Report
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
                        AST N-Grams (XAI)</button>
                </div>

                {/* We only pass selectedPair now. It handles its own classification internally! */}
                <AnalysisPDFExporter selectedPair={selectedPair} />
            </div>

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