import React from 'react';

const StatCard = ({ label, value, loading = false, delay = 1 }) => {
    return (
        <div className={`spatial-card stat-card delay-${delay}`}>
            <div className="card-glass-layer"></div>
            <div className="card-content">
                <span className="stat-label">{label}</span>
                {loading ? (
                    <div className="skeleton-box skeleton-stat-value"></div>
                ) : (
                    <span className="stat-value">{value}</span>
                )}
            </div>
        </div>
    );
};

export default StatCard;
