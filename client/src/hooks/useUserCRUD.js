// src/hooks/useUserCRUD.js
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from '../context/NotificationContext';

export const useUserCRUD = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);
    const toast = useToast();

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
            toast.success("User account authorized successfully!", "User Approved");
            fetchUsers(); // Refresh list
        } catch (err) {
            toast.error("Failed to authorize user account.", "Approval Failed");
        }
    };

    // DELETE
    const deleteUser = async (userId) => {
        if (!window.confirm("Warning: Are you sure you want to permanently purge this user node?")) return false;
        try {
            await api.delete(`/auth/users/${userId}`);
            toast.success("User removed successfully.", "Account Deleted");
            fetchUsers();
            return true;
        } catch (err) {
            toast.error(err.response?.data?.error || "Protocol failure: Unable to delete user.", "Deletion Error");
            return false;
        }
    };

    // CREATE & UPDATE (Save Form Data)
    const saveUser = async (modalMode, formData) => {
        setProcessing(true);         
        try {
            if (modalMode === 'create') {
                await api.post('/auth/users', formData);
                toast.success("User provisioned successfully!", "User Created");
            } else {
                const payload = { username: formData.username, email: formData.email, role: formData.role, status: formData.status };
                if (formData.password) payload.password = formData.password; // Only send password if changed
                await api.put(`/auth/users/${formData.id}`, payload);
                toast.success("User profile updated successfully!", "Changes Saved");
            }
            fetchUsers();
            return true; // Return success so the UI knows to close the modal
        } catch (err) {
            toast.error(err.response?.data?.error || `Failed to ${modalMode} user node.`, "Save Failed");
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