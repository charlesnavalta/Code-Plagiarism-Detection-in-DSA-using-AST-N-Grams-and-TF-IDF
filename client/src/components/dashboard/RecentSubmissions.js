import React from 'react';
import { formatTimestamp } from '../../utils/dateUtils';

const RecentSubmissions = ({ submissions = [], loading = false, role = 'student' }) => {
    return (
        <div className="spatial-card history-card delay-2">
            <div className="card-glass-layer"></div>
            <div className="card-content">
                <span className="stat-label" style={{ marginBottom: '15px', display: 'block', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    Recent Submissions
                </span>

                {loading ? (
                    <div className="submission-history-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton-history-item">
                                <div className="skeleton-history-info">
                                    <div className="skeleton-box skeleton-history-title"></div>
                                    <div className="skeleton-box skeleton-history-date"></div>
                                </div>
                                <div className="skeleton-box skeleton-pill"></div>
                            </div>
                        ))}
                    </div>
                ) : submissions.length === 0 ? (
                    <p className="email-dim" style={{ fontSize: '12px', textAlign: 'center', marginTop: '10px', color: '#9ca3af' }}>
                        No submissions on record.
                    </p>
                ) : (
                    <ul className="submission-history-list">
                        {submissions.slice(0, 5).map((sub) => (
                            <li key={sub.id} className="history-item">
                                <div className="history-info">
                                    <strong className="history-title" title={role === 'instructor' ? `${sub.student_name} → ${sub.assignment_name}` : sub.assignment_name}>
                                        {role === 'instructor'
                                            ? `${sub.student_name} → ${sub.assignment_name}`
                                            : sub.assignment_name
                                        }
                                    </strong>
                                    <span className="history-date">
                                        {role === 'instructor' && sub.classroom_name
                                            ? `${sub.classroom_name} · ${formatTimestamp(sub.submitted_at)}`
                                            : formatTimestamp(sub.date || sub.submitted_at)
                                        }
                                    </span>
                                </div>
                                <div className={`clean-status-pill ${sub.score && sub.score !== 'Pending' ? 'active' : 'archived'}`} style={{ padding: '2px 6px', fontSize: '10px' }}>
                                    {sub.score || 'Pending'}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default RecentSubmissions;
