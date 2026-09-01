"""
=============================================================================
FALSICODE: Code Plagiarism Detection System
Algorithmic Benchmark & Statistical Accuracy Evaluation Script
=============================================================================
Evaluates both:
  1. Primary Binary Detection (Plagiarized vs. Non-Plagiarized)
  2. Multi-Class Taxonomy Classification (Type 1, Type 2, Type 3)
on the ground-truth labeled DSA benchmark datasets using purely deterministic
NLP, AST parsing, N-Grams, and TF-IDF formulas (No Machine Learning).
=============================================================================
"""

import os
import sys

# Ensure UTF-8 output on Windows console
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from utils.python_engine import process_python_file
from utils.java_engine import process_java_file
from utils.similarity import compare_all_files

BENCHMARK_TOPICS = [
    "binary_search_tree",
    "binary_tree",
    "linked_list",
    "merge_sort",
    "quick_sort",
    "exact_copy_testing",
]

CLASSES = ["Type 1", "Type 2", "Type 3", "Non-Plagiarized"]


def get_ground_truth(filename):
    """Determines ground truth plagiarism class from the filename pattern."""
    fn_lower = filename.lower()
    if "type_1" in fn_lower or "exact_copy" in fn_lower:
        return "Type 1"
    elif "type_2" in fn_lower or "renamed" in fn_lower:
        return "Type 2"
    elif "type_3" in fn_lower or "structural" in fn_lower or "rearranged" in fn_lower:
        return "Type 3"
    elif "orig" in fn_lower:
        return "Baseline"
    return "Unknown"


def run_benchmark_for_language(language="python"):
    """Evaluates labeled benchmark datasets for a specified language.

    Loads all files in each topic together as a single batch so TF-IDF has a
    real corpus context (IDF is computed across the full topic, not just 2 files).
    This is the correct simulation of how compare_all_files runs in production
    (all classroom submissions together), and it lets min_df / max_df work as
    intended.
    """
    lang_folder = "python_source-code" if language == "python" else "java_source-code"
    base_path = os.path.join(BASE_DIR, "datasets", lang_folder)
    ext = ".py" if language == "python" else ".java"
    preprocess_fn = process_python_file if language == "python" else process_java_file
    ngram_bounds = (3, 5)

    confusion_matrix = {actual: {pred: 0 for pred in CLASSES} for actual in CLASSES}
    detailed_results = []

    # -------------------------------------------------------------------------
    # POSITIVE PAIRS: within-topic batch evaluation
    # -------------------------------------------------------------------------
    # Load every topic's files together into one compare_all_files call so that
    # TF-IDF has a meaningful corpus (5-7 files) and IDF weights are sensible.
    # We then look up only the (orig, clone) pairwise result we care about.
    # -------------------------------------------------------------------------
    baseline_files = {}   # topic -> (orig_name, orig_path)

    for topic in BENCHMARK_TOPICS:
        topic_path = os.path.join(base_path, topic)
        if not os.path.exists(topic_path):
            continue

        files = [f for f in os.listdir(topic_path) if f.endswith(ext)]
        orig_candidates = [f for f in files if "orig" in f.lower()]
        orig = orig_candidates[0] if orig_candidates else files[0]
        baseline_files[topic] = (orig, os.path.join(topic_path, orig))

        # Build the full batch for this topic (orig + all variants)
        batch_file_data = []
        for fname in files:
            fpath = os.path.join(topic_path, fname)
            try:
                with open(fpath, "r", encoding="utf-8", errors="ignore") as fh:
                    content = fh.read()
                if not content.strip():
                    continue
                doc_str, tokens = preprocess_fn(content)
                if doc_str and tokens:
                    batch_file_data.append({
                        "id": fname,
                        "name": fname,
                        "doc": doc_str,
                        "tokens": tokens,
                        "content": content,
                    })
            except Exception:
                continue

        if len(batch_file_data) < 2:
            continue

        # Run compare_all_files on the whole topic batch
        try:
            batch_results = compare_all_files(batch_file_data, ngram_bounds)
        except Exception:
            batch_results = []

        # Build a lookup: frozenset({name_a, name_b}) -> result dict
        result_lookup = {}
        for r in batch_results:
            key = frozenset({r["file1"], r["file2"]})
            result_lookup[key] = r

        # Now score each (orig, clone) pair using the batch result
        for fname in files:
            if fname == orig:
                continue
            gt = get_ground_truth(fname)
            if gt not in ["Type 1", "Type 2", "Type 3"]:
                continue

            pair_key = frozenset({orig, fname})
            sim_res = result_lookup.get(pair_key)

            if sim_res:
                status = sim_res.get("status", "Low")
                score = sim_res.get("score", 0.0)
                plag_type_str = sim_res.get("plagiarism_type", "N/A")

                if status == "Low" or score < 25.0 or plag_type_str == "N/A":
                    predicted = "Non-Plagiarized"
                elif "Type 1" in plag_type_str:
                    predicted = "Type 1"
                elif "Type 2" in plag_type_str:
                    predicted = "Type 2"
                elif "Type 3" in plag_type_str:
                    predicted = "Type 3"
                else:
                    predicted = "Non-Plagiarized"

                score_out = score
            else:
                predicted = "Non-Plagiarized"
                score_out = 0.0

            confusion_matrix[gt][predicted] += 1
            detailed_results.append({
                "pair": f"{orig} <=> {fname}",
                "actual": gt,
                "predicted": predicted,
                "score": score_out,
                "correct": (gt == predicted),
            })

    # -------------------------------------------------------------------------
    # NEGATIVE CONTROLS: cross-topic baseline comparisons
    # -------------------------------------------------------------------------
    # Evaluate each cross-topic pair as its own 2-file batch. Since these are
    # structurally different algorithms (BST vs merge sort) the cosine score is
    # expected to be low and the high/med thresholds will catch them correctly.
    # -------------------------------------------------------------------------
    distinct_topics = [t for t in baseline_files.keys() if t != "exact_copy_testing"]
    for i in range(len(distinct_topics)):
        for j in range(i + 1, len(distinct_topics)):
            t1, t2 = distinct_topics[i], distinct_topics[j]
            orig1, path1 = baseline_files[t1]
            orig2, path2 = baseline_files[t2]

            try:
                with open(path1, "r", encoding="utf-8", errors="ignore") as fa:
                    content_a = fa.read()
                with open(path2, "r", encoding="utf-8", errors="ignore") as fb:
                    content_b = fb.read()

                doc_a, tokens_a = preprocess_fn(content_a)
                doc_b, tokens_b = preprocess_fn(content_b)

                file_data = [
                    {"id": 1, "name": f"{t1}/{orig1}", "doc": doc_a, "tokens": tokens_a, "content": content_a},
                    {"id": 2, "name": f"{t2}/{orig2}", "doc": doc_b, "tokens": tokens_b, "content": content_b},
                ]

                results = compare_all_files(file_data, ngram_bounds)
                if results:
                    sim_res = results[0]
                    status = sim_res.get("status", "Low")
                    score = sim_res.get("score", 0.0)
                    plag_type_str = sim_res.get("plagiarism_type", "N/A")

                    if status == "Low" or score < 25.0 or plag_type_str == "N/A":
                        predicted = "Non-Plagiarized"
                    elif "Type 1" in plag_type_str:
                        predicted = "Type 1"
                    elif "Type 2" in plag_type_str:
                        predicted = "Type 2"
                    elif "Type 3" in plag_type_str:
                        predicted = "Type 3"
                    else:
                        predicted = "Non-Plagiarized"
                    score_out = score
                else:
                    predicted = "Non-Plagiarized"
                    score_out = 0.0

            except Exception:
                predicted = "Non-Plagiarized"
                score_out = 0.0

            confusion_matrix["Non-Plagiarized"][predicted] += 1
            detailed_results.append({
                "pair": f"{t1}/{orig1} <=> {t2}/{orig2}",
                "actual": "Non-Plagiarized",
                "predicted": predicted,
                "score": score_out,
                "correct": (predicted == "Non-Plagiarized"),
            })

    return confusion_matrix, detailed_results



def print_evaluation_report(language, matrix, detailed_results):
    """Computes and displays both Binary Detection and Taxonomy Classification metrics."""
    total_samples = len(detailed_results)

    # -------------------------------------------------------------------------
    # PART 1: BINARY PLAGIARISM DETECTION (PLAGIARIZED vs. NON-PLAGIARIZED)
    # -------------------------------------------------------------------------
    bin_tp = 0
    bin_tn = 0
    bin_fp = 0
    bin_fn = 0

    for d in detailed_results:
        is_actual_plag = (d["actual"] != "Non-Plagiarized")
        is_pred_plag = (d["predicted"] != "Non-Plagiarized")

        if is_actual_plag and is_pred_plag:
            bin_tp += 1
        elif not is_actual_plag and not is_pred_plag:
            bin_tn += 1
        elif not is_actual_plag and is_pred_plag:
            bin_fp += 1
        elif is_actual_plag and not is_pred_plag:
            bin_fn += 1

    bin_acc = ((bin_tp + bin_tn) / total_samples * 100) if total_samples > 0 else 0.0
    bin_prec = (bin_tp / (bin_tp + bin_fp) * 100) if (bin_tp + bin_fp) > 0 else 0.0
    bin_rec = (bin_tp / (bin_tp + bin_fn) * 100) if (bin_tp + bin_fn) > 0 else 0.0
    bin_spec = (bin_tn / (bin_tn + bin_fp) * 100) if (bin_tn + bin_fp) > 0 else 0.0
    bin_f1 = (2 * bin_prec * bin_rec / (bin_prec + bin_rec)) if (bin_prec + bin_rec) > 0 else 0.0

    print("=" * 80)
    print(f"[REPORT] FALSICODE BENCHMARK EVALUATION REPORT: {language.upper()}")
    print("=" * 80)
    print(f"Total Test Pairs Evaluated: {total_samples}")

    print("\n" + "-" * 80)
    print("SECTION 1: PRIMARY PLAGIARISM DETECTION (PLAGIARIZED vs. HONEST)")
    print("-" * 80)
    print("Measures the system's ability to catch cheaters and clear honest students.")
    print(f"\n  * True Positives  (Cheating correctly caught) : {bin_tp}")
    print(f"  * True Negatives  (Honest code verified safe)   : {bin_tn}")
    print(f"  * False Positives (Honest code wrongly flagged) : {bin_fp}  <-- Critical for fair grading!")
    print(f"  * False Negatives (Cheating missed)             : {bin_fn}\n")

    print(f"  {'Metric':<25} | {'Value':<10} | {'Description'}")
    print(f"  {'-'*25}-|-{'-'*10}-|-{'-'*38}")
    print(f"  {'Precision (Trust)':<25} | {bin_prec:6.2f}%    | When flagged, likelihood it is real cheating")
    print(f"  {'Recall (Sensitivity)':<25} | {bin_rec:6.2f}%    | Percentage of all cheating caught")
    print(f"  {'Specificity (Fairness)':<25} | {bin_spec:6.2f}%    | Percentage of honest students protected")
    print(f"  {'F1-Score (Harmonic)':<25} | {bin_f1:6.2f}%    | Balanced harmonic mean of Precision & Recall")
    print(f"  {'Overall Detection Accuracy':<25} | {bin_acc:6.2f}%    | Total correct decisions ({bin_tp + bin_tn}/{total_samples})")

    # -------------------------------------------------------------------------
    # PART 2: TAXONOMY SUB-CLASSIFICATION (TYPE 1 vs. TYPE 2 vs. TYPE 3)
    # -------------------------------------------------------------------------
    print("\n" + "-" * 80)
    print("SECTION 2: PLAGIARISM TAXONOMY BREAKDOWN (TYPE 1 / 2 / 3)")
    print("-" * 80)
    print("Measures fine-grained classification of specific obfuscation techniques.")

    print("\n--- CONFUSION MATRIX (Rows: Actual Ground Truth, Columns: Predicted) ---")
    header = f"{'Actual \\ Predicted':<18} | " + " | ".join(f"{c:<16}" for c in CLASSES)
    print(header)
    print("-" * len(header))
    for actual in CLASSES:
        row = f"{actual:<18} | " + " | ".join(f"{matrix[actual][pred]:<16}" for pred in CLASSES)
        print(row)

    print("\n--- STATISTICAL METRICS PER PLAGIARISM CLASS ---")
    metric_header = f"{'Plagiarism Class':<18} | {'TP':<5} | {'FP':<5} | {'FN':<5} | {'TN':<5} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10}"
    print(metric_header)
    print("-" * len(metric_header))

    total_tp = 0
    class_metrics = {}
    for c in CLASSES:
        tp = matrix[c][c]
        fp = sum(matrix[other][c] for other in CLASSES if other != c)
        fn = sum(matrix[c][other] for other in CLASSES if other != c)
        tn = sum(matrix[o1][o2] for o1 in CLASSES for o2 in CLASSES if o1 != c and o2 != c)

        precision = (tp / (tp + fp) * 100) if (tp + fp) > 0 else 0.0
        recall = (tp / (tp + fn) * 100) if (tp + fn) > 0 else 0.0
        f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) > 0 else 0.0

        total_tp += tp
        class_metrics[c] = {"precision": precision, "recall": recall, "f1": f1}

        print(f"{c:<18} | {tp:<5} | {fp:<5} | {fn:<5} | {tn:<5} | {precision:6.2f}%    | {recall:6.2f}%    | {f1:6.2f}%")

    tax_accuracy = (total_tp / total_samples * 100) if total_samples > 0 else 0.0
    macro_f1 = sum(m["f1"] for m in class_metrics.values()) / len(CLASSES)

    print("-" * len(metric_header))
    print(f"Taxonomy Classification Accuracy : {tax_accuracy:.2f}%  ({total_tp}/{total_samples} exact taxonomy matches)")
    print(f"Macro-Averaged F1                : {macro_f1:.2f}%")
    print("=" * 80 + "\n")


def main():
    print("\n" + "#" * 80)
    print("  FALSICODE ALGORITHMIC BENCHMARK & ACCURACY EVALUATION")
    print("  (Deterministic AST + N-Grams + TF-IDF Ground-Truth Verification)")
    print("#" * 80 + "\n")

    # Run Python Benchmark
    py_matrix, py_details = run_benchmark_for_language("python")
    print_evaluation_report("Python", py_matrix, py_details)

    # Run Java Benchmark
    java_matrix, java_details = run_benchmark_for_language("java")
    print_evaluation_report("Java", java_matrix, java_details)


if __name__ == "__main__":
    main()
