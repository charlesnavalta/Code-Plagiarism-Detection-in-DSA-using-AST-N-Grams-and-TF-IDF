import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useSpatialSpotlight } from '../../hooks/useSpatialSpotlight';
import { useToast } from '../../context/NotificationContext';
import api from '../../services/api';
import analysisService from '../../services/analysisService';
import InstructorWrapper from './components/InstructorWrapper';
import AnalysisLoadingState from '../../components/instructor/AnalysisLoadingState';
import CodeComparisonModal from '../../modals/instructor/CodeComparisonModal';
import { getPlagiarismDisplayData } from '../../utils/theme';
import { formatLanguageDisplay } from '../../utils/fileUtils';
import './InstructorSubmissionsAuditView.css';

const InstructorSubmissionsAuditView = () => {
    const { id, assignmentId } = useParams();
    const classId = id;
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const [theme] = useTheme();
    const pageRef = useRef(null);
    const handleMouseMove = useSpatialSpotlight(pageRef);

    const navState = useMemo(() => location.state || {}, [location.state]);

    const [assignment, setAssignment] = useState(navState.assignment || null);
    const [submissions, setSubmissions] = useState(navState.submissions || []);
    const [analysisResults, setAnalysisResults] = useState(navState.analysisResults || null);
    const [loading, setLoading] = useState(!navState.assignment);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedComparisonPair, setSelectedComparisonPair] = useState(null);

    const [activeTab, setActiveTab] = useState(navState.initialTab || 'submissions'); // 'submissions' | 'report' | 'summary'
    const [gradeInputs, setGradeInputs] = useState({});
    const [unlockedIds, setUnlockedIds] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [summaryFilter, setSummaryFilter] = useState('all');

    // Smooth transition between analysis loading & results table
    const [displayPhase, setDisplayPhase] = useState('idle');
    const prevAnalyzingRef = useRef(isAnalyzing);

    useEffect(() => {
        if (isAnalyzing) {
            setDisplayPhase('analyzing');
        } else if (prevAnalyzingRef.current && !isAnalyzing && analysisResults) {
            setDisplayPhase('completing');
            const timer1 = setTimeout(() => {
                setDisplayPhase('fading');
            }, 600);
            const timer2 = setTimeout(() => {
                setDisplayPhase('ready');
            }, 900);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        } else if (!isAnalyzing && analysisResults) {
            setDisplayPhase('ready');
        } else {
            setDisplayPhase('idle');
        }
        prevAnalyzingRef.current = isAnalyzing;
    }, [isAnalyzing, analysisResults]);

    const showLoading = displayPhase === 'analyzing' || displayPhase === 'completing' || displayPhase === 'fading';
    const isCompleted = displayPhase === 'completing' || displayPhase === 'fading';
    const isExiting = displayPhase === 'fading';

    // Teacher Comments / Feedback State
    const [feedbackModalSub, setFeedbackModalSub] = useState(null);
    const [feedbackDraft, setFeedbackDraft] = useState('');
    const [isSavingFeedback, setIsSavingFeedback] = useState(false);
    const [feedbackMap, setFeedbackMap] = useState({});

    // Fetch assignment & submissions on mount or direct URL navigation
    useEffect(() => {
        let isMounted = true;
        const fetchAuditData = async () => {
            if (!navState.assignment && (!navState.submissions || navState.submissions.length === 0)) {
                setLoading(true);
            }
            try {
                const [assignRes, subsData] = await Promise.all([
                    !navState.assignment 
                        ? api.get(`/classrooms/${classId}/assignments/${assignmentId}`) 
                        : Promise.resolve({ data: navState.assignment }),
                    analysisService.getAssignmentSubmissions(classId, assignmentId)
                ]);
                if (!isMounted) return;
                if (assignRes?.data) setAssignment(assignRes.data);
                const loadedSubs = Array.isArray(subsData) ? subsData : [];
                setSubmissions(loadedSubs);

                const initialMap = {};
                loadedSubs.forEach(s => {
                    if (s.feedback) initialMap[s.id] = s.feedback;
                });
                setFeedbackMap(prev => ({ ...initialMap, ...prev }));
            } catch (err) {
                console.error("Failed to load assignment audit data:", err);
                if (isMounted) {
                    toast.error("Could not retrieve submissions for this assignment.", "Data Error");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAuditData();

        return () => {
            isMounted = false;
        };
    }, [classId, assignmentId, navState.assignment, navState.submissions, toast]);

    const openFeedbackModal = (sub) => {
        const currentFeedback = feedbackMap[sub.id] !== undefined ? feedbackMap[sub.id] : (sub.feedback || '');
        setFeedbackModalSub(sub);
        setFeedbackDraft(currentFeedback);
    };

    const handleSaveFeedback = async () => {
        if (!feedbackModalSub) return;
        setIsSavingFeedback(true);
        try {
            await api.post(`/classrooms/${classId}/assignments/${assignmentId}/submissions/${feedbackModalSub.id}/feedback`, {
                feedback: feedbackDraft
            });
            toast.success("Feedback committed successfully!", "Remarks Saved");
            setFeedbackMap(prev => ({ ...prev, [feedbackModalSub.id]: feedbackDraft }));
            feedbackModalSub.feedback = feedbackDraft;
            setFeedbackModalSub(null);
            window.dispatchEvent(new Event('refresh-notifications'));
        } catch (error) {
            toast.error("Failed to commit feedback to database.", "Grading Error");
        } finally {
            setIsSavingFeedback(false);
        }
    };

    const handleSaveGrade = async (submissionId) => {
        const scoreToSave = gradeInputs[submissionId];
        if (!scoreToSave) return toast.warning("Please enter a valid grade or score first.", "Input Required");

        try {
            await api.post(`/classrooms/${classId}/assignments/${assignmentId}/submissions/${submissionId}/grade`, { score: scoreToSave });
            toast.success("Grade committed successfully!", "Score Updated");
            const subToUpdate = submissions.find(s => s.id === submissionId);
            if (subToUpdate) subToUpdate.score = scoreToSave;
            window.dispatchEvent(new Event('refresh-notifications'));
        } catch (error) {
            toast.error("Failed to commit grade to database.", "Grading Error");
        }
    };

    const handleAllowResubmit = async (submissionId) => {
        try {
            await api.patch(`/classrooms/${classId}/assignments/${assignmentId}/submissions/${submissionId}/allow-resubmit`);
            toast.success("Resubmission unlocked for student!", "Lock Cleared");
            setUnlockedIds(prev => [...prev, submissionId]);
            window.dispatchEvent(new Event('refresh-notifications'));
        } catch (error) {
            toast.error("Failed to unlock resubmission. Please check your connection.", "Action Failed");
        }
    };

    const handleRunAnalysis = async () => {
        if (submissions.length < 2) {
            return toast.warning("A minimum of 2 student submissions are required to run comparative AST analysis.", "Insufficient Data");
        }
        setIsAnalyzing(true);
        setActiveTab('report');
        toast.info("Running AST, N-Gram & TF-IDF algorithmic comparison...", "Analysis Started");
        try {
            const data = await analysisService.runAnalysis(assignmentId);
            setAnalysisResults(data.results);
            try {
                const refreshedSubs = await analysisService.getAssignmentSubmissions(classId, assignmentId);
                setSubmissions(refreshedSubs);
            } catch (_) {}
            toast.success("Structural plagiarism audit completed successfully!", "Analysis Complete");
        } catch (error) {
            toast.error("Analysis failed: " + (error.response?.data?.error || error.message), "Engine Failure");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleOpenComparison = (pair) => {
        if (!pair) {
            toast.info("No comparative pair available for this student.", "Safe Submission");
            return;
        }
        setSelectedComparisonPair(pair);
    };

    // Filter Submissions by Search Term
    const filteredSubmissions = useMemo(() => {
        if (!searchTerm.trim()) return submissions;
        const query = searchTerm.toLowerCase().trim();
        return submissions.filter(sub =>
            (sub.student_name && sub.student_name.toLowerCase().includes(query)) ||
            (sub.filename && sub.filename.toLowerCase().includes(query)) ||
            (sub.score && String(sub.score).toLowerCase().includes(query))
        );
    }, [submissions, searchTerm]);

    // Count of flagged pairs (Type 1, 2, 3)
    const flaggedPairsCount = useMemo(() => {
        if (!analysisResults) return 0;
        return analysisResults.filter(r => {
            const pt = r.plagiarism_type || '';
            return pt.includes('Type 1') || pt.includes('Type 2') || pt.includes('Type 3') || pt.includes('Exact') || pt.includes('Renamed') || pt.includes('Structure');
        }).length;
    }, [analysisResults]);

    // Filter Plagiarism Report by Search Term & Type Filter
    const filteredResults = useMemo(() => {
        if (!analysisResults) return [];
        let results = analysisResults;

        if (filterType !== 'all') {
            if (filterType === 'Safe') {
                results = results.filter(r => {
                    const pt = r.plagiarism_type || '';
                    return !pt || pt === 'N/A' || pt.toLowerCase().includes('safe') || pt.toLowerCase().includes('clean');
                });
            } else {
                results = results.filter(r => r.plagiarism_type && r.plagiarism_type.includes(filterType));
            }
        }

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            results = results.filter(r =>
                (r.file1 && r.file1.toLowerCase().includes(query)) ||
                (r.file2 && r.file2.toLowerCase().includes(query)) ||
                (r.plagiarism_type && r.plagiarism_type.toLowerCase().includes(query)) ||
                (String(r.score).includes(query))
            );
        }

        return results;
    }, [analysisResults, searchTerm, filterType]);

    // =========================================================================
    // 📊 100% CLASS DISTRIBUTION & STUDENT RISK ROSTER (Option 2B)
    // =========================================================================
    const classDistribution = useMemo(() => {
        if (!submissions || submissions.length === 0) {
            return {
                total: 0,
                type1Count: 0,
                type2Count: 0,
                type3Count: 0,
                safeCount: 0,
                type1Pct: 0,
                type2Pct: 0,
                type3Pct: 0,
                safePct: 0,
                avgSimilarity: '0.0',
                plagiarizedTotal: 0,
                plagiarizedPct: 0,
                cleanPct: 0,
                studentRoster: []
            };
        }

        const total = submissions.length;
        const roster = [];

        let sumSim = 0;
        let simCount = 0;

        if (analysisResults && analysisResults.length > 0) {
            analysisResults.forEach(r => {
                if (r.score !== undefined && !isNaN(r.score)) {
                    sumSim += Number(r.score);
                    simCount++;
                }
            });
        }

        const avgSimilarity = simCount > 0 ? (sumSim / simCount).toFixed(1) : '0.0';

        let type1Count = 0;
        let type2Count = 0;
        let type3Count = 0;
        let safeCount = 0;

        submissions.forEach(sub => {
            const studentName = (sub.student_name || '').toLowerCase().trim();
            const filename = (sub.filename || '').toLowerCase().trim();

            let highestSeverity = 'Safe';
            let highestScore = 0;
            let topPair = null;
            let topMatchPeer = 'Clean (No Plagiarism)';

            if (analysisResults && analysisResults.length > 0) {
                analysisResults.forEach(pair => {
                    const f1 = (pair.file1 || '').toLowerCase();
                    const f2 = (pair.file2 || '').toLowerCase();

                    const matchesF1 = (studentName && f1.includes(studentName)) || (filename && f1.includes(filename));
                    const matchesF2 = (studentName && f2.includes(studentName)) || (filename && f2.includes(filename));

                    if (matchesF1 || matchesF2) {
                        const score = Number(pair.score || 0);
                        const pType = pair.plagiarism_type || '';
                        const otherFile = matchesF1 ? pair.file2 : pair.file1;

                        const isType1 = pType.includes('Type 1') || pType.includes('Type I') || pType.includes('Exact');
                        const isType2 = pType.includes('Type 2') || pType.includes('Type II') || pType.includes('Renamed');
                        const isType3 = pType.includes('Type 3') || pType.includes('Type III') || pType.includes('Structure');

                        if (isType1) {
                            if (highestSeverity !== 'Type 1' || score > highestScore || !topPair) {
                                highestSeverity = 'Type 1';
                                highestScore = score;
                                topPair = pair;
                                topMatchPeer = otherFile;
                            }
                        } else if (isType2 && highestSeverity !== 'Type 1') {
                            if (highestSeverity !== 'Type 2' || score > highestScore || !topPair) {
                                highestSeverity = 'Type 2';
                                highestScore = score;
                                topPair = pair;
                                topMatchPeer = otherFile;
                            }
                        } else if (isType3 && highestSeverity !== 'Type 1' && highestSeverity !== 'Type 2') {
                            if (highestSeverity !== 'Type 3' || score > highestScore || !topPair) {
                                highestSeverity = 'Type 3';
                                highestScore = score;
                                topPair = pair;
                                topMatchPeer = otherFile;
                            }
                        } else if (highestSeverity === 'Safe') {
                            if (score > highestScore || !topPair) {
                                highestScore = score;
                                topPair = pair;
                                topMatchPeer = otherFile;
                            }
                        }
                    }
                });
            }

            if (highestSeverity === 'Type 1') type1Count++;
            else if (highestSeverity === 'Type 2') type2Count++;
            else if (highestSeverity === 'Type 3') type3Count++;
            else safeCount++;

            roster.push({
                id: sub.id,
                student_name: sub.student_name,
                student_avatar: sub.student_avatar,
                filename: sub.filename,
                score: sub.score,
                category: highestSeverity,
                highestScore: highestScore > 0 ? highestScore.toFixed(1) : '0.0',
                topMatchPeer,
                topPair
            });
        });

        const type1Pct = total > 0 ? Math.round((type1Count / total) * 100) : 0;
        const type2Pct = total > 0 ? Math.round((type2Count / total) * 100) : 0;
        const type3Pct = total > 0 ? Math.round((type3Count / total) * 100) : 0;
        const safePct = total > 0 ? Math.max(0, 100 - (type1Pct + type2Pct + type3Pct)) : 0;

        const plagiarizedTotal = type1Count + type2Count + type3Count;
        const plagiarizedPct = total > 0 ? Math.round((plagiarizedTotal / total) * 100) : 0;
        const cleanPct = total > 0 ? Math.max(0, 100 - plagiarizedPct) : 0;

        return {
            total,
            type1Count,
            type2Count,
            type3Count,
            safeCount,
            type1Pct,
            type2Pct,
            type3Pct,
            safePct,
            avgSimilarity,
            plagiarizedTotal,
            plagiarizedPct,
            cleanPct,
            studentRoster: roster
        };
    }, [submissions, analysisResults]);

    const filteredRoster = useMemo(() => {
        let list = classDistribution.studentRoster;

        if (summaryFilter !== 'all') {
            list = list.filter(r => r.category === summaryFilter);
        }

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase().trim();
            list = list.filter(r =>
                (r.student_name && r.student_name.toLowerCase().includes(q)) ||
                (r.filename && r.filename.toLowerCase().includes(q)) ||
                (r.category && r.category.toLowerCase().includes(q)) ||
                (r.topMatchPeer && r.topMatchPeer.toLowerCase().includes(q))
            );
        }

        return list;
    }, [classDistribution.studentRoster, summaryFilter, searchTerm]);

    if (loading) {
        return (
            <InstructorWrapper>
                <div className={`instructor-audit-page ${theme}`} ref={pageRef}>
                    <div className="audit-loading-wrapper">
                        <div className="audit-spinner"></div>
                        <h2>Loading Submissions & Plagiarism Audit...</h2>
                        <p>Retrieving student code files and comparative AST structures.</p>
                    </div>
                </div>
            </InstructorWrapper>
        );
    }

    return (
        <InstructorWrapper>
            <div className={`instructor-audit-page ${theme}`} ref={pageRef} onMouseMove={handleMouseMove}>
                <div className="audit-page-container">

                    {/* --- TOP CINEMATIC BANNER --- */}
                    <header className="cinematic-banner-shared spatial-card fade-in-down audit-hero-banner">
                        <div className="header-inner">
                            <div className="top-meta">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/instructor/class/${classId}`)}
                                    className="neo-back-btn"
                                >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Classroom
                                </button>

                                <div className="audit-header-actions">
                                    <button
                                        type="button"
                                        className={`btn-audit-hero-run ${showLoading ? 'is-analyzing' : ''} ${isCompleted ? 'is-completed' : ''}`}
                                        onClick={handleRunAnalysis}
                                        disabled={showLoading}
                                    >
                                        {showLoading ? (
                                            <span className="btn-analyzing-content">
                                                {isCompleted ? (
                                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                ) : (
                                                    <span className="btn-spinner-ring"></span>
                                                )}
                                                <span>{isCompleted ? "Audit Complete" : "Running Algorithmic Audit..."}</span>
                                            </span>
                                        ) : (
                                            <span className="btn-run-content">
                                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{analysisResults ? "Re-run Plagiarism Analysis" : "Run Falsicode Analysis"}</span>
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="audit-hero-info">
                                <h1 className="hero-title">{assignment?.title || "Assignment Audit"}</h1>
                            </div>

                            <div className="stat-badges">
                                {assignment?.language && (
                                    <span className="b-label lang-badge">
                                        Language: <strong>{formatLanguageDisplay(assignment.language)}</strong>
                                    </span>
                                )}
                                <span className="b-label">
                                    {submissions.length} {submissions.length === 1 ? 'Submission' : 'Submissions'} Total
                                </span>
                                {analysisResults && (
                                    <span className={`b-label ${flaggedPairsCount > 0 ? 'status-alert' : 'status-clean'}`}>
                                        {analysisResults.length} Comparison Pairs Evaluated ({flaggedPairsCount > 0 ? `${flaggedPairsCount} Flagged` : '0 Flagged'})
                                    </span>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* 🌟 STICKY CONTROLS BAR (Segmented Tabs + Search & Filter Toolbar) */}
                    <div className="audit-sticky-controls-bar">
                        {/* 🌟 Segmented 3-Way Tabs */}
                        <div className="audit-page-tabs-bar">
                            <div className="audit-segmented-tabs">
                                <button
                                    type="button"
                                    className={`audit-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
                                    onClick={() => { setActiveTab('submissions'); setSearchTerm(''); }}
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <span>Submissions</span>
                                    <span className="tab-badge-count">{submissions.length}</span>
                                </button>

                                <button
                                    type="button"
                                    className={`audit-tab-btn ${activeTab === 'report' ? 'active' : ''}`}
                                    onClick={() => { setActiveTab('report'); setSearchTerm(''); }}
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                    </svg>
                                    <span>Plagiarism Report</span>
                                    {analysisResults && (
                                        <span className={`tab-badge-count ${flaggedPairsCount > 0 ? 'alert' : 'clean'}`}>
                                            {flaggedPairsCount > 0 ? flaggedPairsCount : '0'}
                                        </span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className={`audit-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                                    onClick={() => { setActiveTab('summary'); setSearchTerm(''); }}
                                >
                                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                                    </svg>
                                    <span>Class Summary</span>
                                    {analysisResults && (
                                        <span className="tab-badge-count info">
                                            100%
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 🔍 Search & Filter Toolbar */}
                        <div className="audit-search-toolbar">
                            <div className="audit-search-input-wrap">
                                <svg className="audit-search-icon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <input
                                    type="text"
                                    className="audit-search-input"
                                    placeholder={
                                        activeTab === 'submissions'
                                            ? "Search by student name or filename (e.g. Mary, TS-A)..."
                                            : activeTab === 'report'
                                            ? "Search student, filename, or clone pair..."
                                            : "Search student risk roster..."
                                    }
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        className="audit-search-clear"
                                        onClick={() => setSearchTerm('')}
                                        title="Clear search"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Filter Chips for Plagiarism Report Tab */}
                            {activeTab === 'report' && analysisResults && !showLoading && (
                                <div className="audit-filter-chips chips-enter">
                                    {[
                                        { id: 'all', label: 'All Pairs' },
                                        { id: 'Type 1', label: 'Type 1: Exact' },
                                        { id: 'Type 2', label: 'Type 2: Renamed' },
                                        { id: 'Type 3', label: 'Type 3: Structure' },
                                        { id: 'Safe', label: 'Safe (Green)' }
                                    ].map(ft => (
                                        <button
                                            key={ft.id}
                                            type="button"
                                            className={`audit-chip-btn ${filterType === ft.id ? 'active' : ''}`}
                                            onClick={() => setFilterType(ft.id)}
                                        >
                                            {ft.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Filter Chips for Class Summary Tab */}
                            {activeTab === 'summary' && analysisResults && !showLoading && (
                                <div className="audit-filter-chips chips-enter">
                                    {[
                                        { id: 'all', label: 'All Students' },
                                        { id: 'Type 1', label: `Type 1 (${classDistribution.type1Count})` },
                                        { id: 'Type 2', label: `Type 2 (${classDistribution.type2Count})` },
                                        { id: 'Type 3', label: `Type 3 (${classDistribution.type3Count})` },
                                        { id: 'Safe', label: `Safe (${classDistribution.safeCount})` }
                                    ].map(st => (
                                        <button
                                            key={st.id}
                                            type="button"
                                            className={`audit-chip-btn ${summaryFilter === st.id ? 'active' : ''}`}
                                            onClick={() => setSummaryFilter(st.id)}
                                        >
                                            {st.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- MAIN AUDIT WORKSPACE CARD --- */}
                    <main className="audit-workspace-card spatial-card">
                        {/* --- TAB CONTENT AREA --- */}
                        <div className="audit-tab-body">
                            
                            {/* =========================================================
                                TAB 1: SUBMISSIONS LIST
                                ========================================================= */}
                            {activeTab === 'submissions' && (
                                <div className="submissions-audit-list">
                                    {searchTerm && (
                                        <div className="audit-results-count-banner">
                                            Showing {filteredSubmissions.length} of {submissions.length} submissions
                                        </div>
                                    )}

                                    {/* Desktop Table View (>= 1024px) */}
                                    <div className="desktop-table-container">
                                        <table className="falsicode-table-hud">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '40px' }}></th>
                                                    <th>STUDENT IDENTITY</th>
                                                    <th>SOURCE FILE</th>
                                                    <th className="th-actions">ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredSubmissions.length > 0 ? (
                                                    filteredSubmissions.map(sub => {
                                                        const isUnlocked = sub.allow_resubmit || unlockedIds.includes(sub.id);
                                                        const isResubmitted = Number(sub.resubmission_count || 0) > 0;
                                                        const subFeedback = feedbackMap[sub.id] !== undefined ? feedbackMap[sub.id] : sub.feedback;
                                                        const hasFeedback = Boolean(subFeedback && subFeedback.trim());

                                                        const dotColorClass = isUnlocked ? "amber pulsing" : (isResubmitted ? "cyan" : "green");
                                                        const dotTitle = isUnlocked ? "Resubmission Unlocked (Waiting for student upload)" : (isResubmitted ? "Revised code resubmitted" : "Initial code submission");

                                                        return (
                                                            <tr key={sub.id} className="submission-card-row">
                                                                <td className="status-cell">
                                                                    <div className={`submission-status-dot ${dotColorClass}`} title={dotTitle}></div>
                                                                </td>
                                                                <td className="td-student">
                                                                    <div className="hud-stu-cell">
                                                                        <div className="stu-icon">
                                                                            {sub.student_avatar ? (
                                                                                <img src={sub.student_avatar} alt="" className="stu-icon-img" />
                                                                            ) : (
                                                                                sub.student_name.charAt(0).toUpperCase()
                                                                            )}
                                                                        </div>
                                                                        <div className="stu-info-meta">
                                                                            <strong className="stu-name">{sub.student_name}</strong>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="td-file">
                                                                    <div className="file-chip-wrapper">
                                                                        <code className="code-box">{sub.filename}</code>
                                                                        {isUnlocked ? (
                                                                            <span className="submission-state-pill pending-resubmit" title="Instructor unlocked resubmission. Waiting for student to upload new file.">
                                                                                ⏳ Awaiting Upload
                                                                            </span>
                                                                        ) : isResubmitted ? (
                                                                            <span className="submission-state-pill resubmitted" title="Revised code file has been uploaded by the student.">
                                                                                🔄 Revised File
                                                                            </span>
                                                                        ) : (
                                                                            <span className="submission-state-pill initial" title="Initial student code submission.">
                                                                                📄 Initial Upload
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="td-action">
                                                                    <div className="grade-input-group">
                                                                        <div className="grade-field-row">
                                                                            <input
                                                                                type="text"
                                                                                className="grade-input-small"
                                                                                placeholder={sub.score && sub.score !== 'Pending' ? sub.score : "e.g. 45/50"}
                                                                                value={gradeInputs[sub.id] !== undefined ? gradeInputs[sub.id] : ''}
                                                                                onChange={(e) => setGradeInputs({ ...gradeInputs, [sub.id]: e.target.value })}
                                                                            />
                                                                            <button className="btn-save-grade" onClick={() => handleSaveGrade(sub.id)}>SAVE</button>
                                                                        </div>

                                                                        <button
                                                                            className={`btn-comment-feedback ${hasFeedback ? 'has-feedback' : ''}`}
                                                                            onClick={() => openFeedbackModal(sub)}
                                                                            title={hasFeedback ? `Feedback: ${subFeedback.slice(0, 50)}...` : "Add instructor feedback / remarks"}
                                                                        >
                                                                            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                                                            </svg>
                                                                            <span>{hasFeedback ? 'FEEDBACK' : 'REMARKS'}</span>
                                                                        </button>

                                                                        <button
                                                                            className={`btn-allow-resubmit ${isUnlocked ? 'unlocked' : ''}`}
                                                                            onClick={() => handleAllowResubmit(sub.id)}
                                                                            disabled={isUnlocked}
                                                                            title={isUnlocked ? "Student is currently allowed to resubmit" : "Unlock to allow student to upload again"}
                                                                        >
                                                                            {isUnlocked ? 'WAITING' : 'ALLOW RESUBMIT'}
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="empty-search-cell">
                                                            <div className="empty-search-box">
                                                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                                </svg>
                                                                <strong>No matching submissions found</strong>
                                                                <p>No student submissions matched your search query "{searchTerm}".</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile & Tablet Responsive Cards (< 1024px) */}
                                    <div className="mobile-tablet-card-container">
                                        {filteredSubmissions.length > 0 ? (
                                            filteredSubmissions.map(sub => {
                                                const isUnlocked = sub.allow_resubmit || unlockedIds.includes(sub.id);
                                                const hasScore = sub.score && sub.score !== 'Pending';
                                                const subFeedback = feedbackMap[sub.id] !== undefined ? feedbackMap[sub.id] : sub.feedback;
                                                const hasFeedback = Boolean(subFeedback && subFeedback.trim());

                                                return (
                                                    <div key={sub.id} className="submission-responsive-card">
                                                        <div className="card-identity-header">
                                                            <div className="student-profile-badge">
                                                                <div className="stu-icon">
                                                                    {sub.student_avatar ? (
                                                                        <img src={sub.student_avatar} alt="" className="stu-icon-img" />
                                                                    ) : (
                                                                        sub.student_name.charAt(0).toUpperCase()
                                                                    )}
                                                                </div>
                                                                <div className="student-title-wrap">
                                                                    <strong className="stu-name">{sub.student_name}</strong>
                                                                    <div className="file-chip-row">
                                                                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="file-icon-mini">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                        </svg>
                                                                        <span className="file-name-text">{sub.filename}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="card-status-badges">
                                                                {hasFeedback && (
                                                                    <div className="status-feedback-pill" title={subFeedback}>
                                                                        <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '3px' }}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                                                                        </svg>
                                                                        Remarks Added
                                                                    </div>
                                                                )}
                                                                <div className={`status-grade-pill ${hasScore ? 'graded' : 'pending'}`}>
                                                                    {hasScore ? `Grade: ${sub.score}` : 'Pending'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="card-action-toolbar">
                                                            <div className="grade-input-wrapper">
                                                                <input
                                                                    type="text"
                                                                    className="grade-input-small"
                                                                    placeholder={hasScore ? sub.score : "e.g. 45/50"}
                                                                    value={gradeInputs[sub.id] !== undefined ? gradeInputs[sub.id] : ''}
                                                                    onChange={(e) => setGradeInputs({ ...gradeInputs, [sub.id]: e.target.value })}
                                                                />
                                                                <button className="btn-save-grade" onClick={() => handleSaveGrade(sub.id)}>
                                                                    SAVE
                                                                </button>
                                                            </div>

                                                            <button
                                                                className={`btn-comment-feedback ${hasFeedback ? 'has-feedback' : ''}`}
                                                                onClick={() => openFeedbackModal(sub)}
                                                                title={hasFeedback ? `Feedback: ${subFeedback.slice(0, 50)}...` : "Add instructor feedback / remarks"}
                                                            >
                                                                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                                                </svg>
                                                                <span>{hasFeedback ? 'FEEDBACK' : 'REMARKS'}</span>
                                                            </button>

                                                            <button
                                                                className={`btn-allow-resubmit ${isUnlocked ? 'unlocked' : ''}`}
                                                                onClick={() => handleAllowResubmit(sub.id)}
                                                                disabled={isUnlocked}
                                                                title={isUnlocked ? "Student is currently allowed to resubmit" : "Unlock to allow student to upload again"}
                                                            >
                                                                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                                </svg>
                                                                <span>{isUnlocked ? 'WAITING' : 'ALLOW RESUBMIT'}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="empty-search-box">
                                                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                </svg>
                                                <strong>No matching submissions found</strong>
                                                <p>No student submissions matched your search query "{searchTerm}".</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* =========================================================
                                TAB 2: PLAGIARISM REPORT (PAIR MATRIX)
                                ========================================================= */}
                            {activeTab === 'report' && (
                                <div className="analysis-report-section tab-view">
                                    <div className="report-header">
                                        <div className="report-header-info">
                                            <h3>Plagiarism Similarity Matrix</h3>
                                            <p className="report-header-sub">Algorithm: AST Structural Tokenization + N-Gram Analysis + TF-IDF</p>
                                        </div>
                                        {analysisResults && !showLoading && (
                                            <div className="scan-badge badge-enter">
                                                Analysis Active
                                            </div>
                                        )}
                                    </div>

                                    {showLoading ? (
                                        <AnalysisLoadingState
                                            submissionCount={submissions.length}
                                            isBatch={false}
                                            language={submissions.some(s => s.filename?.toLowerCase().endsWith('.java')) ? 'java' : 'python'}
                                            isCompleted={isCompleted}
                                            isExiting={isExiting}
                                            matchesFound={analysisResults ? analysisResults.length : null}
                                        />
                                    ) : filteredResults.length > 0 ? (
                                        <div className="table-responsive-wrapper results-table-enter">
                                            <table className="falsicode-table-hud hoverable-table">
                                                <thead>
                                                    <tr>
                                                        <th>COMPARISON PAIR</th>
                                                        <th>SIMILARITY SCORE</th>
                                                        <th>PLAGIARISM CLASSIFICATION</th>
                                                        <th className="th-actions">FORENSIC ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredResults.map((result, idx) => {
                                                        const { badgeClass, label } = getPlagiarismDisplayData(result.plagiarism_type);
                                                        return (
                                                            <tr
                                                                key={idx}
                                                                className="clickable-row"
                                                                onClick={() => handleOpenComparison(result)}
                                                                title="Click to launch comparative code analysis modal"
                                                            >
                                                                <td>
                                                                    <div className="pair-wrap">
                                                                        <span className="pair-file">{result.file1}</span>
                                                                        <span className="pair-vs">vs</span>
                                                                        <span className="pair-file">{result.file2}</span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="score-wrap">
                                                                        <div className="score-meter-mini">
                                                                            <div
                                                                                className="score-fill-mini"
                                                                                style={{
                                                                                    width: `${Math.min(100, Math.max(0, result.score))}%`,
                                                                                    background: result.score > 70 ? 'var(--status-red)' : result.score > 40 ? 'var(--status-yellow)' : 'var(--status-green)'
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                        <strong>{result.score}%</strong>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className={`badge-pill ${badgeClass}`}>
                                                                        {label}
                                                                    </span>
                                                                </td>
                                                                <td className="td-action">
                                                                    <button
                                                                        type="button"
                                                                        className="btn-inspect-pair"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleOpenComparison(result);
                                                                        }}
                                                                    >
                                                                        <span>Compare Code</span>
                                                                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                                        </svg>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : analysisResults ? (
                                        <div className="empty-search-box report-empty clean-audit-box">
                                            <div className="report-empty-icon clean-icon-circle">
                                                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                            <h4 className="clean-audit-title">No {filterType !== 'all' ? `${filterType} Clones` : 'Matching Pairs'} Detected</h4>
                                            <p className="clean-audit-subtext">
                                                {searchTerm
                                                    ? `No submission comparison pairs matched your search query "${searchTerm}".`
                                                    : `None of the audited submissions were categorized under "${filterType}". All comparison pairs in this category passed structural evaluation.`}
                                            </p>
                                            <span className="clean-audit-pill">PASS · 0 FLAGGED PAIRS</span>
                                        </div>
                                    ) : (
                                        <div className="empty-search-box report-empty">
                                            <div className="report-empty-icon">
                                                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                                </svg>
                                            </div>
                                            <h4>No Plagiarism Scan Generated Yet</h4>
                                            <p>Run the analysis engine to cross-check all submitted files using AST + N-Grams + TF-IDF algorithms.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* =========================================================
                                TAB 3: CLASS SUMMARY REPORT (100% PROPORTIONAL DISTRIBUTION)
                                ========================================================= */}
                            {activeTab === 'summary' && (
                                <div className="class-summary-section tab-view">
                                    <div className="report-header">
                                        <div className="report-header-info">
                                            <h3>Class Plagiarism & Integrity Summary</h3>
                                            <p className="report-header-sub">
                                                100% Submission Distribution Breakdown across Exact, Renamed, Structural & Safe submissions
                                            </p>
                                        </div>
                                        {analysisResults && !showLoading && (
                                            <div className="summary-distribution-badge">
                                                {classDistribution.total} Total Submissions (100%)
                                            </div>
                                        )}
                                    </div>

                                    {showLoading ? (
                                        <AnalysisLoadingState
                                            submissionCount={submissions.length}
                                            isBatch={false}
                                            language={submissions.some(s => s.filename?.toLowerCase().endsWith('.java')) ? 'java' : 'python'}
                                            isCompleted={isCompleted}
                                            isExiting={isExiting}
                                            matchesFound={analysisResults ? analysisResults.length : null}
                                        />
                                    ) : analysisResults ? (
                                        <div className="class-summary-content-scroll">
                                            {/* Top 4 KPI Metrics Grid */}
                                            <div className="summary-stats-grid">
                                                <div className="summary-stat-card">
                                                    <div className="stat-icon-wrap total">
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="stat-text-wrap">
                                                        <span className="stat-label">Total Submissions</span>
                                                        <strong className="stat-value">{classDistribution.total}</strong>
                                                        <span className="stat-subtext">Active student uploads</span>
                                                    </div>
                                                </div>

                                                <div className="summary-stat-card">
                                                    <div className="stat-icon-wrap plagiarized">
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="stat-text-wrap">
                                                        <span className="stat-label">Flagged / Plagiarized</span>
                                                        <strong className="stat-value text-red">
                                                            {classDistribution.plagiarizedTotal} <span className="stat-pct">({classDistribution.plagiarizedPct}%)</span>
                                                        </strong>
                                                        <span className="stat-subtext">Type 1, 2, or 3 clones</span>
                                                    </div>
                                                </div>

                                                <div className="summary-stat-card">
                                                    <div className="stat-icon-wrap clean">
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="stat-text-wrap">
                                                        <span className="stat-label">Safe & Original</span>
                                                        <strong className="stat-value text-green">
                                                            {classDistribution.safeCount} <span className="stat-pct">({classDistribution.safePct}%)</span>
                                                        </strong>
                                                        <span className="stat-subtext">No clone patterns detected</span>
                                                    </div>
                                                </div>

                                                <div className="summary-stat-card">
                                                    <div className="stat-icon-wrap similarity">
                                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                                        </svg>
                                                    </div>
                                                    <div className="stat-text-wrap">
                                                        <span className="stat-label">Class Avg Similarity</span>
                                                        <strong className="stat-value text-blue">{classDistribution.avgSimilarity}%</strong>
                                                        <span className="stat-subtext">Across all comparative pairs</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 🌟 100% Proportional Multi-Segment Progress Bar */}
                                            <div className="distribution-bar-card">
                                                <div className="distribution-bar-header">
                                                    <div>
                                                        <h4 className="distribution-bar-title">Class Risk Distribution</h4>
                                                        <p className="distribution-bar-sub">100% of student submissions categorized by highest detected clone severity</p>
                                                    </div>
                                                    <span className="distribution-sum-tag">SUM: 100%</span>
                                                </div>

                                                <div className="distribution-progress-track">
                                                    {classDistribution.type1Pct > 0 && (
                                                        <div
                                                            className="distribution-segment seg-type1"
                                                            style={{ width: `${classDistribution.type1Pct}%` }}
                                                            title={`Type 1: Exact Clones — ${classDistribution.type1Count} student(s) (${classDistribution.type1Pct}%)`}
                                                        >
                                                            {classDistribution.type1Pct >= 10 && (
                                                                <span className="segment-label">T1: {classDistribution.type1Pct}%</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {classDistribution.type2Pct > 0 && (
                                                        <div
                                                            className="distribution-segment seg-type2"
                                                            style={{ width: `${classDistribution.type2Pct}%` }}
                                                            title={`Type 2: Renamed / Parameterized — ${classDistribution.type2Count} student(s) (${classDistribution.type2Pct}%)`}
                                                        >
                                                            {classDistribution.type2Pct >= 10 && (
                                                                <span className="segment-label">T2: {classDistribution.type2Pct}%</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {classDistribution.type3Pct > 0 && (
                                                        <div
                                                            className="distribution-segment seg-type3"
                                                            style={{ width: `${classDistribution.type3Pct}%` }}
                                                            title={`Type 3: Structural Reordering — ${classDistribution.type3Count} student(s) (${classDistribution.type3Pct}%)`}
                                                        >
                                                            {classDistribution.type3Pct >= 10 && (
                                                                <span className="segment-label">T3: {classDistribution.type3Pct}%</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {classDistribution.safePct > 0 && (
                                                        <div
                                                            className="distribution-segment seg-safe"
                                                            style={{ width: `${classDistribution.safePct}%` }}
                                                            title={`Safe / Clean — ${classDistribution.safeCount} student(s) (${classDistribution.safePct}%)`}
                                                        >
                                                            {classDistribution.safePct >= 10 && (
                                                                <span className="segment-label">Safe: {classDistribution.safePct}%</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* 4-Column Legend Cards */}
                                                <div className="distribution-legend-grid">
                                                    <div className="legend-card legend-type1">
                                                        <div className="legend-dot dot-type1"></div>
                                                        <div className="legend-body">
                                                            <div className="legend-top">
                                                                <strong>Type 1: Exact</strong>
                                                                <span className="legend-count">{classDistribution.type1Count} ({classDistribution.type1Pct}%)</span>
                                                            </div>
                                                            <span className="legend-def">Verbatim copy & paste</span>
                                                        </div>
                                                    </div>

                                                    <div className="legend-card legend-type2">
                                                        <div className="legend-dot dot-type2"></div>
                                                        <div className="legend-body">
                                                            <div className="legend-top">
                                                                <strong>Type 2: Renamed</strong>
                                                                <span className="legend-count">{classDistribution.type2Count} ({classDistribution.type2Pct}%)</span>
                                                            </div>
                                                            <span className="legend-def">Renamed identifiers & variables</span>
                                                        </div>
                                                    </div>

                                                    <div className="legend-card legend-type3">
                                                        <div className="legend-dot dot-type3"></div>
                                                        <div className="legend-body">
                                                            <div className="legend-top">
                                                                <strong>Type 3: Structure</strong>
                                                                <span className="legend-count">{classDistribution.type3Count} ({classDistribution.type3Pct}%)</span>
                                                            </div>
                                                            <span className="legend-def">Reordered logic & statement flow</span>
                                                        </div>
                                                    </div>

                                                    <div className="legend-card legend-safe">
                                                        <div className="legend-dot dot-safe"></div>
                                                        <div className="legend-body">
                                                            <div className="legend-top">
                                                                <strong>Safe / Clean</strong>
                                                                <span className="legend-count">{classDistribution.safeCount} ({classDistribution.safePct}%)</span>
                                                            </div>
                                                            <span className="legend-def">Original implementation</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Student Risk Classification Roster Table */}
                                            <div className="student-roster-section">
                                                <div className="roster-header-row">
                                                    <h4>Student Risk Classification Roster</h4>
                                                    <span className="roster-count-tag">
                                                        Showing {filteredRoster.length} of {classDistribution.total} students
                                                    </span>
                                                </div>

                                                <div className="table-responsive-wrapper">
                                                    <table className="falsicode-table-hud hoverable-table">
                                                        <thead>
                                                            <tr>
                                                                <th>STUDENT IDENTITY</th>
                                                                <th>SUBMITTED FILE</th>
                                                                <th>RISK CLASSIFICATION</th>
                                                                <th>SIMILARITY SCORE</th>
                                                                <th>TOP PEER MATCH</th>
                                                                <th className="th-actions">FORENSIC ACTION</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredRoster.length > 0 ? (
                                                                filteredRoster.map(stu => {
                                                                    const { badgeClass, label } = getPlagiarismDisplayData(stu.category);
                                                                    const numScore = Number(stu.highestScore || 0);

                                                                    return (
                                                                        <tr
                                                                            key={stu.id}
                                                                            className={stu.topPair ? "clickable-row" : ""}
                                                                            onClick={() => {
                                                                                if (stu.topPair) handleOpenComparison(stu.topPair);
                                                                            }}
                                                                            title={stu.topPair ? "Click to launch comparative code analysis modal" : undefined}
                                                                        >
                                                                            <td className="td-student">
                                                                                <div className="hud-stu-cell">
                                                                                    <div className="stu-icon">
                                                                                        {stu.student_avatar ? (
                                                                                            <img src={stu.student_avatar} alt="" className="stu-icon-img" />
                                                                                        ) : (
                                                                                            stu.student_name.charAt(0).toUpperCase()
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="stu-info-meta">
                                                                                        <strong className="stu-name">{stu.student_name}</strong>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="td-file">
                                                                                <code className="code-box">{stu.filename}</code>
                                                                            </td>
                                                                            <td>
                                                                                <span className={`badge-pill ${badgeClass}`}>
                                                                                    {label}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <div className="score-wrap">
                                                                                    <div className="score-meter-mini">
                                                                                        <div
                                                                                            className="score-fill-mini"
                                                                                            style={{
                                                                                                width: `${Math.min(100, Math.max(0, numScore))}%`,
                                                                                                background: numScore > 70 ? 'var(--status-red)' : numScore > 40 ? 'var(--status-yellow)' : 'var(--status-green)'
                                                                                            }}
                                                                                        ></div>
                                                                                    </div>
                                                                                    <strong>{stu.highestScore}%</strong>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <span className="roster-match-peer" title={stu.topMatchPeer}>
                                                                                    {stu.topMatchPeer}
                                                                                </span>
                                                                            </td>
                                                                            <td className="td-action">
                                                                                {stu.topPair ? (
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn-inspect-pair"
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleOpenComparison(stu.topPair);
                                                                                        }}
                                                                                    >
                                                                                        <span>Compare Code</span>
                                                                                        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                                                        </svg>
                                                                                    </button>
                                                                                ) : (
                                                                                    <span className="clean-safe-tag">Safe / Clean</span>
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="6" className="empty-search-cell">
                                                                        <div className="empty-search-box">
                                                                            <strong>No students matched the filter</strong>
                                                                            <p>No student records found under "{summaryFilter}" matching "{searchTerm}".</p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-search-box report-empty">
                                            <div className="report-empty-icon">
                                                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                                                </svg>
                                            </div>
                                            <h4>No Class Distribution Generated Yet</h4>
                                            <p>Run Falsicode Analysis to calculate the 100% class distribution across Type 1, Type 2, Type 3, and Safe submissions.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* TEACHER FEEDBACK / REMARKS MODAL OVERLAY */}
                {feedbackModalSub && (
                    <div className="feedback-modal-backdrop" onClick={() => setFeedbackModalSub(null)}>
                        <div className="feedback-modal-sheet" onClick={(e) => e.stopPropagation()}>
                            <div className="feedback-modal-header">
                                <div className="feedback-title-group">
                                    <div className="feedback-avatar-icon">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="feedback-modal-title">Instructor Remarks & Feedback</h3>
                                        <p className="feedback-modal-sub">
                                            Student: <strong>{feedbackModalSub.student_name}</strong> • File: <code className="feedback-sub-code">{feedbackModalSub.filename}</code>
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="feedback-modal-close-btn"
                                    onClick={() => setFeedbackModalSub(null)}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="feedback-modal-content">
                                <div className="feedback-section-block">
                                    <label className="feedback-label-caption">QUICK-INSERT FEEDBACK PRESETS</label>
                                    <div className="feedback-preset-chips">
                                        {[
                                            "Clean logic and well-structured implementation.",
                                            "Consider optimizing time and space complexity.",
                                            "Check edge cases such as empty inputs or boundary values.",
                                            "High similarity detected with peer submissions; please attend consultation.",
                                            "Solution approved with distinction."
                                        ].map((preset, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className="feedback-preset-chip"
                                                onClick={() => setFeedbackDraft(prev => prev ? `${prev}\n${preset}` : preset)}
                                            >
                                                {preset}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="feedback-section-block">
                                    <label className="feedback-label-caption">DETAILED REMARKS FOR STUDENT</label>
                                    <textarea
                                        className="feedback-notes-textarea"
                                        rows="5"
                                        placeholder="Provide constructive feedback, notes on algorithm efficiency, or instructions for the student..."
                                        value={feedbackDraft}
                                        onChange={(e) => setFeedbackDraft(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="feedback-char-count">
                                        {feedbackDraft.length} characters
                                    </div>
                                </div>
                            </div>

                            <div className="feedback-modal-actions">
                                <button
                                    type="button"
                                    className="btn-feedback-dismiss"
                                    onClick={() => setFeedbackModalSub(null)}
                                    disabled={isSavingFeedback}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn-feedback-submit"
                                    onClick={handleSaveFeedback}
                                    disabled={isSavingFeedback}
                                >
                                    {isSavingFeedback ? (
                                        <>
                                            <span className="feedback-save-spinner"></span>
                                            Saving Remarks...
                                        </>
                                    ) : (
                                        "Save Feedback"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🌟 COMPARATIVE CODE ANALYSIS MODAL */}
                <CodeComparisonModal
                    isOpen={!!selectedComparisonPair}
                    onClose={() => setSelectedComparisonPair(null)}
                    selectedPair={selectedComparisonPair}
                    submissions={submissions}
                    allPairs={analysisResults || []}
                    onSelectPair={(newPair) => setSelectedComparisonPair(newPair)}
                />
            </div>
        </InstructorWrapper>
    );
};

export default InstructorSubmissionsAuditView;
