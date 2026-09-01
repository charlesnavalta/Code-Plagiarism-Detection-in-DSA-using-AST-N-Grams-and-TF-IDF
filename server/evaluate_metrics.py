"""
=============================================================================
FALSICODE: Code Plagiarism Detection System
Algorithmic Benchmark & Statistical Accuracy Evaluation Script
=============================================================================
Evaluates both:
  1. Primary Binary Detection (Plagiarized vs. Non-Plagiarized)
  2. Multi-Class Taxonomy Classification (Type 1, Type 2, Type 3)

Uses the official Ground-Truth mapping (from datasets/ground_truth.json based
on Plagiarism Detection Benchmark Dataset.pdf) to accurately evaluate
known source-to-clone plagiarism pairs vs. independent honest submissions.
=============================================================================
"""

import os
import sys
import json

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from utils.python_engine import process_python_file
from utils.java_engine import process_java_file
from utils.similarity import compare_all_files

CLASSES = ["Type 1", "Type 2", "Type 3", "Non-Plagiarized"]

# Load official ground truth database
GT_PATH = os.path.join(BASE_DIR, "datasets", "ground_truth.json")
GT_DB = {}
if os.path.exists(GT_PATH):
    try:
        with open(GT_PATH, "r", encoding="utf-8") as fh:
            GT_DB = json.load(fh)
    except Exception as e:
        print(f"Warning: Could not load ground_truth.json: {e}")


def get_fallback_ground_truth(filename):
    fn = filename.lower()
    if any(k in fn for k in ["type1_", "type_1", "exact_copy", "exactcopy", "level1-exactcopy", "level1_exactcopy"]):
        return "Type 1"
    if any(k in fn for k in ["type2_", "type_2", "renamed", "level2-methodextraction", "level2_methodextraction", "methodextraction"]):
        return "Type 2"
    if any(k in fn for k in ["type3_", "type_3", "structural", "rearranged", "mixed_attack", "mixedattack", "level3-reordered", "level3_reordered", "reordered", "renamed_reordered_combo"]):
        return "Type 3"
    if any(k in fn for k in ["organic", "unique"]):
        return "Non-Plagiarized"
    if any(k in fn for k in ["orig", "original", "bstoriginal", "lsoriginal", "msoriginal", "qsoriginal", "treeoriginal"]):
        return "Baseline"
    if fn.startswith("ts-") and not any(k in fn for k in ["exactcopy", "methodextraction", "reordered", "level1-", "level2-", "level3-"]):
        return "Baseline"
    return "Unknown"


def discover_all_topics(language="python"):
    lang_folder = "python_source-code" if language == "python" else "java_source-code"
    base_path = os.path.join(BASE_DIR, "datasets", lang_folder)
    if not os.path.exists(base_path):
        return []
    return [(name, os.path.join(base_path, name))
            for name in sorted(os.listdir(base_path))
            if os.path.isdir(os.path.join(base_path, name))]


def classify_result(sim_res):
    if not sim_res:
        return "Non-Plagiarized", 0.0
    status = sim_res.get("status", "Low")
    score = sim_res.get("score", 0.0)
    plag_type = sim_res.get("plagiarism_type", "N/A")
    if status == "Low" or score < 25.0 or plag_type == "N/A":
        return "Non-Plagiarized", score
    if "Type 1" in plag_type: return "Type 1", score
    if "Type 2" in plag_type: return "Type 2", score
    if "Type 3" in plag_type: return "Type 3", score
    return "Non-Plagiarized", score


def evaluate_topic_batch(topic_name, topic_path, ext, preprocess_fn, ngram_bounds):
    files = sorted([f for f in os.listdir(topic_path) if f.endswith(ext)])
    if len(files) < 2:
        return []

    # Check official Ground-Truth Database
    topic_gt = GT_DB.get(topic_name, {})
    known_positives = {}
    for p in topic_gt.get("positive_pairs", []):
        f1 = p["file1"].replace(".py", ext).replace(".java", ext)
        f2 = p["file2"].replace(".py", ext).replace(".java", ext)
        known_positives[frozenset({f1, f2})] = p["type"]

    batch = []
    for fname in files:
        fpath = os.path.join(topic_path, fname)
        try:
            with open(fpath, "r", encoding="utf-8", errors="ignore") as fh:
                content = fh.read()
            if not content.strip():
                continue
            doc_str, tokens = preprocess_fn(content)
            if doc_str and tokens:
                batch.append({"id": fname, "name": fname, "doc": doc_str, "tokens": tokens, "content": content})
        except Exception:
            continue

    if len(batch) < 2:
        return []

    try:
        batch_results = compare_all_files(batch, ngram_bounds)
    except Exception:
        batch_results = []

    result_lookup = {frozenset({r["file1"], r["file2"]}): r for r in batch_results}
    pair_results = []

    # If ground_truth.json contains this topic, use the exact origin-source ground truth
    if known_positives or topic_name in GT_DB:
        for i in range(len(files)):
            for j in range(i + 1, len(files)):
                f1, f2 = files[i], files[j]
                pair_key = frozenset({f1, f2})
                actual = known_positives.get(pair_key, "Non-Plagiarized")
                sim_res = result_lookup.get(pair_key)
                predicted, score_out = classify_result(sim_res)
                pair_results.append({
                    "pair": f"{f1} <=> {f2}",
                    "topic": topic_name,
                    "actual": actual,
                    "predicted": predicted,
                    "score": score_out,
                    "correct": (actual == predicted)
                })
    else:
        # Fallback to legacy naming heuristic if topic not in ground_truth.json
        categorised = {f: get_fallback_ground_truth(f) for f in files}
        plagiarised_files = [f for f, gt in categorised.items() if gt in ("Type 1", "Type 2", "Type 3")]
        honest_files = [f for f, gt in categorised.items() if gt == "Non-Plagiarized"]

        if not plagiarised_files:
            return []

        for plag_f in plagiarised_files:
            gt = categorised[plag_f]
            for honest_f in honest_files:
                predicted, score_out = classify_result(result_lookup.get(frozenset({plag_f, honest_f})))
                pair_results.append({
                    "pair": f"{plag_f} <=> {honest_f}",
                    "topic": topic_name,
                    "actual": gt,
                    "predicted": predicted,
                    "score": score_out,
                    "correct": (gt == predicted)
                })

        for i, h1 in enumerate(honest_files):
            for h2 in honest_files[i + 1:]:
                predicted, score_out = classify_result(result_lookup.get(frozenset({h1, h2})))
                pair_results.append({
                    "pair": f"{h1} <=> {h2}",
                    "topic": topic_name,
                    "actual": "Non-Plagiarized",
                    "predicted": predicted,
                    "score": score_out,
                    "correct": (predicted == "Non-Plagiarized")
                })

    return pair_results


def run_benchmark_for_language(language="python"):
    ext = ".py" if language == "python" else ".java"
    preprocess_fn = process_python_file if language == "python" else process_java_file
    ngram_bounds = (3, 5)
    topics = discover_all_topics(language)

    confusion_matrix = {actual: {pred: 0 for pred in CLASSES} for actual in CLASSES}
    detailed_results = []
    skipped_topics = []

    print(f"\n  Scanning {len(topics)} topic folders for {language.upper()} ...")

    for topic_name, topic_path in topics:
        pair_results = evaluate_topic_batch(topic_name, topic_path, ext, preprocess_fn, ngram_bounds)
        if not pair_results:
            skipped_topics.append(topic_name)
            continue
        for r in pair_results:
            if r["actual"] in CLASSES and r["predicted"] in CLASSES:
                confusion_matrix[r["actual"]][r["predicted"]] += 1
            detailed_results.append(r)

    if skipped_topics:
        print(f"  Note: {len(skipped_topics)} folder(s) skipped (no valid pairs): {', '.join(skipped_topics)}")

    return confusion_matrix, detailed_results


def print_evaluation_report(language, matrix, detailed_results):
    total_samples = len(detailed_results)
    bin_tp = bin_tn = bin_fp = bin_fn = 0
    for d in detailed_results:
        ap = (d["actual"] != "Non-Plagiarized")
        pp = (d["predicted"] != "Non-Plagiarized")
        if ap and pp: bin_tp += 1
        elif not ap and not pp: bin_tn += 1
        elif not ap and pp: bin_fp += 1
        elif ap and not pp: bin_fn += 1

    bin_acc = ((bin_tp + bin_tn) / total_samples * 100) if total_samples else 0.0
    bin_prec = (bin_tp / (bin_tp + bin_fp) * 100) if (bin_tp + bin_fp) else 0.0
    bin_rec = (bin_tp / (bin_tp + bin_fn) * 100) if (bin_tp + bin_fn) else 0.0
    bin_spec = (bin_tn / (bin_tn + bin_fp) * 100) if (bin_tn + bin_fp) else 0.0
    bin_f1 = (2 * bin_prec * bin_rec / (bin_prec + bin_rec)) if (bin_prec + bin_rec) else 0.0
    fpr = (bin_fp / (bin_fp + bin_tn) * 100) if (bin_fp + bin_tn) else 0.0
    fnr = (bin_fn / (bin_tp + bin_fn) * 100) if (bin_tp + bin_fn) else 0.0

    print("=" * 80)
    print(f"[REPORT] FALSICODE BENCHMARK EVALUATION REPORT: {language.upper()}")
    print("=" * 80)
    print(f"Total Test Pairs Evaluated : {total_samples}")
    print("\n" + "-" * 80)
    print("SECTION 1: PRIMARY PLAGIARISM DETECTION (PLAGIARIZED vs. HONEST)")
    print("-" * 80)
    print(f"\n  * True Positives  (Cheating correctly caught) : {bin_tp}")
    print(f"  * True Negatives  (Honest code verified safe)   : {bin_tn}")
    print(f"  * False Positives (Honest code wrongly flagged) : {bin_fp}  <-- Critical for fair grading!")
    print(f"  * False Negatives (Cheating missed)             : {bin_fn}\n")
    print(f"  {'Metric':<25} | {'Value':<10} | Description")
    print(f"  {'-'*25}-|-{'-'*10}-|-{'-'*38}")
    print(f"  {'Precision (Trust)':<25} | {bin_prec:6.2f}%    | When flagged, likelihood it is real cheating")
    print(f"  {'Recall (Sensitivity)':<25} | {bin_rec:6.2f}%    | Percentage of all cheating caught")
    print(f"  {'Specificity (Fairness)':<25} | {bin_spec:6.2f}%    | Percentage of honest students protected")
    print(f"  {'False Positive Rate (FPR)':<25} | {fpr:6.2f}%    | Innocent pairs wrongly flagged")
    print(f"  {'False Negative Rate (FNR)':<25} | {fnr:6.2f}%    | Actual cheating missed")
    print(f"  {'F1-Score (Harmonic)':<25} | {bin_f1:6.2f}%    | Balanced harmonic mean of Precision & Recall")
    print(f"  {'Overall Detection Accuracy':<25} | {bin_acc:6.2f}%    | Total correct decisions ({bin_tp+bin_tn}/{total_samples})")

    print("\n" + "-" * 80)
    print("SECTION 2: PLAGIARISM TAXONOMY BREAKDOWN (TYPE 1 / 2 / 3)")
    print("-" * 80)
    print("\n--- CONFUSION MATRIX (Rows: Actual Ground Truth, Columns: Predicted) ---")
    hdr = f"{'Actual \\ Predicted':<18} | " + " | ".join(f"{c:<16}" for c in CLASSES)
    print(hdr); print("-" * len(hdr))
    for actual in CLASSES:
        print(f"{actual:<18} | " + " | ".join(f"{matrix[actual][pred]:<16}" for pred in CLASSES))

    print("\n--- STATISTICAL METRICS PER PLAGIARISM CLASS ---")
    mh = f"{'Plagiarism Class':<18} | {'TP':<5} | {'FP':<5} | {'FN':<5} | {'TN':<5} | {'Precision':<10} | {'Recall':<10} | {'F1-Score':<10}"
    print(mh); print("-" * len(mh))
    total_tp = 0; class_f1s = []
    for c in CLASSES:
        tp = matrix[c][c]
        fp = sum(matrix[o][c] for o in CLASSES if o != c)
        fn = sum(matrix[c][o] for o in CLASSES if o != c)
        tn = sum(matrix[o1][o2] for o1 in CLASSES for o2 in CLASSES if o1 != c and o2 != c)
        prec = (tp / (tp + fp) * 100) if (tp + fp) else 0.0
        rec = (tp / (tp + fn) * 100) if (tp + fn) else 0.0
        f1 = (2 * prec * rec / (prec + rec)) if (prec + rec) else 0.0
        total_tp += tp; class_f1s.append(f1)
        print(f"{c:<18} | {tp:<5} | {fp:<5} | {fn:<5} | {tn:<5} | {prec:6.2f}%    | {rec:6.2f}%    | {f1:6.2f}%")

    tax_acc = (total_tp / total_samples * 100) if total_samples else 0.0
    macro_f1 = sum(class_f1s) / len(CLASSES)
    print("-" * len(mh))
    print(f"Taxonomy Classification Accuracy : {tax_acc:.2f}%  ({total_tp}/{total_samples} exact matches)")
    print(f"Macro-Averaged F1                : {macro_f1:.2f}%")

    print("\n" + "-" * 80)
    print("SECTION 3: PER-TOPIC BREAKDOWN")
    print("-" * 80)
    th = f"  {'Topic':<25} | {'Pairs':>5} | {'TP':>4} | {'TN':>4} | {'FP':>4} | {'FN':>4} | {'FPR':>6} | {'Acc':>6}"
    print(th); print("  " + "-" * (len(th) - 2))
    for t in sorted({d["topic"] for d in detailed_results}):
        rows = [d for d in detailed_results if d["topic"] == t]
        t_tp = sum(1 for d in rows if d["actual"] != "Non-Plagiarized" and d["predicted"] != "Non-Plagiarized")
        t_tn = sum(1 for d in rows if d["actual"] == "Non-Plagiarized" and d["predicted"] == "Non-Plagiarized")
        t_fp = sum(1 for d in rows if d["actual"] == "Non-Plagiarized" and d["predicted"] != "Non-Plagiarized")
        t_fn = sum(1 for d in rows if d["actual"] != "Non-Plagiarized" and d["predicted"] == "Non-Plagiarized")
        t_fpr = (t_fp / (t_fp + t_tn) * 100) if (t_fp + t_tn) else 0.0
        t_acc = ((t_tp + t_tn) / len(rows) * 100) if rows else 0.0
        print(f"  {t:<25} | {len(rows):>5} | {t_tp:>4} | {t_tn:>4} | {t_fp:>4} | {t_fn:>4} | {t_fpr:5.1f}% | {t_acc:5.1f}%")

    print("=" * 80 + "\n")


def main():
    print("\n" + "#" * 80)
    print("  FALSICODE ALGORITHMIC BENCHMARK & ACCURACY EVALUATION")
    print("  (Official Ground-Truth Dataset Mapping | Python & Java)")
    print("#" * 80)
    py_matrix, py_details = run_benchmark_for_language("python")
    print_evaluation_report("Python", py_matrix, py_details)
    java_matrix, java_details = run_benchmark_for_language("java")
    print_evaluation_report("Java", java_matrix, java_details)


if __name__ == "__main__":
    main()
