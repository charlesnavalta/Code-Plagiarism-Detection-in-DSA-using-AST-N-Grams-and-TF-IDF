import React, { useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [files, setFiles] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (files.length < 2) return alert("Please select at least 2 files.");

        setLoading(true);
        const formData = new FormData();
        for (let file of files) {
            formData.append('submissions', file);
        }

        try {
            const res = await axios.post('http://localhost:5000/api/upload', formData);
            setResults(res.data);
            setShowResults(true);
        } catch (error) {
            alert("Error connecting to server!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-h1">LogicGuard Batch Processor</h1>
            <p className="subtitle">Upload all student files to detect cross-plagiarism.</p>

            {!showResults ? (
                <form onSubmit={handleSubmit}>
                    <div className="upload-box">
                        <label className="upload-label">
                            <strong>{files.length > 0 ? `${files.length} Files Selected` : 'Click to Select Class Submissions'}</strong>
                            <br />
                            <small>Hold Ctrl/Cmd to select multiple .py or .txt files</small>
                            <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                    </div>
                    <button type="submit" className="btn-analysis" disabled={loading}>
                        {loading ? "Analyzing... (Please Wait)" : "Run Batch Analysis"}
                    </button>
                </form>
            ) : (
                <div className="results-area">
                    <h3>Analysis Results ({files.length} files)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>File A</th>
                                <th>File B</th>
                                <th>Similarity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.file1}</td>
                                    <td>{row.file2}</td>
                                    <td className={row.score > 70 ? 'high' : 'low'}>{row.score}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={() => setShowResults(false)} className="btn-analysis" style={{marginTop: '20px'}}>
                        Start New Analysis
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;