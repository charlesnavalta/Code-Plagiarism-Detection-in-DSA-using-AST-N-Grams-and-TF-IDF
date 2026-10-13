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

export const MAX_GUIDE_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per file limit
export const MAX_GUIDE_FILE_SIZE_MB = 10;

export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Explicit whitelist of allowed extensions for Guide & Reference materials
export const ALLOWED_GUIDE_EXTENSIONS = [
    // Documents
    '.pdf', '.doc', '.docx', '.txt', '.rtf', '.md', '.odt',
    // Spreadsheets & Presentations
    '.csv', '.tsv', '.xls', '.xlsx', '.ppt', '.pptx',
    // Code & Algorithms / DSA Tools
    '.py', '.java', '.c', '.cpp', '.h', '.hpp', '.cs', '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.xml', '.sql',
    // Starter archives / data packages
    '.zip', '.tar', '.gz', '.7z', '.rar',
    // Diagrams & Images
    '.png', '.jpg', '.jpeg', '.webp', '.svg'
];

// Disallowed multimedia & dangerous extensions for explicit, friendly rejections
export const DISALLOWED_MEDIA_EXTENSIONS = [
    // Audio
    '.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.wma', '.mid', '.midi',
    // Video
    '.mp4', '.avi', '.mov', '.mkv', '.webm', '.wmv', '.flv', '.m4v', '.3gp', '.m4p', '.mpg', '.mpeg', '.vob'
];

export const GUIDE_FILE_ACCEPT_STRING = ALLOWED_GUIDE_EXTENSIONS.join(',');

/**
 * Validates a guide file uploaded by an instructor.
 * Rejects audio/video, dangerous executables, empty files, non-whitelisted types, and files over 10 MB.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateGuideFile = (file) => {
    if (!file) {
        return { valid: false, error: "No file was selected." };
    }

    const name = file.name || '';
    const lastDot = name.lastIndexOf('.');
    const ext = lastDot !== -1 ? name.substring(lastDot).toLowerCase() : '';
    const mime = (file.type || '').toLowerCase();

    // 1. Explicitly reject Audio and Video files (e.g. mp3, mp4)
    if (
        DISALLOWED_MEDIA_EXTENSIONS.includes(ext) ||
        mime.startsWith('audio/') ||
        mime.startsWith('video/')
    ) {
        return {
            valid: false,
            error: `Audio and video files (${ext || mime || 'media'}) are not allowed as guide materials. Please upload documents, code, or archives.`
        };
    }

    // 2. Reject executable / system script files that pose security risks
    const dangerousExtensions = ['.exe', '.msi', '.bat', '.cmd', '.sh', '.bin', '.dll', '.com', '.vbs', '.ps1'];
    if (dangerousExtensions.includes(ext)) {
        return {
            valid: false,
            error: `Executable and system script files (${ext}) cannot be uploaded as guide materials.`
        };
    }

    // 3. Whitelist check: Must be in the allowed guide extensions
    if (!ext || !ALLOWED_GUIDE_EXTENSIONS.includes(ext)) {
        return {
            valid: false,
            error: `File "${name}" has an unsupported format (${ext || 'no extension'}). Allowed types: PDF, DOCX, TXT, Code (PY, JAVA, CPP), ZIP, and images.`
        };
    }

    // 4. Empty file check (e.g. 0 Bytes)
    if (file.size === 0) {
        return {
            valid: false,
            error: `File "${name}" is empty (0 B). Please select a valid document or reference file.`
        };
    }

    // 5. File size limit check (Max 10 MB)
    if (file.size > MAX_GUIDE_FILE_SIZE_BYTES) {
        return {
            valid: false,
            error: `File "${name}" exceeds the maximum allowed size of ${MAX_GUIDE_FILE_SIZE_MB} MB (${formatFileSize(file.size)}).`
        };
    }

    return { valid: true };
};