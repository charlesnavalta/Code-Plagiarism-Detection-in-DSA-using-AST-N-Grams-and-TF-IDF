// src/hooks/useUserCRUD.js
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useUserCRUD = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    // READ
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/auth/users');
            const nonAdminUsers = res.data.filter(user => user.role !== 'admin');
            setUsers(nonAdminUsers);
            setError('');
        } catch (err) {
            setError('System Protocol: Failed to fetch users. Ensure the backend is active.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // UPDATE (Approve)
    const approveUser = async (userId) => {
        try {
            await api.patch(`/auth/users/${userId}/approve`);
            fetchUsers(); // Refresh list
        } catch (err) {
            alert("Security Protocol: Failed to approve user.");
        }
    };

    // DELETE
    const deleteUser = async (userId) => {
        if (!window.confirm("Warning: Are you sure you want to permanently purge this user node?")) return false;
        try {
            await api.delete(`/auth/users/${userId}`);
            fetchUsers();
            return true;
        } catch (err) {
            alert(err.response?.data?.error || "Protocol failure: Unable to delete user.");
            return false;
        }
    };

    // CREATE & UPDATE (Save Form Data)
    const saveUser = async (modalMode, formData) => {
        setProcessing(true);
        try {
            if (modalMode === 'create') {
                await api.post('/auth/users', formData);
            } else {
                const payload = { username: formData.username, email: formData.email, role: formData.role, status: formData.status };
                if (formData.password) payload.password = formData.password; // Only send password if changed
                await api.put(`/auth/users/${formData.id}`, payload);
            }
            fetchUsers();
            return true; // Return success so the UI knows to close the modal
        } catch (err) {
            alert(err.response?.data?.error || `Failed to ${modalMode} user node.`);
            return false;
        } finally {
            setProcessing(false);
        }
    };

    return { 
        users, 
        loading, 
        error, 
        processing, 
        approveUser, 
        deleteUser, 
        saveUser 
    };
};