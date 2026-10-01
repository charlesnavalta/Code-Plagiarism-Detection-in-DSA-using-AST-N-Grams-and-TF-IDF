"""
=============================================================================
FALSICODE: Pairwise AST N-Gram TF-IDF Similarity Comparator
=============================================================================
Coordinates TF-IDF vectorization, Cosine & Containment scoring, multi-class
plagiarism taxonomy assignment, and XAI evidence generation across student submissions.
=============================================================================
"""

import difflib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .metrics import (
    get_dynamic_df_bounds,
    compute_containment_score,
    calculate_adaptive_thresholds,
    _get_raw_value
)
from .classifier import (
    get_raw_identity_signature,
    get_ordered_shared_sequence,
    get_structural_skeleton,
    structural_divergence,
    detect_renamed_line_pairs,
    classify_plagiarism_type
)
from .xai import (
    extract_lines_from_tfidf,
    get_top_shared_patterns,
    get_top_unique_patterns
)


def compare_all_files(file_data: list[dict], ngram_bounds: tuple[int, int]) -> list[dict]:
    """
    Compares a batch of files using AST N-Grams, TF-IDF, and Cosine/Containment Similarity.
    Classifies each flagged pair as Type 1, Type 2, or Type 3 plagiarism with full XAI evidence.

    Args:
        file_data (list[dict]): List of dictionaries with 'name' (str), 'doc' (str),
                               'tokens' (list[tuple]), and optional 'raw_code' (str).
        ngram_bounds (tuple[int, int]): (min_n, max_n) N-Gram range, e.g. (3, 5).

    Returns:
        list[dict]: Sorted list of pairwise comparison results with forensic evidence.
    """
    if len(file_data) < 2:
        return []

    # =========================================================================
    # PHASE 1: PREPARATION & TF-IDF VECTORIZATION
    # =========================================================================
    documents = [f['doc'] for f in file_data]
    filenames = [f['name'] for f in file_data]
    tokens_list = [f['tokens'] for f in file_data]
    n_docs = len(documents)

    dynamic_max_df, dynamic_min_df = get_dynamic_df_bounds(n_docs)

    vectorizer = TfidfVectorizer(
        ngram_range=ngram_bounds,
        sublinear_tf=True,
        max_df=dynamic_max_df,
        min_df=dynamic_min_df
    )

    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
        sim_matrix = cosine_similarity(tfidf_matrix)

        feature_names = vectorizer.get_feature_names_out()
        idf_weights = vectorizer.idf_
        ngram_weight_map = dict(zip(feature_names, idf_weights))
        all_ngrams_set = set(feature_names)

        results = []

        # =========================================================================
        # PHASE 2: PAIRWISE COMPARISON & SCORING
        # =========================================================================
        for i in range(len(filenames)):
            for j in range(i + 1, len(filenames)):
                score = round(sim_matrix[i][j] * 100, 2)

                # Skip negligible overlap below 10% floor
                if score <= 10.0:
                    continue

                vec_i = tfidf_matrix[i].toarray()[0]
                vec_j = tfidf_matrix[j].toarray()[0]

                # =========================================================================
                # PHASE 3: CONTAINMENT SKELETON METRIC & ADAPTIVE GATING
                # =========================================================================
                containment_score = compute_containment_score(vec_i, vec_j, feature_names)

                len_i = len(tokens_list[i])
                len_j = len(tokens_list[j])
                size_ratio = max(len_i, len_j) / max(min(len_i, len_j), 1)

                if size_ratio >= 2.0:
                    final_score = max(score, containment_score)
                else:
                    final_score = score

                high_threshold, med_threshold = calculate_adaptive_thresholds(tokens_list[i], tokens_list[j])

                status = "Low"
                if final_score >= high_threshold:
                    status = "High"
                elif final_score >= med_threshold:
                    status = "Medium"

                # =========================================================================
                # PHASE 4: FORENSIC EVIDENCE EXTRACTION (LINES & N-GRAMS)
                # =========================================================================
                shared_ngrams = set()
                for idx in range(len(feature_names)):
                    if vec_i[idx] > 0 and vec_j[idx] > 0:
                        shared_ngrams.add(feature_names[idx])

                tokens_i = tokens_list[i]
                tokens_j = tokens_list[j]

                lines_i = extract_lines_from_tfidf(tokens_i, shared_ngrams, ngram_bounds)
                lines_j = extract_lines_from_tfidf(tokens_j, shared_ngrams, ngram_bounds)

                # =========================================================================
                # PHASE 5: FORENSIC METRICS & TAXONOMY CLASSIFICATION
                # =========================================================================
                flagged_lines_i = set(lines_i)
                flagged_lines_j = set(lines_j)

                sig_i = get_raw_identity_signature(tokens_i, flagged_lines_i)
                sig_j = get_raw_identity_signature(tokens_j, flagged_lines_j)

                if not sig_i and not sig_j:
                    sig_i = [
                        _get_raw_value(t) if _get_raw_value(t) is not None else t[0]
                        for t in tokens_i if t[0] in ("Name_ID", "Constant_CONST")
                    ]
                    sig_j = [
                        _get_raw_value(t) if _get_raw_value(t) is not None else t[0]
                        for t in tokens_j if t[0] in ("Name_ID", "Constant_CONST")
                    ]

                raw_identity_score = 0.0
                if sig_i or sig_j:
                    raw_identity_score = round(
                        difflib.SequenceMatcher(None, sig_i, sig_j).ratio() * 100, 2
                    )

                order_n = ngram_bounds[0]
                seq_i = get_ordered_shared_sequence(tokens_i, shared_ngrams, order_n)
                seq_j = get_ordered_shared_sequence(tokens_j, shared_ngrams, order_n)

                order_similarity_score = 100.0
                if seq_i or seq_j:
                    order_similarity_score = round(
                        difflib.SequenceMatcher(None, seq_i, seq_j).ratio() * 100, 2
                    )

                skeleton_i = get_structural_skeleton(tokens_i)
                skeleton_j = get_structural_skeleton(tokens_j)
                struct_divergence_score = structural_divergence(skeleton_i, skeleton_j)

                plagiarism_type = "Safe: Original Code"
                formatted_lines_i = []
                formatted_lines_j = []
                renamed_lines_i = []
                renamed_lines_j = []

                if status in ("High", "Medium"):
                    plagiarism_type = classify_plagiarism_type(
                        status, raw_identity_score, order_similarity_score, struct_divergence_score
                    )

                    # Format match numeric type for frontend
                    match_type_num = 1
                    if "Type 2" in plagiarism_type:
                        match_type_num = 2
                    elif "Type 3" in plagiarism_type:
                        match_type_num = 3

                    # PHASE 5b: Mixed-attack line detection
                    if "Type 3" in plagiarism_type and lines_i and lines_j:
                        renamed_lines_i, renamed_lines_j = detect_renamed_line_pairs(
                            tokens_i, tokens_j, set(lines_i), set(lines_j)
                        )

                    renamed_set_i = set(renamed_lines_i)
                    renamed_set_j = set(renamed_lines_j)

                    formatted_lines_i = [
                        {"line": ln, "type": 2 if ln in renamed_set_i else match_type_num}
                        for ln in lines_i if ln > 0
                    ]
                    formatted_lines_j = [
                        {"line": ln, "type": 2 if ln in renamed_set_j else match_type_num}
                        for ln in lines_j if ln > 0
                    ]

                # =========================================================================
                # PHASE 6: XAI FORENSIC PATTERNS
                # =========================================================================
                top_shared_patterns = get_top_shared_patterns(
                    tokens_i, shared_ngrams, ngram_weight_map, n_docs, ngram_size=3
                )
                top_unique_patterns_i = get_top_unique_patterns(
                    tokens_i, shared_ngrams, all_ngrams_set, ngram_weight_map, n_docs, ngram_size=3
                )
                top_unique_patterns_j = get_top_unique_patterns(
                    tokens_j, shared_ngrams, all_ngrams_set, ngram_weight_map, n_docs, ngram_size=3
                )

                results.append({
                    "file1": filenames[i],
                    "file2": filenames[j],
                    "score": final_score,
                    "status": status,
                    "plagiarism_type": plagiarism_type,
                    "raw_identity_score": raw_identity_score,
                    "order_similarity_score": order_similarity_score,
                    "struct_divergence_score": struct_divergence_score,
                    "renamed_line_count": len(renamed_lines_i),
                    "lines1": formatted_lines_i,
                    "lines2": formatted_lines_j,
                    "ast_xai_1": top_shared_patterns,
                    "ast_xai_2": top_shared_patterns,
                    "ast_unique_1": top_unique_patterns_i,
                    "ast_unique_2": top_unique_patterns_j
                })

        return sorted(results, key=lambda x: x['score'], reverse=True)

    except ValueError as e:
        print(f"TF-IDF Vectorizer Warning: {str(e)}")
        return []
    except Exception as e:
        print(f"Comparison Error: {str(e)}")
        return []
