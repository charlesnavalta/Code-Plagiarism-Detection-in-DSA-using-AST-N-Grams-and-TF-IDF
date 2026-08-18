import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ displayName, userInitial, roleText, statusLabel, profileLink, loading = false }) => {
    const navigate = useNavigate();

    return (
        <div
            className="spatial-card profile-card"
            onClick={() => !loading && profileLink && navigate(profileLink)}
            style={{ cursor: loading ? 'default' : 'pointer' }}
        >
            <div className="card-glass-layer"></div>
            <div className="card-content">
                {loading ? (
                    <>
                        <div className="skeleton-box skeleton-avatar" style={{ width: '62px', height: '62px', margin: '0 auto 16px', borderRadius: '50%' }}></div>
                        <div className="skeleton-box" style={{ width: '120px', height: '22px', margin: '0 auto 8px', borderRadius: '6px' }}></div>
                        <div className="skeleton-box" style={{ width: '140px', height: '14px', margin: '0 auto 16px', borderRadius: '4px' }}></div>
                        <div className="skeleton-box skeleton-pill" style={{ width: '84px', height: '24px', margin: '0 auto', borderRadius: '20px' }}></div>
                    </>
                ) : (
                    <>
                        <div className="avatar-hologram">
                            <div className="avatar-core">{userInitial}</div>
                            <div className="avatar-ring-1"></div>
                        </div>
                        <h2 className="user-display-name">{displayName}</h2>
                        <p className="user-role-text">{roleText}</p>
                        <div className="system-status">
                            <span className="status-dot online"></span>{statusLabel}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
