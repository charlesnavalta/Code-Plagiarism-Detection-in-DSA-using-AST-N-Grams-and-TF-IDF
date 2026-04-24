import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-wrapper theme-dark">
            {/* Navigation Bar */}
            <nav className="landing-navbar">
                <div className="landing-logo">
                    <span className="logo-icon">⎔</span> Falsicode.
                </div>
                <div className="nav-actions">
                    <button className="btn-nav-login" onClick={() => navigate('/login')}>
                        Sign In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="landing-hero">
                <div className="hero-bg-glow blob-1"></div>
                <div className="hero-bg-glow blob-2"></div>
                
                <div className="hero-content fade-in-up">
                    <div className="hero-badge">XAI Multi-Language Engine</div>
                    <h1 className="hero-title">
                        Beyond Text. <br/>
                        <span className="text-gradient">Analyze the Algorithm.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Falsicode is an advanced structural plagiarism detection system for Data Structures and Algorithms. 
                        Powered by Abstract Syntax Trees (AST) and TF-IDF N-Grams, it detects logic-copying in Python and Java 
                        even if variable names, comments, and spacing are completely changed.
                    </p>
                    
                    <div className="hero-buttons">
                        <button className="btn-primary-large" onClick={() => navigate('/login')}>
                            Access Dashboard
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginLeft: '8px'}}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;