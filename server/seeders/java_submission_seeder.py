import os
from datetime import datetime, timezone, timedelta
from database import db
from models import User, Classroom, Assignment, Submission

def seed_java_submissions(db_instance):
    print("--- Seeding Java Submissions (All Classrooms & Assignments) ---")
    sample_students = User.query.filter_by(role='student').order_by(User.id).all()
    if not sample_students:
        print("No student accounts found in database.")
        return

    datasets_root = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets")

    classroom_configs = [
        ("4CSA - Different Scenarios", "controlled_benchmarks/java/test_scenarios", [
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
        ("4CSB - Multiple Files", "controlled_benchmarks/java/multiple_files", [
            ("Multiple-A 1", "multiple_a1"),
            ("Multiple-A 2", "multiple_a2"),
            ("Multiple-A 3", "multiple_a3"),
            ("Multiple-B 1", "multiple_b1"),
            ("Multiple-B 2", "multiple_b2"),
            ("Multiple-C 1", "multiple_c1"),
            ("Multiple-C 2", "multiple_c2"),
            ("Multiple-D 1", "multiple_d1"),
            ("Multiple-E 1", "multiple_e1"),
            ("Multiple-E 2", "multiple_e2"),
            ("Multiple-E 3", "multiple_e3"),
            ("Multiple-E 4", "multiple_e4"),
            ("Multiple-F 1", "multiple_f1"),
            ("Multiple-F 2", "multiple_f2"),
            ("Multiple-G 1", "multiple_g1"),
            ("Multiple-G 2", "multiple_g2"),
            ("Multiple-G 3", "multiple_g3"),
        ]),
        ("4CSC - DSA Clone Benchmarks (Java)", "controlled_benchmarks/java/dsa_clone_benchmarks", [
            ("BST: Clone Benchmark", "binary_search_tree"),
            ("Binary Tree: Clone Benchmark", "binary_tree"),
            ("Linked List: Clone Benchmark", "linked_list"),
            ("Merge Sort: Clone Benchmark", "merge_sort"),
            ("Quick Sort: Clone Benchmark", "quick_sort"),
        ]),
        ("4CSD - Real-World DSA Benchmark (GitHub / CodeNet)", "github_codenet_datasets/java", [
            ("Problem p02391", "codenet_p02391"),
            ("Problem p02641", "codenet_p02641"),
            ("Problem p02724", "codenet_p02724"),
            ("Problem p02766", "codenet_p02766"),
            ("Problem p02981", "codenet_p02981"),
        ]),
    ]

    for class_name, sub_folder, assignment_configs in classroom_configs:
        java_class = Classroom.query.filter_by(name=class_name).first()
        if not java_class:
            print(f"Could not find classroom '{class_name}'")
            continue

        for ass_prefix, folder_name in assignment_configs:
            ass = Assignment.query.filter(Assignment.classroom_id == java_class.id, Assignment.title.like(f"{ass_prefix}%")).first()
            if not ass:
                print(f"Warning: Assignment starting with {ass_prefix} not found for class {java_class.name}")
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
