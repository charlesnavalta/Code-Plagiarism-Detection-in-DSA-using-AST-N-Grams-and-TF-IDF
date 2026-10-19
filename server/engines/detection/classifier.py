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


def classify_pair_lines(
    tokens_i: list, tokens_j: list, lines_i: list, lines_j: list
) -> tuple[list[dict], list[dict]]:
    """
    Unified per-line forensic classifier used for ALL pair types (Safe, Type 1, 2, 3).

    Replaces the previous 'stamp every flagged line with the pair's overall type' approach.
    Each flagged line in i is individually matched to the best unclaimed line in j
    by skeleton similarity, then assigned its own type based on content and position evidence.

    Decision tree per line in i
    ──────────────────────────────────────────────────────────────────────────
    Step 1 — structural match
      best skeleton_ratio across unclaimed j-lines:
      < SKEL_MIN (0.70) ────────────────────────────► Type 3  (no structural peer
                                                              → structurally modified line)

    Step 2 — content identity (raw variable names / literals)
      raw_ratio >= TYPE1_RAW  (0.85) ──────────────► Type 1  (verbatim / near-identical line)
      raw_ratio <  TYPE2_RAW_MAX (0.65) ───────────► Type 2  (same AST shape, renamed vars)

    Step 3 — position delta (for ambiguous content in 0.65–0.85 band)
      |ln_i - ln_j| > POS_TOLERANCE (2) ──────────► Type 3  (reordered to different position)
      otherwise ───────────────────────────────────► Type 1  (same position, near-identical)

    J-lines not claimed by any i-line are stamped Type 3 (reordered / structurally unique).
    Lines with empty skeletons (pure keywords / braces only) are skipped.

    Returns:
        tuple[list[dict], list[dict]]: (formatted_lines_i, formatted_lines_j)
        each entry is {"line": int, "type": int (1, 2, or 3)}.
    """
    SKEL_MIN      = 0.70   # min skeleton similarity to consider a structural match
    TYPE1_RAW     = 0.85   # raw identity >= this  →  verbatim line (Type 1)
    TYPE2_RAW_MAX = 0.65   # raw identity <  this  →  renamed line  (Type 2)
    POS_TOLERANCE = 2      # line-number delta within which position is "the same"

    # ── helpers ──────────────────────────────────────────────────────────────
    def tokens_by_line(tokens, line_set):
        by_line = {}
        for t in tokens:
            ln = t[1]
            if ln in line_set:
                by_line.setdefault(ln, []).append(t)
        return by_line

    def line_skeleton(line_toks):
        return [t[0] for t in line_toks if t[0] not in STRUCTURAL_IGNORE_TYPES]

    def line_raw_ids(line_toks):
        result = []
        for t in line_toks:
            if t[0] in ("Name_ID", "Constant_CONST"):
                raw = _get_raw_value(t)
                result.append(raw if raw is not None else t[0])
        return result

    # ── build per-line token maps ─────────────────────────────────────────────
    set_i = set(ln for ln in lines_i if ln > 0)
    set_j = set(ln for ln in lines_j if ln > 0)

    map_i = tokens_by_line(tokens_i, set_i)
    map_j = tokens_by_line(tokens_j, set_j)

    if not map_i or not map_j:
        # No token data — fall back to stamping everything Type 3
        return (
            [{"line": ln, "type": 3} for ln in sorted(set_i)],
            [{"line": ln, "type": 3} for ln in sorted(set_j)]
        )

    j_data = {
        ln: (line_skeleton(toks), line_raw_ids(toks))
        for ln, toks in map_j.items()
    }

    annotated_i = {}  # ln_i → line type
    matched_j   = {}  # ln_j → line type
    claimed_j   = set()  # prevents a j-line from being matched by multiple i-lines

    # ── per-line matching (i-lines processed in ascending order) ─────────────
    for ln_i, toks_i in sorted(map_i.items()):
        skel_i = line_skeleton(toks_i)
        raw_i  = line_raw_ids(toks_i)

        if not skel_i:
            # Pure boilerplate (only keywords / punctuation) — skip
            continue

        # Step 1: find best unclaimed structural match in j
        best_skel_ratio = 0.0
        best_ln_j       = None

        for ln_j, (skel_j, _) in j_data.items():
            if not skel_j or ln_j in claimed_j:
                continue
            ratio = difflib.SequenceMatcher(None, skel_i, skel_j).ratio()
            if ratio > best_skel_ratio:
                best_skel_ratio = ratio
                best_ln_j       = ln_j

        if best_ln_j is None or best_skel_ratio < SKEL_MIN:
            # No structural peer found → structurally modified / inserted line
            annotated_i[ln_i] = 3
            continue

        # Step 2: raw content identity on the matched pair
        _, raw_j = j_data[best_ln_j]
        raw_ratio = (
            difflib.SequenceMatcher(None, raw_i, raw_j).ratio()
            if (raw_i or raw_j) else 1.0
        )

        # Step 3: decide line type
        if raw_ratio >= TYPE1_RAW:
            line_type = 1                               # verbatim / near-identical
        elif raw_ratio < TYPE2_RAW_MAX:
            line_type = 2                               # renamed identifiers
        elif abs(ln_i - best_ln_j) > POS_TOLERANCE:
            line_type = 3                               # reordered to different position
        else:
            line_type = 1                               # same position, similar content

        claimed_j.add(best_ln_j)
        annotated_i[ln_i]    = line_type
        matched_j[best_ln_j] = line_type

    # j-lines not claimed by any i-line → Type 3 (reordered / structurally unique)
    for ln_j in sorted(set_j):
        if ln_j not in matched_j:
            matched_j[ln_j] = 3

    fmt_i = [{"line": ln, "type": t} for ln, t in sorted(annotated_i.items())]
    fmt_j = [{"line": ln, "type": t} for ln, t in sorted(matched_j.items())]
    return fmt_i, fmt_j


def detect_renamed_line_pairs(tokens_i: list, tokens_j: list, flagged_lines_i: set, flagged_lines_j: set):
    """
    Legacy wrapper — kept for API compatibility.
    Delegates to classify_pair_lines() and returns only the renamed (Type 2) line numbers.
    """
    lines_i = sorted(flagged_lines_i)
    lines_j = sorted(flagged_lines_j)
    fmt_i, fmt_j = classify_pair_lines(tokens_i, tokens_j, lines_i, lines_j)
    renamed_i = [e["line"] for e in fmt_i if e["type"] == 2]
    renamed_j = [e["line"] for e in fmt_j if e["type"] == 2]
    return renamed_i, renamed_j


def classify_safe_pair_lines(
    tokens_i: list, tokens_j: list, lines_i: list, lines_j: list
) -> tuple[list[dict], list[dict]]:
    """
    Legacy wrapper — kept for API compatibility.
    Delegates to classify_pair_lines() and filters to Type 1/2 only (no Type 3 for Safe pairs).
    """
    fmt_i, fmt_j = classify_pair_lines(tokens_i, tokens_j, lines_i, lines_j)
    fmt_i = [e for e in fmt_i if e["type"] in (1, 2)]
    fmt_j = [e for e in fmt_j if e["type"] in (1, 2)]
    return fmt_i, fmt_j



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
