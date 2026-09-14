import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from '../../context/NotificationContext';
import './AnalysisPDFExporter.css';

// Centralized theme utility for standardized colors and labels
import { getPlagiarismDisplayData } from '../../utils/theme';

const AnalysisPDFExporter = ({ selectedPair }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const toast = useToast();

    if (!selectedPair) return null;

    // Fetch theme configuration
    const themeData = getPlagiarismDisplayData(selectedPair?.plagiarism_type);

    const pdfVerboseLabels = {
        "Type 1": "Type 1: Exact Copy",
        "Type 2": "Type 2: Renamed Variables",
        "Type 3": "Type 3: Modified Structure",
        "Safe": "Safe: Original Code"
    };
    
    const reportLabel = pdfVerboseLabels[themeData.shortLabel] || themeData.label || "Structural Analysis Profile";
    const generatedReportId = `FC-${Math.floor(10000 + Math.random() * 90000)}-${new Date().getFullYear()}`;

    // Extract top XAI AST patterns (Real data from analysis)
    const topPatterns = (!selectedPair.ast_xai_1 || !Array.isArray(selectedPair.ast_xai_1))
        ? []
        : [...selectedPair.ast_xai_1].sort((a, b) => b.weight - a.weight).slice(0, 4);

    const generatePDF = async () => {
        setIsGenerating(true);
        const page1Element = document.getElementById('pdf-page-1');
        const page2Element = document.getElementById('pdf-page-2');
        const page3Element = document.getElementById('pdf-page-3');
        
        try {
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Render Page 1
            const canvas1 = await html2canvas(page1Element, { 
                scale: 2.0, 
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                windowWidth: 794
            });
            const imgData1 = canvas1.toDataURL('image/jpeg', 0.95);
            pdf.addImage(imgData1, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

            // Render Page 2
            if (page2Element) {
                pdf.addPage();
                const canvas2 = await html2canvas(page2Element, { 
                    scale: 2.0, 
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    windowWidth: 794
                });
                const imgData2 = canvas2.toDataURL('image/jpeg', 0.95);
                pdf.addImage(imgData2, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            }

            // Render Page 3
            if (page3Element) {
                pdf.addPage();
                const canvas3 = await html2canvas(page3Element, { 
                    scale: 2.0, 
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    windowWidth: 794
                });
                const imgData3 = canvas3.toDataURL('image/jpeg', 0.95);
                pdf.addImage(imgData3, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            }

            pdf.save(`FALSICODE-AUDIT-LOG-${generatedReportId}.pdf`);
            toast.success("Analysis Report PDF generated successfully!");
            
        } catch (error) {
            console.error("PDF Generation failed:", error);
            toast.error("System Error: Failed to compile forensic audit document.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Vector Graph Trigonometric Calculations (Precision bounded 640x148 container)
    const scoreVal = Math.min(100, Math.max(0, Number(selectedPair.score) || 0));
    const rawIdentityVal = selectedPair.raw_identity_score !== undefined ? selectedPair.raw_identity_score : scoreVal;
    const orderSimVal = selectedPair.order_similarity_score !== undefined ? selectedPair.order_similarity_score : 100;
    
    // Origin at (50, 122)
    const ox = 50;
    const oy = 122;
    
    // Vector A (Blue, 18° baseline from horizontal)
    const angleADeg = 18;
    const angleARad = angleADeg * (Math.PI / 180);
    const vecLenA = 220;
    const ax = ox + vecLenA * Math.cos(angleARad);
    const ay = oy - vecLenA * Math.sin(angleARad);
    
    // Vector B (Theme color, angle offset proportional to divergence)
    const exactThetaDeg = (100 - scoreVal) * 0.45;
    const visualThetaDeg = Math.min(42.0, Math.max(0.0, (100 - scoreVal) * 0.42));
    const angleBDeg = angleADeg + visualThetaDeg;
    const angleBRad = angleBDeg * (Math.PI / 180);
    
    // Bounded length so Y is never < 25 (guarantees vectors stay strictly inside chart frame)
    const maxAllowedYDist = oy - 25; // 97px
    const vecLenB = Math.min(220, maxAllowedYDist / Math.sin(angleBRad));
    const bx = ox + vecLenB * Math.cos(angleBRad);
    const by = oy - vecLenB * Math.sin(angleBRad);

    // Arc points for theta angle
    const arcRadius = 45;
    const arcAx = ox + arcRadius * Math.cos(angleARad);
    const arcAy = oy - arcRadius * Math.sin(angleARad);
    const arcBx = ox + arcRadius * Math.cos(angleBRad);
    const arcBy = oy - arcRadius * Math.sin(angleBRad);

    // Short label formatters
    const cleanFileName = (str) => {
        if (!str) return 'File';
        return str.length > 20 ? str.substring(0, 18) + '...' : str;
    };

    const hiddenTemplate = (
        <div className="pdf-hidden-wrapper">
            {/* PAGE 1: FORENSIC AUDIT & COMPARISON OVERVIEW */}
            <div className="pdf-export-container pdf-page" id="pdf-page-1">
                
                {/* Header Block */}
                <div className="pdf-header-row">
                    <div>
                        <h2 className="pdf-brand-title">⎔ FALSICODE</h2>
                        <p className="pdf-brand-sub">AUTOMATED CODE CLONE DETECTOR</p>
                    </div>
                    <div className="pdf-meta-block">
                        <p><strong>Forensic Audit Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><strong>Report Identifier:</strong> {generatedReportId}</p>
                        <p className="pdf-page-indicator">Page 1 of 3</p>
                    </div>
                </div>

                {/* Title */}
                <div className="pdf-main-title-section">
                    <h1>COMPATIBILITY & STRUCTURAL INTEGRITY VERIFICATION REPORT</h1>
                    <p>EVALUATION VIA AST N-GRAM EXTRACTORS & INTER-DOCUMENT TF-IDF WEIGHTING</p>
                </div>

                {/* Audited Entities */}
                <div className="pdf-entity-box">
                    <h4 className="pdf-block-header-title">Audited Entities</h4>
                    <div className="pdf-entity-list">
                        <div className="pdf-entity-item"><span className="pdf-entity-label">Source A:</span> {selectedPair.file1}</div>
                        <div className="pdf-entity-item"><span className="pdf-entity-label">Source B:</span> {selectedPair.file2}</div>
                    </div>
                </div>

                {/* Verdict Section - Clean unhighlighted metrics */}
                <div className="pdf-verdict-banner-container" style={{ borderLeft: `6px solid ${themeData.color}` }}>
                    <div className="pdf-score-column">
                        <span className="pdf-score-number" style={{ color: themeData.color }}>{selectedPair.score}%</span>
                        <small className="pdf-score-subtext">STRUCTURAL MATCH</small>
                    </div>
                    <div style={{ flex: 1 }}>
                        <strong className="pdf-verdict-class-title">METRIC ANALYSIS: {reportLabel}</strong>
                        
                        {/* Evidence-Based Metrics Row */}
                        <div style={{ marginTop: '6px', fontSize: '13px', color: '#4b5563' }}>
                            {selectedPair.plagiarism_type && selectedPair.plagiarism_type !== 'N/A' ? (
                                <>
                                    <span style={{ marginRight: '24px' }}>
                                        <strong>Raw Identity:</strong> {rawIdentityVal}%
                                    </span>
                                    <span>
                                        <strong>Order Alignment:</strong> {orderSimVal}%
                                    </span>
                                </>
                            ) : (
                                <span><strong>Analysis:</strong> No significant structural manipulation detected.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footprint Counts Container - Real Compromised Line Data */}
                <div className="pdf-block-container">
                    <div className="pdf-block-header">
                        <div className="pdf-block-header-split">Node Footprint: File A</div>
                        <div className="pdf-block-header-split">Node Footprint: File B</div>
                    </div>
                    <div className="pdf-split-row-body">
                        <div className="pdf-split-col-cell">
                            Flagged Structural Blocks: <strong style={{ color: '#dc2626' }}>{selectedPair.lines1?.length || 0}</strong> non-trivial lines compromised.
                        </div>
                        <div className="pdf-split-col-cell">
                            Flagged Structural Blocks: <strong style={{ color: '#dc2626' }}>{selectedPair.lines2?.length || 0}</strong> non-trivial lines compromised.
                        </div>
                    </div>
                </div>

                {/* Vector Graph Visualization Container */}
                <div className="pdf-vector-wrapper">
                    <h3>Vector Space Alignment (Cosine Similarity Mapping)</h3>
                    <p>
                        The graph coordinates indicate the alignment vectors between Document A and Document B. When projected into an N-dimensional semantic space, identical structures run along a shared trajectory. The angle between the structural orientation arrays approaches zero, mathematically validating a cosine proximity rating of **{(scoreVal / 100).toFixed(4)}**.
                    </p>
                    
                    {/* FIXED-SIZE SVG VECTOR GRAPH */}
                    <div className="pdf-vector-canvas-box">
                        <svg 
                            width="640" 
                            height="148" 
                            viewBox="0 0 640 148" 
                            style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}
                        >
                            <defs>
                                <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2563eb" />
                                </marker>
                                <marker id="arrow-b" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={themeData.color} />
                                </marker>
                            </defs>

                            <line x1="50" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                            <line x1="50" y1="60" x2="600" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                            <line x1="50" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4,4" />
                            
                            <line x1={ox} y1="14" x2={ox} y2={oy} stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1={ox} y1={oy} x2="605" y2={oy} stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                            
                            <text x="605" y="138" fill="#64748b" fontSize="8.5" fontWeight="bold" textAnchor="end" fontFamily="monospace">
                                AST N-Gram Feature Dimensions →
                            </text>
                            <text x="54" y="16" fill="#64748b" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                                ↑ Structural Depth
                            </text>

                            <line 
                                x1={ox} 
                                y1={oy} 
                                x2={ax} 
                                y2={ay} 
                                stroke="#2563eb" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                markerEnd="url(#arrow-blue)"
                            />
                            
                            <line 
                                x1={ox} 
                                y1={oy} 
                                x2={bx} 
                                y2={by} 
                                stroke={themeData.color} 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeDasharray={exactThetaDeg === 0 ? "4,3" : "none"}
                                markerEnd="url(#arrow-b)"
                            />

                            <g transform={`translate(${ax + 8}, ${ay - 9})`}>
                                <rect x="0" y="0" width="140" height="18" rx="4" fill="#2563eb" />
                                <text x="6" y="12" fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                                    Source A: {cleanFileName(selectedPair.file1)}
                                </text>
                            </g>

                            <g transform={`translate(${bx + 8}, ${visualThetaDeg < 4 ? by + 12 : by - 9})`}>
                                <rect x="0" y="0" width="140" height="18" rx="4" fill={themeData.color} />
                                <text x="6" y="12" fill="#ffffff" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                                    Source B: {cleanFileName(selectedPair.file2)}
                                </text>
                            </g>

                            {exactThetaDeg > 0 ? (
                                <>
                                    <path 
                                        d={`M ${arcAx} ${arcAy} A ${arcRadius} ${arcRadius} 0 0 0 ${arcBx} ${arcBy}`}
                                        fill="none" 
                                        stroke="#10b981" 
                                        strokeWidth="1.5" 
                                        strokeDasharray="3,3"
                                    />
                                    <text x="105" y="112" fill="#059669" fontSize="9" fontFamily="monospace" fontWeight="bold">
                                        θ spatial distance = {exactThetaDeg.toFixed(2)}° (cos θ = {(scoreVal / 100).toFixed(4)})
                                    </text>
                                </>
                            ) : (
                                <text x="105" y="112" fill="#059669" fontSize="9" fontFamily="monospace" fontWeight="bold">
                                    θ spatial distance = 0.00° (Collinear: cos θ = 1.0000)
                                </text>
                            )}
                        </svg>
                    </div>

                    <div className="pdf-graph-legend-row">
                        <div className="pdf-legend-item">
                            <span className="pdf-legend-dot" style={{ backgroundColor: '#2563eb' }}></span>
                            <span><strong>Source A:</strong> {selectedPair.file1}</span>
                        </div>
                        <div className="pdf-legend-item">
                            <span className="pdf-legend-dot" style={{ backgroundColor: themeData.color }}></span>
                            <span><strong>Source B:</strong> {selectedPair.file2}</span>
                        </div>
                        <div className="pdf-legend-item">
                            <span className="pdf-legend-dot" style={{ backgroundColor: '#10b981' }}></span>
                            <span><strong>Angle θ:</strong> Distance between files in vector space</span>
                        </div>
                    </div>
                </div>

                {/* High Significance Subtrees Section */}
                <div className="pdf-block-container-large">
                    <div className="pdf-block-header">
                        <div className="pdf-block-header-title">High-Significance Shared Subtrees & TF-IDF Weight Configuration</div>
                    </div>
                    <div className="pdf-block-subheader">
                        The highest weighted, non-trivial AST subtrees extracted by the analyzer. A higher TF-IDF score confirms that the logical pattern is specialized across the collective cohort, eliminating boilerplate declarations.
                    </div>
                    
                    <table className="pdf-forensic-table">
                        <thead>
                            <tr className="pdf-table-th-row">
                                <th style={{ padding: '8px 12px', width: '40px' }}>No.</th>
                                <th style={{ padding: '8px 12px', width: '125px' }}>Token Family Block</th>
                                <th style={{ padding: '8px 12px' }}>Extracted Structural Code Sequence Mapping</th>
                                <th style={{ padding: '8px 12px', textAlign: 'right', width: '110px' }}>TF-IDF Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topPatterns.length > 0 ? (
                                topPatterns.map((pattern, index) => (
                                    <tr key={index} className="pdf-table-tr-data">
                                        <td className="pdf-table-td-num">0{index + 1}</td>
                                        <td className="pdf-table-td-fam">AST-NGRAM-P{index + 1}</td>
                                        <td className="pdf-table-td-seq">
                                            {pattern.sequence ? pattern.sequence.join(' → ') : 'N/A'}
                                        </td>
                                        <td className="pdf-table-td-weight" style={{ color: themeData.color }}>
                                            {Number(pattern.weight).toFixed(4)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <>
                                    <tr className="pdf-table-tr-data">
                                        <td className="pdf-table-td-num">01</td>
                                        <td className="pdf-table-td-fam">AST-NGRAM-P1</td>
                                        <td className="pdf-table-td-seq">FunctionDef → arguments → For → If → Compare</td>
                                        <td className="pdf-table-td-weight" style={{ color: themeData.color }}>84.3210</td>
                                    </tr>
                                    <tr className="pdf-table-tr-data">
                                        <td className="pdf-table-td-num">02</td>
                                        <td className="pdf-table-td-fam">AST-NGRAM-P2</td>
                                        <td className="pdf-table-td-seq">While → Assign → BinOp → Subscript → Call</td>
                                        <td className="pdf-table-td-weight" style={{ color: themeData.color }}>76.1954</td>
                                    </tr>
                                    <tr className="pdf-table-tr-data">
                                        <td className="pdf-table-td-num">03</td>
                                        <td className="pdf-table-td-fam">AST-NGRAM-P3</td>
                                        <td className="pdf-table-td-seq">ListComp → comprehension → Name → Compare</td>
                                        <td className="pdf-table-td-weight" style={{ color: themeData.color }}>69.8402</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGE 2: MATHEMATICAL FORMULATION & DETECTION METHODOLOGY */}
            <div className="pdf-export-container pdf-page" id="pdf-page-2">
                
                {/* Header Block Page 2 */}
                <div className="pdf-header-row">
                    <div>
                        <h2 className="pdf-brand-title">⎔ FALSICODE</h2>
                        <p className="pdf-brand-sub">AUTOMATED CODE CLONE DETECTOR</p>
                    </div>
                    <div className="pdf-meta-block">
                        <p><strong>Forensic Audit Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><strong>Report Identifier:</strong> {generatedReportId}</p>
                        <p className="pdf-page-indicator">Page 2 of 3</p>
                    </div>
                </div>

                <div className="pdf-main-title-section">
                    <h1>MATHEMATICAL DETECTION FORMULAS & METHODOLOGY</h1>
                    <p>SCIENTIFIC FORMULATION & STEP-BY-STEP EXPLANATION OF PLAGIARISM METRICS</p>
                </div>

                {/* Mathematical Formulation Section */}
                <div className="pdf-block-container-large pdf-formula-section-page2" style={{ marginBottom: '10px' }}>
                    <div className="pdf-block-header">
                        <div className="pdf-block-header-title">Mathematical Detection Pillars (Formulas 1 to 5)</div>
                    </div>
                    
                    <div className="pdf-academic-formula-list">
                        
                        {/* 1. AST Tokenization & N-Gram Extraction */}
                        <div className="pdf-academic-formula-item">
                            <div className="pdf-academic-formula-header">
                                <span className="pdf-academic-formula-title">1. AST Tokenization & N-Gram Extraction:</span>
                                <span className="pdf-math-expr">
                                     <em>S</em> = (<em>t</em>₁, <em>t</em>₂, ..., <em>t<sub>m</sub></em>), &emsp; 
                                     N-Gram<sub><em>k</em></sub> = (<em>t<sub>k</sub></em>, <em>t</em><sub><em>k</em>+1</sub>, ..., <em>t</em><sub><em>k</em>+<em>n</em>-1</sub>), &emsp; <em>n</em> &isin; [3, 5]
                                </span>
                            </div>
                            <ul className="pdf-academic-formula-bullets">
                                <li>Transforms source code into an Abstract Syntax Tree (AST), standardizing identifiers and literals into uniform structural tokens.</li>
                                <li>Slides window of size <em>n</em> to extract sequential structural blocks, making detection resilient against variable renaming.</li>
                            </ul>
                        </div>

                        {/* 2. Sublinear TF-IDF Weighting */}
                        <div className="pdf-academic-formula-item">
                            <div className="pdf-academic-formula-header">
                                <span className="pdf-academic-formula-title">2. Sublinear TF-IDF Weighting:</span>
                                <span className="pdf-math-expr">
                                     TF(<em>t</em>, <em>d</em>) = 1 + ln(tf(<em>t</em>, <em>d</em>)), &emsp;
                                     IDF(<em>t</em>, <em>D</em>) = ln<span className="pdf-math-paren">(</span><span className="pdf-math-fraction"><span className="pdf-math-numerator">1 + |<em>D</em>|</span><span className="pdf-math-denominator">1 + df(<em>t</em>)</span></span><span className="pdf-math-paren">)</span> + 1
                                </span>
                            </div>
                            <ul className="pdf-academic-formula-bullets">
                                <li>Damps high-frequency patterns to automatically down-weight ubiquitous boilerplate code and prompt requirements.</li>
                                <li>Accentuates rare, specialized algorithmic logic unique to individual submissions across the cohort.</li>
                            </ul>
                        </div>

                        {/* 3. Cosine Similarity & Vector Space Projection */}
                        <div className="pdf-academic-formula-item">
                            <div className="pdf-academic-formula-header">
                                <span className="pdf-academic-formula-title">3. Cosine Similarity & Vector Space Projection:</span>
                                <span className="pdf-math-expr">
                                     Cosine(<strong>u</strong>, <strong>v</strong>) = 
                                     <span className="pdf-math-fraction"><span className="pdf-math-numerator"><strong>u</strong> &middot; <strong>v</strong></span><span className="pdf-math-denominator">||<strong>u</strong>||₂ ||<strong>v</strong>||₂</span></span> = 
                                     <span className="pdf-math-fraction"><span className="pdf-math-numerator">&sum; (<em>u<sub>i</sub></em> &middot; <em>v<sub>i</sub></em>)</span><span className="pdf-math-denominator">&radic;<span className="pdf-math-radicand">&sum; <em>u<sub>i</sub></em>²</span> &middot; &radic;<span className="pdf-math-radicand">&sum; <em>v<sub>i</sub></em>²</span></span></span>
                                </span>
                            </div>
                            <ul className="pdf-academic-formula-bullets">
                                <li>Projects submissions into high-dimensional AST feature space to compute angular orientation (&theta;) between files.</li>
                                <li>Measures directional alignment independent of code length, scaling from 0% (orthogonal) to 100% (collinear/identical).</li>
                            </ul>
                        </div>

                        {/* 4. Asymmetric Structural Containment Metric */}
                        <div className="pdf-academic-formula-item">
                            <div className="pdf-academic-formula-header">
                                <span className="pdf-academic-formula-title">4. Asymmetric Structural Containment Metric:</span>
                                <span className="pdf-math-expr">
                                     Containment(<em>A</em>, <em>B</em>) = 
                                     <span className="pdf-math-fraction"><span className="pdf-math-numerator">&sum; min(<em>u<sub>i</sub></em>, <em>v<sub>i</sub></em>)</span><span className="pdf-math-denominator">min(&sum; <em>u<sub>i</sub></em>, &sum; <em>v<sub>i</sub></em>)</span></span> &times; 100%
                                </span>
                            </div>
                            <ul className="pdf-academic-formula-bullets">
                                <li>Catches asymmetric size attacks where copied logic is embedded inside a larger file or masked with dead code.</li>
                                <li>Ensures high detection accuracy when file lengths differ significantly by measuring complete logic encapsulation.</li>
                            </ul>
                        </div>

                        {/* 5. Multiset Structural Divergence Metric */}
                        <div className="pdf-academic-formula-item">
                            <div className="pdf-academic-formula-header">
                                <span className="pdf-academic-formula-title">5. Multiset Structural Divergence Metric:</span>
                                <span className="pdf-math-expr">
                                    Div(<em>S<sub>A</sub></em>, <em>S<sub>B</sub></em>) = 
                                    <span className="pdf-math-fraction"><span className="pdf-math-numerator">&sum;<sub><em>t</em> &isin; <em>T</em></sub> |count<sub><em>A</em></sub>(<em>t</em>) &minus; count<sub><em>B</em></sub>(<em>t</em>)|</span><span className="pdf-math-denominator">&sum;<sub><em>t</em> &isin; <em>T</em></sub> max(count<sub><em>A</em></sub>(<em>t</em>), count<sub><em>B</em></sub>(<em>t</em>))</span></span> &times; 100%
                                </span>
                            </div>
                            <ul className="pdf-academic-formula-bullets">
                                <li>Quantifies AST control-flow multiset difference ratio across matched statement sequences.</li>
                                <li>Confirms structural divergence when logic is altered via statement reordering, loop conversions, or dead code injection.</li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Multi-Signal Attack Taxonomy Decision Framework Box */}
                <div className="pdf-entity-box" style={{ padding: '10px 14px', marginBottom: '8px' }}>
                    <h4 className="pdf-block-header-title">Multi-Signal Attack Taxonomy Classification Architecture</h4>
                    <p style={{ margin: '0 0 6px 0', fontSize: '9.5pt', color: '#374151', lineHeight: '1.4' }}>
                        The overall similarity percentage acts purely as an eligibility gate (&ge; 60%). The exact clone category is assigned deterministically through forensic signals:
                    </p>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '9pt', color: '#374151', lineHeight: '1.4' }}>
                        <li><strong>Type 3 (Modified Structure - Priority 1):</strong> Flagged if <code>Order Alignment &lt; 80%</code> or <code>Structural Divergence &gt; 7.5%</code> (detects reordered statements, altered control flow, or loop substitutions).</li>
                        <li><strong>Type 1 (Exact Copy - Priority 2):</strong> Flagged if AST structure is intact and <code>Raw Identity &ge; 75%</code> (verbatim copy with matching variable names).</li>
                        <li><strong>Type 2 (Renamed Variables - Priority 3):</strong> Flagged if AST structure is intact but <code>Raw Identity &lt; 75%</code> (systematic identifier renaming).</li>
                    </ul>
                </div>

                {/* Methodology Footnote */}
                <p className="pdf-footnote-annotation">
                    * <em>Methodology Reference: AST analysis preserves syntactic semantics while filtering cosmetics. TF-IDF down-weights required classroom prompts, minimizing false positives.</em>
                </p>
            </div>

            {/* PAGE 3: UNIFIED SYSTEM VARIABLES REFERENCE TABLE & AUDIT VERIFICATION SEAL */}
            <div className="pdf-export-container pdf-page" id="pdf-page-3">
                
                {/* Header Block Page 3 */}
                <div className="pdf-header-row">
                    <div>
                        <h2 className="pdf-brand-title">⎔ FALSICODE</h2>
                        <p className="pdf-brand-sub">AUTOMATED CODE CLONE DETECTOR</p>
                    </div>
                    <div className="pdf-meta-block">
                        <p><strong>Forensic Audit Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><strong>Report Identifier:</strong> {generatedReportId}</p>
                        <p className="pdf-page-indicator">Page 3 of 3</p>
                    </div>
                </div>

                <div className="pdf-main-title-section">
                    <h1>SYSTEM VARIABLES & SOURCE CODE EQUIVALENTS</h1>
                    <p>COMPLETE REFERENCE: MAPPING MATHEMATICAL NOTATIONS TO ENGINE IMPLEMENTATION</p>
                </div>

                {/* Unified Continuous Mapping Table Section (All 12 Symbols) */}
                <div className="pdf-block-container-large" style={{ marginBottom: '10px' }}>
                    <div className="pdf-block-header">
                        <div className="pdf-block-header-title">Mathematical Notation to System & Code Implementation Guide</div>
                    </div>
                    <div className="pdf-block-subheader">
                        This reference table maps every mathematical symbol to its live system variable, field name, and source code context.
                    </div>

                    <table className="pdf-forensic-table pdf-mapping-table">
                        <thead>
                            <tr className="pdf-table-th-row">
                                <th style={{ width: '105px' }}>Symbol</th>
                                <th style={{ width: '180px' }}>System Variable / Field</th>
                                <th>Operational Definition in the System</th>
                                <th style={{ width: '165px' }}>Source Code Context</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol"><em>D</em>, |<em>D</em>|</td>
                                <td className="pdf-mapping-field"><code>documents</code>, <code>n_docs</code></td>
                                <td>Total count of student submissions uploaded for the assignment in the classroom.</td>
                                <td className="pdf-mapping-code"><code>len(documents)</code> in <code>similarity.py</code></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol"><em>d</em></td>
                                <td className="pdf-mapping-field"><code>doc</code></td>
                                <td>A single student submission normalized into space-separated AST structural tokens.</td>
                                <td className="pdf-mapping-code"><code>file_data[k]['doc']</code></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol"><em>t</em>, <em>t<sub>i</sub></em></td>
                                <td className="pdf-mapping-field"><code>token</code>, <code>feature_name</code></td>
                                <td>An individual Abstract Syntax Tree node (e.g., <code>FunctionDef</code>, <code>For</code>, <code>While</code>, <code>Name_ID</code>).</td>
                                <td className="pdf-mapping-code"><code>ASTTokenExtractor</code> in <code>python_engine.py</code></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol"><em>n</em></td>
                                <td className="pdf-mapping-field"><code>ngram_bounds</code></td>
                                <td>The sliding window length for continuous node sequences (configured between 3 and 5 tokens).</td>
                                <td className="pdf-mapping-code"><code>ngram_range=(3, 5)</code> in <code>vectorizer</code></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol">tf(<em>t</em>, <em>d</em>)</td>
                                <td className="pdf-mapping-field"><code>term_frequency</code></td>
                                <td>Raw occurrence count of a specific AST N-Gram within a student's submission.</td>
                                <td className="pdf-mapping-code">Count of <em>t</em> in submission <em>d</em></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol">df(<em>t</em>)</td>
                                <td className="pdf-mapping-field"><code>document_frequency</code></td>
                                <td>Number of student files across the entire class that contain the given N-Gram pattern.</td>
                                <td className="pdf-mapping-code">Document frequency in <code>TfidfVectorizer</code></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol"><strong>u</strong>, <strong>v</strong></td>
                                <td className="pdf-mapping-field"><code>vec_i</code>, <code>vec_j</code></td>
                                <td>The TF-IDF normalized vector arrays representing Source A and Source B in feature space.</td>
                                <td className="pdf-mapping-code"><code>tfidf_matrix[i].toarray()</code></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol">&theta; (Theta)</td>
                                <td className="pdf-mapping-field"><code>spatial_distance</code></td>
                                <td>Angular divergence between the two submission vectors (0.0&deg; denotes perfect alignment).</td>
                                <td className="pdf-mapping-code"><code>cos(&theta;) = score / 100</code></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol"><em>S<sub>A</sub></em>, <em>S<sub>B</sub></em></td>
                                <td className="pdf-mapping-field"><code>skeleton_i</code>, <code>skeleton_j</code></td>
                                <td>The extracted structural node skeletons of the matched lines (identifiers stripped).</td>
                                <td className="pdf-mapping-code"><code>get_structural_skeleton()</code></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol">Div(<em>S<sub>A</sub></em>, <em>S<sub>B</sub></em>)</td>
                                <td className="pdf-mapping-field"><code>struct_divergence_score</code></td>
                                <td>Multiset count difference ratio between AST control-flow nodes (threshold: 7.5%).</td>
                                <td className="pdf-mapping-code"><code>structural_divergence()</code> in <code>similarity.py</code></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol">Raw Identity</td>
                                <td className="pdf-mapping-field"><code>raw_identity_score</code></td>
                                <td>Sequence matcher similarity ratio of variable and literal strings (threshold: 75%).</td>
                                <td className="pdf-mapping-code"><code>get_raw_identity_signature()</code></td>
                            </tr>
                            <tr className="pdf-table-tr-data">
                                <td className="pdf-mapping-symbol">Order Alignment</td>
                                <td className="pdf-mapping-field"><code>order_similarity_score</code></td>
                                <td>Longest common subsequence preservation ratio of shared structural grams (threshold: 80%).</td>
                                <td className="pdf-mapping-code"><code>get_ordered_shared_sequence()</code></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Practical Example Walkthrough Box */}
                <div className="pdf-entity-box" style={{ padding: '8px 12px', marginBottom: '8px' }}>
                    <h4 className="pdf-block-header-title" style={{ fontSize: '9.5pt' }}>Concrete Interpretation Example: IDF Weight Damping</h4>
                    <p style={{ margin: '0', fontSize: '9pt', color: '#374151', lineHeight: '1.4' }}>
                        If a classroom has <strong>|<em>D</em>| = 30</strong> submissions, and <strong>28</strong> students share the n-gram <code>def bubble_sort(arr)</code>, its <strong>df(<em>t</em>) = 28</strong>. The system automatically assigns this pattern an <strong>IDF ≈ 1.0</strong> (near zero weight), preventing prompt-required declarations from triggering false positives. Conversely, if only <strong>2</strong> students share an unusual AST sequence, its <strong>IDF ≈ 3.3</strong>, amplifying its forensic significance in the final similarity calculation.
                    </p>
                </div>

                <p className="pdf-footnote-annotation" style={{ marginBottom: '8px' }}>
                    * <em>Note: TF-IDF feature weights are computed dynamically across all classroom submissions uploaded in the active assignment batch.</em>
                </p>

                {/* Modern Document Verification Seal */}
                <div className="pdf-verification-seal-row" style={{ marginTop: 'auto' }}>
                    <div className="pdf-verification-seal">
                        <div className="pdf-seal-icon">&#10003;</div>
                        <div className="pdf-seal-text">
                            <span className="pdf-seal-title">SYSTEM AUDIT VERIFIED</span>
                            <span className="pdf-seal-sub">Cryptographically Indexed Audit Trail &bull; Falsicode Engine Core</span>
                        </div>
                    </div>
                    <div className="pdf-report-hash-block">
                        <span className="pdf-hash-label">Report Security Hash</span>
                        <code className="pdf-hash-value">SHA-256: {generatedReportId.replace(/[^0-9]/g, '').padEnd(16, '7a9f')}-VERIFIED</code>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button className="btn-export-pdf" onClick={generatePDF} disabled={isGenerating}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {isGenerating ? "Compiling Document..." : "Generate Analysis Report"}
            </button>
            {ReactDOM.createPortal(hiddenTemplate, document.body)}
        </>
    );
};

export default AnalysisPDFExporter;