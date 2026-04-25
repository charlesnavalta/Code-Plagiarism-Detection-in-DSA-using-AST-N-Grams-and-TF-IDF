import React, { useState } from 'react';
import './CodeComparisonView.css'; 

const CodeComparisonView = ({ selectedPair, submissions, onBack }) => {
    // --- State Toggles ---
    const [showReport, setShowReport] = useState(false);
    const [viewMode, setViewMode] = useState('code'); // 'code' or 'ast'

    // --- Pure Algorithmic Plagiarism Classification ---
    const getPlagiarismType = (pair) => {
        const score = pair.score;

        if (score >= 95) return { 
            label: "Type I: Exact Copying", 
            color: "#ef4444",
            description: "The AST N-Grams engine detected an exceptionally high structural match. This indicates a direct replication where the logic, sequence, and syntax are virtually identical."
        };
        if (score >= 80) return { 
            label: "Type II: Renamed Identifiers", 
            color: "#f97316",
            description: "The engine detected highly identical underlying logic. This indicates superficial modifications, such as renaming variables or functions, while preserving the exact original structure."
        };
        if (score >= 70) return { 
            label: "Type III: Structural Modification", 
            color: "#eab308",
            description: "The engine identified significantly overlapping logic sequences. This indicates the modification of control structures (e.g., swapping loop types) or statement reordering to hide copied algorithms."
        };
        
        return { 
            label: "Low Similarity", 
            color: "#10b981",
            description: "The structural logic sequences fall within the expected baseline for independent work. The engine found no significant evidence of structural copying."
        };
    };

    const getCodeByFilename = (label) => {
        const sub = submissions.find(s => `${s.student_name} (${s.filename})` === label);
        return sub && sub.content ? sub.content : "Code content not available. Please check backend.";
    };

    // --- N-GRAM GENERATOR HELPER ---
    const generateNGrams = (tokens, n = 3) => {
        if (!tokens || tokens.length === 0) return [];
        if (tokens.length < n) return [tokens]; 
        
        let nGrams = [];
        for (let i = 0; i <= tokens.length - n; i++) {
            nGrams.push(tokens.slice(i, i + n));
        }
        return nGrams;
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

    const renderASTStream = (tokens) => {
        if (!tokens || tokens.length === 0) return <div className="empty-ast">No structural tokens extracted. Please check backend configuration.</div>;
        
        const nGrams = generateNGrams(tokens, 3);
        
        return (
            <div className="ast-pattern-stream">
                {nGrams.map((ngramPattern, patternIndex) => (
                    <div key={`pattern-${patternIndex}`} className="ngram-pattern-box">
                        <div className="pattern-header">Pattern {patternIndex + 1}</div>
                        
                        <div className="pattern-tokens-container">
                            {ngramPattern.map((token, tokenIndex) => (
                                <React.Fragment key={`token-${patternIndex}-${tokenIndex}`}>
                                    <div className="ast-token-pill">
                                        <span className="token-index">{patternIndex + tokenIndex + 1}</span>
                                        <span className="token-name">{token}</span>
                                    </div>
                                    
                                    {/* Arrow connection between tokens */}
                                    {tokenIndex < ngramPattern.length - 1 && (
                                        <svg className="pattern-arrow" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                ))}
                {tokens.length === 20 && <div className="ast-token-pill more-nodes">... subsequent patterns truncated for view</div>}
            </div>
        );
    };

    const typeData = getPlagiarismType(selectedPair);

    return (
        <div className="code-comparison-view fade-in">
            {/* Header Area with Toggles */}
            <div className="comparison-header-flex">
                <button className="btn-back-link" onClick={onBack}>
                    ← Back to Analysis Report
                </button>
                
                <div className="view-toggle-group">
                    <button 
                        className={`toggle-btn ${viewMode === 'code' ? 'active' : ''}`} 
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
            </div>

            {/* Main Visualizer Panes */}
            <div className="split-screen-container">
                <div className="code-pane">
                    <div className="code-pane-header">
                        <span className="file-badge student-a">{selectedPair.file1}</span>
                    </div>
                    <div className="pane-content-scroll">
                        {viewMode === 'code' 
                            ? <pre className="code-block">{renderCodeWithHighlights(getCodeByFilename(selectedPair.file1), selectedPair.lines1)}</pre>
                            : renderASTStream(selectedPair.ast1)
                        }
                    </div>
                </div>
                <div className="code-pane">
                    <div className="code-pane-header">
                        <span className="file-badge student-b">{selectedPair.file2}</span>
                    </div>
                    <div className="pane-content-scroll">
                        {viewMode === 'code' 
                            ? <pre className="code-block">{renderCodeWithHighlights(getCodeByFilename(selectedPair.file2), selectedPair.lines2)}</pre>
                            : renderASTStream(selectedPair.ast2)
                        }
                    </div>
                </div>
            </div>

            {/* Similarity Report Footer */}
            <div className="plagiarism-report-wrapper">
                {!showReport ? (
                    <button className="btn-view-report fade-in" onClick={() => setShowReport(true)}>
                        <span className="icon">📊</span> View Detailed Similarity Report
                    </button>
                ) : (
                    <div className="plagiarism-proof-footer expanded fade-in-down" style={{ borderLeft: `4px solid ${typeData.color}` }}>
                        <div className="report-header-flex">
                            <div className="proof-tag">
                                <span className="proof-label">DETECTION PROOF:</span>
                                <strong className="proof-value" style={{color: '#fff'}}>{typeData.label}</strong>
                            </div>
                            
                            <div className="score-badge" style={{ color: typeData.color, borderColor: typeData.color }}>
                                {selectedPair.score}% MATCH
                            </div>
                            
                            <button className="btn-close-report" onClick={() => setShowReport(false)}>&times;</button>
                        </div>
                        
                        <p className="proof-description">
                            {typeData.description}
                        </p>

                        <div className="report-metrics-grid">
                            <div className="metric-box">
                                <span className="m-label">Analysis Engine</span>
                                <span className="m-value">AST N-Grams (TF-IDF)</span>
                            </div>
                            <div className="metric-box">
                                <span className="m-label">Variable Names</span>
                                <span className="m-value">Sanitized / Ignored</span>
                            </div>
                            <div className="metric-box">
                                <span className="m-label">Flagged Nodes</span>
                                <span className="m-value">{selectedPair.lines1?.length || 0} Suspicious Lines</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeComparisonView;