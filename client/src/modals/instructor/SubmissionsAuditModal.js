import React, { useState } from 'react';
import api from '../../services/api'; 
import { useToast } from '../../context/NotificationContext';
import CodeComparisonView from '../../components/instructor/CodeComparisonView'; 
import './SubmissionsAuditModal.css'; 
import { getPlagiarismDisplayData } from '../../utils/theme';

// 🌟 Import the Base Skeleton
import BaseModal from '../shared/BaseModal';

const SubmissionsAuditModal = ({ isOpen, onClose, submissions, analysisResults, isAnalyzing, onRunAnalysis, classroomId, assignmentId }) => {
    const [selectedPair, setSelectedPair] = useState(null);
    const [gradeInputs, setGradeInputs] = useState({}); 
    const [unlockedIds, setUnlockedIds] = useState([]); // Tracks instantly unlocked submissions
    const toast = useToast();

    if (!isOpen) {
        if (selectedPair) setSelectedPair(null);
        return null;
    }

    const handleSaveGrade = async (submissionId) => {
        const scoreToSave = gradeInputs[submissionId];
        if (!scoreToSave) return toast.warning("Please enter a valid grade or score first.", "Input Required");

        try {
            await api.post(`/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${submissionId}/grade`, { score: scoreToSave });
            toast.success("Grade committed successfully!", "Score Updated");
            const subToUpdate = submissions.find(s => s.id === submissionId);
            if (subToUpdate) subToUpdate.score = scoreToSave;
        } catch (error) {
            toast.error("Failed to commit grade to database.", "Grading Error");
        }
    };

    // Handler for the Resubmit Button
    const handleAllowResubmit = async (submissionId) => {
        try {
            await api.patch(`/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${submissionId}/allow-resubmit`);
            toast.success("Resubmission unlocked for student!", "Lock Cleared");
            setUnlockedIds(prev => [...prev, submissionId]); // Instantly updates the UI
        } catch (error) {
            toast.error("Failed to unlock resubmission. Please check your connection.", "Action Failed");
        }
    };

    return (
        <BaseModal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={selectedPair ? "Code Comparison" : "Submission Tree"} 
            subtitle={selectedPair ? `Detailed logic analysis between ${selectedPair.file1} and ${selectedPair.file2}` : ""}
            customClass="wide-hud"
        >
            <div className="hud-modal-body audit-body-override">
                {!selectedPair ? (
                    <>
                        <div className="table-responsive-wrapper">
                            <table className="falsicode-table-hud responsive-card-table">
                                <thead>
                                    <tr>
                                        <th style={{width: '40px'}} className="hide-mobile"></th>
                                        <th>STUDENT IDENTITY</th>
                                        <th>SOURCE FILE</th>
                                        {/* 🌟 Widened from 280px to 380px to fit everything on one line */}
                                        <th style={{width: '380px'}}>ACTIONS</th> 
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map(sub => {
                                        const isUnlocked = sub.allow_resubmit || unlockedIds.includes(sub.id);
                                        
                                        return (
                                            <tr key={sub.id}>
                                                <td className="status-cell hide-mobile">
                                                    <div className="status-dot yellow"></div>
                                                </td>
                                                <td className="td-student">
                                                    <div className="hud-stu-cell">
                                                        <div className="stu-icon">{sub.student_name.charAt(0)}</div>
                                                        <strong>{sub.student_name}</strong>
                                                    </div>
                                                </td>
                                                <td className="td-file">
                                                    <code className="code-box">{sub.filename}</code>
                                                </td>
                                                <td className="td-action">
                                                    <div className="grade-input-group">
                                                        <input 
                                                            type="text" className="grade-input-small" 
                                                            placeholder={sub.score && sub.score !== 'Pending' ? sub.score : "e.g. 45/50"}
                                                            value={gradeInputs[sub.id] !== undefined ? gradeInputs[sub.id] : ''}
                                                            onChange={(e) => setGradeInputs({...gradeInputs, [sub.id]: e.target.value})}
                                                        />
                                                        <button className="btn-save-grade" onClick={() => handleSaveGrade(sub.id)}>Save</button>
                                                        
                                                        {/* 🌟 Updated Button Text & Added whiteSpace nowrap */}
                                                        <button 
                                                            className={`btn-allow-resubmit ${isUnlocked ? 'unlocked' : ''}`} 
                                                            onClick={() => handleAllowResubmit(sub.id)}
                                                            disabled={isUnlocked}
                                                            title={isUnlocked ? "Student is currently allowed to resubmit" : "Unlock to allow student to upload again"}
                                                            style={{ whiteSpace: 'nowrap' }}
                                                        >
                                                            {isUnlocked ? 'Waiting' : 'Allow Resubmit'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {analysisResults && (
                            <div className="analysis-report-section">
                                <div className="report-header">
                                    <h3>Falsicode Analysis Report</h3>
                                    <span className="scan-badge">SCAN COMPLETE</span>
                                </div>
                                <div className="table-responsive-wrapper">
                                    <table className="falsicode-table-hud report-table hoverable-table responsive-card-table">
                                        <thead>
                                            <tr>
                                                <th>MATCHED PAIR</th>
                                                <th style={{textAlign: 'right'}} className="align-left-mobile">SIM</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analysisResults.length > 0 ? (
                                                analysisResults.map((res, i) => {
                                                    const displayData = getPlagiarismDisplayData(res.plagiarism_type);
                                                    return (
                                                        <tr key={i} onClick={() => setSelectedPair(res)} className="clickable-row">
                                                            <td className="comparison-text td-file">
                                                                <div className="pair-wrap">
                                                                    {res.file1} <span className="arrow-icon">↔</span> {res.file2}
                                                                </div>
                                                                <span className="view-details-text">Click to view comparison</span>
                                                            </td>
                                                            <td className="sim-score td-action" style={{ color: displayData.color }}>
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

            {!selectedPair && (
                <div className="hud-modal-footer">
                    <button 
                        className={`btn-hud-run ${isAnalyzing ? 'pulsing' : ''}`} 
                        onClick={onRunAnalysis} 
                        disabled={isAnalyzing}
                    >
                        {isAnalyzing ? "Processing..." : "Run Falsicode Analysis"}
                    </button>
                </div>
            )}
        </BaseModal>
    );
};

export default SubmissionsAuditModal;