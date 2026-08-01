import React, { useRef } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import { useSpatialSpotlight } from '../../../hooks/useSpatialSpotlight';
import '../../../style/InstructorTheme.css'; 
import './InstructorShared.css';

const InstructorWrapper = ({ children }) => {
    const [theme] = useTheme();
    const dashboardRef = useRef(null);
    const handleMouseMove = useSpatialSpotlight(dashboardRef);

    return (
        <div className={`nexus-wrapper ${theme}`} ref={dashboardRef} onMouseMove={handleMouseMove}>
            <div className="aurora-canvas">
                <div className="aurora-blob blob-primary"></div>
                <div className="aurora-blob blob-secondary"></div>
            </div>
            {children}
        </div>
    );
};

export default InstructorWrapper;