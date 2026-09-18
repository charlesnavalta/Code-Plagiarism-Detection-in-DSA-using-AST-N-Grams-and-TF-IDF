import os
from datetime import datetime, timezone, timedelta
from database import db
from models import User, Classroom, Assignment, Submission

def seed_python_submissions(db_instance):
    print("--- Seeding Python Submissions (All Classrooms & Assignments) ---")
    sample_students = User.query.filter_by(role='student').order_by(User.id).all()
    if not sample_students:
        print("No student accounts found in database.")
        return

    datasets_root = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets")

    classroom_configs = [
        ("3CSB - Different Scenarios", "controlled_benchmarks/python/test_scenarios", [
            ("TS-A 1", "ts_a1"),
            ("TS-A 2", "ts_a2"),
            ("TS-A 3", "ts_a3"),
            ("TS-B 1", "ts_b1"),
            ("TS-B 2", "ts_b2"),
            ("TS-B 3", "ts_b3"),
            ("TS-C 1", "ts_c1"),
            ("TS-C 2", "ts_c2"),
            ("TS-C 3", "ts_c3"),
        ]),
        ("3CSC - Multiple Files", "controlled_benchmarks/python/multi_student_cohorts", [
            ("Multiple-A 1", "cohort_a1"),
            ("Multiple-A 2", "cohort_a2"),
            ("Multiple-A 3", "cohort_a3"),
            ("Multiple-B 1", "cohort_b1"),
            ("Multiple-B 2", "cohort_b2"),
            ("Multiple-C 1", "cohort_c1"),
            ("Multiple-C 2", "cohort_c2"),
            ("Multiple-D 1", "cohort_d1"),
            ("Multiple-E 1", "cohort_e1"),
            ("Multiple-E 2", "cohort_e2"),
            ("Multiple-E 3", "cohort_e3"),
            ("Multiple-E 4", "cohort_e4"),
            ("Multiple-F 1", "cohort_f1"),
            ("Multiple-F 2", "cohort_f2"),
            ("Multiple-G 1", "cohort_g1"),
            ("Multiple-G 2", "cohort_g2"),
            ("Multiple-G 3", "cohort_g3"),
        ]),
        ("3CSD - DSA Clone Benchmarks", "controlled_benchmarks/python/dsa_clone_benchmarks", [
            ("BST: Clone Benchmark", "binary_search_tree"),
            ("Binary Tree: Clone Benchmark", "binary_tree"),
            ("Linked List: Clone Benchmark", "linked_list"),
            ("Merge Sort: Clone Benchmark", "merge_sort"),
            ("Quick Sort: Clone Benchmark", "quick_sort"),
        ]),
        ("3CSE - Real-World DSA Benchmark (GitHub / CodeNet)", "github_codenet_datasets/python", [
            ("Problem p02709", "codenet_p02709"),
        ]),
    ]

    for class_name, sub_folder, assignment_configs in classroom_configs:
        py_class = Classroom.query.filter_by(name=class_name).first()
        if not py_class:
            print(f"Could not find classroom '{class_name}'")
            continue

        for ass_prefix, folder_name in assignment_configs:
            ass = Assignment.query.filter(Assignment.classroom_id == py_class.id, Assignment.title.like(f"{ass_prefix}%")).first()
            if not ass:
                print(f"Warning: Assignment starting with {ass_prefix} not found for class {py_class.name}")
                continue

            folder_path = os.path.join(datasets_root, sub_folder, folder_name)
            if not os.path.exists(folder_path):
                print(f"Warning: Dataset folder {folder_path} not found")
                continue

            files = sorted(os.listdir(folder_path))
            for idx, student in enumerate(sample_students):
                if idx >= len(files):
                    break
                fname = files[idx]
                rel_path = f"datasets/{sub_folder}/{folder_name}/{fname}"
                sub = Submission.query.filter_by(assignment_id=ass.id, student_id=student.id).first()
                if not sub:
                    sub = Submission(
                        assignment_id=ass.id,
                        student_id=student.id,
                        filename=fname,
                        file_path=rel_path
                    )
                    db_instance.session.add(sub)
                else:
                    sub.filename = fname
                    sub.file_path = rel_path
            db_instance.session.commit()
            print(f"[{class_name}] Seeded submissions for {ass_prefix} ({min(len(files), len(sample_students))} files)")
