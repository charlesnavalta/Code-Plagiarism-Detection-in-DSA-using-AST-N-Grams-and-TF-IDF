"""
=============================================================================
FALSICODE: Multi-Class Plagiarism Taxonomy Classifier
=============================================================================
Categorizes flagged code pairs into Type 1 (Verbatim Copy), Type 2 (Renamed Identifiers),
or Type 3 (Reordered / Structurally Modified) plagiarism using multiset divergence
and sequence alignment metrics.
=============================================================================
"""

import difflib
from collections import Counter
from .metrics import (
    ORDER_SIMILARITY_THRESHOLD,
    RAW_IDENTITY_TYPE1_THRESHOLD,
    STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD,
    STRUCTURAL_IGNORE_TYPES,
    _get_raw_value
)


def get_raw_identity_signature(tokens: list, flagged_lines: set) -> list[str]:
    """
    Builds an ordered signature of actual identifier/literal values (not normalized AST labels)
    restricted to the flagged/matched lines to distinguish Type 1 (verbatim) from Type 2 (renamed).
    """
    sig = []
    for t in tokens:
        if t[1] in flagged_lines and t[0] in ("Name_ID", "Constant_CONST"):
            raw_val = _get_raw_value(t)
            sig.append(raw_val if raw_val is not None else t[0])
    return sig


def get_ordered_shared_sequence(tokens: list, shared_set: set, n: int) -> list[str]:
    """
    Slides a fixed window of length n across the token stream, recording in order
    every n-gram belonging to shared_set.difflib comparison reveals if code was
    reordered or interleaved with inserted/deleted statements (Type 3).
    """
    seq = []
    if n <= 0 or len(tokens) < n:
        return seq
    for k in range(len(tokens) - n + 1):
        ngram_str = " ".join([t[0].lower() for t in tokens[k:k + n]])
        if ngram_str in shared_set:
            seq.append(ngram_str)
    return seq


def get_structural_skeleton(tokens: list, flagged_lines: set = None) -> list[str]:
    """
    Builds the ordered sequence of AST node types (e.g. For, While, Call_CALL, Subscript),
    stripping out identifier and literal tokens. Retains all structural constructs
    (including unilateral insertions) to evaluate structural shape divergence.
    """
    if flagged_lines is not None:
        tokens = [t for t in tokens if t[1] in flagged_lines]
    return [t[0] for t in tokens if t[0] not in STRUCTURAL_IGNORE_TYPES]


def structural_divergence(skeleton_i: list, skeleton_j: list) -> float:
    """
    Compares two structural skeletons using multiset difference (type/count fingerprint)
    to detect control-flow modifications, loop conversions, and structural rewrites (Type 3).
    """
    fp_i, fp_j = Counter(skeleton_i), Counter(skeleton_j)
    all_types = set(fp_i) | set(fp_j)
    total = sum(max(fp_i.get(t, 0), fp_j.get(t, 0)) for t in all_types)
    if total == 0:
        return 0.0
    diff = sum(abs(fp_i.get(t, 0) - fp_j.get(t, 0)) for t in all_types)
    return round((diff / total) * 100, 2)


def detect_renamed_line_pairs(tokens_i: list, tokens_j: list, flagged_lines_i: set, flagged_lines_j: set):
    """
    Identifies lines within a Type 3 pair that also exhibit Type 2 (renamed identifier)
    characteristics — i.e. identical structural skeleton with altered variable/literal names.

    Returns:
        tuple[list[int], list[int]]: (renamed_lines_i, renamed_lines_j)
    """
    SKELETON_MATCH_THRESHOLD = 0.70
    RAW_DIFF_THRESHOLD = 0.75

    def tokens_by_line(tokens, flagged_set):
        by_line = {}
        for t in tokens:
            ln = t[1]
            if ln in flagged_set:
                by_line.setdefault(ln, []).append(t)
        return by_line

    lines_map_i = tokens_by_line(tokens_i, flagged_lines_i)
    lines_map_j = tokens_by_line(tokens_j, flagged_lines_j)

    if not lines_map_i or not lines_map_j:
        return [], []

    def line_skeleton(line_tokens):
        return [t[0] for t in line_tokens if t[0] not in STRUCTURAL_IGNORE_TYPES]

    def line_raw_ids(line_tokens):
        result = []
        for t in line_tokens:
            if t[0] in ("Name_ID", "Constant_CONST"):
                raw = _get_raw_value(t)
                result.append(raw if raw is not None else t[0])
        return result

    renamed_i = set()
    renamed_j = set()

    j_data = {
        ln: (line_skeleton(toks), line_raw_ids(toks))
        for ln, toks in lines_map_j.items()
    }

    for ln_i, toks_i in lines_map_i.items():
        skel_i = line_skeleton(toks_i)
        raw_i = line_raw_ids(toks_i)

        if not skel_i:
            continue

        best_skel_ratio = 0.0
        best_ln_j = None
        best_raw_ratio = 0.0

        for ln_j, (skel_j, raw_j) in j_data.items():
            if not skel_j:
                continue
            skel_ratio = difflib.SequenceMatcher(None, skel_i, skel_j).ratio()
            if skel_ratio > best_skel_ratio:
                best_skel_ratio = skel_ratio
                best_ln_j = ln_j
                best_raw_ratio = (
                    difflib.SequenceMatcher(None, raw_i, raw_j).ratio()
                    if (raw_i or raw_j) else 1.0
                )

        if (best_ln_j is not None
                and best_skel_ratio >= SKELETON_MATCH_THRESHOLD
                and best_raw_ratio < RAW_DIFF_THRESHOLD):
            renamed_i.add(ln_i)
            renamed_j.add(best_ln_j)

    return list(renamed_i), list(renamed_j)


def classify_plagiarism_type(status: str, raw_identity_score: float, order_similarity_score: float, struct_divergence_score: float) -> str:
    """
    Assigns an exclusive single-label plagiarism classification:
    - 'Safe: Original Code' (Low tier)
    - 'Type 3: Modified Structure' (Reordered N-Grams or AST structural divergence)
    - 'Type 1: Exact Copy' (High raw token identity)
    - 'Type 2: Renamed Variables' (AST match with renamed variables)
    """
    if status == "Low":
        return "Safe: Original Code"

    if order_similarity_score < ORDER_SIMILARITY_THRESHOLD:
        return "Type 3: Modified Structure"

    if struct_divergence_score > STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD:
        return "Type 3: Modified Structure"

    if raw_identity_score >= RAW_IDENTITY_TYPE1_THRESHOLD:
        return "Type 1: Exact Copy"

    return "Type 2: Renamed Variables"
