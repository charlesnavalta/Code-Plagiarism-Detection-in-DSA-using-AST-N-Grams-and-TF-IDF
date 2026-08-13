from models import Assignment, Classroom
from datetime import datetime

assignments_to_seed = [
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
    {
        "title": "1. Quick Sort Implementation (Java)",
        "description": "Develop a Java program that implements the Quick Sort algorithm. Your class must include a separate partition method and utilize a recursive approach to sort an array of integers.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "2. Merge Sort Implementation (Java)",
        "description": "Create a Java class to implement the Merge Sort algorithm using a divide-and-conquer strategy. The implementation must handle the recursive splitting of arrays and a merge helper method for reconstruction.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "3. Singly Linked List (Java)",
        "description": "Implement a Singly Linked List in Java. You must define a Node class and include methods for append(), prepend(), and an in-place reverse() method to flip the list structure without creating a new list.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "4. Binary Tree Traversals (Java)",
        "description": "Construct a Binary Tree structure in Java. Write recursive methods to perform Pre-order, In-order, and Post-order traversals, demonstrating the output on a tree containing at least 7 nodes.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "5. Binary Search Tree (BST) Operations (Java)",
        "description": "Develop a Binary Search Tree (BST) in Java. Your implementation must successfully handle the insertion of new elements, searching for specific values, and the logic required to delete a leaf node.",
        "max_score": 100,
        "classroom_name": "4CSA - Different Scenarios",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    }
]

def seed_assignments(db):
    print("FALSICODE: Seeding Assignments...")
    for assign_data in assignments_to_seed:
        classroom = Classroom.query.filter_by(name=assign_data["classroom_name"]).first()
        if classroom:
            existing_assignment = Assignment.query.filter_by(title=assign_data["title"], classroom_id=classroom.id).first()
            if not existing_assignment:
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
            print(f"WARNING: Classroom '{assign_data['classroom_name']}' not found.")
            
    db.session.commit()