"""
=============================================================================
FALSICODE: Plagiarism Detection & Forensic Analysis Package
=============================================================================
Modular detection engine implementing:
- `comparator.py`: Main TF-IDF vectorizer & pairwise comparison coordinator
- `classifier.py`: Type 1 (Verbatim), Type 2 (Renamed), Type 3 (Structural) taxonomy classifier
- `metrics.py`: Thresholds, dynamic DF bounds, containment skeleton metric
- `xai.py`: Line reverse-mapping and Explainable AI pattern samplers
=============================================================================
"""

from .comparator import compare_all_files
from .classifier import (
    classify_plagiarism_type,
    structural_divergence,
    get_structural_skeleton,
    get_raw_identity_signature,
    get_ordered_shared_sequence,
    detect_renamed_line_pairs
)
from .metrics import (
    ORDER_SIMILARITY_THRESHOLD,
    RAW_IDENTITY_TYPE1_THRESHOLD,
    STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD,
    STRUCTURAL_IGNORE_TYPES,
    compute_containment_score,
    calculate_adaptive_thresholds,
    get_dynamic_df_bounds
)
from .xai import (
    extract_lines_from_tfidf,
    get_top_shared_patterns,
    get_top_unique_patterns
)

__all__ = [
    'compare_all_files',
    'classify_plagiarism_type',
    'structural_divergence',
    'get_structural_skeleton',
    'get_raw_identity_signature',
    'get_ordered_shared_sequence',
    'detect_renamed_line_pairs',
    'ORDER_SIMILARITY_THRESHOLD',
    'RAW_IDENTITY_TYPE1_THRESHOLD',
    'STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD',
    'STRUCTURAL_IGNORE_TYPES',
    'compute_containment_score',
    'calculate_adaptive_thresholds',
    'get_dynamic_df_bounds',
    'extract_lines_from_tfidf',
    'get_top_shared_patterns',
    'get_top_unique_patterns'
]
