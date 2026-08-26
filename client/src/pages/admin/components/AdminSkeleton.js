import React from 'react';
import './AdminSkeleton.css';

export const AdminDashboardSkeleton = () => {
    return (
        <div className="admin-skeleton-wrapper fade-in-up">
            {/* Header Banner Skeleton */}
            <div className="admin-skeleton-banner admin-shimmer"></div>

            {/* Bento Grid Skeleton */}
            <div className="admin-skeleton-bento-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`bento-skel-${i}`} className="admin-skeleton-bento-card">
                        <div className="admin-skeleton-pill admin-shimmer"></div>
                        <div className="admin-skeleton-stat admin-shimmer"></div>
                        <div className="admin-skeleton-subtext admin-shimmer"></div>
                    </div>
                ))}
            </div>

            {/* Wide Panel Skeleton */}
            <div className="admin-skeleton-wide-card">
                <div className="admin-skeleton-row-header admin-shimmer"></div>
                <div className="admin-skeleton-health-bar admin-shimmer"></div>
            </div>
        </div>
    );
};

export const AdminTableSkeleton = ({ rows = 5, columns = 5 }) => {
    return (
        <div className="admin-skeleton-wrapper fade-in-up">
            {/* Header Banner Skeleton */}
            <div className="admin-skeleton-banner admin-shimmer"></div>

            {/* Search and Filters Bar Skeleton */}
            <div className="admin-skeleton-controls">
                <div className="admin-skeleton-search-input admin-shimmer"></div>
                <div className="admin-skeleton-filter-pill admin-shimmer"></div>
                <div className="admin-skeleton-filter-pill admin-shimmer"></div>
            </div>

            {/* Table Skeleton */}
            <div className="admin-skeleton-table-card">
                <div className="admin-skeleton-table-header admin-shimmer"></div>
                {Array.from({ length: rows }).map((_, rIdx) => (
                    <div key={`tbl-skel-row-${rIdx}`} className="admin-skeleton-table-row">
                        {Array.from({ length: columns }).map((_, cIdx) => (
                            <div key={`cell-${cIdx}`} className={`admin-skeleton-cell c-${cIdx} admin-shimmer`}></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminSkeleton = {
    Dashboard: AdminDashboardSkeleton,
    Table: AdminTableSkeleton
};

export default AdminSkeleton;
