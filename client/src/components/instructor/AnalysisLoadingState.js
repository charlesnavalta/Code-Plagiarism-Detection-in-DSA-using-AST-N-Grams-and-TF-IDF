import React, { useState, useEffect } from 'react';
import './AnalysisLoadingState.css';

const STAGES = [
    {
        num: 1,
        id: "ast",
        label: "AST Tokenizer",
        fullName: "AST Structural Tokenization",
        desc: "Syntax tree normalization & control grammar flattening",
        icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    },
    {
        num: 2,
        id: "ngrams",
        label: "N-Gram Slicer",
        fullName: "Sliding Window N-Grams",
        desc: "Extracts token sequences with sliding window N ∈ [3, 5]",
        icon: "M4 6h16M4 12h16m-7 6h7"
    },
    {
        num: 3,
        id: "tfidf",
        label: "TF-IDF Matrix",
        fullName: "Cosine Vector Space",
        desc: "Sublinear term frequencies & pairwise cosine vector matrix",
        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    },
    {
        num: 4,
        id: "taxonomy",
        label: "Taxonomy & Diff",
        fullName: "Clone Taxonomy Classifier",
        desc: "Forensic classification across Type 1, Type 2, & Type 3 clones",
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    }
];

const AnalysisLoadingState = ({ 
    submissionCount, 
    isBatch = false, 
    language = 'python',
    isCompleted = false,
    isExiting = false,
    matchesFound = null 
}) => {
    const count = Math.max(2, Number(submissionCount) || 2);
    const totalPairs = Math.round((count * (count - 1)) / 2);

    // Dynamic duration based on submission count (O(N) tokenization + O(N^2) pairwise comparisons)
    const totalEstimatedMs = Math.min(5200, Math.max(2200, 1800 + count * 45));

    // Dynamic stage budget allocation
    const stage0Duration = totalEstimatedMs * 0.28;
    const stage1Duration = totalEstimatedMs * 0.20;
    const stage2Duration = totalEstimatedMs * 0.20;
    const stage3Duration = totalEstimatedMs * 0.27;

    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(4);
    const [stageMetric, setStageMetric] = useState(`0/${count} AST Trees`);
    const [stageDetail, setStageDetail] = useState(`Parsing AST structural syntax trees for ${count} submissions...`);
    const [telemetryLog, setTelemetryLog] = useState(`[AST_ENGINE] >> Initializing AST parser and token stream for ${count} submissions...`);

    const langLabel = (language || '').toLowerCase().includes('java') ? 'Java AST Engine' : 'Python AST Engine';

    useEffect(() => {
        if (isCompleted) return;

        const startTime = Date.now();

        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;

            if (elapsed < stage0Duration) {
                // STAGE 0: AST PARSER & TOKENIZATION
                setCurrentStep(0);
                const ratio = Math.min(1, Math.max(0.05, elapsed / stage0Duration));
                const currentFiles = Math.min(count, Math.max(1, Math.round(ratio * count)));
                const calculatedProgress = Math.min(27, Math.round(ratio * 27));

                setProgress(calculatedProgress);
                setStageMetric(`${currentFiles}/${count} AST Trees`);
                setStageDetail(`Parsing AST structural syntax trees (${currentFiles} of ${count} files tokenized)...`);
                setTelemetryLog(`[AST_ENGINE] >> Tokenizing structural syntax tree: file ${currentFiles}/${count}...`);

            } else if (elapsed < stage0Duration + stage1Duration) {
                // STAGE 1: SLIDING WINDOW N-GRAMS
                setCurrentStep(1);
                const stageElapsed = elapsed - stage0Duration;
                const ratio = Math.min(1, Math.max(0, stageElapsed / stage1Duration));
                const calculatedProgress = Math.min(48, Math.round(28 + ratio * 20));

                setProgress(calculatedProgress);
                setStageMetric(`N-Grams: N ∈ [3, 5]`);
                setStageDetail(`Extracting sliding window N-Grams (N=3, 4, 5) across token sequences...`);
                setTelemetryLog(`[NGRAM_ENGINE] >> Generating sliding window N-Grams across ${count} token sequences...`);

            } else if (elapsed < stage0Duration + stage1Duration + stage2Duration) {
                // STAGE 2: TF-IDF VECTOR SPACE & COSINE MATRIX
                setCurrentStep(2);
                const stageElapsed = elapsed - (stage0Duration + stage1Duration);
                const ratio = Math.min(1, Math.max(0, stageElapsed / stage2Duration));
                const calculatedProgress = Math.min(68, Math.round(48 + ratio * 20));

                setProgress(calculatedProgress);
                setStageMetric(`Matrix: ${count}×${count}`);
                setStageDetail(`Computing sublinear TF-IDF vectors & ${count}×${count} cosine similarity matrix...`);
                setTelemetryLog(`[TFIDF_ENGINE] >> Computing sublinear term weighting and ${count}×${count} cosine matrix...`);

            } else {
                // STAGE 3: CLONE TAXONOMY & FORENSIC LINE EXTRACTION
                setCurrentStep(3);
                const stageElapsed = elapsed - (stage0Duration + stage1Duration + stage2Duration);
                const ratio = Math.min(1, Math.max(0, stageElapsed / stage3Duration));
                const currentPairs = Math.min(totalPairs, Math.max(1, Math.round(ratio * totalPairs)));
                
                const calculatedProgress = Math.min(96, Math.round(68 + ratio * 28));

                setProgress(calculatedProgress);
                setStageMetric(`${currentPairs}/${totalPairs} Pairs`);
                setStageDetail(`Evaluating ${totalPairs} comparison pairs for Type 1, Type 2, & Type 3 clones...`);
                setTelemetryLog(`[TAXONOMY_ENGINE] >> Evaluating comparison pair ${currentPairs}/${totalPairs} for Type 1, 2, 3 clone patterns...`);
            }
        }, 50);

        return () => clearInterval(timer);
    }, [isCompleted, count, totalPairs, stage0Duration, stage1Duration, stage2Duration, stage3Duration]);

    // Derived states during completion transition
    const activeStep = isCompleted ? 4 : currentStep;
    const activeProgress = isCompleted ? 100 : progress;
    const activeMetric = isCompleted 
        ? `${matchesFound !== null ? matchesFound.toLocaleString() : totalPairs.toLocaleString()} Matches Found`
        : stageMetric;
    const activeDetail = isCompleted
        ? `Cross-audit complete. Rendering plagiarism similarity matrix...`
        : stageDetail;
    const activeBadgeText = isCompleted
        ? "AUDIT COMPLETE"
        : (isBatch ? "BATCH FORENSIC ENGINE ACTIVE" : "ALGORITHM RUNNING IN BACKGROUND");
    const activeTelemetry = isCompleted
        ? `[AUDIT_COMPLETE] >> All ${totalPairs} comparison pairs evaluated. Rendering matrix...`
        : telemetryLog;

    return (
        <div className={`analysis-loading-dashboard ${isCompleted ? 'is-completed' : ''} ${isExiting ? 'is-exiting' : ''}`}>
            
            {/* Top Row: Hero Core + Main Title & Dynamic Status Badges */}
            <div className="loading-hero-row">
                <div className="loading-core-wrap">
                    <div className="loading-spinner-outer"></div>
                    <div className="loading-spinner-middle"></div>
                    <div className="loading-spinner-inner"></div>
                    <div className="loading-core-icon">
                        {isCompleted ? (
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                            </svg>
                        ) : (
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                            </svg>
                        )}
                    </div>
                </div>

                <div className="loading-hero-details">
                    <div className="loading-status-badges-row">
                        <div className="loading-status-badge">
                            <span className="loading-status-dot"></span>
                            <span>{activeBadgeText}</span>
                        </div>
                        <span className="loading-engine-pill">{langLabel}</span>
                        <span className="loading-metric-pill">{activeMetric}</span>
                    </div>

                    <h3 className="loading-main-title">
                        Cross-Auditing {count} Submissions ({totalPairs.toLocaleString()} Comparison Pairs)
                    </h3>
                    <p className="loading-subtext" title={activeDetail}>
                        {activeDetail}
                    </p>
                </div>
            </div>

            {/* Glowing Main Progress Bar with Percent Meter */}
            <div className="loading-progress-section">
                <div className="loading-progress-meta">
                    <span className="progress-meta-label">
                        {isCompleted ? "Algorithmic Pipeline Complete" : `Stage ${Math.min(4, currentStep + 1)} of 4: ${STAGES[Math.min(3, currentStep)].fullName}`}
                    </span>
                    <span className="progress-meta-val">{activeProgress}%</span>
                </div>

                <div className="loading-progress-track">
                    <div 
                        className={`loading-progress-bar ${isCompleted ? 'is-completed' : ''}`}
                        style={{ width: `${activeProgress}%` }}
                    >
                        <div className="loading-progress-shine"></div>
                    </div>
                </div>
            </div>

            {/* 4 Forensic Pipeline Stage Cards Grid */}
            <div className="loading-stages-grid">
                {STAGES.map((stage, idx) => {
                    const isActive = !isCompleted && idx === activeStep;
                    const isStepCompleted = isCompleted || idx < activeStep;
                    const isPending = !isCompleted && idx > activeStep;

                    return (
                        <div 
                            key={stage.num}
                            className={`loading-stage-card ${isActive ? 'is-active' : ''} ${isStepCompleted ? 'is-completed' : ''} ${isPending ? 'is-pending' : ''}`}
                        >
                            <div className="stage-card-top">
                                <div className="stage-card-icon-wrap">
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stage.icon}></path>
                                    </svg>
                                </div>
                                <div className="stage-card-status-indicator">
                                    {isStepCompleted ? (
                                        <span className="stage-check-badge">
                                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <span>DONE</span>
                                        </span>
                                    ) : isActive ? (
                                        <span className="stage-active-badge">
                                            <span className="stage-active-spinner"></span>
                                            <span>RUNNING</span>
                                        </span>
                                    ) : (
                                        <span className="stage-pending-badge">
                                            0{stage.num}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="stage-card-body">
                                <div className="stage-card-title">{stage.label}</div>
                                <div className="stage-card-desc">{stage.desc}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Live Forensic Telemetry Terminal Feed */}
            <div className="loading-telemetry-feed">
                <div className="telemetry-terminal-dot"></div>
                <span className="telemetry-text">{activeTelemetry}</span>
                <span className="telemetry-cursor">_</span>
            </div>

        </div>
    );
};

export default AnalysisLoadingState;
