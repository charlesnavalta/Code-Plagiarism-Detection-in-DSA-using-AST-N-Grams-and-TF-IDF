import api from './api';

const authService = {
    /**
     * Authenticate user credentials
     * @param {string} username - Username or email
     * @param {string} password - User password
     */
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },

    /**
     * Register a new student or instructor account
     * @param {Object} userData - { username, email, password, role }
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Request a 6-digit email OTP verification code
     * @param {string} email - Destination email address
     */
    requestCode: async (email) => {
        const response = await api.post('/auth/request-code', { email });
        return response.data;
    },

    /**
     * Initiate password recovery sequence
     * @param {string} email - Account email address
     */
    requestPasswordReset: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    /**
     * Finalize password reset with OTP code
     * @param {Object} payload - { email, code, new_password }
     */
    resetPassword: async ({ email, code, newPassword }) => {
        const response = await api.post('/auth/reset-password', { 
            email, 
            code, 
            new_password: newPassword 
        });
        return response.data;
    },

    /**
     * Get current user profile details
     */
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    /**
     * Update user profile credentials
     * @param {Object} data - Profile updates
     */
    updateProfile: async (data) => {
        const response = await api.put('/auth/profile', data);
        return response.data;
    }
};

export default authService;
