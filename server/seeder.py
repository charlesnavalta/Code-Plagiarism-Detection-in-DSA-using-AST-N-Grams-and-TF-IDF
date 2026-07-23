from datetime import datetime, timedelta, timezone
import random

from models import User, Classroom, Enrollment, Assignment, Submission
from flask_bcrypt import generate_password_hash 

def run_smart_seed(db):
    """
    Non-destructive seeder for Falsicode.
    Dynamically generates classrooms, enrolls students, and creates assignments.
    """
    print("-" * 30)
    print("FALSICODE: Starting Smart Seed...")
    
    try:
        # A. Define User Identity Data
        users_to_seed = [
            # Admin account
            {
                "email": "admin@test.com", 
                "username": "admin", 
                "password": "admin123", 
                "role": "admin",
                "status": "active",
                "is_verified": True
            },
            # Instructors
            {
                "email": "renz@gmail.com", 
                "username": "Renz", 
                "password": "renz123", 
                "role": "instructor",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "doca@gmail.com", 
                "username": "Doca", 
                "password": "doca123", 
                "role": "instructor",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "ba@gmail.com", 
                "username": "Ba", 
                "password": "ba123", 
                "role": "instructor",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "janus@gmail.com", 
                "username": "Janus", 
                "password": "janus123", 
                "role": "instructor",
                "status": "active",
                "is_verified": True
            },
            # Students
            {
                "email": "mary@gmail.com", 
                "username": "Mary", 
                "password": "mary123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "charles@gmail.com", 
                "username": "Charles", 
                "password": "charles123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "nicolo@gmail.com", 
                "username": "Nicolo", 
                "password": "nicolo123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "dan@gmail.com", 
                "username": "Dan", 
                "password": "dan123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "ramon@gmail.com", 
                "username": "Ramon", 
                "password": "ramon123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "jude@gmail.com", 
                "username": "Jude", 
                "password": "jude123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "jm@gmail.com", 
                "username": "Jm", 
                "password": "jm123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "patrick@gmail.com", 
                "username": "Patrick", 
                "password": "patrick123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "rachel@gmail.com", 
                "username": "Rachel", 
                "password": "rachel123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "karo@gmail.com", 
                "username": "Karo", 
                "password": "karo123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "sol@gmail.com", 
                "username": "Sol", 
                "password": "sol123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
            {
                "email": "ramil@gmail.com", 
                "username": "Ramil", 
                "password": "ramil123", 
                "role": "student",
                "status": "active",
                "is_verified": True
            },
        ]

        # B. Define Explicit Classroom Data
        classrooms_to_seed = [
            {
                "name": "3CSB - DSA", 
                "instructor_username": "Renz"
            },
            {
                "name": "3CSC - DSA", 
                "instructor_username": "Renz"
            },
            {
                "name": "Web Development 101", 
                "instructor_username": "Ba"
            },
        ]

        # C. Explicit Assignment Data
        assignments_to_seed = [
            {
                "title": "1. Quick Sort Program",
                "description": "Write a Python program that uses the Quick Sort method. You need to include a helper function that divides the list into smaller pieces.",
                "max_score": 100,
                "classroom_name": "3CSB - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59) # Dec 31, 2027, 11:59:59 PM
            },
            {
                "title": "2. Merge Sort Program",
                "description": "Write a Merge Sort program that repeatedly splits the list in half to sort it. Make sure it works perfectly whether the list has an even or odd number of items.",
                "max_score": 100,
                "classroom_name": "3CSB - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "3. Singly Linked List",
                "description": "Create a basic Linked List program. Write code to add an item to the front, add an item to the back, and flip the entire list around.",
                "max_score": 100,
                "classroom_name": "3CSB - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "4. Binary Tree Basics",
                "description": "Build a basic Binary Tree with at least 7 items. Write code to visit and print the items in three different ways: pre-order, in-order, and post-order.",
                "max_score": 100,
                "classroom_name": "3CSB - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "5. Binary Search Tree Tools",
                "description": "Write a working Binary Search Tree. Your program must be able to add a new item, find a specific item, and delete an item that sits at the very bottom of the tree (a leaf).",
                "max_score": 100,
                "classroom_name": "3CSB - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },

            # ==============================================================================
            # TS-A Part: Lexical Obfuscation (Changing Words and Text)
            # ==============================================================================
            {
                "title": "TS-A 1: Merge Sort (Exact Copy)",
                "description": "Write a Merge Sort program. This is a basic test to see if the system can catch exact, copy-pasted code.",
                "max_score": 100,
                "classroom_name": "3CSC - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "TS-A 2: Quick Sort (Renaming Variables)",
                "description": "Write a Quick Sort program. This tests if the system can still catch cheating when students change variable names and comments.",
                "max_score": 100,
                "classroom_name": "3CSC - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "TS-A 3: Binary Search (Changing Spacing)",
                "description": "Write a Binary Search program in Python. This checks if the system can ignore tricks like adding extra spaces, blank lines, or changing how the code is formatted.",
                "max_score": 100,
                "classroom_name": "3CSC - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },

            # ==============================================================================
            # TS-B Part: Structural Obfuscation (Changing How Code is Organized)
            # ==============================================================================
            {
                "title": "TS-B 1: Fibonacci (Swapping Lines)",
                "description": "Write a Python program to find the Fibonacci sequence. This tests if the system can catch cheating when code lines or variables are swapped around.",
                "max_score": 100,
                "classroom_name": "3CSC - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "TS-B 2: Sorting (Breaking into Functions)",
                "description": "Write a sorting program. This checks if the system can catch copying even when a student moves a chunk of the code into a separate helper function.",
                "max_score": 100,
                "classroom_name": "3CSC - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "TS-B 3: Loops (Swapping Loop Types)",
                "description": "Write a program using loops in Python. This tests if the system can tell that a 'for' loop and a 'while' loop are doing the exact same logic.",
                "max_score": 100,
                "classroom_name": "3CSC - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },

            # ==============================================================================
            # TS-C Part: Advanced Logic & Noise Injection (Adding Fake Code and Math Tricks)
            # ==============================================================================
            {
                "title": "TS-C 1: Quick Sort (Adding Fake Code)",
                "description": "Write a Quick Sort program. This tests if the system can ignore extra 'dead code'—fake variables and functions that don't actually do anything.",
                "max_score": 100,
                "classroom_name": "3CSC - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "TS-C 2: Linked List (Swapping Math Logic)",
                "description": "Write a Singly Linked List program. This checks if the system knows when math logic is written differently but means the same thing (like changing 'not less than' to 'greater than or equal to').",
                "max_score": 100,
                "classroom_name": "3CSC - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "TS-C 3: Binary Search Tree (Mixed Cheating Tricks)",
                "description": "The Final Test: Write a Binary Search Tree program. This combines all cheating tricks at once—changing names, mixing up line order, and adding fake code.",
                "max_score": 100,
                "classroom_name": "3CSC - DSA",
                "language": "python",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },

            # ==============================================================================
            # WEB DEVELOPMENT 101: JAVA ASSIGNMENTS
            # ==============================================================================
            {
                "title": "1. Quick Sort Implementation (Java)",
                "description": "Develop a Java program that implements the Quick Sort algorithm. Your class must include a separate partition method and utilize a recursive approach to sort an array of integers.",
                "max_score": 100,
                "classroom_name": "Web Development 101",
                "language": "java",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "2. Merge Sort Implementation (Java)",
                "description": "Create a Java class to implement the Merge Sort algorithm using a divide-and-conquer strategy. The implementation must handle the recursive splitting of arrays and a merge helper method for reconstruction.",
                "max_score": 100,
                "classroom_name": "Web Development 101",
                "language": "java",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "3. Singly Linked List (Java)",
                "description": "Implement a Singly Linked List in Java. You must define a Node class and include methods for append(), prepend(), and an in-place reverse() method to flip the list structure without creating a new list.",
                "max_score": 100,
                "classroom_name": "Web Development 101",
                "language": "java",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "4. Binary Tree Traversals (Java)",
                "description": "Construct a Binary Tree structure in Java. Write recursive methods to perform Pre-order, In-order, and Post-order traversals, demonstrating the output on a tree containing at least 7 nodes.",
                "max_score": 100,
                "classroom_name": "Web Development 101",
                "language": "java",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            },
            {
                "title": "5. Binary Search Tree (BST) Operations (Java)",
                "description": "Develop a Binary Search Tree (BST) in Java. Your implementation must successfully handle the insertion of new elements, searching for specific values, and the logic required to delete a leaf node.",
                "max_score": 100,
                "classroom_name": "Web Development 101",
                "language": "java",
                "deadline": datetime(2027, 12, 31, 23, 59, 59)
            }
        ]

        # D. Explicit Submission Data (Pointing to Physical Files in the Datasets Folder)
        submissions_to_seed = [

            #Assignment 1 Submissions - Quick Sort Implementation
            # Note: These files are intentionally crafted to represent different levels of plagiarism (Exact Copy and Renamed Variables) for robust testing.
            {
                "student_username": "charles",
                "assignment_title": "1. Quick Sort Program",
                "filename": "original.py",
                "file_path": "datasets/python_source-code/quick_sort/original.py"
            },
            {
                "student_username": "nicolo",
                "assignment_title": "1. Quick Sort Program",
                "filename": "type_1_exact_copy.py",
                "file_path": "datasets/python_source-code/quick_sort/type_1_exact_copy.py"
            },
            {
                "student_username": "dan",
                "assignment_title": "1. Quick Sort Program",
                "filename": "type_2_renamed.py",
                "file_path": "datasets/python_source-code/quick_sort/type_2_renamed.py"
            },

            # Assignment 2 Submissions - Merge Sort Implementation
            # These Test case is specifically designed to evaluate the structe plagiarism detection capabilities of the system, with varying levels of structural changes while maintaining core logic.

            {
                "student_username": "charles",
                "assignment_title": "2. Merge Sort Program",
                "filename": "original.py",
                "file_path": "datasets/python_source-code/merge_sort/original.py"
            },
            {
                "student_username": "nicolo",
                "assignment_title": "2. Merge Sort Program",
                "filename": "type_3_structural.py",
                "file_path": "datasets/python_source-code/merge_sort/type_3_structural.py"
            },
            {
                "student_username": "dan",
                "assignment_title": "2. Merge Sort Program",
                "filename": "type_3_structural2.py",
                "file_path": "datasets/python_source-code/merge_sort/type_3_structural2.py"
            },

            # Assignment 3 Submissions - Singly Linked List

            {
                "student_username": "mary",
                "assignment_title": "3. Singly Linked List",
                "filename": "original.py",
                "file_path": "datasets/python_source-code/linked_list/original.py"
            },
            {
                "student_username": "ramon",
                "assignment_title": "3. Singly Linked List",
                "filename": "type_1_exact.py",
                "file_path": "datasets/python_source-code/linked_list/type_1_exact.py"
            },
            {
                "student_username": "rachel",
                "assignment_title": "3. Singly Linked List",
                "filename": "type_2_renamed.py",
                "file_path": "datasets/python_source-code/linked_list/type_2_renamed.py"
            },
            {
                "student_username": "karo",
                "assignment_title": "3. Singly Linked List",
                "filename": "type_2_renamed2.py",
                "file_path": "datasets/python_source-code/linked_list/type_2_renamed2.py"
            },
            {
                "student_username": "jm",
                "assignment_title": "3. Singly Linked List",
                "filename": "type_3_structural.py",
                "file_path": "datasets/python_source-code/linked_list/type_3_structural.py"
            },

            #Assignment Sir Janus
            #Assignment A 1 TS-A Level 1: Merge Sort (Exact Copy)
            {
                "student_username": "mary",
                "assignment_title": "TS-A 1: Merge Sort (Exact Copy)",
                "filename": "TS-A_Level1.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-A_Level1.py"
            },
            {
                "student_username": "charles",
                "assignment_title": "TS-A 1: Merge Sort (Exact Copy)",
                "filename": "TS-A_Level1-ExactCopy.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-A_Level1-ExactCopy.py"
            },
            #Assignment A 2 TS-A Level 2: Quick Sort (Lexical Obfuscation)
            {
                "student_username": "mary",
                "assignment_title": "TS-A 2: Quick Sort (Renaming Variables)",
                "filename": "TS-A_Level2.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-A_Level2.py"
            },
            {
                "student_username": "charles",
                "assignment_title": "TS-A 2: Quick Sort (Renaming Variables)",
                "filename": "TS-A_Level2-LexicalObfuscation.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-A_Level2-LexicalObfuscation.py"
            },
            #Assignment A 3 TS-A Level 3: Binary Search (Formatting Manipulation)
            {
                "student_username": "mary",
                "assignment_title": "TS-A 3: Binary Search (Changing Spacing)",
                "filename": "TS-A_Level3.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-A_Level3.py"
            },
            {
                "student_username": "charles",
                "assignment_title": "TS-A 3: Binary Search (Changing Spacing)",
                "filename": "TS-A_Level3-FormattingManipulation.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-A_Level3-FormattingManipulation.py"
            },
            #Assignment B 1 TS-B Level 1: Fibonacci (Statement Reordering)
            {
                "student_username": "mary",
                "assignment_title": "TS-B 1: Fibonacci (Swapping Lines)",
                "filename": "TS-B_Level1.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-B_Level1.py"
            },
            {
                "student_username": "charles",
                "assignment_title": "TS-B 1: Fibonacci (Swapping Lines)",
                "filename": "TS-B_Level1-StatementReordering.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-B_Level1-StatementReordering.py"
            },

            #Assignment B 2 TS-B Level 2: Monolithic Sort (Method Extraction)
            {
                "student_username": "mary",
                "assignment_title": "TS-B 2: Sorting (Breaking into Functions)",
                "filename": "TS-B_Level2.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-B_Level2.py"
            },
            {
                "student_username": "charles",
                "assignment_title": "TS-B 2: Sorting (Breaking into Functions)",
                "filename": "TS-B_Level2-MethodExtraction.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-B_Level2-MethodExtraction.py"
            },
            
            #Assignment B 3 TS-B Level 3: Iteration (Control Flow Replacement)
            {
                "student_username": "mary",
                "assignment_title": "TS-B 3: Loops (Swapping Loop Types)",
                "filename": "TS-B_Level3.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-B_Level3.py"
            },
            {
                "student_username": "charles",
                "assignment_title": "TS-B 3: Loops (Swapping Loop Types)",
                "filename": "TS-B_Level3-ControlFlowReplacement.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-B_Level3-ControlFlowReplacement.py"
            },
            #Assignment C 1 TS-C Level 1: Quick Sort (Dead Code Injection)
            # Assignment C 1: Dead Code Injection
            {
                "student_username": "Mary",
                "assignment_title": "TS-C 1: Quick Sort (Adding Fake Code)",
                "filename": "TS-C_Level1.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-C_Level1.py"
            },
            {
                "student_username": "Charles",
                "assignment_title": "TS-C 1: Quick Sort (Adding Fake Code)",
                "filename": "TS-C_Level1-DeadCode.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-C_Level1-DeadCode.py"
            },

            # Assignment C 2: Expression Substitution
            {
                "student_username": "Mary",
                "assignment_title": "TS-C 2: Linked List (Swapping Math Logic)",
                "filename": "TS-C_Level2.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-C_Level2.py"
            },
            {
                "student_username": "Charles",
                "assignment_title": "TS-C 2: Linked List (Swapping Math Logic)",
                "filename": "TS-C_Level2-Substitution.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-C_Level2-Substitution.py"
            },

            # Assignment C 3: Mixed Attack
            {
                "student_username": "Mary",
                "assignment_title": "TS-C 3: Binary Search Tree (Mixed Cheating Tricks)",
                "filename": "TS-C_Level3.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-C_Level3.py"
            },
            {
                "student_username": "Charles",
                "assignment_title": "TS-C 3: Binary Search Tree (Mixed Cheating Tricks)",
                "filename": "TS-C_Level3-MixedAttack.py",
                "file_path": "datasets/python_source-code/sirjanus-testcases/TS-C_Level3-MixedAttack.py"
            },

            # Java Assignments Submissions
            # Assignment 1 Submissions - Quick Sort Implementation (Java)
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
                "file_path": "datasets/java_source-code/quick_sort/type_2_renamed_of_renamed.java"
            },
            {
                "student_username": "Mary",
                "assignment_title": "1. Quick Sort Implementation (Java)",
                "filename": "type_2_renamed2.java",
                "file_path": "datasets/java_source-code/quick_sort/type_2_renamed2.java"
            },
            {
                "student_username": "Ramon",
                "assignment_title": "1. Quick Sort Implementation (Java)",
                "filename": "type_3_structural.java",
                "file_path": "datasets/java_source-code/quick_sort/type_3_structural.java"
            },
            {
                "student_username": "Jude",
                "assignment_title": "1. Quick Sort Implementation (Java)",
                "filename": "type_3_structural2.java",
                "file_path": "datasets/java_source-code/quick_sort/type_3_structural2.java"
            },

            # Assignment 2 Submissions - Merge Sort Implementation (Java)
            {
                "student_username": "Charles",
                "assignment_title": "2. Merge Sort Implementation (Java)",
                "filename": "original.java",
                "file_path": "datasets/java_source-code/merge_sort/original.java"
            },
            {
                "student_username": "Nicolo",
                "assignment_title": "2. Merge Sort Implementation (Java)",
                "filename": "type_1_exact.java",
                "file_path": "datasets/java_source-code/merge_sort/type_1_exact.java"
            },
            {
                "student_username": "Dan",
                "assignment_title": "2. Merge Sort Implementation (Java)",
                "filename": "type_2_renamed.java",
                "file_path": "datasets/java_source-code/merge_sort/type_2_renamed.java"
            },
            {
                "student_username": "Mary",
                "assignment_title": "2. Merge Sort Implementation (Java)",
                "filename": "type_2_renamed2.java",
                "file_path": "datasets/java_source-code/merge_sort/type_2_renamed2.java"
            },
            {
                "student_username": "Ramon",
                "assignment_title": "2. Merge Sort Implementation (Java)",
                "filename": "type_3_structural.java",
                "file_path": "datasets/java_source-code/merge_sort/type_3_structural.java"
            },

            # Assignment 3 Submissions - Singly Linked List (Java)
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

            # Assignment 4 Submissions - Binary Tree Traversals
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

            # Assignment 5 Submissions - Binary Search Tree (BST) Operations
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
            },
        ]

        # 1. Smart User Seeding
        for u in users_to_seed:
            existing_user = User.query.filter_by(email=u["email"]).first()
            if not existing_user:
                print(f"FALSICODE: Adding {u['role'].capitalize()} account: {u['username']}")
                
                user = User(
                    email=u["email"],
                    username=u["username"],
                    role=u["role"],
                    # We can use .get() to pull the status if it exists, default to 'active'
                    status=u.get("status", "active") 
                )
                
                user.password = generate_password_hash(u["password"]).decode('utf-8')
                
                # 🌟 THE FIX: Force the account to be verified so it bypasses the OTP lock
                user.is_verified = u.get("is_verified", True)
                
                db.session.add(user)
        
        db.session.commit()

        # 2. Smart Classroom Seeding (Using Explicit Names)
        seeded_classrooms = []

        for class_data in classrooms_to_seed:
            instructor = User.query.filter_by(username=class_data["instructor_username"]).first()
            
            if instructor:
                existing_class = Classroom.query.filter_by(name=class_data["name"], instructor_id=instructor.id).first()

                if not existing_class:
                    print(f"FALSICODE: Creating Classroom '{class_data['name']}' for {instructor.username}")
                    existing_class = Classroom(
                        name=class_data["name"],
                        instructor_id=instructor.id
                    )
                    db.session.add(existing_class)
                    db.session.flush() # Flush to get the ID before committing
                
                seeded_classrooms.append(existing_class)
            else:
                print(f"FALSICODE WARNING: Could not find instructor '{class_data['instructor_username']}'")
            
        db.session.commit()

        # 3. SMART ENROLLMENT SEEDING (Dynamic for ALL Students)
        students = User.query.filter_by(role='student').all()

        for classroom in seeded_classrooms:
            for student in students:
                is_enrolled = Enrollment.query.filter_by(
                    student_id=student.id, 
                    classroom_id=classroom.id
                ).first()
                
                if not is_enrolled:
                    print(f"FALSICODE: Enrolling {student.username} in {classroom.name}")
                    enrollment = Enrollment(
                        student_id=student.id, 
                        classroom_id=classroom.id
                    )
                    db.session.add(enrollment)
        
        db.session.commit()

        # 4. SMART ASSIGNMENT SEEDING (NEW SECTION)
        for assign_data in assignments_to_seed:
            # Find the classroom by its name
            classroom = Classroom.query.filter_by(name=assign_data["classroom_name"]).first()
            
            if classroom:
                # Check if this assignment already exists in this classroom
                existing_assignment = Assignment.query.filter_by(
                    title=assign_data["title"], 
                    classroom_id=classroom.id
                ).first()
                
                if not existing_assignment:
                    print(f"FALSICODE: Adding Assignment '{assign_data['title']}' to {classroom.name}")
                    new_assignment = Assignment(
                        title=assign_data["title"],
                        description=assign_data["description"],
                        max_score=assign_data["max_score"],
                        classroom_id=classroom.id,
                        language=assign_data.get("language", "python"),
                        deadline=assign_data.get("deadline")
                    )
                    db.session.add(new_assignment)
            else:
                print(f"FALSICODE WARNING: Classroom '{assign_data['classroom_name']}' not found for assignment seeding.")
                
        db.session.commit()

        # 5. SMART SUBMISSION SEEDING (NEW SECTION)
        print("--- 🚀 FALSICODE: SEEDER IS RUNNING ---") # ADD THIS!
        for sub_data in submissions_to_seed:
            student = User.query.filter_by(username=sub_data["student_username"]).first()
            assignment = Assignment.query.filter_by(title=sub_data["assignment_title"]).first()

            if student and assignment:
                existing_sub = Submission.query.filter_by(
                    student_id=student.id, 
                    assignment_id=assignment.id
                ).first()

                if not existing_sub:
                    new_submission = Submission(
                        assignment_id=assignment.id,
                        student_id=student.id,
                        filename=sub_data["filename"],
                        file_path=sub_data["file_path"]
                    )
                    
                    # 🌟 AUTOMATION: If no specific date is provided, generate a random one 
                    # from the last 14 days so they don't all show up as "today"
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
                print(f"FALSICODE WARNING: Could not find Student/Assignment for '{sub_data['filename']}'")
                print(f"--- 📊 FALSICODE: Attempting to seed {len(submissions_to_seed)} submissions ---")
        
        db.session.commit()

        print("FALSICODE: Smart seeding complete!")
        print("-" * 30)

    except Exception as e:
        db.session.rollback()
        print(f"FALSICODE SEED ERROR: {e}")
        print("-" * 30)