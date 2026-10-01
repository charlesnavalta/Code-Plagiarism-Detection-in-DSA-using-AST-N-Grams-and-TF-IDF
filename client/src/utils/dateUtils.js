export const formatDeadline = (isoString) => {
    if (!isoString) return 'No Deadline Specified';
    
    const normalizedIso = (typeof isoString === 'string' && !isoString.endsWith('Z') && !isoString.includes('+')) 
        ? `${isoString}Z` 
        : isoString;
    const date = new Date(normalizedIso);
    return date.toLocaleDateString('en-PH', {
        timeZone: 'Asia/Manila',
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    });
};

export const formatTimestamp = (isoString) => {
    if (!isoString) return 'Pending...';
    
    const normalizedIso = (typeof isoString === 'string' && !isoString.endsWith('Z') && !isoString.includes('+')) 
        ? `${isoString}Z` 
        : isoString;
    const date = new Date(normalizedIso);
    return date.toLocaleDateString('en-PH', { 
        timeZone: 'Asia/Manila',
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
};