import React from 'react';

export const EmptyClassroomSkeleton = () => {
    return (
        <div className="spatial-card empty-card" style={{ padding: '40px', textAlign: 'center', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <div className="skeleton-box" style={{ width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto' }}></div>
            <div className="skeleton-box" style={{ width: '200px', height: '22px', borderRadius: '6px', margin: '0 auto' }}></div>
            <div className="skeleton-box" style={{ width: '320px', height: '14px', borderRadius: '4px', margin: '0 auto' }}></div>
        </div>
    );
};

const ClassroomCardSkeleton = ({ count = 3 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={`skeleton-${index}`}
                    className="spatial-card skeleton-course-card"
                    style={{ animationDelay: `${index * 0.08}s` }}
                >
                    <div className="card-glass-layer"></div>
                    <div className="card-content flex-col">
                        <div className="skeleton-box skeleton-badge"></div>
                        <div className="skeleton-box skeleton-title"></div>
                        <div className="skeleton-instructor">
                            <div className="skeleton-box skeleton-avatar"></div>
                            <div className="skeleton-box skeleton-text-sm"></div>
                        </div>
                        <div className="skeleton-footer">
                            <div className="skeleton-box skeleton-btn"></div>
                            <div
                                className="skeleton-box skeleton-avatar"
                                style={{ width: '18px', height: '18px', borderRadius: '4px' }}
                            ></div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ClassroomCardSkeleton;
