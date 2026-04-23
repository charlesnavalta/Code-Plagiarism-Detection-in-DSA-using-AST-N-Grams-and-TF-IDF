import React, { useState } from 'react';
import './CodeComparisonView.css'; // <-- NEW: Import the dedicated CSS file

const CodeComparisonView = ({ selectedPair, submissions, onBack }) => {
    // --- NEW: State to toggle the report ---
    const [showReport, setShowReport] = useState(false);
    
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

    const typeData = getPlagiarismType(selectedPair);

    return (
        <div className="code-comparison-view fade-in">
            <button className="btn-back-link" onClick={onBack}>
                ← Back to Analysis Report
            </button>
            <div className="split-screen-container">
                <div className="code-pane">
                    <div className="code-pane-header"><span className="file-badge">{selectedPair.file1}</span></div>
                    <pre className="code-block">
                        {renderCodeWithHighlights(getCodeByFilename(selectedPair.file1), selectedPair.lines1)}
                    </pre>
                </div>
                <div className="code-pane">
                    <div className="code-pane-header"><span className="file-badge">{selectedPair.file2}</span></div>
                    <pre className="code-block">
                        {renderCodeWithHighlights(getCodeByFilename(selectedPair.file2), selectedPair.lines2)}
                    </pre>
                </div>
            </div>

            {/* --- TOGGLEABLE SIMILARITY REPORT --- */}
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
                                <strong className="proof-value">{typeData.label}</strong>
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