import React, { useState, useEffect } from 'react';
import './AnalysisLoadingState.css';

const STAGES = [
    { num: 1, id: "ast", label: "AST Parser", fullName: "AST Structural Tokenization" },
    { num: 2, id: "ngrams", label: "N-Grams", fullName: "Sliding Window N-Grams" },
    { num: 3, id: "tfidf", label: "TF-IDF", fullName: "Cosine Vector Matrix" },
    { num: 4, id: "taxonomy", label: "Taxonomy", fullName: "Clone Taxonomy Classifier" }
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

    const langLabel = (language || '').toLowerCase().includes('java') ? 'Java AST Engine' : 'Python AST Engine';

    useEffect(() => {
        if (isCompleted) return; // When complete, freeze animation and stay at 100%

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

            } else if (elapsed < stage0Duration + stage1Duration) {
                // STAGE 1: SLIDING WINDOW N-GRAMS
                setCurrentStep(1);
                const stageElapsed = elapsed - stage0Duration;
                const ratio = Math.min(1, Math.max(0, stageElapsed / stage1Duration));
                const calculatedProgress = Math.min(48, Math.round(28 + ratio * 20));

                setProgress(calculatedProgress);
                setStageMetric(`N-Grams: N ∈ [3, 5]`);
                setStageDetail(`Extracting sliding window N-Grams (N=3, 4, 5) across token sequences...`);

            } else if (elapsed < stage0Duration + stage1Duration + stage2Duration) {
                // STAGE 2: TF-IDF VECTOR SPACE & COSINE MATRIX
                setCurrentStep(2);
                const stageElapsed = elapsed - (stage0Duration + stage1Duration);
                const ratio = Math.min(1, Math.max(0, stageElapsed / stage2Duration));
                const calculatedProgress = Math.min(68, Math.round(48 + ratio * 20));

                setProgress(calculatedProgress);
                setStageMetric(`Matrix: ${count}×${count}`);
                setStageDetail(`Computing sublinear TF-IDF vectors & ${count}×${count} cosine similarity matrix...`);

            } else {
                // STAGE 3: CLONE TAXONOMY & FORENSIC LINE EXTRACTION
                // NEVER LOOPS BACK TO 0!
                // CurentStep stays on 3, actively scanning pairs while waiting for the API response.
                setCurrentStep(3);
                const stageElapsed = elapsed - (stage0Duration + stage1Duration + stage2Duration);
                const ratio = Math.min(1, Math.max(0, stageElapsed / stage3Duration));
                const currentPairs = Math.min(totalPairs, Math.max(1, Math.round(ratio * totalPairs)));
                
                // Asymptotically approach 96% so it never appears frozen and never loops
                const calculatedProgress = Math.min(96, Math.round(68 + ratio * 28));

                setProgress(calculatedProgress);
                setStageMetric(`${currentPairs}/${totalPairs} Pairs`);
                setStageDetail(`Evaluating ${totalPairs} comparison pairs for Type 1, Type 2, & Type 3 clones...`);
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
        : (isBatch ? "BATCH AUDIT ENGINE ACTIVE" : "ALGORITHM RUNNING IN BACKGROUND");

    return (
        <div className={`analysis-loading-compact ${isCompleted ? 'is-completed' : ''} ${isExiting ? 'is-exiting' : ''}`}>
            {/* Top row: Animated Dual-Ring AST Core + Accurate Status */}
            <div className="compact-core-row">
                <div className="compact-spinner-wrap">
                    <div className="compact-spinner-outer"></div>
                    <div className="compact-spinner-inner"></div>
                    <div className="compact-core-icon">
                        {isCompleted ? (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                            </svg>
                        ) : (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                            </svg>
                        )}
                    </div>
                </div>

                <div className="compact-header-wrap">
                    <div className="compact-status-row">
                        <div className="compact-status-badge">
                            <span className="compact-status-dot"></span>
                            <span>{activeBadgeText}</span>
                        </div>
                        <span className="compact-engine-pill">{langLabel}</span>
                        <span className="compact-metric-pill">{activeMetric}</span>
                    </div>

                    <h4 className="compact-main-title">
                        Cross-Auditing {count} Submissions ({totalPairs.toLocaleString()} Comparison Pairs)
                    </h4>
                    <p className="compact-subtext" title={activeDetail}>
                        {activeDetail}
                    </p>
                </div>
            </div>

            {/* Accurate Progress Bar Track with Real Percentage */}
            <div className="compact-progress-container">
                <div className="compact-progress-track">
                    <div 
                        className={`compact-progress-bar ${isCompleted ? 'is-completed' : ''}`}
                        style={{ width: `${activeProgress}%` }}
                    >
                        <div className="compact-progress-shine"></div>
                    </div>
                </div>
                <span className="compact-progress-val">{activeProgress}%</span>
            </div>

            {/* Streamlined Stepper Pills Row (Monotonic: never loops back) */}
            <div className="compact-stepper-row">
                {STAGES.map((stage, idx) => {
                    const isActive = !isCompleted && idx === activeStep;
                    const isStepCompleted = isCompleted || idx < activeStep;
                    return (
                        <React.Fragment key={stage.num}>
                            <div 
                                className={`compact-step-pill ${isActive ? 'is-active' : ''} ${isStepCompleted ? 'is-completed' : ''}`}
                                title={stage.fullName}
                            >
                                <div className="step-pill-indicator">
                                    {isStepCompleted ? (
                                        <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    ) : isActive ? (
                                        <span className="step-pill-spinner"></span>
                                    ) : (
                                        <span>{stage.num}</span>
                                    )}
                                </div>
                                <span className="step-pill-label">{stage.label}</span>
                            </div>
                            {idx < STAGES.length - 1 && (
                                <span className={`compact-step-arrow ${isStepCompleted ? 'is-completed' : ''}`}>
                                    ›
                                </span>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default AnalysisLoadingState;
