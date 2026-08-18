import React from 'react';
import InstructorWrapper from './InstructorWrapper';
import '../../../components/dashboard/DashboardLayout.css';

const ClassroomViewSkeleton = ({ role = 'student' }) => {
    return (
        <InstructorWrapper>
            <div className={`nexus-content ${role}-layout`}>
                {/* --- 🌟 Shimmering Classroom Hero Banner --- */}
                <header className="cinematic-banner-shared spatial-card classroom-hero-banner" style={{ minHeight: '220px', marginBottom: '50px' }}>
                    <div className="header-inner" style={{ padding: '45px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="top-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div className="skeleton-box" style={{ width: '80px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)' }}></div>
                            <div className="skeleton-box" style={{ width: '160px', height: '32px', borderRadius: '30px', background: 'rgba(255,255,255,0.15)' }}></div>
                        </div>

                        <div className="skeleton-box" style={{ width: '55%', height: '42px', borderRadius: '10px', background: 'rgba(255,255,255,0.25)', margin: '6px 0' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="skeleton-box" style={{ width: '90px', height: '18px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)' }}></div>
                            <div className="skeleton-box" style={{ width: '140px', height: '20px', borderRadius: '6px', background: 'rgba(255,255,255,0.2)' }}></div>
                        </div>

                        {role === 'student' ? (
                            <div style={{ maxWidth: '400px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className="skeleton-box" style={{ width: '100%', height: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)' }}></div>
                                <div className="skeleton-box" style={{ width: '180px', height: '14px', borderRadius: '4px', background: 'rgba(255,255,255,0.15)' }}></div>
                            </div>
                        ) : (
                            <div className="skeleton-box" style={{ width: '140px', height: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)' }}></div>
                        )}
                    </div>
                </header>

                {/* --- 🌟 Shimmering Assignment Stream --- */}
                <main className="content-hub">
                    <div className="hub-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div className="skeleton-box" style={{ width: '180px', height: '32px', borderRadius: '8px' }}></div>
                        {role === 'instructor' && (
                            <div className="skeleton-box" style={{ width: '180px', height: '42px', borderRadius: '40px' }}></div>
                        )}
                    </div>

                    <div className="assignment-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="spatial-card assignment-item-row" style={{ padding: '30px', animationDelay: `${i * 0.1}s`, cursor: 'default' }}>
                                <div className="card-glass-layer"></div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="skeleton-box" style={{ width: '130px', height: '16px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-box" style={{ width: '80px', height: '22px', borderRadius: '20px' }}></div>
                                    </div>

                                    <div className="skeleton-box" style={{ width: '45%', height: '24px', borderRadius: '6px' }}></div>
                                    <div className="skeleton-box" style={{ width: '85%', height: '16px', borderRadius: '4px' }}></div>
                                    <div className="skeleton-box" style={{ width: '60%', height: '16px', borderRadius: '4px' }}></div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                                        <div className="skeleton-box" style={{ width: '16px', height: '16px', borderRadius: '4px' }}></div>
                                        <div className="skeleton-box" style={{ width: '140px', height: '14px', borderRadius: '4px' }}></div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-card)' }}>
                                        <div className="skeleton-box" style={{ width: '90px', height: '24px', borderRadius: '6px' }}></div>
                                        <div className="skeleton-box" style={{ width: '170px', height: '38px', borderRadius: '10px' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </InstructorWrapper>
    );
};

export default ClassroomViewSkeleton;
