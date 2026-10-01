"""
=============================================================================
FALSICODE: Explainable AI (XAI) Pattern & Line Extractor
=============================================================================
Extracts human-interpretable forensic evidence, line reverse-mapping,
and suspicious/unique AST N-Gram patterns for the instructor comparison UI and PDF report.
=============================================================================
"""

import numpy as np


def extract_lines_from_tfidf(tokens: list, shared_set: set, ngram_bounds: tuple) -> list[int]:
    """
    Reverse-maps flagged shared N-Grams back to original source code line numbers
    by sliding matching windows across the token stream.
    """
    highlighted_lines = set()
    for n in range(ngram_bounds[1], ngram_bounds[0] - 1, -1):
        for k in range(len(tokens) - n + 1):
            ngram_str = " ".join([t[0].lower() for t in tokens[k:k + n]])
            if ngram_str in shared_set:
                for t in tokens[k:k + n]:
                    if t[1] > 0:
                        highlighted_lines.add(t[1])
    return sorted(list(highlighted_lines))


def get_top_shared_patterns(tokens_for_case: list, shared_set: set, ngram_weight_map: dict, n_documents: int, ngram_size: int = 3) -> list[dict]:
    """
    Extracts and ranks the top shared AST N-Gram patterns by normalized TF-IDF weight.
    Returns a representative sample for UI rendering.
    """
    extracted_patterns = {}
    max_possible_idf = np.log(n_documents) + 1 if n_documents > 0 else 1.0

    for k in range(len(tokens_for_case) - ngram_size + 1):
        original_sequence = [t[0] for t in tokens_for_case[k:k + ngram_size]]
        ngram_str = " ".join(s.lower() for s in original_sequence)

        if ngram_str in shared_set and ngram_str not in extracted_patterns:
            real_weight = ngram_weight_map.get(ngram_str, 0.0)
            normalized_score = round((real_weight / max_possible_idf) * 100, 2) if max_possible_idf > 0 else 0

            extracted_patterns[ngram_str] = {
                "sequence": original_sequence,
                "weight": normalized_score,
                "is_shared": True
            }

    suspicious_patterns = sorted(extracted_patterns.values(), key=lambda x: x['weight'], reverse=True)
    total_patterns = len(suspicious_patterns)

    if total_patterns <= 40:
        return suspicious_patterns

    # Representative sample (Top 20, Middle 5, Bottom 5)
    representative_sample = suspicious_patterns[:20]
    mid_index = total_patterns // 2
    representative_sample.extend(suspicious_patterns[mid_index: mid_index + 5])
    representative_sample.extend(suspicious_patterns[-5:])
    return representative_sample


def get_top_unique_patterns(tokens_for_case: list, shared_set: set, all_ngram_set: set, ngram_weight_map: dict, n_documents: int, ngram_size: int = 3) -> list[dict]:
    """
    Extracts top distinct N-Gram patterns present in this file but NOT in the shared set
    (forensic evidence of algorithmic divergences).
    """
    extracted_patterns = {}
    max_possible_idf = np.log(n_documents) + 1 if n_documents > 0 else 1.0

    for k in range(len(tokens_for_case) - ngram_size + 1):
        original_sequence = [t[0] for t in tokens_for_case[k:k + ngram_size]]
        ngram_str = " ".join(s.lower() for s in original_sequence)

        if (ngram_str in all_ngram_set
                and ngram_str not in shared_set
                and ngram_str not in extracted_patterns):
            real_weight = ngram_weight_map.get(ngram_str, 0.0)
            normalized_score = round((real_weight / max_possible_idf) * 100, 2) if max_possible_idf > 0 else 0

            extracted_patterns[ngram_str] = {
                "sequence": original_sequence,
                "weight": normalized_score,
                "is_shared": False
            }

    unique_patterns = sorted(extracted_patterns.values(), key=lambda x: x['weight'], reverse=True)
    return unique_patterns[:8]
