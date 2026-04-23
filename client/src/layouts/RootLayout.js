// src/layouts/RootLayout.js
import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import './RootLayout.css';

const RootLayout = ({ children }) => {
    const [isBooting, setIsBooting] = useState(true);

    useEffect(() => {
        // Simulate a system boot sequence
        const timer = setTimeout(() => {
            setIsBooting(false);
        }, 1200); // 1.2s boot time

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="falsicode-root-shell">
            {isBooting ? (
                <div className="terminal-boot-screen">
                    <div className="boot-content">
                        <div className="boot-logo">F</div>
                        <p className="boot-text">INITIALIZING FALSICODE_NODE_01...</p>
                        <div className="boot-progress-bar">
                            <div className="boot-progress-fill"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <Navbar />
                    <div className="falsicode-page-container">
                        {children}
                    </div>
                </>
            )}
        </div>
    );
};

export default RootLayout;