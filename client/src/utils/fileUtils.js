export const getFileExtension = (language) => {
    const lang = language?.toLowerCase() || '';
    
    // Using a dictionary mapping makes it incredibly easy to add new languages later
    const extensionMap = {
        'python': '.py',
        'java': '.java',
        'cpp': '.cpp',
        'javascript': '.js',
        'csharp': '.cs'
    };

    return extensionMap[lang] || '.txt'; // Default fallback
};

export const validateUploadedFile = (file, expectedExtension) => {
    if (!file) return "Please select a file to deploy.";
    
    // Strict extension check
    if (!file.name.toLowerCase().endsWith(expectedExtension)) {
        return `Security Rejection: Invalid format. You must upload a ${expectedExtension} file.`;
    }
    
    return null; // Passed validation
};

export const formatLanguageDisplay = (language) => {
    if (!language) return 'UNKNOWN';
    return language.toUpperCase();
};