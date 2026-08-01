import React from 'react';
import './InstructorShared.css';

const QuantumLoader = ({ text = "Synchronizing Data...", fullScreen = true }) => (
    <div className={fullScreen ? "falsicode-loader-fullscreen" : "falsicode-loader-local"}>
        <div className="quantum-spinner"></div>
        {text && <p className="loader-text">{text}</p>}
    </div>
);

export default QuantumLoader;