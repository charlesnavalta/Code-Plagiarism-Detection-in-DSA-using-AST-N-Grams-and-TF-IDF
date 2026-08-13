from models import User, Assignment, Submission
from datetime import datetime, timedelta, timezone
import random

python_submissions = [
    # ==========================================
    # TS-A (Python)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "TS-A 1: Merge Sort (Exact Copy)",
        "filename": "TS-A_Level1.py",
        "file_path": "datasets/python_source-code/TS-A_LEVEL1/TS-A_Level1.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-A 1: Merge Sort (Exact Copy)",
        "filename": "TS-A_Level1-ExactCopy.py",
        "file_path": "datasets/python_source-code/TS-A_LEVEL1/TS-A_Level1-ExactCopy.py"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-A 2: Quick Sort (Renaming Variables)",
        "filename": "TS-A_Level2.py",
        "file_path": "datasets/python_source-code/TS-A_LEVEL2/TS-A_Level2.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-A 2: Quick Sort (Renaming Variables)",
        "filename": "TS-A_Level2-LexicalObfuscation.py",
        "file_path": "datasets/python_source-code/TS-A_LEVEL2/TS-A_Level2-LexicalObfuscation.py"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-A 3: Binary Search (Changing Spacing)",
        "filename": "TS-A_Level3.py",
        "file_path": "datasets/python_source-code/TS-A_LEVEL3/TS-A_Level3.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-A 3: Binary Search (Changing Spacing)",
        "filename": "TS-A_Level3-FormattingManipulation.py",
        "file_path": "datasets/python_source-code/TS-A_LEVEL3/TS-A_Level3-FormattingManipulation.py"
    },

    # ==========================================
    # TS-B (Python)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "TS-B 1: Fibonacci (Swapping Lines)",
        "filename": "TS-B_Level1.py",
        "file_path": "datasets/python_source-code/TS-B_LEVEL1/TS-B_Level1.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-B 1: Fibonacci (Swapping Lines)",
        "filename": "TS-B_Level1-StatementReordering.py",
        "file_path": "datasets/python_source-code/TS-B_LEVEL1/TS-B_Level1-StatementReordering.py"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-B 2: Sorting (Breaking into Functions)",
        "filename": "TS-B_Level2.py",
        "file_path": "datasets/python_source-code/TS-B_LEVEL2/TS-B_Level2.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-B 2: Sorting (Breaking into Functions)",
        "filename": "TS-B_Level2-MethodExtraction.py",
        "file_path": "datasets/python_source-code/TS-B_LEVEL2/TS-B_Level2-MethodExtraction.py"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-B 3: Loops (Swapping Loop Types)",
        "filename": "TS-B_Level3.py",
        "file_path": "datasets/python_source-code/TS-B_LEVEL3/TS-B_Level3.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-B 3: Loops (Swapping Loop Types)",
        "filename": "TS-B_Level3-ControlFlowReplacement.py",
        "file_path": "datasets/python_source-code/TS-B_LEVEL3/TS-B_Level3-ControlFlowReplacement.py"
    },

    # ==========================================
    # TS-C (Python)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "TS-C 1: Quick Sort (Adding Fake Code)",
        "filename": "TS-C_Level1.py",
        "file_path": "datasets/python_source-code/TS-C_LEVEL1/TS-C_Level1.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-C 1: Quick Sort (Adding Fake Code)",
        "filename": "TS-C_Level1-DeadCode.py",
        "file_path": "datasets/python_source-code/TS-C_LEVEL1/TS-C_Level1-DeadCode.py"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-C 2: Linked List (Swapping Math Logic)",
        "filename": "TS-C_Level2.py",
        "file_path": "datasets/python_source-code/TS-C_LEVEL2/TS-C_Level2.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-C 2: Linked List (Swapping Math Logic)",
        "filename": "TS-C_Level2-Substitution.py",
        "file_path": "datasets/python_source-code/TS-C_LEVEL2/TS-C_Level2-Substitution.py"
    },
    {
        "student_username": "Mary",
        "assignment_title": "TS-C 3: Binary Search Tree (Mixed Cheating Tricks)",
        "filename": "TS-C_Level3.py",
        "file_path": "datasets/python_source-code/TS-C_LEVEL3/TS-C_Level3.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "TS-C 3: Binary Search Tree (Mixed Cheating Tricks)",
        "filename": "TS-C_Level3-MixedAttack.py",
        "file_path": "datasets/python_source-code/TS-C_LEVEL3/TS-C_Level3-MixedAttack.py"
    }
]

def seed_python_submissions(db):
    print("FALSICODE: Seeding Python Submissions...")
    for sub_data in python_submissions:
        # Match case-insensitively just in case
        student = User.query.filter(User.username.ilike(sub_data["student_username"])).first()
        assignment = Assignment.query.filter_by(title=sub_data["assignment_title"]).first()

        if student and assignment:
            existing_sub = Submission.query.filter_by(student_id=student.id, assignment_id=assignment.id).first()

            if not existing_sub:
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
        else:
            print(f"WARNING: Could not find Student '{sub_data['student_username']}' or Assignment '{sub_data['assignment_title']}' for '{sub_data['filename']}'")
            
    db.session.commit()