export const formatDeadline = (isoString) => {
    if (!isoString) return 'No Deadline Specified';
    
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    });
};

export const formatTimestamp = (isoString) => {
    if (!isoString) return 'Pending...';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};