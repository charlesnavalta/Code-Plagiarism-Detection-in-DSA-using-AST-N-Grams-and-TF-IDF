from models import User, Assignment, Submission
from datetime import datetime, timedelta, timezone
import random

java_submissions = [
    # ==========================================
    # TS-A (Java)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "TS-A 1: Merge Sort (Exact Copy) Java",
        "filename": "MergeSort.java",
        "file_path": "datasets/java_source-code/TS-A_LEVEL1/MergeSort.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-A 1: Merge Sort (Exact Copy) Java",
        "filename": "MergeSortExactCopy.java",
        "file_path": "datasets/java_source-code/TS-A_LEVEL1/MergeSortExactCopy.java"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-A 2: Quick Sort (Renaming Variables) Java",
        "filename": "QuickSort.java",
        "file_path": "datasets/java_source-code/TS-A_LEVEL2/QuickSort.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-A 2: Quick Sort (Renaming Variables) Java",
        "filename": "QuickSortRenamed.java",
        "file_path": "datasets/java_source-code/TS-A_LEVEL2/QuickSortRenamed.java"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-A 3: Binary Search (Changing Spacing) Java",
        "filename": "BinarySearchTree.java",
        "file_path": "datasets/java_source-code/TS-A_LEVEL3/BinarySearchTree.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-A 3: Binary Search (Changing Spacing) Java",
        "filename": "BinarySearchTreeReformat.java",
        "file_path": "datasets/java_source-code/TS-A_LEVEL3/BinarySearchTreeReformat.java"
    },

    # ==========================================
    # TS-B (Java)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "TS-B 1: Fibonacci (Swapping Lines) Java",
        "filename": "Fibonacci.java",
        "file_path": "datasets/java_source-code/TS-B_LEVEL1/Fibonacci.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-B 1: Fibonacci (Swapping Lines) Java",
        "filename": "FibonacciReordered.java",
        "file_path": "datasets/java_source-code/TS-B_LEVEL1/FibonacciReordered.java"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-B 2: Sorting (Breaking into Functions) Java",
        "filename": "SelectionExtracted.java",
        "file_path": "datasets/java_source-code/TS-B_LEVEL2/SelectionExtracted.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-B 2: Sorting (Breaking into Functions) Java",
        "filename": "SelectionMonolithic.java",
        "file_path": "datasets/java_source-code/TS-B_LEVEL2/SelectionMonolithic.java"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-B 3: Loops (Swapping Loop Types) Java",
        "filename": "ComputeEvenTotal.java",
        "file_path": "datasets/java_source-code/TS-B_LEVEL3/ComputeEvenTotal.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-B 3: Loops (Swapping Loop Types) Java",
        "filename": "EvenNumberSum.java",
        "file_path": "datasets/java_source-code/TS-B_LEVEL3/EvenNumberSum.java"
    },

    # ==========================================
    # TS-C (java)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "TS-C 1: Quick Sort (Adding Fake Code) Java",
        "filename": "QuickSort.java",
        "file_path": "datasets/java_source-code/TS-C_LEVEL1/QuickSort.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-C 1: Quick Sort (Adding Fake Code) Java",
        "filename": "QuickSortDeadCode.java",
        "file_path": "datasets/java_source-code/TS-C_LEVEL1/QuickSortDeadCode.java"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-C 2: Linked List (Swapping Math Logic) Java",
        "filename": "LinkedList.java",
        "file_path": "datasets/java_source-code/TS-C_LEVEL2/LinkedList.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-C 2: Linked List (Swapping Math Logic) Java",
        "filename": "LinkedListSubstitution.java",
        "file_path": "datasets/java_source-code/TS-C_LEVEL2/LinkedListSubstitution.java"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-C 3: Binary Search Tree (Mixed Cheating Tricks) Java",
        "filename": "BinarySearchTreeOps.java",
        "file_path": "datasets/java_source-code/TS-C_LEVEL3/BinarySearchTreeOps.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-C 3: Binary Search Tree (Mixed Cheating Tricks) Java",
        "filename": "MixedAttackTree.java",
        "file_path": "datasets/java_source-code/TS-C_LEVEL3/MixedAttackTree.java"
    },
    # ==========================================
    # Multiple Files (Java)
    # ==========================================
    
]

def seed_java_submissions(db):
    print("FALSICODE: Seeding Java Submissions...")
    # Pre-cache users, assignments, and existing submissions in bulk (3 queries total)
    user_map = {u.username.lower(): u for u in User.query.all()}
    assignment_map = {a.title: a for a in Assignment.query.all()}
    existing_subs = {(s.student_id, s.assignment_id) for s in Submission.query.all()}

    for sub_data in java_submissions:
        student = user_map.get(sub_data["student_username"].lower())
        assignment = assignment_map.get(sub_data["assignment_title"])

        if student and assignment:
            if (student.id, assignment.id) not in existing_subs:
                new_submission = Submission(
                    assignment_id=assignment.id,
                    student_id=student.id,
                    filename=sub_data["filename"],
                    file_path=sub_data["file_path"]
                )
                
                # Automation: Randomize timestamp
                if "submitted_at" in sub_data:
                    new_submission.submitted_at = sub_data["submitted_at"]
                else:
                    random_days = random.randint(1, 14)
                    random_hours = random.randint(0, 23)
                    new_submission.submitted_at = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(days=random_days, hours=random_hours)

                if "score" in sub_data:
                    new_submission.score = sub_data["score"]
                    
                db.session.add(new_submission)
                existing_subs.add((student.id, assignment.id))
        else:
            print(f"WARNING: Could not find Student '{sub_data['student_username']}' or Assignment '{sub_data['assignment_title']}' for '{sub_data['filename']}'")
            
    db.session.commit()