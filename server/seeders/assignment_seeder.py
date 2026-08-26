from models import Assignment, Classroom
from datetime import datetime

assignments_to_seed = [
    # ==========================================
    # TS-A 1: Merge Sort (Exact Copy)
    # TS-A (Python)
    # ==========================================
    {
        "title": "TS-A 1: Merge Sort (Exact Copy)",
        "description": "Write a Merge Sort program. This is a basic test to see if the system can catch exact, copy-pasted code.",
        "max_score": 100,
        "classroom_name": "3CSB - Different Scenarios",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-A 2: Quick Sort (Renaming Variables)",
        "description": "Write a Quick Sort program. This tests if the system can still catch cheating when students change variable names and comments.",
        "max_score": 100,
        "classroom_name": "3CSB - Different Scenarios",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-A 3: Binary Search (Changing Spacing)",
        "description": "Write a Binary Search program in Python. This checks if the system can ignore tricks like adding extra spaces, blank lines, or changing how the code is formatted.",
        "max_score": 100,
        "classroom_name": "3CSB - Different Scenarios",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # TS-B (Python)
    # ==========================================
    {
        "title": "TS-B 1: Fibonacci (Swapping Lines)",
        "description": "Write a Python program to find the Fibonacci sequence. This tests if the system can catch cheating when code lines or variables are swapped around.",
        "max_score": 100,
        "classroom_name": "3CSB - Different Scenarios",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-B 2: Sorting (Breaking into Functions)",
        "description": "Write a sorting program. This checks if the system can catch copying even when a student moves a chunk of the code into a separate helper function.",
        "max_score": 100,
        "classroom_name": "3CSB - Different Scenarios",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-B 3: Loops (Swapping Loop Types)",
        "description": "Write a program using loops in Python. This tests if the system can tell that a 'for' loop and a 'while' loop are doing the exact same logic.",
        "max_score": 100,
        "classroom_name": "3CSB - Different Scenarios",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # TS-C (Python)
    # ==========================================
    {
        "title": "TS-C 1: Quick Sort (Adding Fake Code)",
        "description": "Write a Quick Sort program. This tests if the system can ignore extra 'dead code'—fake variables and functions that don't actually do anything.",
        "max_score": 100,
        "classroom_name": "3CSB - Different Scenarios",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-C 2: Linked List (Swapping Math Logic)",
        "description": "Write a Singly Linked List program. This checks if the system knows when math logic is written differently but means the same thing (like changing 'not less than' to 'greater than or equal to').",
        "max_score": 100,
        "classroom_name": "3CSB - Different Scenarios",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-C 3: Binary Search Tree (Mixed Cheating Tricks)",
        "description": "The Final Test: Write a Binary Search Tree program. This combines all cheating tricks at once—changing names, mixing up line order, and adding fake code.",
        "max_score": 100,
        "classroom_name": "3CSB - Different Scenarios",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # Multiple Files (Python)
    # ==========================================

    # ==========================================
    # Multiple-A (Python)
    # ==========================================
    {
        "title": "Multiple-A 1: Binary Search (Control Group)",
        "description": "Write a Binary Search program. This is a baseline control test: it checks that independently written solutions are NOT flagged as plagiarism against each other, while confirming the system still catches a direct, unmodified copy.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "description": "Write a Bubble Sort program. This tests if the system can see past surface-level changes—renamed variables/comments and spacing or indentation differences—that don't change what the code actually does.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "description": "Write a 0/1 Knapsack program using Dynamic Programming. Because DP problems allow many valid approaches (top-down memoized, bottom-up 2D table, bottom-up rolling array), this recalibrates the false-positive threshold on a richer solution space than the earlier control groups, while still checking that a direct copy is caught.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # Multiple-B (python)
    # ==========================================
    {
        "title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "description": "Write a program that reverses a Singly Linked List. This tests if the system can detect copied logic even when independent statements are reordered, when the pointer-swap logic is pulled out into a separate helper method, or when a loop is rewritten as a different control structure.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
        "description": "Write a Binary Tree Traversal program (in-order, pre-order, or post-order). This checks whether the system correctly matches copies back to their true source across two different valid approaches—recursive and iterative—without cross-matching between the two families, and still catches a combined rename-plus-reorder disguise.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # Multiple-C (python)
    # ==========================================
    {
        "title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "description": "Write a program that solves the Two Sum problem using a hash map. This tests if the system can ignore extra 'dead code'—fake variables and functions that don't do anything—and still catch cases where math or boolean logic is swapped for an equivalent version (like changing 'less than' to 'greater than or equal to').",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "description": "The Final Test: Write a Breadth-First Search program for a graph. This combines every cheating trick at once—renaming, reordering, control-flow swaps (queue to recursion), dead code, and stacked combinations—to see if disguises that individually evade detection still get caught when layered together.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    
    # ==========================================
    # TS-A (java)
    # ==========================================
    {
        "title": "TS-A 1: Merge Sort (Exact Copy) Java",
        "description": "Write a Merge Sort program. This is a basic test to see if the system can catch exact, copy-pasted code.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-A 2: Quick Sort (Renaming Variables) Java",
        "description": "Write a Quick Sort program. This tests if the system can still catch cheating when students change variable names and comments.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-A 3: Binary Search (Changing Spacing) Java",
        "description": "Write a Binary Search program in Java. This checks if the system can ignore tricks like adding extra spaces, blank lines, or changing how the code is formatted.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # TS-B (java)
    # ==========================================
    {
        "title": "TS-B 1: Fibonacci (Swapping Lines) Java",
        "description": "Write a Java program to find the Fibonacci sequence. This tests if the system can catch cheating when code lines or variables are swapped around.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-B 2: Sorting (Breaking into Functions) Java",
        "description": "Write a sorting program. This checks if the system can catch copying even when a student moves a chunk of the code into a separate helper function.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-B 3: Loops (Swapping Loop Types) Java",
        "description": "Write a program using loops in Java. This tests if the system can tell that a 'for' loop and a 'while' loop are doing the exact same logic.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # TS-C (java)
    # ==========================================
    {
        "title": "TS-C 1: Quick Sort (Adding Fake Code) Java",
        "description": "Write a Quick Sort program. This tests if the system can ignore extra 'dead code'—fake variables and functions that don't actually do anything.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-C 2: Linked List (Swapping Math Logic) Java",
        "description": "Write a Singly Linked List program. This checks if the system knows when math logic is written differently but means the same thing (like changing 'not less than' to 'greater than or equal to').",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "TS-C 3: Binary Search Tree (Mixed Cheating Tricks) Java",
        "description": "The Final Test: Write a Binary Search Tree program. This combines all cheating tricks at once—changing names, mixing up line order, and adding fake code.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # Multiple Files (Java)
    # ==========================================

    # ==========================================
    # Multiple-A (Java)
    # ==========================================
    {
        "title": "Multiple-A 1: Binary Search (Control Group) Java",
        "description": "Write a Binary Search program. This is a baseline control test: it checks that independently written solutions are NOT flagged as plagiarism against each other, while confirming the system still catches a direct, unmodified copy.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "description": "Write a Bubble Sort program. This tests if the system can see past surface-level changes—renamed variables/comments and spacing or indentation differences—that don't change what the code actually does.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "description": "Write a 0/1 Knapsack program using Dynamic Programming. Because DP problems allow many valid approaches (top-down memoized, bottom-up 2D table, bottom-up rolling array), this recalibrates the false-positive threshold on a richer solution space than the earlier control groups, while still checking that a direct copy is caught.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # Multiple-B (Java)
    # ==========================================
    {
        "title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "description": "Write a program that reverses a Singly Linked List. This tests if the system can detect copied logic even when independent statements are reordered, when the pointer-swap logic is pulled out into a separate helper method, or when a loop is rewritten as a different control structure.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
        "description": "Write a Binary Tree Traversal program (in-order, pre-order, or post-order). This checks whether the system correctly matches copies back to their true source across two different valid approaches—recursive and iterative—without cross-matching between the two families, and still catches a combined rename-plus-reorder disguise.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # Multiple-C (Java)
    # ==========================================
    {
        "title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "description": "Write a program that solves the Two Sum problem using a hash map. This tests if the system can ignore extra 'dead code'—fake variables and functions that don't do anything—and still catch cases where math or boolean logic is swapped for an equivalent version (like changing 'less than' to 'greater than or equal to').",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "description": "The Final Test: Write a Breadth-First Search program for a graph. This combines every cheating trick at once—renaming, reordering, control-flow swaps (queue to recursion), dead code, and stacked combinations—to see if disguises that individually evade detection still get caught when layered together.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
]

def seed_assignments(db):
    print("FALSICODE: Seeding Assignments...")
    class_map = {c.name: c for c in Classroom.query.all()}
    existing_assignments = {(a.title, a.classroom_id) for a in Assignment.query.all()}

    for assign_data in assignments_to_seed:
        classroom = class_map.get(assign_data["classroom_name"])
        if classroom:
            if (assign_data["title"], classroom.id) not in existing_assignments:
                new_assignment = Assignment(
                    title=assign_data["title"],
                    description=assign_data["description"],
                    max_score=assign_data["max_score"],
                    classroom_id=classroom.id,
                    language=assign_data.get("language", "python"),
                    deadline=assign_data.get("deadline")
                )
                db.session.add(new_assignment)
                existing_assignments.add((assign_data["title"], classroom.id))
        else:
            print(f"WARNING: Classroom '{assign_data['classroom_name']}' not found.")
            
    db.session.commit()