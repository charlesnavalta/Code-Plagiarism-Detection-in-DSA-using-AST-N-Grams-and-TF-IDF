export const clearAuthSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
};

export const getUserData = () => {
    try {
        const rawUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (rawUser && rawUser !== "undefined") return JSON.parse(rawUser);
    } catch (e) { 
        console.error("Identity Sync Error", e); 
    }
    
    return { username: 'Guest Student', role: 'student' }; 
};