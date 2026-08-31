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
    """Evaluates labeled benchmark datasets for a specified language."""
    lang_folder = "python_source-code" if language == "python" else "java_source-code"
    base_path = os.path.join(BASE_DIR, "datasets", lang_folder)
    ext = ".py" if language == "python" else ".java"
    preprocess_fn = process_python_file if language == "python" else process_java_file

    pairs_to_test = []
    baseline_files = {}

    # 1. Collect within-topic clone pairs (Positive Plagiarism Pairs)
    for topic in BENCHMARK_TOPICS:
        topic_path = os.path.join(base_path, topic)
        if not os.path.exists(topic_path):
            continue

        files = [f for f in os.listdir(topic_path) if f.endswith(ext)]
        # Find baseline original
        orig_candidates = [f for f in files if "orig" in f.lower()]
        if not orig_candidates:
            orig = files[0]
        else:
            orig = orig_candidates[0]

        baseline_files[topic] = (orig, os.path.join(topic_path, orig))

        for f in files:
            if f == orig:
                continue
            gt = get_ground_truth(f)
            if gt in ["Type 1", "Type 2", "Type 3"]:
                pairs_to_test.append({
                    "topic": topic,
                    "file_a_name": orig,
                    "file_a_path": os.path.join(topic_path, orig),
                    "file_b_name": f,
                    "file_b_path": os.path.join(topic_path, f),
                    "ground_truth": gt
                })

    # 2. Collect cross-topic distinct algorithm pairs (Negative Non-Plagiarized Controls)
    # Exclude exact_copy_testing from cross-topic comparisons as its code is a clone of binary_search_tree
    distinct_topics = [t for t in baseline_files.keys() if t != "exact_copy_testing"]
    for i in range(len(distinct_topics)):
        for j in range(i + 1, len(distinct_topics)):
            t1, t2 = distinct_topics[i], distinct_topics[j]
            orig1, path1 = baseline_files[t1]
            orig2, path2 = baseline_files[t2]
            pairs_to_test.append({
                "topic": f"{t1}_vs_{t2}",
                "file_a_name": f"{t1}/{orig1}",
                "file_a_path": path1,
                "file_b_name": f"{t2}/{orig2}",
                "file_b_path": path2,
                "ground_truth": "Non-Plagiarized"
            })

    # 3. Evaluate each pair using the plagiarism engine
    confusion_matrix = {actual: {pred: 0 for pred in CLASSES} for actual in CLASSES}
    detailed_results = []

    for pair in pairs_to_test:
        with open(pair["file_a_path"], "r", encoding="utf-8", errors="ignore") as fa:
            content_a = fa.read()
        with open(pair["file_b_path"], "r", encoding="utf-8", errors="ignore") as fb:
            content_b = fb.read()

        doc_a, tokens_a = preprocess_fn(content_a)
        doc_b, tokens_b = preprocess_fn(content_b)

        file_data = [
            {"id": 1, "name": pair["file_a_name"], "doc": doc_a, "tokens": tokens_a, "content": content_a},
            {"id": 2, "name": pair["file_b_name"], "doc": doc_b, "tokens": tokens_b, "content": content_b},
        ]

        try:
            results = compare_all_files(file_data, ngram_bounds=(3, 5))
            if results and len(results) > 0:
                sim_res = results[0]
                status = sim_res.get("status", "Low")
                score = sim_res.get("score", 0.0)
                plag_type_str = sim_res.get("plagiarism_type", "N/A")

                # Map engine output to 4 classification bins
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
            else:
                score = 0.0
                predicted = "Non-Plagiarized"
        except Exception:
            score = 0.0
            predicted = "Non-Plagiarized"

        actual = pair["ground_truth"]
        confusion_matrix[actual][predicted] += 1
        detailed_results.append({
            "pair": f"{pair['file_a_name']} <=> {pair['file_b_name']}",
            "actual": actual,
            "predicted": predicted,
            "score": score,
            "correct": (actual == predicted)
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
