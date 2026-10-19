"""
=============================================================================
FALSICODE: Pairwise Benchmark & Accuracy Evaluation Helper
=============================================================================
Computes mathematically sound pairwise evaluation metrics for plagiarism audits:
- Ground-Truth Confusion Matrix (TP, FP, TN, FN, FPR, Accuracy, Precision, Recall, F1)
- Plagiarism Taxonomy Breakdown (Type 1, Type 2, Type 3)
- Non-benchmark Pairwise Screening Breakdown (N * (N - 1) / 2 combinations)
=============================================================================
"""

import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GT_PATH = os.path.join(BASE_DIR, "datasets", "ground_truth.json")

GT_DB = {}
if os.path.exists(GT_PATH):
    try:
        with open(GT_PATH, "r", encoding="utf-8") as f:
            GT_DB = json.load(f)
    except Exception as e:
        print(f"Warning: Could not load ground_truth.json in benchmark_evaluator: {e}")

CLASSES = ["Type 1", "Type 2", "Type 3", "Non-Plagiarized"]


def detect_assignment_topic(assignment_title="", file_paths=None, filenames=None):
    """
    Detects if the assignment matches any official benchmark topic in ground_truth.json.
    """
    if not GT_DB:
        return None, None

    # 1. Match by file paths (e.g. controlled_benchmarks/python/multiple_files/multiple_g3/...)
    if file_paths:
        for fp in file_paths:
            norm_fp = (fp or "").lower().replace("\\", "/")
            for topic in GT_DB.keys():
                if f"/{topic}/" in norm_fp or norm_fp.endswith(f"/{topic}") or f"_{topic}_" in norm_fp or norm_fp.startswith(f"{topic}/"):
                    return topic, GT_DB[topic]

    # 2. Match by assignment title (e.g. "Multiple-G 3", "multiple_g3", "BST: Clone Benchmark")
    if assignment_title:
        clean_title = assignment_title.lower().replace("-", "_").replace(" ", "_")
        stripped_title = clean_title.replace("_", "")
        for topic in GT_DB.keys():
            stripped_topic = topic.replace("_", "")
            if topic in clean_title or stripped_topic in stripped_title:
                return topic, GT_DB[topic]
        # Common title variants
        if "bst" in clean_title:
            return "binary_search_tree", GT_DB.get("binary_search_tree")
        if "binary_tree" in clean_title or "tree_clone" in clean_title:
            return "binary_tree", GT_DB.get("binary_tree")
        if "linked_list" in clean_title:
            return "linked_list", GT_DB.get("linked_list")
        if "merge_sort" in clean_title:
            return "merge_sort", GT_DB.get("merge_sort")
        if "quick_sort" in clean_title:
            return "quick_sort", GT_DB.get("quick_sort")

    # 3. Match by individual positive_pair filenames
    if filenames:
        fn_set = {os.path.basename(f) for f in filenames if f}
        for topic, data in GT_DB.items():
            pos_pairs = data.get("positive_pairs", [])
            if pos_pairs and any(p["file1"] in fn_set or p["file2"] in fn_set for p in pos_pairs):
                return topic, data

    return None, None


def classify_sim_result(sim_res):
    """
    Classifies a pairwise similarity result into Taxonomy classes or Non-Plagiarized.
    Matches evaluate_metrics.py classification thresholds.
    """
    if not sim_res:
        return "Non-Plagiarized", 0.0
    status = sim_res.get("status", "Low")
    score = sim_res.get("score", 0.0)
    plag_type = sim_res.get("plagiarism_type", "N/A")
    if status == "Low" or score < 25.0 or plag_type == "N/A":
        return "Non-Plagiarized", score
    if "Type 1" in plag_type:
        return "Type 1", score
    if "Type 2" in plag_type:
        return "Type 2", score
    if "Type 3" in plag_type:
        return "Type 3", score
    return "Non-Plagiarized", score


def evaluate_pairwise_matrix(filenames, results, language="python", topic_override=None, assignment_title=None, file_paths=None):
    """
    Performs full pairwise matrix evaluation across all N*(N-1)/2 submission pairs.
    If topic matches ground truth, computes exact benchmark accuracy matching evaluate_metrics.py.
    """
    clean_files = sorted(list(set(f for f in filenames if f)))
    n_files = len(clean_files)
    total_pairs = (n_files * (n_files - 1)) // 2 if n_files >= 2 else 0

    if total_pairs == 0:
        return {
            "is_benchmark": False,
            "topic": None,
            "total_pairs": 0,
            "flagged_pairs": 0,
            "safe_pairs": 0,
            "flag_rate": 0.0,
            "taxonomy": []
        }

    # Build fast lookup dictionary for pairwise comparisons
    result_lookup = {}
    if results:
        for r in results:
            raw_f1 = r.get("file1", "")
            raw_f2 = r.get("file2", "")
            fn1 = raw_f1.split("(")[-1].rstrip(")").strip() if "(" in raw_f1 else raw_f1.strip()
            fn2 = raw_f2.split("(")[-1].rstrip(")").strip() if "(" in raw_f2 else raw_f2.strip()
            result_lookup[frozenset({fn1, fn2})] = r

    # Determine topic
    topic_name = topic_override
    topic_gt = GT_DB.get(topic_name) if topic_name else None
    if not topic_gt:
        topic_name, topic_gt = detect_assignment_topic(assignment_title, file_paths, clean_files)

    ext = ".py" if (language or "python").lower() == "python" else ".java"

    # =========================================================================
    # SCENARIO A: OFFICIAL BENCHMARK DATASET AVAILABLE
    # =========================================================================
    if topic_name and topic_gt:
        known_positives = {}
        for p in topic_gt.get("positive_pairs", []):
            f1 = p["file1"].replace(".py", ext).replace(".java", ext)
            f2 = p["file2"].replace(".py", ext).replace(".java", ext)
            known_positives[frozenset({f1, f2})] = p["type"]

        confusion_matrix = {actual: {pred: 0 for pred in CLASSES} for actual in CLASSES}
        pair_details = []

        for i in range(len(clean_files)):
            for j in range(i + 1, len(clean_files)):
                f1, f2 = clean_files[i], clean_files[j]
                pair_key = frozenset({f1, f2})
                actual = known_positives.get(pair_key, "Non-Plagiarized")
                sim_res = result_lookup.get(pair_key)
                predicted, score_out = classify_sim_result(sim_res)

                if actual in CLASSES and predicted in CLASSES:
                    confusion_matrix[actual][predicted] += 1

                pair_details.append({
                    "f1": f1,
                    "f2": f2,
                    "actual": actual,
                    "predicted": predicted,
                    "score": score_out,
                    "correct": (actual == predicted)
                })

        bin_tp = sum(1 for d in pair_details if d["actual"] != "Non-Plagiarized" and d["predicted"] != "Non-Plagiarized")
        bin_tn = sum(1 for d in pair_details if d["actual"] == "Non-Plagiarized" and d["predicted"] == "Non-Plagiarized")
        bin_fp = sum(1 for d in pair_details if d["actual"] == "Non-Plagiarized" and d["predicted"] != "Non-Plagiarized")
        bin_fn = sum(1 for d in pair_details if d["actual"] != "Non-Plagiarized" and d["predicted"] == "Non-Plagiarized")

        total_samples = len(pair_details)
        bin_acc = ((bin_tp + bin_tn) / total_samples * 100) if total_samples else 0.0
        bin_prec = (bin_tp / (bin_tp + bin_fp) * 100) if (bin_tp + bin_fp) else 0.0
        bin_rec = (bin_tp / (bin_tp + bin_fn) * 100) if (bin_tp + bin_fn) else 0.0
        bin_spec = (bin_tn / (bin_tn + bin_fp) * 100) if (bin_tn + bin_fp) else 0.0
        bin_f1 = (2 * bin_prec * bin_rec / (bin_prec + bin_rec)) if (bin_prec + bin_rec) else 0.0
        fpr = (bin_fp / (bin_fp + bin_tn) * 100) if (bin_fp + bin_tn) else 0.0

        taxonomy_stats = []
        for c in ["Type 1", "Type 2", "Type 3"]:
            tp_c = confusion_matrix[c][c]
            fp_c = sum(confusion_matrix[o][c] for o in CLASSES if o != c)
            fn_c = sum(confusion_matrix[c][o] for o in CLASSES if o != c)
            tn_c = sum(confusion_matrix[o1][o2] for o1 in CLASSES for o2 in CLASSES if o1 != c and o2 != c)
            prec_c = (tp_c / (tp_c + fp_c) * 100) if (tp_c + fp_c) else 0.0
            rec_c = (tp_c / (tp_c + fn_c) * 100) if (tp_c + fn_c) else 0.0
            f1_c = (2 * prec_c * rec_c / (prec_c + rec_c)) if (prec_c + rec_c) else 0.0

            taxonomy_stats.append({
                "type": f"{c}: " + ("Exact Copy" if c == "Type 1" else "Renamed" if c == "Type 2" else "Structural"),
                "shortType": c,
                "tp": tp_c,
                "fp": fp_c,
                "fn": fn_c,
                "tn": tn_c,
                "precision": round(prec_c, 1),
                "recall": round(rec_c, 1),
                "f1": round(f1_c, 1)
            })

        return {
            "is_benchmark": True,
            "topic": topic_name,
            "description": topic_gt.get("description", ""),
            "total_pairs": total_samples,
            "total_files": n_files,
            "tp": bin_tp,
            "tn": bin_tn,
            "fp": bin_fp,
            "fn": bin_fn,
            "fpr": round(fpr, 1),
            "accuracy": round(bin_acc, 1),
            "precision": round(bin_prec, 1),
            "recall": round(bin_rec, 1),
            "specificity": round(bin_spec, 1),
            "f1": round(bin_f1, 1),
            "ground_truth_positives": len(known_positives),
            "ground_truth_negatives": total_samples - len(known_positives),
            "taxonomy": taxonomy_stats,
            "confusion_matrix": confusion_matrix
        }

    # =========================================================================
    # SCENARIO B: LIVE CLASSROOM AUDIT (NO GROUND-TRUTH ANNOTATIONS)
    # =========================================================================
    flagged_pairs = [r for r in results if r.get("score", 0) >= 25.0 and r.get("status") != "Low"]
    t1_pairs = sum(1 for r in flagged_pairs if "Type 1" in (r.get("plagiarism_type") or ""))
    t2_pairs = sum(1 for r in flagged_pairs if "Type 2" in (r.get("plagiarism_type") or ""))
    t3_pairs = sum(1 for r in flagged_pairs if "Type 3" in (r.get("plagiarism_type") or ""))
    safe_pairs = max(0, total_pairs - len(flagged_pairs))
    flag_rate = round((len(flagged_pairs) / total_pairs * 100), 1) if total_pairs else 0.0

    return {
        "is_benchmark": False,
        "topic": None,
        "description": "Standard classroom audit (pairwise screening across all submission combinations).",
        "total_pairs": total_pairs,
        "total_files": n_files,
        "flagged_pairs": len(flagged_pairs),
        "safe_pairs": safe_pairs,
        "flag_rate": flag_rate,
        "taxonomy": [
            {
                "type": "Type 1: Exact Copy",
                "shortType": "Type 1",
                "flagged": t1_pairs,
                "safe": total_pairs - t1_pairs,
                "rate": round(t1_pairs / total_pairs * 100, 1) if total_pairs else 0
            },
            {
                "type": "Type 2: Renamed",
                "shortType": "Type 2",
                "flagged": t2_pairs,
                "safe": total_pairs - t2_pairs,
                "rate": round(t2_pairs / total_pairs * 100, 1) if total_pairs else 0
            },
            {
                "type": "Type 3: Structural",
                "shortType": "Type 3",
                "flagged": t3_pairs,
                "safe": total_pairs - t3_pairs,
                "rate": round(t3_pairs / total_pairs * 100, 1) if total_pairs else 0
            }
        ]
    }
