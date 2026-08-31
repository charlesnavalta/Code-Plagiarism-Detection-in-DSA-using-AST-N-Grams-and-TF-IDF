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
    {
        "title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "description": "Large Cohort Benchmark: Write a Quick Sort program. This realistic classroom test features 30 diverse submissions from 30 students, testing system scalability, heatmap rendering, and detection of Type 1, Type 2, Type 3, and mixed cheating attacks within a large cohort.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # Multiple-E (Python)
    # ==========================================
    {
        "title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "description": "Write a 2D Grid Depth-First Search (DFS) traversal program (e.g., Number of Islands / Flood Fill). This evaluates whether the system detects structural equivalence across recursive calls, explicit stack iterations, and unrolled direction loops, while cleanly distinguishing organic Breadth-First Search (BFS) baselines.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "description": "Write a Frequency Counter and Bracket Matching program. This evaluates detection performance when high-level data structures (e.g., Hash Maps) are substituted with low-level primitive arrays, cascading if-elif branches, or string-based lookup buffers without altering algorithmic semantics.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "description": "Write an Array Range Accumulator program. This tests algorithmic resilience against directional iteration reversal (forward vs backward scans) and the manual replacement of built-in functions with explicit loops, compared against organic Divide-and-Conquer baselines.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "description": "Write a Substring Pattern Searching program. This tests detection accuracy against control-flow restructuring—such as replacing explicit 'break' statements with stateful boolean flag variables and converting 'for' loops into 'while' constructs—while validating true negatives against organic KMP algorithms.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # Multiple-F (Python) - Large Cohorts (36 & 42 Students)
    # ==========================================
    {
        "title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "description": "Divide-and-Conquer Sorting Benchmark: Write a complete Merge Sort algorithm to sort an array in ascending order. This large classroom benchmark features 36 student submissions (Divide-and-Conquer Sorting) evaluating detection of Type 1 verbatim copies, Type 2 lexical renames, Type 3 iterative bottom-up variants, in-place helper extractions, and diverse organic implementations across a 36-student cohort.",
        "max_score": 100,
        "classroom_name": "3CSC - Multiple Files",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "description": "Binary Search Tree Large Cohort: Implement a Binary Search Tree (BST) supporting Node insertion, searching, and tree traversals across varied class structures and pointer manipulation. Features 42 student submissions evaluating high-volume plagiarism detection, AST structural variants, helper delegation, dead code injection, and diverse organic implementations in a 42-student cohort.",
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
    {
        "title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "description": "Large Cohort Benchmark: Write a Quick Sort program. This realistic classroom test features 30 diverse submissions from 30 students, testing system scalability, heatmap rendering, and detection of Type 1, Type 2, Type 3, and mixed cheating attacks within a large cohort.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # Multiple-E (Java)
    # ==========================================
    {
        "title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "description": "Write a 2D Grid Depth-First Search (DFS) traversal program (e.g., Number of Islands / Flood Fill). This evaluates whether the system detects structural equivalence across recursive calls, explicit stack iterations, and unrolled direction loops, while cleanly distinguishing organic Breadth-First Search (BFS) baselines.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "description": "Write a Frequency Counter and Bracket Matching program. This evaluates detection performance when high-level data structures (e.g., Hash Maps) are substituted with low-level primitive arrays, cascading if-elif branches, or string-based lookup buffers without altering algorithmic semantics.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "description": "Write an Array Range Accumulator program. This tests algorithmic resilience against directional iteration reversal (forward vs backward scans) and the manual replacement of built-in functions with explicit loops, compared against organic Divide-and-Conquer baselines.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "description": "Write a Substring Pattern Searching program. This tests detection accuracy against control-flow restructuring—such as replacing explicit 'break' statements with stateful boolean flag variables and converting 'for' loops into 'while' constructs—while validating true negatives against organic KMP algorithms.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # Multiple-F (Java) - Large Cohorts (36 & 42 Students)
    # ==========================================
    {
        "title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "description": "Divide-and-Conquer Sorting Benchmark: Write a complete Merge Sort algorithm to sort an array in ascending order. This large classroom benchmark features 36 student submissions (Divide-and-Conquer Sorting) evaluating detection of Type 1 verbatim copies, Type 2 lexical renames, Type 3 iterative bottom-up variants, in-place helper extractions, and diverse organic implementations across a 36-student cohort.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "description": "Binary Search Tree Large Cohort: Implement a Binary Search Tree (BST) supporting Node insertion, searching, and tree traversals across varied class structures and pointer manipulation. Features 42 student submissions evaluating high-volume plagiarism detection, AST structural variants, helper delegation, dead code injection, and diverse organic implementations in a 42-student cohort.",
        "max_score": 100,
        "classroom_name": "4CSB - Multiple Files",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # DSA Clone Benchmarks (Python - 3CSD)
    # ==========================================
    {
        "title": "BST: Clone Benchmark (Python)",
        "description": "Ground-truth clone detection benchmark on Binary Search Tree containing Type 1 verbatim copies, Type 2 lexical renames, and Type 3 structural modifications.",
        "max_score": 100,
        "classroom_name": "3CSD - DSA Clone Benchmarks",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Binary Tree: Clone Benchmark (Python)",
        "description": "Ground-truth clone detection benchmark on Binary Tree implementations evaluating Type 2 renaming and Type 3 structural changes.",
        "max_score": 100,
        "classroom_name": "3CSD - DSA Clone Benchmarks",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Linked List: Clone Benchmark (Python)",
        "description": "Ground-truth clone detection benchmark on Singly Linked List operations evaluating Type 1, 2, and 3 plagiarism detection.",
        "max_score": 100,
        "classroom_name": "3CSD - DSA Clone Benchmarks",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Merge Sort: Clone Benchmark (Python)",
        "description": "Ground-truth clone detection benchmark on Divide-and-Conquer Merge Sort evaluating Type 1, 2, and 3 plagiarism variants.",
        "max_score": 100,
        "classroom_name": "3CSD - DSA Clone Benchmarks",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Quick Sort: Clone Benchmark (Python)",
        "description": "Ground-truth clone detection benchmark on Quick Sort evaluating multi-variation Type 1, Type 2, and Type 3 clones.",
        "max_score": 100,
        "classroom_name": "3CSD - DSA Clone Benchmarks",
        "language": "python",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    # ==========================================
    # DSA Clone Benchmarks (Java - 4CSC)
    # ==========================================
    {
        "title": "BST: Clone Benchmark (Java)",
        "description": "Ground-truth clone detection benchmark on Java Binary Search Tree containing Type 1, 2, and 3 academic clones.",
        "max_score": 100,
        "classroom_name": "4CSC - DSA Clone Benchmarks (Java)",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Binary Tree: Clone Benchmark (Java)",
        "description": "Ground-truth clone detection benchmark on Java Binary Tree implementations evaluating Type 2 renaming and Type 3 structural changes.",
        "max_score": 100,
        "classroom_name": "4CSC - DSA Clone Benchmarks (Java)",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Linked List: Clone Benchmark (Java)",
        "description": "Ground-truth clone detection benchmark on Java Linked List operations evaluating Type 1, 2, and 3 plagiarism detection.",
        "max_score": 100,
        "classroom_name": "4CSC - DSA Clone Benchmarks (Java)",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Merge Sort: Clone Benchmark (Java)",
        "description": "Ground-truth clone detection benchmark on Java Divide-and-Conquer Merge Sort evaluating Type 1, 2, and 3 plagiarism variants.",
        "max_score": 100,
        "classroom_name": "4CSC - DSA Clone Benchmarks (Java)",
        "language": "java",
        "deadline": datetime(2027, 12, 31, 23, 59, 59)
    },
    {
        "title": "Quick Sort: Clone Benchmark (Java)",
        "description": "Ground-truth clone detection benchmark on Java Quick Sort evaluating Type 1, 2, and 3 clones.",
        "max_score": 100,
        "classroom_name": "4CSC - DSA Clone Benchmarks (Java)",
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