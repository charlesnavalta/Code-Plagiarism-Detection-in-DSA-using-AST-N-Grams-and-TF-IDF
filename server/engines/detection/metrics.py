"""
=============================================================================
FALSICODE: Plagiarism Thresholds & Mathematical Metrics
=============================================================================
Defines classification thresholds, raw token extractors, containment formulas,
and adaptive threshold scalers for DSA algorithmic code comparison.
=============================================================================
"""

import numpy as np

# =========================================================================
# CLASSIFICATION THRESHOLDS
# =========================================================================
# ORDER_SIMILARITY_THRESHOLD: Minimum relative alignment of shared N-Grams
# required for linear similarity. Below this -> Type 3.
ORDER_SIMILARITY_THRESHOLD = 80

# RAW_IDENTITY_TYPE1_THRESHOLD: Threshold for actual variable names/literals
# in matched regions before classifying as Type 1 (verbatim) vs Type 2 (renamed).
RAW_IDENTITY_TYPE1_THRESHOLD = 75

# STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD: Maximum allowable AST node-type divergence
# before classifying as Type 3 (structural rewrite / loop swap / extra logic).
STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD = 7.5

# Token types representing identifiers and literals rather than syntax structure.
STRUCTURAL_IGNORE_TYPES = {"Name_ID", "Constant_CONST"}


def _get_raw_value(token):
    """
    Safely extracts the raw identifier/literal value from a token tuple.
    Supports both 3-tuple (token_str, lineno, raw_value) and legacy 2-tuple (token_str, lineno).
    """
    if len(token) > 2:
        return token[2]
    return None


def get_dynamic_df_bounds(n_docs: int) -> tuple[float, int]:
    """
    Calculates dynamic max_df and min_df for TF-IDF vectorization to suppress
    boilerplate while ensuring sklearn's mathematical constraints are never violated.

    Args:
        n_docs (int): Total count of code documents in the batch.

    Returns:
        tuple[float, int]: (dynamic_max_df, dynamic_min_df)
    """
    if n_docs <= 2:
        # 2-doc batch: Proportion filtering collapses to <= 1 doc; disable filters.
        return 1.0, 1
    elif n_docs <= 5:
        # Small batch: Boilerplate suppression active (floor(0.85 * 3) = 2 == min_df).
        return 0.85, 2
    else:
        # Full classroom: Tighter filter (floor(0.80 * 6) = 4 >= min_df).
        return 0.80, 2


def compute_containment_score(vec_i: np.ndarray, vec_j: np.ndarray, feature_names: list) -> float:
    """
    Calculates the Containment Skeleton Metric:
    Containment(A, B) = sum(min(w_A, w_B)) / min(sum(w_A), sum(w_B)) * 100%

    Catches asymmetric plagiarism where a compact solution is embedded inside a large file.
    """
    weight_i = np.sum(vec_i)
    weight_j = np.sum(vec_j)

    if min(weight_i, weight_j) <= 0:
        return 0.0

    shared_weight = np.sum([min(vec_i[idx], vec_j[idx]) for idx in range(len(feature_names))])
    return round((shared_weight / min(weight_i, weight_j)) * 100, 2)


def calculate_adaptive_thresholds(tokens_i: list, tokens_j: list) -> tuple[float, float]:
    """
    Dynamically adjusts High and Medium risk thresholds based on token length
    to prevent false positives on naturally concise DSA implementations.

    Returns:
        tuple[float, float]: (high_threshold, med_threshold)
    """
    avg_tokens = (len(tokens_i) + len(tokens_j)) / 2.0
    high_threshold = 90.0 if avg_tokens < 45 else 85.0
    med_threshold = 65.0 if avg_tokens < 45 else 60.0
    return high_threshold, med_threshold
