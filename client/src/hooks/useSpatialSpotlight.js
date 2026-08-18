export const useSpatialSpotlight = (ref) => {
    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const cards = ref.current.querySelectorAll('.spatial-card');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        }
    };
    
    return handleMouseMove;
};