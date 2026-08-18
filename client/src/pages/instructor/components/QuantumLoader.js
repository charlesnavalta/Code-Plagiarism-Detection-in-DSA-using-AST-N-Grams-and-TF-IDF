import React from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import ClassroomCardSkeleton from '../../../components/dashboard/ClassroomCardSkeleton';

const QuantumLoader = () => {
    return (
        <DashboardLayout>
            <div className="nexus-layout">
                {/* --- 🌟 1:1 Matching Sidebar Skeleton --- */}
                <aside className="nexus-sidebar">
                    {/* Profile Card Skeleton */}
                    <div className="spatial-card profile-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content">
                            <div className="skeleton-box skeleton-avatar" style={{ width: '78px', height: '78px', margin: '0 auto 16px', borderRadius: '50%' }}></div>
                            <div className="skeleton-box" style={{ width: '130px', height: '24px', margin: '0 auto 8px', borderRadius: '6px' }}></div>
                            <div className="skeleton-box" style={{ width: '150px', height: '14px', margin: '0 auto 16px', borderRadius: '4px' }}></div>
                            <div className="skeleton-box skeleton-pill" style={{ width: '88px', height: '24px', margin: '0 auto', borderRadius: '20px' }}></div>
                        </div>
                    </div>

                    {/* Stat Card Skeleton */}
                    <div className="spatial-card stat-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content">
                            <div className="skeleton-box" style={{ width: '110px', height: '14px', marginBottom: '6px', borderRadius: '4px' }}></div>
                            <div className="skeleton-box skeleton-stat-value"></div>
                        </div>
                    </div>

                    {/* Recent Submissions Skeleton */}
                    <div className="spatial-card history-card">
                        <div className="card-glass-layer"></div>
                        <div className="card-content">
                            <div className="skeleton-box" style={{ width: '120px', height: '14px', marginBottom: '16px', borderRadius: '4px' }}></div>
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
                        </div>
                    </div>
                </aside>

                {/* --- 🌟 1:1 Matching Main Hub Area Skeleton --- */}
                <main className="nexus-main">
                    {/* Hero Banner Skeleton */}
                    <div className="cinematic-banner-shared spatial-card" style={{ minHeight: '120px' }}>
                        <div className="banner-content" style={{ opacity: 0.7 }}>
                            <div className="banner-text">
                                <div className="skeleton-box" style={{ width: '180px', height: '32px', marginBottom: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)' }}></div>
                                <div className="skeleton-box" style={{ width: '280px', height: '16px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Workspaces Section Skeleton */}
                    <div className="workspace-section">
                        <div className="section-title-block">
                            <div className="skeleton-box" style={{ width: '22px', height: '22px', borderRadius: '6px' }}></div>
                            <div className="skeleton-box" style={{ width: '160px', height: '20px', borderRadius: '6px' }}></div>
                        </div>

                        {/* Classroom Grid Skeleton */}
                        <div className="classroom-grid">
                            <ClassroomCardSkeleton count={4} />
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
};

export default QuantumLoader;