export const getPlagiarismDisplayData = (backendType) => {
    const typeStr = backendType || "";

    if (typeStr.includes("Type 1")) {
        return { color: "#dc2626", shortLabel: "Type I" }; 
    }
    if (typeStr.includes("Type 2")) {
        return { color: "#ea580c", shortLabel: "Type II" }; 
    }
    if (typeStr.includes("Type 3")) {
        return { color: "#ca8a04", shortLabel: "Type III" }; 
    }
    
    return { color: "#10b981", shortLabel: "Safe" }; 
};

// 🌟 NEW: Extracted AST Badge Logic
export const getASTBadgeStyle = (realWeight, patternIndex, totalPatterns) => {
    let categoryLabel = "High Suspicion (Copied Logic)";
    let badgeColor = "#ef4444"; 
    let badgeBg = "rgba(239, 68, 68, 0.1)";

    if (totalPatterns === 30) {
        if (patternIndex >= 20 && patternIndex <= 24) {
            categoryLabel = "Average Structural Overlap";
            badgeColor = "#f97316"; 
            badgeBg = "rgba(249, 115, 22, 0.1)";
        } else if (patternIndex >= 25) {
            categoryLabel = "Common Boilerplate (Ignored)";
            badgeColor = "#10b981"; 
            badgeBg = "rgba(16, 185, 129, 0.1)";
        }
    } else {
        if (realWeight < 65 && realWeight >= 30) {
            categoryLabel = "Average Structural Overlap";
            badgeColor = "#f97316"; 
            badgeBg = "rgba(249, 115, 22, 0.1)";
        } else if (realWeight < 30) {
            categoryLabel = "Common Boilerplate (Ignored)";
            badgeColor = "#10b981"; 
            badgeBg = "rgba(16, 185, 129, 0.1)";
        }
    }

    return { categoryLabel, badgeColor, badgeBg };
};