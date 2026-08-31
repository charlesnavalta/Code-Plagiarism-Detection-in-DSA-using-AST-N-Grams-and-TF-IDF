// This file only handles logic, no UI/HTML!
export const validateAssignmentDescription = (description) => {
    if (!description) return "Description is required.";

    const descTrimmed = description.trim();
    const words = descTrimmed.split(/\s+/); 

    // 1. Check for minimum length and word count
    if (descTrimmed.length < 20 || words.length < 4) {
        return "Description is too short. Please provide a detailed, meaningful explanation.";
    }

    // 2. Check for keyboard mashing
    const hasMashedKeys = words.some(word => word.length > 25 && !word.startsWith('http'));
    if (hasMashedKeys) {
        return "Invalid input detected. Please write a proper description without keyboard mashing.";
    }

    // If everything is good, return null (no errors)
    return null; 
};

export const validateDeadline = (deadline) => {
    if (!deadline || !String(deadline).trim()) {
        return "Deadline is required. Please set a date and time for the assignment.";
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
        return "Invalid deadline date format.";
    }

    const now = new Date();
    // Allow a 1-minute grace period to prevent submission race conditions
    if (deadlineDate.getTime() < (now.getTime() - 60000)) {
        return "Deadline cannot be set in the past. Please select a future date and time.";
    }

    return null;
};