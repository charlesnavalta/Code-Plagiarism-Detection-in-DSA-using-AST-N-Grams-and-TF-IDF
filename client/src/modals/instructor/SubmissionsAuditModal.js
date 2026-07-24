import React, { useState } from 'react';
import api from '../../services/api'; 
import CodeComparisonView from '../../components/instructor/CodeComparisonView'; 
import './SubmissionsAuditModal.css'; 

// 🌟 Import your new DRY utility
import { getPlagiarismDisplayData } from '../../utils/theme';

const SubmissionsAuditModal = ({ isOpen, onClose, submissions, analysisResults, isAnalyzing, onRunAnalysis, classroomId, assignmentId }) => {
    const [selectedPair, setSelectedPair] = useState(null);
    const [gradeInputs, setGradeInputs] = useState({}); 

    if (!isOpen) {
        if (selectedPair) setSelectedPair(null);
        return null;
    }

    const handleSaveGrade = async (submissionId) => {
        const scoreToSave = gradeInputs[submissionId];
        if (!scoreToSave) return alert("Please enter a score first.");

        try {
            await api.post(`/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${submissionId}/grade`, { score: scoreToSave });
            alert("Grade saved successfully!");
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
                    <h2>{selectedPair ? "Code Comparison" : "Submission Tree"}</h2>
                    <p className="hud-subtitle">
                        {selectedPair 
                            ? `Detailed logic analysis between ${selectedPair.file1} and ${selectedPair.file2}`
                            : ""}
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
                                        <th style={{width: '180px'}}>ASSIGN GRADE</th>
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
                                            <td>
                                                <div className="grade-input-group">
                                                    <input 
                                                        type="text" 
                                                        className="grade-input-small" 
                                                        placeholder={sub.score && sub.score !== 'Pending' ? sub.score : "e.g. 45/50"}
                                                        value={gradeInputs[sub.id] !== undefined ? gradeInputs[sub.id] : ''}
                                                        onChange={(e) => setGradeInputs({...gradeInputs, [sub.id]: e.target.value})}
                                                    />
                                                    <button className="btn-save-grade" onClick={() => handleSaveGrade(sub.id)}>Save</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {analysisResults && (
                                <div className="analysis-report-section">
                                    <div className="report-header">
                                        <h3>Falsicode Analysis Report</h3>
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
                                                analysisResults.map((res, i) => {
                                                    // 🌟 Call the DRY utility using the smart backend data
                                                    const displayData = getPlagiarismDisplayData(res.plagiarism_type);
                                                    
                                                    return (
                                                        <tr key={i} onClick={() => setSelectedPair(res)} className="clickable-row">
                                                            <td className="comparison-text">
                                                                {res.file1} <span className="arrow-icon">↔</span> {res.file2}
                                                                <span className="view-details-text">Click to view comparison</span>
                                                            </td>
                                                            
                                                            {/* 🌟 Apply the smart color and add the Type label */}
                                                            <td className="sim-score" style={{ color: displayData.color }}>
                                                                <span style={{ fontSize: '11px', display: 'block', marginBottom: '2px', fontWeight: 'bold' }}>
                                                                    {displayData.shortLabel}
                                                                </span>
                                                                {res.score}%
                                                            </td>
                                                        </tr>
                                                    );
                                                })
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
                        <CodeComparisonView 
                            selectedPair={selectedPair} 
                            submissions={submissions} 
                            onBack={() => setSelectedPair(null)} 
                        />
                    )}
                </div>

                <div className="hud-footer-actions">
                    {!selectedPair && (
                        <button className={`btn-hud-run ${isAnalyzing ? 'pulsing' : ''}`} onClick={onRunAnalysis} disabled={isAnalyzing}>
                            {isAnalyzing ? "Processing..." : "Run Falsicode Analysis"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubmissionsAuditModal;