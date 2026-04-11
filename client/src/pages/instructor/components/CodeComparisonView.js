import React from 'react';

const CodeComparisonView = ({ selectedPair, submissions, onBack }) => {
    
    // --- Pure Algorithmic Plagiarism Classification ---
    const getPlagiarismType = (pair) => {
        const score = pair.score;

        if (score >= 95) return { 
            label: "Type I: Exact Copying", 
            color: "#ef4444",
            description: "The engine detected an exceptionally high structural match. This indicates a direct replication where the logic, sequence, and syntax are virtually identical."
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

            {/* --- PLAGIARISM TYPE INDICATOR (Bottom Left) --- */}
            <div className="plagiarism-proof-footer">
                <div className="proof-tag" style={{ borderLeft: `4px solid ${getPlagiarismType(selectedPair).color}` }}>
                    <span className="proof-label">DETECTION PROOF:</span>
                    <strong className="proof-value">{getPlagiarismType(selectedPair).label}</strong>
                </div>
                {/* THE FIX: Replaced hardcoded text with the dynamic description */}
                <p className="proof-description">
                    {getPlagiarismType(selectedPair).description}
                </p>
            </div>
        </div>
    );
};

export default CodeComparisonView;