import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 

const LandingPage = () => {
    const navigate = useNavigate();
    
    // Interactive State for the mockup demonstration
    const [selectedVariant, setSelectedVariant] = useState('original'); // 'original' or 'obfuscated'

    return (
        <div className="landing-wrapper theme-dark">
            {/* Background Aurora Engine */}
            <div className="aurora-canvas">
                <div className="aurora-blob blob-1"></div>
                <div className="aurora-blob blob-2"></div>
            </div>

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
            <main className="landing-hero split-layout">
                
                {/* LEFT COLUMN: Value Proposition */}
                <div className="hero-text-column fade-in-up">
                    <h1 className="hero-title">
                        Beyond Text. <br/>
                        <span className="text-gradient">Analyze the Algorithm.</span>
                    </h1>
                    <p className="hero-subtitle">
                        An advanced structural plagiarism engine for Python and Java. Falsicode uses AST and TF-IDF to expose copied logic—even when variables, comments, and formatting are completely disguised.
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

                {/* RIGHT COLUMN: Interactive Structural Mockup */}
                <div className="hero-graphic-column fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="glass-mockup">
                        <div className="mockup-header">
                            <div className="mockup-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <div className="mockup-url">falsicode.app/sandbox</div>
                        </div>
                        
                        <div className="mockup-tabs">
                            <button 
                                className={`mockup-tab-btn ${selectedVariant === 'original' ? 'active' : ''}`}
                                onClick={() => setSelectedVariant('original')}
                            >
                                submission_A.py
                            </button>
                            <button 
                                className={`mockup-tab-btn ${selectedVariant === 'obfuscated' ? 'active' : ''}`}
                                onClick={() => setSelectedVariant('obfuscated')}
                            >
                                submission_B_obfuscated.py
                            </button>
                        </div>

                        <div className="mockup-body">
                            {selectedVariant === 'original' ? (
                                <div className="mockup-code-block">
                                    <span className="m-keyword">def</span> <span className="m-func">merge_sort</span>(arr):<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="m-keyword">if</span> len(arr) &gt; 1:<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mid = len(arr) // 2<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left = arr[:mid]
                                </div>
                            ) : (
                                <div className="mockup-code-block">
                                    <span className="m-keyword">def</span> <span className="m-func">executeSortProcess</span>(target_list):<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="m-comment"># Replaced labels and spacing entirely</span><br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="m-keyword">if</span> len(target_list) &gt; 1:<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;pivot_point = len(target_list) // 2<br/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;first_half = target_list[:pivot_point]
                                </div>
                            )}

                            <div className="mockup-ast-line">
                                <span className="ast-label-text">Structural Hash Topology:</span>
                                <div className="ast-nodes-flex">
                                    <span className="ast-node">FunctionDef</span> ➔ <span className="ast-node">If</span> ➔ <span className="ast-node">Assign</span>
                                </div>
                            </div>
                            
                            <div className="mockup-match-box">
                                <span className="match-label">Structural Clone Identity Matrix</span>
                                <span className="match-percent text-gradient">100% Match</span>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default LandingPage;