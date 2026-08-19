// src/modals/shared/ModalSkeleton.js
import React from 'react';
import './ModalSkeleton.css';

/**
 * 🌟 FormSkeleton: For CreateAssignmentModal & EditAssignmentModal loading states
 */
export const FormSkeleton = ({ rows = 3 }) => {
    return (
        <div className="modal-skeleton-wrapper">
            <div className="modal-skeleton-field">
                <div className="modal-skeleton-box modal-skeleton-label"></div>
                <div className="modal-skeleton-box modal-skeleton-input"></div>
            </div>

            <div className="modal-skeleton-field">
                <div className="modal-skeleton-box modal-skeleton-label"></div>
                <div className="modal-skeleton-box modal-skeleton-textarea"></div>
            </div>

            <div className="modal-skeleton-field">
                <div className="modal-skeleton-box modal-skeleton-label"></div>
                <div className="modal-skeleton-box modal-skeleton-input"></div>
            </div>

            <div className="modal-skeleton-row">
                <div className="modal-skeleton-field">
                    <div className="modal-skeleton-box modal-skeleton-label" style={{ width: '60px' }}></div>
                    <div className="modal-skeleton-box modal-skeleton-input"></div>
                </div>
                <div className="modal-skeleton-field">
                    <div className="modal-skeleton-box modal-skeleton-label" style={{ width: '80px' }}></div>
                    <div className="modal-skeleton-box modal-skeleton-input"></div>
                </div>
            </div>
        </div>
    );
};

/**
 * 🌟 SubmissionsListSkeleton: For SubmissionsAuditModal student list
 */
export const SubmissionsListSkeleton = ({ count = 3 }) => {
    return (
        <div className="modal-skeleton-table">
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="modal-skeleton-row-card">
                    <div className="modal-skeleton-user-info">
                        <div className="modal-skeleton-box modal-skeleton-avatar"></div>
                        <div className="modal-skeleton-user-text">
                            <div className="modal-skeleton-box" style={{ width: '130px', height: '16px' }}></div>
                            <div className="modal-skeleton-box" style={{ width: '90px', height: '12px' }}></div>
                        </div>
                    </div>

                    <div className="modal-skeleton-box" style={{ width: '120px', height: '28px', borderRadius: '6px' }}></div>

                    <div className="modal-skeleton-actions">
                        <div className="modal-skeleton-box" style={{ width: '80px', height: '36px', borderRadius: '8px' }}></div>
                        <div className="modal-skeleton-box" style={{ width: '60px', height: '36px', borderRadius: '8px' }}></div>
                        <div className="modal-skeleton-box" style={{ width: '120px', height: '36px', borderRadius: '8px' }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

/**
 * 🌟 AnalysisReportSkeleton: For SubmissionsAuditModal scanning & report generation
 */
export const AnalysisReportSkeleton = ({ count = 3 }) => {
    return (
        <div className="modal-skeleton-wrapper">
            <div className="modal-skeleton-scan-header">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="modal-skeleton-box" style={{ width: '190px', height: '20px' }}></div>
                    <div className="modal-skeleton-box" style={{ width: '280px', height: '12px' }}></div>
                </div>
                <div className="modal-skeleton-box" style={{ width: '120px', height: '26px', borderRadius: '20px' }}></div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.from({ length: count }).map((_, idx) => (
                    <div key={idx} className="modal-skeleton-match-card">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div className="modal-skeleton-box" style={{ width: '110px', height: '22px', borderRadius: '6px' }}></div>
                                <div className="modal-skeleton-box" style={{ width: '20px', height: '16px' }}></div>
                                <div className="modal-skeleton-box" style={{ width: '110px', height: '22px', borderRadius: '6px' }}></div>
                            </div>
                            <div className="modal-skeleton-box" style={{ width: '170px', height: '12px' }}></div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="modal-skeleton-box" style={{ width: '70px', height: '22px', borderRadius: '4px' }}></div>
                            <div className="modal-skeleton-box" style={{ width: '50px', height: '28px' }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * 🌟 ViewAssignmentSkeleton: For ViewAssignmentModal details loading
 */
export const ViewAssignmentSkeleton = () => {
    return (
        <div className="modal-skeleton-view-box">
            <div className="modal-skeleton-title-group">
                <div className="modal-skeleton-box" style={{ width: '65%', height: '26px' }}></div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="modal-skeleton-box" style={{ width: '110px', height: '22px', borderRadius: '20px' }}></div>
                    <div className="modal-skeleton-box" style={{ width: '100px', height: '22px', borderRadius: '20px' }}></div>
                </div>
            </div>

            <div className="modal-skeleton-desc-box">
                <div className="modal-skeleton-box" style={{ width: '160px', height: '16px' }}></div>
                <div className="modal-skeleton-box" style={{ width: '95%', height: '14px' }}></div>
                <div className="modal-skeleton-box" style={{ width: '88%', height: '14px' }}></div>
                <div className="modal-skeleton-box" style={{ width: '60%', height: '14px' }}></div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
                <div className="modal-skeleton-box" style={{ width: '130px', height: '32px', borderRadius: '6px' }}></div>
                <div className="modal-skeleton-box" style={{ width: '130px', height: '32px', borderRadius: '6px' }}></div>
            </div>
        </div>
    );
};

/**
 * 🌟 FileSubmitSkeleton: For SubmitFileModal deploying/processing state
 */
export const FileSubmitSkeleton = () => {
    return (
        <div className="modal-skeleton-wrapper">
            <div className="modal-skeleton-box" style={{ width: '100%', height: '48px', borderRadius: '10px' }}></div>
            <div className="modal-skeleton-dropzone">
                <div className="modal-skeleton-box" style={{ width: '48px', height: '48px', borderRadius: '12px' }}></div>
                <div className="modal-skeleton-box" style={{ width: '180px', height: '16px' }}></div>
                <div className="modal-skeleton-box" style={{ width: '120px', height: '12px' }}></div>
            </div>
        </div>
    );
};

const ModalSkeleton = {
    Form: FormSkeleton,
    SubmissionsList: SubmissionsListSkeleton,
    AnalysisReport: AnalysisReportSkeleton,
    ViewAssignment: ViewAssignmentSkeleton,
    FileSubmit: FileSubmitSkeleton,
};

export default ModalSkeleton;
