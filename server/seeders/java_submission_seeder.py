from models import User, Assignment, Submission
from datetime import datetime, timedelta, timezone
import random

java_submissions = [
    # ==========================================
    # Java Assignments - Quick Sort
    # ==========================================
    {
        "student_username": "Charles",
        "assignment_title": "1. Quick Sort Implementation (Java)",
        "filename": "original.java",
        "file_path": "datasets/java_source-code/quick_sort/original.java"
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "1. Quick Sort Implementation (Java)",
        "filename": "type_1_exact_of_copy.java",
        "file_path": "datasets/java_source-code/quick_sort/type_1_exact_of_copy.java"
    },
    {
        "student_username": "Dan",
        "assignment_title": "1. Quick Sort Implementation (Java)",
        "filename": "type_2_renamed_of_renamed.java",
        "file_path": "datasets/java_source-code/quick_sort/type_2_renamed.java"
    },
    
    # ==========================================
    # Java Assignments - Merge Sort
    # ==========================================
    {
        "student_username": "Charles",
        "assignment_title": "2. Merge Sort Implementation (Java)",
        "filename": "original.java",
        "file_path": "datasets/java_source-code/merge_sort/original.java"
    }, 
    {
        "student_username": "Mary",
        "assignment_title": "2. Merge Sort Implementation (Java)",
        "filename": "type_2_renamed2.java",
        "file_path": "datasets/java_source-code/merge_sort//type_3_structural.java"
    },
    {
        "student_username": "Ramon",
        "assignment_title": "2. Merge Sort Implementation (Java)",
        "filename": "type_3_structural.java",
        "file_path": "datasets/java_source-code/merge_sort/type_3_structural2.java"
    },

    # ==========================================
    # Java Assignments - Singly Linked List
    # ==========================================
    {
        "student_username": "Jm",
        "assignment_title": "3. Singly Linked List (Java)",
        "filename": "original.java",
        "file_path": "datasets/java_source-code/linked_list/original.java"
    },
    {
        "student_username": "Patrick",
        "assignment_title": "3. Singly Linked List (Java)",
        "filename": "type_1_exact.java",
        "file_path": "datasets/java_source-code/linked_list/type_1_exact.java"
    },
    {
        "student_username": "Rachel",
        "assignment_title": "3. Singly Linked List (Java)",
        "filename": "type_2_renamed.java",
        "file_path": "datasets/java_source-code/linked_list/type_2_renamed.java"
    },
    {
        "student_username": "Karo",
        "assignment_title": "3. Singly Linked List (Java)",
        "filename": "type_2_renamed2.java",
        "file_path": "datasets/java_source-code/linked_list/type_2_renamed2.java"
    },
    {
        "student_username": "Sol",
        "assignment_title": "3. Singly Linked List (Java)",
        "filename": "type_3_structural.java",
        "file_path": "datasets/java_source-code/linked_list/type_3_structural.java"
    },

    # ==========================================
    # Java Assignments - Binary Tree Traversals
    # ==========================================
    {
        "student_username": "Charles",
        "assignment_title": "4. Binary Tree Traversals (Java)",
        "filename": "original..java",
        "file_path": "datasets/java_source-code/binary_tree/original..java"
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "4. Binary Tree Traversals (Java)",
        "filename": "type_2_renamed.java",
        "file_path": "datasets/java_source-code/binary_tree/type_2_renamed.java"
    },
    {
        "student_username": "Dan",
        "assignment_title": "4. Binary Tree Traversals (Java)",
        "filename": "type_2_renamed2.java",
        "file_path": "datasets/java_source-code/binary_tree/type_2_renamed2.java"
    },
    {
        "student_username": "Mary",
        "assignment_title": "4. Binary Tree Traversals (Java)",
        "filename": "type_3_structural.java",
        "file_path": "datasets/java_source-code/binary_tree/type_3_structural.java"
    },
    {
        "student_username": "Ramon",
        "assignment_title": "4. Binary Tree Traversals (Java)",
        "filename": "type_3_structural2.java",
        "file_path": "datasets/java_source-code/binary_tree/type_3_structural2.java"
    },

    # ==========================================
    # Java Assignments - BST
    # ==========================================
    {
        "student_username": "Jude",
        "assignment_title": "5. Binary Search Tree (BST) Operations (Java)",
        "filename": "original.java",
        "file_path": "datasets/java_source-code/binary_search_tree/original.java"
    },
    {
        "student_username": "Jm",
        "assignment_title": "5. Binary Search Tree (BST) Operations (Java)",
        "filename": "type_1_exact.java",
        "file_path": "datasets/java_source-code/binary_search_tree/type_1_exact.java"
    },
    {
        "student_username": "Patrick",
        "assignment_title": "5. Binary Search Tree (BST) Operations (Java)",
        "filename": "type_2_renamed.java",
        "file_path": "datasets/java_source-code/binary_search_tree/type_2_renamed.java"
    },
    {
        "student_username": "Rachel",
        "assignment_title": "5. Binary Search Tree (BST) Operations (Java)",
        "filename": "type_2_renamed2.java",
        "file_path": "datasets/java_source-code/binary_search_tree/type_2_renamed2.java"
    },
    {
        "student_username": "Karo",
        "assignment_title": "5. Binary Search Tree (BST) Operations (Java)",
        "filename": "type_3_structural.java",
        "file_path": "datasets/java_source-code/binary_search_tree/type_3_structural.java"
    },
    {
        "student_username": "Sol",
        "assignment_title": "5. Binary Search Tree (BST) Operations (Java)",
        "filename": "type_3_structural2.java",
        "file_path": "datasets/java_source-code/binary_search_tree/type_3_structural2.java"
    }
]

def seed_java_submissions(db):
    print("FALSICODE: Seeding Java Submissions...")
    for sub_data in java_submissions:
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