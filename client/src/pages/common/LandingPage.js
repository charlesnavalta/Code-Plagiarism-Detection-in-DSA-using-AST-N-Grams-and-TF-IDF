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

            {/* Hero Section - SPLIT LAYOUT */}
            <main className="landing-hero split-layout">
                <div className="hero-bg-glow blob-1"></div>
                <div className="hero-bg-glow blob-2"></div>
                
                {/* LEFT COLUMN: Text Content */}
                <div className="hero-text-column fade-in-up">
                    <h1 className="hero-title">
                        Beyond Text. <br/>
                        <span className="text-gradient">Analyze the Algorithm.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Falsicode is an advanced structural plagiarism detection system for Data Structures and Algorithms. 
                        Powered by Abstract Syntax Trees (AST) and TF-IDF N-Grams, it detects logic-copying in Python and Java 
                        even if variable names, comments, and spacing are completely changed.
                    </p>
                    
                    <div className="hero-action-group">
                        <button className="btn-primary-large" onClick={() => navigate('/login')}>
                            Access Dashboard
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginLeft: '8px'}}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </button>
                        <span className="hero-microcopy">Secure platform for instructors and students.</span>
                    </div>
                </div>

                {/* RIGHT COLUMN: Mockup/Graphic */}
                <div className="hero-graphic-column fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="glass-mockup">
                        {/* Simulated UI Window */}
                        <div className="mockup-header">
                            <div className="mockup-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="mockup-url">falsicode.app/analysis</div>
                        </div>
                        <div className="mockup-body">
                            <div className="mockup-code-block">
                                <span className="m-keyword">def</span> <span className="m-func">merge_sort</span>(arr):
                                <br/>&nbsp;&nbsp;&nbsp;&nbsp;<span className="m-keyword">if</span> len(arr) {'>'} 1:
                                <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mid = len(arr)//2
                            </div>
                            <div className="mockup-ast-line">
                                <span className="ast-node">FunctionDef</span> ➔ <span className="ast-node">If</span> ➔ <span className="ast-node">Assign</span>
                            </div>
                            <div className="mockup-match-box">
                                <span className="match-label">Structural Match Found</span>
                                <span className="match-percent text-gradient">92.4%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;