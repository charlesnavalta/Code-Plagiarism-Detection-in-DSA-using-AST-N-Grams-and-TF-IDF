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

    base_sub_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets", "java_source-code")

    classroom_configs = [
        ("4CSA - Different Scenarios", [
            ("TS-A 1", "TS-A_LEVEL1"),
            ("TS-A 2", "TS-A_LEVEL2"),
            ("TS-A 3", "TS-A_LEVEL3"),
            ("TS-B 1", "TS-B_LEVEL1"),
            ("TS-B 2", "TS-B_LEVEL2"),
            ("TS-B 3", "TS-B_LEVEL3"),
            ("TS-C 1", "TS-C_LEVEL1"),
            ("TS-C 2", "TS-C_LEVEL2"),
            ("TS-C 3", "TS-C_LEVEL3"),
        ]),
        ("4CSB - Multiple Files", [
            ("Multiple-A 1", "Multiple-A1"),
            ("Multiple-A 2", "Multiple-A2"),
            ("Multiple-A 3", "Multiple-A3"),
            ("Multiple-B 1", "Multiple-B1"),
            ("Multiple-B 2", "Multiple-B2"),
            ("Multiple-C 1", "Multiple-C1"),
            ("Multiple-C 2", "Multiple-C2"),
            ("Multiple-D 1", "Multiple-D1"),
            ("Multiple-E 1", "Multiple-E1"),
            ("Multiple-E 2", "Multiple-E2"),
            ("Multiple-E 3", "Multiple-E3"),
            ("Multiple-E 4", "Multiple-E4"),
            ("Multiple-F 1", "Multiple-F1"),
            ("Multiple-F 2", "Multiple-F2"),
            ("Multiple-G 1", "Multiple-G1"),
            ("Multiple-G 2", "Multiple-G2"),
            ("Multiple-G 3", "Multiple-G3"),
        ]),
        ("4CSC - DSA Clone Benchmarks (Java)", [
            ("BST: Clone Benchmark", "binary_search_tree"),
            ("Binary Tree: Clone Benchmark", "binary_tree"),
            ("Linked List: Clone Benchmark", "linked_list"),
            ("Merge Sort: Clone Benchmark", "merge_sort"),
            ("Quick Sort: Clone Benchmark", "quick_sort"),
        ]),
    ]

    for class_name, assignment_configs in classroom_configs:
        java_class = Classroom.query.filter_by(name=class_name).first()
        if not java_class:
            print(f"Could not find classroom '{class_name}'")
            continue

        for ass_prefix, folder_name in assignment_configs:
            ass = Assignment.query.filter(Assignment.classroom_id == java_class.id, Assignment.title.like(f"{ass_prefix}%")).first()
            if not ass:
                print(f"Warning: Assignment starting with {ass_prefix} not found for class {java_class.name}")
                continue

            folder_path = os.path.join(base_sub_dir, folder_name)
            if not os.path.exists(folder_path):
                print(f"Warning: Dataset folder {folder_path} not found")
                continue

            files = sorted(os.listdir(folder_path))
            for idx, student in enumerate(sample_students):
                if idx >= len(files):
                    break
                fname = files[idx]
                rel_path = f"datasets/java_source-code/{folder_name}/{fname}"
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
