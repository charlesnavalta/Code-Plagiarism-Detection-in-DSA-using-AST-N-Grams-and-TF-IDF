// src/modals/instructor/CodeComparisonModal.js
import React from 'react';
import BaseModal from '../shared/BaseModal';
import CodeComparisonView from '../../components/instructor/CodeComparisonView';
import './CodeComparisonModal.css';

const CodeComparisonModal = ({
    isOpen,
    onClose,
    selectedPair,
    submissions = [],
    allPairs = [],
    onSelectPair
}) => {
    if (!isOpen || !selectedPair) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Comparative Code Analysis"
            subtitle="Side-by-side algorithmic syntax alignment, line-by-line clone detection, and AST token sequence flow."
            customClass="comparison-hud-modal"
        >
            <div className="comparison-modal-body">
                <CodeComparisonView
                    selectedPair={selectedPair}
                    submissions={submissions}
                    allPairs={allPairs}
                    onSelectPair={onSelectPair}
                    onBack={onClose}
                />
            </div>
        </BaseModal>
    );
};

export default CodeComparisonModal;
