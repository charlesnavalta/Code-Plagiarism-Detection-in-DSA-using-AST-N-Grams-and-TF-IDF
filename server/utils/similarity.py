import difflib
from collections import Counter

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# =========================================================================
# CLASSIFICATION THRESHOLDS (tune these against a labeled corpus)
# =========================================================================
# Below this, we don't even bother computing a plagiarism type ("Low" tier).
# Above it, we run the Type 1/2/3 classifier.
#
# ORDER_SIMILARITY_THRESHOLD: how much the relative ORDER of shared n-grams
# must be preserved between the two files before we consider it "structurally
# linear" (i.e. not reordered/inserted/deleted). Below this -> Type 3.
#
# RAW_IDENTITY_TYPE1_THRESHOLD: how similar the actual variable names/literals
# must be (in the matched region) before we call it verbatim copying (Type 1)
# rather than renamed (Type 2).
#
# STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD: how much the AST *node-type* skeleton
# (control flow, calls, subscripts, etc - excluding identifier/literal names)
# is allowed to differ between the two files before we call it a structural
# rewrite (Type 3) rather than a same-shape rename (Type 2). Calibrated
# against labeled pairs: a pure rename produces ~0% divergence; a for->while
# rewrite or an added range()/subscript indirection produces 20-50%+.
ORDER_SIMILARITY_THRESHOLD = 80
RAW_IDENTITY_TYPE1_THRESHOLD = 75
STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD = 7.5

# Token types that encode identifier/literal identity rather than code
# structure. These are excluded when building a structural skeleton, since
# renaming a variable should never by itself count as a structural change.
STRUCTURAL_IGNORE_TYPES = {"Name_ID", "Constant_CONST"}


def _get_raw_value(token):
    """Safely pulls the raw identifier/literal value from a token tuple.
    Supports both the new 3-tuple (token_str, lineno, raw_value) and the
    legacy 2-tuple (token_str, lineno) format, so this won't crash if one
    of the engines hasn't been updated yet."""
    if len(token) > 2:
        return token[2]
    return None


def get_raw_identity_signature(tokens, flagged_lines):
    """Builds an ordered signature of actual identifier/literal values
    (not the normalized AST label) restricted to the flagged/matched lines.
    This is what lets us tell Type 1 (verbatim) apart from Type 2 (renamed),
    since the normalized token stream is identical for both."""
    sig = []
    for t in tokens:
        if t[1] in flagged_lines and t[0] in ("Name_ID", "Constant_CONST"):
            raw_val = _get_raw_value(t)
            sig.append(raw_val if raw_val is not None else t[0])
    return sig


def get_ordered_shared_sequence(tokens, shared_set, n):
    """Slides a fixed-size window of length n across the token stream and
    records, IN ORDER, every n-gram that's a member of shared_set. Comparing
    this ordered sequence between two files (via difflib) tells us whether
    the shared content appears in the same relative order in both files, or
    whether it's been reordered / interleaved with inserted-deleted material
    (the hallmark of Type 3 plagiarism)."""
    seq = []
    if n <= 0 or len(tokens) < n:
        return seq
    for k in range(len(tokens) - n + 1):
        ngram_str = " ".join([t[0].lower() for t in tokens[k:k + n]])
        if ngram_str in shared_set:
            seq.append(ngram_str)
    return seq


def get_structural_skeleton(tokens, flagged_lines=None):
    """Builds the ordered sequence of AST node TYPES (e.g. For, While, Call_CALL,
    Subscript) restricted to the flagged/matched lines, with identifier and
    literal tokens stripped out.

    This is the counterpart to get_raw_identity_signature: that function looks
    at *what the names/values are* (Type 1 vs Type 2), this one looks at *what
    shape the code takes* (Type 2 vs Type 3). Unlike get_ordered_shared_sequence,
    this is NOT filtered down to only shared n-grams first - it keeps every
    structural token, including ones that only appear in one file. That's
    deliberate: an inserted range()/subscript/while-loop that only exists in
    one file is exactly the signal we need, and pre-filtering to shared n-grams
    (as the order-similarity signal does) throws that signal away before we
    ever get to look at it.
    """
    if flagged_lines is not None:
        tokens = [t for t in tokens if t[1] in flagged_lines]
    return [t[0] for t in tokens if t[0] not in STRUCTURAL_IGNORE_TYPES]


def structural_divergence(skeleton_i, skeleton_j):
    """Compares two structural skeletons using a type/count fingerprint
    (a multiset difference) rather than a sequence-alignment ratio.

    Why not just diff the sequences? Because difflib's ratio is forgiving of
    insertions in short files - two skeletons that share a long common
    subsequence can score 85-90% "similar" even when one of them has extra
    control-flow nodes (an added while-loop, an added subscript/range() call)
    that the other doesn't have at all. Counting *how many* of each node type
    exist in each file and comparing the multisets catches that directly:
    a pure rename produces a perfect type/count match (0% divergence), while
    any added/removed/swapped control-flow construct shows up immediately as
    a count mismatch, regardless of where in the sequence it sits.
    """
    fp_i, fp_j = Counter(skeleton_i), Counter(skeleton_j)
    all_types = set(fp_i) | set(fp_j)
    total = sum(max(fp_i.get(t, 0), fp_j.get(t, 0)) for t in all_types)
    if total == 0:
        return 0.0
    diff = sum(abs(fp_i.get(t, 0) - fp_j.get(t, 0)) for t in all_types)
    return round((diff / total) * 100, 2)


def classify_plagiarism_type(status, raw_identity_score, order_similarity_score, struct_divergence_score):
    """Exclusive single-label classification: every pair gets exactly one
    of Type 1, Type 2, Type 3, or N/A.

    Order matters here: we check structural reordering/rewriting FIRST. If
    the shared content has been reordered, split up, interleaved with
    inserted/deleted statements (order_similarity_score), OR the AST
    skeleton itself has diverged - control flow added/removed/swapped, like
    for-loop -> while-loop, or a direct iteration rewritten with an added
    range()/subscript indirection (struct_divergence_score) - that's a
    stronger/more specific signal than naming similarity, so it takes
    precedence over the Type 1 vs Type 2 distinction.
    """
    if status == "Low":
        return "N/A"

    if order_similarity_score < ORDER_SIMILARITY_THRESHOLD:
        return "Type 3 (Reordered / Structurally Modified)"

    if struct_divergence_score > STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD:
        return "Type 3 (Reordered / Structurally Modified)"

    if raw_identity_score >= RAW_IDENTITY_TYPE1_THRESHOLD:
        return "Type 1 (Verbatim / Near-Identical Copy)"

    return "Type 2 (Renamed Identifiers/Literals)"


def compare_all_files(file_data, ngram_bounds):
    """
    Compares a batch of files using AST N-Grams, TF-IDF, and Cosine Similarity to detect structural plagiarism.
    Additionally classifies each flagged pair as Type 1, Type 2, or Type 3 plagiarism.

    Args:
        file_data (list): A list of dictionaries containing 'name' (filename), 'doc' (space-separated AST tokens),
                        and 'tokens' (raw token list with line numbers, and where available, raw identifier/literal values).
        ngram_bounds (tuple): A tuple like (3, 5) defining the min and max N-Gram sizes.

    Returns:
        list: A sorted list of dictionaries containing pairwise comparison results, scores, plagiarism type, and forensic evidence.
    """
    if len(file_data) < 2:
        return []

    # =========================================================================
    # PHASE 1: PREPARATION & TF-IDF VECTORIZATION
    # =========================================================================
    documents = [f['doc'] for f in file_data]
    filenames = [f['name'] for f in file_data]
    tokens_list = [f['tokens'] for f in file_data]

    # Dynamic min_df / max_df: both values must be set together so that
    # sklearn's constraint (effective max_df docs >= min_df docs) is never
    # violated, regardless of batch size.
    #
    # The math for a proportion-based max_df is: effective_max = floor(max_df * n).
    # If floor(max_df * n) < min_df, sklearn raises a ValueError and the entire
    # comparison silently returns [] — every pair becomes "Non-Plagiarized".
    #
    # Tier breakdown:
    #   n == 2  (isolated pair / benchmark) — no proportion filtering is
    #           mathematically safe; use raw overlap and rely on score thresholds.
    #   3–5     (small group / topic batch) — activate boilerplate suppression
    #           at 85% so floor(0.85*3)=2 >= min_df=2.
    #   > 5     (full classroom run) — tighter 80% filter; floor(0.80*6)=4 >= 2.
    n_docs = len(documents)
    if n_docs <= 2:
        # 2-doc batch: proportion filtering always collapses to ≤1 doc,
        # which is below any meaningful min_df. Disable both filters.
        dynamic_max_df = 1.0
        dynamic_min_df = 1
    elif n_docs <= 5:
        # Small batch: boilerplate suppression active; floor(0.85*3)=2 == min_df
        dynamic_max_df = 0.85
        dynamic_min_df = 2
    else:
        # Full classroom: tighter filter; floor(0.80*6)=4 > min_df=2
        dynamic_max_df = 0.80
        dynamic_min_df = 2

    # Initialize the TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(
        ngram_range=ngram_bounds,
        sublinear_tf=True,        # Sublinear TF scaling: 1 + log(tf) dampens high-frequency tokens
        max_df=dynamic_max_df,    # Suppress near-universal boilerplate n-grams
        min_df=dynamic_min_df     # Exclude singleton n-grams to avoid phantom high-IDF features
    )

    try:
        # Fit the documents into a sparse mathematical matrix and calculate standard cosine similarity
        tfidf_matrix = vectorizer.fit_transform(documents)
        sim_matrix = cosine_similarity(tfidf_matrix)

        # Extract feature (N-Gram) names and their corresponding Inverse Document Frequency (IDF) weights
        feature_names = vectorizer.get_feature_names_out()
        idf_weights = vectorizer.idf_
        ngram_weight_map = dict(zip(feature_names, idf_weights))

        results = []

        # =========================================================================
        # PHASE 2: PAIRWISE COMPARISON & SCORING
        # =========================================================================
        for i in range(len(filenames)):
            for j in range(i + 1, len(filenames)):
                # Base Cosine Similarity Score (0 to 100%)
                score = round(sim_matrix[i][j] * 100, 2)

                # Only enter the forensic pipeline if the raw cosine score
                # is above a meaningful floor. With TF-IDF on small batches,
                # a score > 0 is almost always true for same-prompt DSA
                # submissions — even completely innocent pairs share enough
                # structural tokens to produce a non-zero dot product.
                # A floor of 10% filters genuine noise before any of the
                # expensive containment / type-classification work runs.
                if score > 10.0:
                    # Convert sparse matrix rows to standard arrays for direct mathematical manipulation
                    vec_i = tfidf_matrix[i].toarray()[0]
                    vec_j = tfidf_matrix[j].toarray()[0]

                    # =========================================================================
                    # PHASE 3: CONTAINMENT SKELETON METRIC
                    # =========================================================================
                    # Containment catches cases where File A is small and File B is huge,
                    # but File B fully contains File A's logic (cosine understimates this).
                    weight_i = np.sum(vec_i)
                    weight_j = np.sum(vec_j)

                    # Calculate the shared weight by taking the minimum value of each shared feature vector
                    shared_weight = np.sum([min(vec_i[idx], vec_j[idx]) for idx in range(len(feature_names))])

                    if min(weight_i, weight_j) > 0:
                        containment_score = round((shared_weight / min(weight_i, weight_j)) * 100, 2)
                    else:
                        containment_score = 0.0

                    # Containment is only used as the deciding score when there is a
                    # significant size disparity between the two files (one file is at
                    # least 2x the length of the other). For same-prompt DSA submissions
                    # of comparable size, students naturally share most of the smaller
                    # file's structural patterns — not because of plagiarism but because
                    # the assignment requires the same algorithm. In that case, using
                    # max(cosine, containment) artificially inflates innocent pairs to
                    # "High" or "Medium" status. When files are similarly sized, cosine
                    # similarity alone is the more reliable signal.
                    len_i = len(tokens_list[i])
                    len_j = len(tokens_list[j])
                    size_ratio = max(len_i, len_j) / max(min(len_i, len_j), 1)
                    if size_ratio >= 2.0:
                        # True size-asymmetric case: containment override is meaningful
                        final_score = max(score, containment_score)
                    else:
                        # Files are similar in length: stick with cosine similarity
                        final_score = score

                    # Adaptive risk thresholds calibrated for DSA same-prompt submissions.
                    # Students solving the same BST / linked-list / sort problem will have
                    # a high natural structural overlap that is innocent. Thresholds are
                    # raised above the generic defaults to account for this baseline:
                    #   - Short code (<45 tokens): raise both gates by +5 points
                    #   - Standard code: High=85, Medium=60 (vs old 80/50)
                    avg_tokens = (len(tokens_list[i]) + len(tokens_list[j])) / 2.0
                    high_threshold = 90.0 if avg_tokens < 45 else 85.0
                    med_threshold  = 65.0 if avg_tokens < 45 else 60.0

                    # Assign a strict classification tier
                    status = "Low"
                    if final_score >= high_threshold:
                        status = "High"
                    elif final_score >= med_threshold:
                        status = "Medium"

                    # =========================================================================
                    # PHASE 4: FORENSIC EVIDENCE EXTRACTION (LINES & N-GRAMS)
                    # =========================================================================
                    # Find exactly which N-Gram tokens both files shared
                    shared_ngrams = set()
                    for idx in range(len(feature_names)):
                        if vec_i[idx] > 0 and vec_j[idx] > 0:
                            shared_ngrams.add(feature_names[idx])

                    tokens_i = tokens_list[i]
                    tokens_j = tokens_list[j]

                    # Helper function to reverse-map flagged N-Grams back to original source code line numbers
                    def extract_lines_from_tfidf(tokens, shared_set):
                        highlighted_lines = set()
                        # Slide a window across the tokens to rebuild the exact N-Grams
                        for n in range(ngram_bounds[1], ngram_bounds[0] - 1, -1):
                            for k in range(len(tokens) - n + 1):
                                ngram_str = " ".join([t[0].lower() for t in tokens[k:k+n]])
                                if ngram_str in shared_set:
                                    for t in tokens[k:k+n]:
                                        highlighted_lines.add(t[1])  # Add the line number (t[1]) to the highlight set
                        return list(highlighted_lines)

                    lines_i = extract_lines_from_tfidf(tokens_i, shared_ngrams)
                    lines_j = extract_lines_from_tfidf(tokens_j, shared_ngrams)

                    # =========================================================================
                    # PHASE 5: TYPE 1 / 2 / 3 CLASSIFICATION
                    # =========================================================================
                    plagiarism_type = "N/A"
                    raw_identity_score = 0.0
                    order_similarity_score = 0.0
                    struct_divergence_score = 0.0

                    if status in ("High", "Medium"):
                        # --- Raw identity signal (Type 1 vs Type 2) ---
                        flagged_lines_i = set(lines_i)
                        flagged_lines_j = set(lines_j)

                        sig_i = get_raw_identity_signature(tokens_i, flagged_lines_i)
                        sig_j = get_raw_identity_signature(tokens_j, flagged_lines_j)

                        # Fall back to whole-file raw signature if the flagged region
                        # produced no Name/Constant tokens (rare, but possible for tiny snippets)
                        if not sig_i and not sig_j:
                            sig_i = [
                                _get_raw_value(t) if _get_raw_value(t) is not None else t[0]
                                for t in tokens_i if t[0] in ("Name_ID", "Constant_CONST")
                            ]
                            sig_j = [
                                _get_raw_value(t) if _get_raw_value(t) is not None else t[0]
                                for t in tokens_j if t[0] in ("Name_ID", "Constant_CONST")
                            ]

                        if sig_i or sig_j:
                            raw_identity_score = round(
                                difflib.SequenceMatcher(None, sig_i, sig_j).ratio() * 100, 2
                            )

                        # --- Order/sequence signal (Type 3, catches reordering/interleaving) ---
                        # Use the finest n-gram granularity for the most sensitive
                        # reordering signal.
                        order_n = ngram_bounds[0]
                        seq_i = get_ordered_shared_sequence(tokens_i, shared_ngrams, order_n)
                        seq_j = get_ordered_shared_sequence(tokens_j, shared_ngrams, order_n)

                        if seq_i or seq_j:
                            order_similarity_score = round(
                                difflib.SequenceMatcher(None, seq_i, seq_j).ratio() * 100, 2
                            )
                        else:
                            # No matches at the finest granularity (unlikely given score > 0
                            # at coarser n-gram sizes) — default to "aligned" so we don't
                            # falsely trigger Type 3 on a data quirk.
                            order_similarity_score = 100.0

                        # --- Structural skeleton signal (Type 3, catches control-flow rewrites) ---
                        # Uses full structural skeletons (excluding identifier/literal tokens)
                        # so that structural insertions, deleted blocks, and loop conversions
                        # are accurately measured.
                        skeleton_i = get_structural_skeleton(tokens_i)
                        skeleton_j = get_structural_skeleton(tokens_j)

                        struct_divergence_score = structural_divergence(skeleton_i, skeleton_j)

                        plagiarism_type = classify_plagiarism_type(
                            status, raw_identity_score, order_similarity_score, struct_divergence_score
                        )

                    # --- Format numeric match type for the frontend ---
                    match_type_num = 1
                    if "Type 2" in plagiarism_type:
                        match_type_num = 2
                    elif "Type 3" in plagiarism_type:
                        match_type_num = 3

                    formatted_lines_i = [{"line": ln, "type": match_type_num} for ln in lines_i]
                    formatted_lines_j = [{"line": ln, "type": match_type_num} for ln in lines_j]

                    # =========================================================================
                    # PHASE 6: XAI (EXPLAINABLE AI) PATTERN SAMPLING
                    # =========================================================================
                    # Helper function to format the top mathematical patterns for the PDF/UI
                    def get_top_shared_patterns(tokens_for_case, shared_set, ngram_size=3):
                        extracted_patterns = {}
                        max_possible_idf = np.log(len(documents)) + 1

                        for k in range(len(tokens_for_case) - ngram_size + 1):
                            original_sequence = [t[0] for t in tokens_for_case[k:k+ngram_size]]
                            ngram_str = " ".join(s.lower() for s in original_sequence)

                            # If it's a shared pattern, normalize its TF-IDF weight so the UI can display it
                            if ngram_str in shared_set and ngram_str not in extracted_patterns:
                                real_weight = ngram_weight_map.get(ngram_str, 0.0)
                                normalized_score = round((real_weight / max_possible_idf) * 100, 2) if max_possible_idf > 0 else 0

                                extracted_patterns[ngram_str] = {
                                    "sequence": original_sequence,
                                    "weight": normalized_score,
                                    "is_shared": True
                                }

                        # Sort patterns by their mathematical weight (highest risk first)
                        suspicious_patterns = sorted(extracted_patterns.values(), key=lambda x: x['weight'], reverse=True)
                        total_patterns = len(suspicious_patterns)

                        # Return everything if it's small enough for the UI to handle smoothly
                        if total_patterns <= 40:
                            return suspicious_patterns

                        # Otherwise, create a representative sample (Top 20, Middle 5, Bottom 5)
                        representative_sample = suspicious_patterns[:20]
                        mid_index = total_patterns // 2
                        representative_sample.extend(suspicious_patterns[mid_index : mid_index + 5])
                        representative_sample.extend(suspicious_patterns[-5:])

                        return representative_sample

                    # Extract the structured XAI data for the React frontend
                    top_shared_patterns = get_top_shared_patterns(tokens_i, shared_ngrams, ngram_size=3)

                    # Append the final, highly structured forensic package to the results array
                    results.append({
                        "file1": filenames[i],
                        "file2": filenames[j],
                        "score": final_score,
                        "status": status,
                        "plagiarism_type": plagiarism_type,
                        "raw_identity_score": raw_identity_score,
                        "order_similarity_score": order_similarity_score,
                        "struct_divergence_score": struct_divergence_score,
                        "lines1": formatted_lines_i,
                        "lines2": formatted_lines_j,
                        "ast_xai_1": top_shared_patterns,
                        "ast_xai_2": top_shared_patterns
                    })

        # Sort the final results from highest plagiarism score to lowest
        return sorted(results, key=lambda x: x['score'], reverse=True)

    except ValueError as e:
        print(f"TF-IDF Vectorizer Warning: {str(e)}")
        return []
    except Exception as e:
        print(f"Comparison Error: {str(e)}")
        return []