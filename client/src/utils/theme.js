export const getPlagiarismDisplayData = (backendType) => {
    const typeStr = String(backendType || "");

    if (typeStr.includes("Type 1") || typeStr.includes("Type I")) {
        return { 
            color: "#ef4444", 
            badgeClass: "badge-type1",
            label: "Type 1: Exact Copy",
            shortLabel: "Type 1" 
        }; 
    }
    if (typeStr.includes("Type 2") || typeStr.includes("Type II")) {
        return { 
            color: "#f97316", 
            badgeClass: "badge-type2",
            label: "Type 2: Renamed Variables",
            shortLabel: "Type 2" 
        }; 
    }
    if (typeStr.includes("Type 3") || typeStr.includes("Type III")) {
        return { 
            color: "#eab308", 
            badgeClass: "badge-type3",
            label: "Type 3: Modified Structure",
            shortLabel: "Type 3" 
        }; 
    }
    
    return { 
        color: "#10b981", 
        badgeClass: "badge-safe",
        label: "Safe: Original Code",
        shortLabel: "Safe" 
    }; 
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