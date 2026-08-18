import api from './api';

const analysisService = {
    /**
     * Trigger AST, N-Gram & TF-IDF similarity analysis on an assignment
     * @param {number|string} assignmentId
     */
    runAnalysis: async (assignmentId) => {
        const response = await api.post(`/analyze/${assignmentId}`, {});
        return response.data;
    },

    /**
     * Fetch submissions for a specific assignment within a classroom
     * @param {number|string} classroomId
     * @param {number|string} assignmentId
     */
    getAssignmentSubmissions: async (classroomId, assignmentId) => {
        const response = await api.get(`/classrooms/${classroomId}/assignments/${assignmentId}/submissions`);
        return response.data;
    },

    /**
     * Fetch a specific plagiarism report
     * @param {number|string} reportId
     */
    getReport: async (reportId) => {
        const response = await api.get(`/analyze/report/${reportId}`);
        return response.data;
    }
};

export default analysisService;
