import React, { useState } from 'react';
import api from '../../../services/api'; // Make sure to import your API

const SubmissionsAuditModal = ({ isOpen, onClose, submissions, analysisResults, isAnalyzing, onRunAnalysis, classroomId, assignmentId }) => {
    const [selectedPair, setSelectedPair] = useState(null);
    const [gradeInputs, setGradeInputs] = useState({}); // Stores the typed grades before saving

    if (!isOpen) {
        if (selectedPair) setSelectedPair(null);
        return null;
    }

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

    // --- NEW: Handle saving the manual grade ---
    const handleSaveGrade = async (submissionId) => {
        const scoreToSave = gradeInputs[submissionId];
        if (!scoreToSave) return alert("Please enter a score first.");

        try {
            await api.post(`/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${submissionId}/grade`, { score: scoreToSave });
            alert("Grade saved successfully!");
            // Update the local submission array so it shows the new score instantly
            const subToUpdate = submissions.find(s => s.id === submissionId);
            if (subToUpdate) subToUpdate.score = scoreToSave;
        } catch (error) {
            alert("Failed to save grade.");
            console.error(error);
        }
    };

    return (
        <div className="falsicode-hud-overlay">
            <div className="spatial-card hud-modal-content wide-hud fade-in">
                <div className="hud-header">
                    <button className="btn-close-icon" onClick={onClose}>&times;</button>
                    <h2>{selectedPair ? "Code Comparison" : "Tree"}</h2>
                    <p className="hud-subtitle">
                        {selectedPair 
                            ? `Detailed logic analysis between ${selectedPair.file1} and ${selectedPair.file2}`
                            : "Reviewing student logic submissions"}
                    </p>
                </div>
                
                <div className="hud-body-scroll">
                    {!selectedPair ? (
                        <>
                            <table className="falsicode-table-hud">
                                <thead>
                                    <tr>
                                        <th style={{width: '40px'}}></th>
                                        <th>STUDENT IDENTITY</th>
                                        <th>SOURCE FILE</th>
                                        <th style={{width: '180px'}}>ASSIGN GRADE</th> {/* NEW COLUMN */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map(sub => (
                                        <tr key={sub.id}>
                                            <td className="status-cell"><div className="status-dot yellow"></div></td>
                                            <td>
                                                <div className="hud-stu-cell">
                                                    <div className="stu-icon">{sub.student_name.charAt(0)}</div>
                                                    <strong>{sub.student_name}</strong>
                                                </div>
                                            </td>
                                            <td><code className="code-box">{sub.filename}</code></td>
                                            
                                            {/* NEW GRADE INPUT UI */}
                                            <td>
                                                <div className="grade-input-group">
                                                    <input 
                                                        type="text" 
                                                        className="grade-input-small" 
                                                        placeholder={sub.score && sub.score !== 'Pending' ? sub.score : "e.g. 45/50"}
                                                        value={gradeInputs[sub.id] !== undefined ? gradeInputs[sub.id] : ''}
                                                        onChange={(e) => setGradeInputs({...gradeInputs, [sub.id]: e.target.value})}
                                                    />
                                                    <button 
                                                        className="btn-save-grade" 
                                                        onClick={() => handleSaveGrade(sub.id)}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {analysisResults && (
                                <div className="analysis-report-section">
                                    <div className="report-header">
                                        <h3>LogicGuard Analysis Report</h3>
                                        <span className="scan-badge">SCAN COMPLETE</span>
                                    </div>
                                    <table className="falsicode-table-hud report-table hoverable-table">
                                        <thead>
                                            <tr>
                                                <th>MATCHED PAIR</th>
                                                <th style={{textAlign: 'right'}}>SIM</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analysisResults.length > 0 ? (
                                                analysisResults.map((res, i) => (
                                                    <tr key={i} onClick={() => setSelectedPair(res)} className="clickable-row">
                                                        <td className="comparison-text">
                                                            {res.file1} <span className="arrow-icon">↔</span> {res.file2}
                                                            <span className="view-details-text">Click to view code</span>
                                                        </td>
                                                        <td className="sim-score">{res.score}%</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" style={{ textAlign: 'center', padding: '30px', color: 'var(--status-green)' }}>
                                                        <strong>✓ No structural plagiarism detected.</strong>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="code-comparison-view fade-in">
                            <button className="btn-back-link" onClick={() => setSelectedPair(null)}>
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
                        </div>
                    )}
                </div>

                <div className="hud-footer-actions">
                    {!selectedPair && (
                        <button className={`btn-hud-run ${isAnalyzing ? 'pulsing' : ''}`} onClick={onRunAnalysis} disabled={isAnalyzing}>
                            {isAnalyzing ? "Processing..." : "Run LogicGuard Analysis"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubmissionsAuditModal;