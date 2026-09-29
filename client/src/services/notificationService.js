// client/src/services/notificationService.js
import api from './api';

const notificationService = {
    /**
     * Fetch user's notification list and unread count
     */
    getNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    /**
     * Mark a single notification as read
     */
    markAsRead: async (notificationId) => {
        const response = await api.patch(`/notifications/${notificationId}/read`);
        return response.data;
    },

    /**
     * Mark all unread notifications as read
     */
    markAllAsRead: async () => {
        const response = await api.patch('/notifications/read-all');
        return response.data;
    },

    /**
     * Delete a single notification
     */
    deleteNotification: async (notificationId) => {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    },

    /**
     * Clear all notifications for the user
     */
    clearAll: async () => {
        const response = await api.delete('/notifications/clear-all');
        return response.data;
    }
};

export default notificationService;
