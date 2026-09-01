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
    # Multiple-A 1: Binary Search (Control Group)
    # 8 organic · 1 unique · 1 exact copy
    # ==========================================

    # --- Organic (independently written) ---
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group) Java",
        "filename": "organic1_binary_search.java",
        "file_path": "datasets/java_source-code/Multiple-A1/organic1_binary_search.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group) Java",
        "filename": "organic2_binary_search.java",
        "file_path": "datasets/java_source-code/Multiple-A1/organic2_binary_search.java"
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group) Java",
        "filename": "organic3_binary_search.java",
        "file_path": "datasets/java_source-code/Multiple-A1/organic3_binary_search.java"
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group) Java",
        "filename": "organic4_binary_search.java",
        "file_path": "datasets/java_source-code/Multiple-A1/organic4_binary_search.java"
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group) Java",
        "filename": "organic5_binary_search.java",
        "file_path": "datasets/java_source-code/Multiple-A1/organic5_binary_search.java"
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group) Java",
        "filename": "organic6_binary_search.java",
        "file_path": "datasets/java_source-code/Multiple-A1/organic6_binary_search.java"
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group) Java",
        "filename": "organic7_binary_search.java",
        "file_path": "datasets/java_source-code/Multiple-A1/organic7_binary_search.java"
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group) Java",
        "filename": "organic8_binary_search.java",
        "file_path": "datasets/java_source-code/Multiple-A1/organic8_binary_search.java"
    },

    # --- Unique baseline ---
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group) Java",
        "filename": "unique1_binary_search.java",
        "file_path": "datasets/java_source-code/Multiple-A1/unique1_binary_search.java"
    },

    # --- Exact copy of Rachel's unique1 ---
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group) Java",
        "filename": "exact_copy1_binary_search.java",
        "file_path": "datasets/java_source-code/Multiple-A1/exact_copy1_binary_search.java"
    },

    # ==========================================
    # Multiple-A 2: Bubble Sort (Renamed & Reformatted)
    # 8 organic · 1 unique · 1 exact copy · 1 renamed · 1 reformatted
    # ==========================================

    # --- Organic (independently written) ---
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "organic1_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/organic1_bubble_sort.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "organic2_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/organic2_bubble_sort.java"
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "organic3_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/organic3_bubble_sort.java"
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "organic4_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/organic4_bubble_sort.java"
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "organic5_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/organic5_bubble_sort.java"
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "organic6_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/organic6_bubble_sort.java"
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "organic7_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/organic7_bubble_sort.java"
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "organic8_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/organic8_bubble_sort.java"
    },

    # --- Unique baseline ---
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "unique1_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/unique1_bubble_sort.java"
    },

    # --- Exact copy of Rachel's unique1 ---
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "exact_copy1_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/exact_copy1_bubble_sort.java"
    },

    # --- Renamed variant of Rachel's unique1 ---
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "renamed1_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/renamed1_bubble_sort.java"
    },

    # --- Reformatted variant of Rachel's unique1 ---   
    {
        "student_username": "Jake",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted) Java",
        "filename": "reformatted1_bubble_sort.java",
        "file_path": "datasets/java_source-code/Multiple-A2/reformatted1_bubble_sort.java"
    },

    # ==========================================
    # Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)
    # 10 organic · 2 unique · 2 exact copy · 1 renamed
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "organic_1.java",
        "file_path": "datasets/java_source-code/Multiple-A3/organic_1.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "organic_2.java",
        "file_path": "datasets/java_source-code/Multiple-A3/organic_2.java"
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "organic_3.java",
        "file_path": "datasets/java_source-code/Multiple-A3/organic_3.java"
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "organic_4.java",
        "file_path": "datasets/java_source-code/Multiple-A3/organic_4.java"
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "organic_5.java",
        "file_path": "datasets/java_source-code/Multiple-A3/organic_5.java"
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "organic_6.java",
        "file_path": "datasets/java_source-code/Multiple-A3/organic_6.java"
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "organic_7.java",
        "file_path": "datasets/java_source-code/Multiple-A3/organic_7.java"
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "organic_8.java",
        "file_path": "datasets/java_source-code/Multiple-A3/organic_8.java"
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "organic_9.java",
        "file_path": "datasets/java_source-code/Multiple-A3/organic_9.java"
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "organic_10.java",
        "file_path": "datasets/java_source-code/Multiple-A3/organic_10.java"
    },
 
    # ---------- 1 unique (should NOT match anything) ----------
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "unique_1.java",
        "file_path": "datasets/java_source-code/Multiple-A3/unique_1.java"
    },
 
    # ---------- 3 disguised copies (all derived from organic_1 / Mary) ----------
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "reordered_1.java",
        "file_path": "datasets/java_source-code/Multiple-A3/reordered_1.java"
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "method_extracted_1.java",
        "file_path": "datasets/java_source-code/Multiple-A3/method_extracted_1.java"
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group) Java",
        "filename": "control_flow_swapped_1.java",
        "file_path": "datasets/java_source-code/Multiple-A3/control_flow_swapped_1.java"
    },
    # ==========================================
    # Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)
    # 10 organic · 2 unique · 2 exact copy · 1 renamed
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "organic_1.java",
        "file_path": "datasets/java_source-code/Multiple-B1/organic_1.java"
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "organic_2.java",
        "file_path": "datasets/java_source-code/Multiple-B1/organic_2.java"
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "organic_3.java",
        "file_path": "datasets/java_source-code/Multiple-B1/organic_3.java"
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "organic_4.java",
        "file_path": "datasets/java_source-code/Multiple-B1/organic_4.java"
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "organic_5.java",
        "file_path": "datasets/java_source-code/Multiple-B1/organic_5.java"
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "organic_6.java",
        "file_path": "datasets/java_source-code/Multiple-B1/organic_6.java"
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "organic_7.java",
        "file_path": "datasets/java_source-code/Multiple-B1/organic_7.java"
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "organic_8.java",
        "file_path": "datasets/java_source-code/Multiple-B1/organic_8.java"
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "organic_9.java",
        "file_path": "datasets/java_source-code/Multiple-B1/organic_9.java"
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "organic_10.java",
        "file_path": "datasets/java_source-code/Multiple-B1/organic_10.java"
    },
 
    # ---------- 2 unique sources (recursive + iterative families) ----------
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "unique_recursive_1.java",
        "file_path": "datasets/java_source-code/Multiple-B1/unique_recursive_1.java"
    },
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "unique_iterative_1.java",
        "file_path": "datasets/java_source-code/Multiple-B1/unique_iterative_1.java"
    },
 
    # ---------- 2 exact copies ----------
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "exact_copy_recursive_1.java",
        "file_path": "datasets/java_source-code/Multiple-B1/exact_copy_recursive_1.java"
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "exact_copy_iterative_1.java",
        "file_path": "datasets/java_source-code/Multiple-B1/exact_copy_iterative_1.java"
    },
 
    # ---------- 1 renamed+reordered combo ----------
    {
        "student_username": "Chris",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction) Java",
        "filename": "renamed_reordered_combo_1.java",
        "file_path": "datasets/java_source-code/Multiple-B1/renamed_reordered_combo_1.java"
    },
    # ==========================================
    # Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)
    # 9 organic · 1 unique · 1 exact copy · 1 dead-code injected
    # ==========================================

    # ---------- 9 organic (independent) ----------
        {
            "student_username": "Mary",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "organic_1.java",
            "file_path": "datasets/java_source-code/Multiple-B2/organic_1.java"
        },
        {
            "student_username": "Charles",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "organic_2.java",
            "file_path": "datasets/java_source-code/Multiple-B2/organic_2.java"
        },
        {
            "student_username": "Nicolo",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "organic_3.java",
            "file_path": "datasets/java_source-code/Multiple-B2/organic_3.java"
        },
        {
            "student_username": "Dan",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "organic_4.java",
            "file_path": "datasets/java_source-code/Multiple-B2/organic_4.java"
        },
        {
            "student_username": "Ramon",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "organic_5.java",
            "file_path": "datasets/java_source-code/Multiple-B2/organic_5.java"
        },
        {
            "student_username": "Jude",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "organic_6.java",
            "file_path": "datasets/java_source-code/Multiple-B2/organic_6.java"
        },
        {
            "student_username": "Jm",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "organic_7.java",
            "file_path": "datasets/java_source-code/Multiple-B2/organic_7.java"
        },
        {
            "student_username": "Patrick",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "organic_8.java",
            "file_path": "datasets/java_source-code/Multiple-B2/organic_8.java"
        },
        {
            "student_username": "Rachel",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "organic_9.java",
            "file_path": "datasets/java_source-code/Multiple-B2/organic_9.java"
        },
    
        # ---------- 1 unique source ----------
        {
            "student_username": "Karo",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "unique_1.java",
            "file_path": "datasets/java_source-code/Multiple-B2/unique_1.java"
        },
    
        # ---------- 1 exact copy ----------
        {
            "student_username": "Sol",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "exact_copy_1.java",
            "file_path": "datasets/java_source-code/Multiple-B2/exact_copy_1.java"
        },
    
        # ---------- 1 dead-code injected ----------
        {
            "student_username": "Ramil",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "dead_code_injected_1.java",
            "file_path": "datasets/java_source-code/Multiple-B2/dead_code_injected_1.java"
        },
    
        # ---------- 1 logic-substituted ----------
        {
            "student_username": "Alex",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes) Java",
            "filename": "logic_substituted_1.java",
            "file_path": "datasets/java_source-code/Multiple-B2/logic_substituted_1.java"
        },

        # ==========================================


        {
        "student_username": "Mary",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "organic_1.java",
        "file_path": "datasets/java_source-code/Multiple-C1/organic_1.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "organic_2.java",
        "file_path": "datasets/java_source-code/Multiple-C1/organic_2.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "organic_3.java",
        "file_path": "datasets/java_source-code/Multiple-C1/organic_3.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "organic_4.java",
        "file_path": "datasets/java_source-code/Multiple-C1/organic_4.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "organic_5.java",
        "file_path": "datasets/java_source-code/Multiple-C1/organic_5.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "organic_6.java",
        "file_path": "datasets/java_source-code/Multiple-C1/organic_6.java",
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "organic_7.java",
        "file_path": "datasets/java_source-code/Multiple-C1/organic_7.java",
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "organic_8.java",
        "file_path": "datasets/java_source-code/Multiple-C1/organic_8.java",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "organic_9.java",
        "file_path": "datasets/java_source-code/Multiple-C1/organic_9.java",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "organic_10.java",
        "file_path": "datasets/java_source-code/Multiple-C1/organic_10.java",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "unique_1.java",
        "file_path": "datasets/java_source-code/Multiple-C1/unique_1.java",
    },
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "exact_copy_1.java",
        "file_path": "datasets/java_source-code/Multiple-C1/exact_copy_1.java",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "renamed_1.java",
        "file_path": "datasets/java_source-code/Multiple-C1/renamed_1.java",
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "structural_recursion_1.java",
        "file_path": "datasets/java_source-code/Multiple-C1/structural_recursion_1.java",
    },
    {
        "student_username": "Chris",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "mixed_attack_1.java",
        "file_path": "datasets/java_source-code/Multiple-C1/mixed_attack_1.java",
    },
    {
        "student_username": "Jake",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution) Java",
        "filename": "triple_combo_1.java",
        "file_path": "datasets/java_source-code/Multiple-C1/triple_combo_1.java",
    },
    # ==========================================

    {
        "student_username": "Mary",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "organic_1.java",
        "file_path": "datasets/java_source-code/Multiple-C2/organic_1.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "organic_2.java",
        "file_path": "datasets/java_source-code/Multiple-C2/organic_2.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "organic_3.java",
        "file_path": "datasets/java_source-code/Multiple-C2/organic_3.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "organic_4.java",
        "file_path": "datasets/java_source-code/Multiple-C2/organic_4.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "organic_5.java",
        "file_path": "datasets/java_source-code/Multiple-C2/organic_5.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "organic_6.java",
        "file_path": "datasets/java_source-code/Multiple-C2/organic_6.java",
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "organic_7.java",
        "file_path": "datasets/java_source-code/Multiple-C2/organic_7.java",
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "organic_8.java",
        "file_path": "datasets/java_source-code/Multiple-C2/organic_8.java",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "organic_9.java",
        "file_path": "datasets/java_source-code/Multiple-C2/organic_9.java",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "unique_1.java",
        "file_path": "datasets/java_source-code/Multiple-C2/unique_1.java",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test) Java",
        "filename": "exact_copy_1.java",
        "file_path": "datasets/java_source-code/Multiple-C2/exact_copy_1.java",
    },
    # ==========================================
        # ==========================================
    # Multiple-D 1: Quick Sort (Large Cohort) Java
    # 24 organic · 1 exact copy · 2 renamed · 2 structural · 1 mixed (30 students)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_1.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_1.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_2.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_2.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_3.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_3.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_4.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_4.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_5.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_5.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_6.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_6.java",
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_7.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_7.java",
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_8.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_8.java",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_9.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_9.java",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_10.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_10.java",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_11.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_11.java",
    },
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_12.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_12.java",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_13.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_13.java",
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_14.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_14.java",
    },
    {
        "student_username": "Chris",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_15.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_15.java",
    },
    {
        "student_username": "Jake",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_16.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_16.java",
    },
    {
        "student_username": "Kyle",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_17.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_17.java",
    },
    {
        "student_username": "Cyrus",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_18.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_18.java",
    },
    {
        "student_username": "Jr",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_19.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_19.java",
    },
    {
        "student_username": "Andrei",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_20.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_20.java",
    },
    {
        "student_username": "Tricia",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_21.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_21.java",
    },
    {
        "student_username": "Tatin",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_22.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_22.java",
    },
    {
        "student_username": "Pauline",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_23.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_23.java",
    },
    {
        "student_username": "Che",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "organic_24.java",
        "file_path": "datasets/java_source-code/Multiple-D1/organic_24.java",
    },
    {
        "student_username": "Kiko",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "exact_copy_1.java",
        "file_path": "datasets/java_source-code/Multiple-D1/exact_copy_1.java",
    },
    {
        "student_username": "Darrel",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "renamed_1.java",
        "file_path": "datasets/java_source-code/Multiple-D1/renamed_1.java",
    },
    {
        "student_username": "Edrian",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "renamed_2.java",
        "file_path": "datasets/java_source-code/Multiple-D1/renamed_2.java",
    },
    {
        "student_username": "Sean",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "structural_1.java",
        "file_path": "datasets/java_source-code/Multiple-D1/structural_1.java",
    },
    {
        "student_username": "Hannah",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "structural_2.java",
        "file_path": "datasets/java_source-code/Multiple-D1/structural_2.java",
    },
    {
        "student_username": "Stark",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort) Java",
        "filename": "mixed_attack_1.java",
        "file_path": "datasets/java_source-code/Multiple-D1/mixed_attack_1.java",
    },
    # ==========================================
    # Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "filename": "original_1_grid_dfs.java",
        "file_path": "datasets/java_source-code/Multiple-E1/original_1_grid_dfs.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "filename": "type1_formatting_1_grid_dfs.java",
        "file_path": "datasets/java_source-code/Multiple-E1/type1_formatting_1_grid_dfs.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "filename": "type2_renamed_1_grid_dfs.java",
        "file_path": "datasets/java_source-code/Multiple-E1/type2_renamed_1_grid_dfs.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "filename": "type3_unrolled_1_grid_dfs.java",
        "file_path": "datasets/java_source-code/Multiple-E1/type3_unrolled_1_grid_dfs.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "filename": "type3_stack_1_grid_dfs.java",
        "file_path": "datasets/java_source-code/Multiple-E1/type3_stack_1_grid_dfs.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "filename": "type3_composite_1_grid_dfs.java",
        "file_path": "datasets/java_source-code/Multiple-E1/type3_composite_1_grid_dfs.java",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "filename": "organic_bfs_1_grid_dfs.java",
        "file_path": "datasets/java_source-code/Multiple-E1/organic_bfs_1_grid_dfs.java",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "filename": "type1_bfs_clone_1_grid_dfs.java",
        "file_path": "datasets/java_source-code/Multiple-E1/type1_bfs_clone_1_grid_dfs.java",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "filename": "organic_set_1_grid_dfs.java",
        "file_path": "datasets/java_source-code/Multiple-E1/organic_set_1_grid_dfs.java",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal) Java",
        "filename": "type2_set_clone_1_grid_dfs.java",
        "file_path": "datasets/java_source-code/Multiple-E1/type2_set_clone_1_grid_dfs.java",
    },

    # ==========================================
    # Multiple-E 2: Frequency Counter (Data Structure Substitution) Java
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "filename": "original_1_valid_parentheses.java",
        "file_path": "datasets/java_source-code/Multiple-E2/original_1_valid_parentheses.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "filename": "type1_formatting_1_valid_parentheses.java",
        "file_path": "datasets/java_source-code/Multiple-E2/type1_formatting_1_valid_parentheses.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "filename": "type2_renamed_1_valid_parentheses.java",
        "file_path": "datasets/java_source-code/Multiple-E2/type2_renamed_1_valid_parentheses.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "filename": "type3_arraysim_1_valid_parentheses.java",
        "file_path": "datasets/java_source-code/Multiple-E2/type3_arraysim_1_valid_parentheses.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "filename": "type3_if_elif_1_valid_parentheses.java",
        "file_path": "datasets/java_source-code/Multiple-E2/type3_if_elif_1_valid_parentheses.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "filename": "type3_composite_1_valid_parentheses.java",
        "file_path": "datasets/java_source-code/Multiple-E2/type3_composite_1_valid_parentheses.java",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "filename": "organic_replace_1_valid_parentheses.java",
        "file_path": "datasets/java_source-code/Multiple-E2/organic_replace_1_valid_parentheses.java",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "filename": "type1_replace_clone_1_valid_parentheses.java",
        "file_path": "datasets/java_source-code/Multiple-E2/type1_replace_clone_1_valid_parentheses.java",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "filename": "organic_string_1_valid_parentheses.java",
        "file_path": "datasets/java_source-code/Multiple-E2/organic_string_1_valid_parentheses.java",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution) Java",
        "filename": "type2_string_clone_1_valid_parentheses.java",
        "file_path": "datasets/java_source-code/Multiple-E2/type2_string_clone_1_valid_parentheses.java",
    },

    # ==========================================
    # Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "filename": "original_1_max_subarray.java",
        "file_path": "datasets/java_source-code/Multiple-E3/original_1_max_subarray.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "filename": "type1_formatting_1_max_subarray.java",
        "file_path": "datasets/java_source-code/Multiple-E3/type1_formatting_1_max_subarray.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "filename": "type2_renamed_1_max_subarray.java",
        "file_path": "datasets/java_source-code/Multiple-E3/type2_renamed_1_max_subarray.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "filename": "type3_reverse_1_max_subarray.java",
        "file_path": "datasets/java_source-code/Multiple-E3/type3_reverse_1_max_subarray.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "filename": "type3_if_else_1_max_subarray.java",
        "file_path": "datasets/java_source-code/Multiple-E3/type3_if_else_1_max_subarray.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "filename": "type3_composite_1_max_subarray.java",
        "file_path": "datasets/java_source-code/Multiple-E3/type3_composite_1_max_subarray.java",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "filename": "organic_divide_conquer_1_max_subarray.java",
        "file_path": "datasets/java_source-code/Multiple-E3/organic_divide_conquer_1_max_subarray.java",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "filename": "type1_divide_conquer_clone_1_max_subarray.java",
        "file_path": "datasets/java_source-code/Multiple-E3/type1_divide_conquer_clone_1_max_subarray.java",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "filename": "organic_prefix_sum_1_max_subarray.java",
        "file_path": "datasets/java_source-code/Multiple-E3/organic_prefix_sum_1_max_subarray.java",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping) Java",
        "filename": "type2_prefix_sum_clone_1_max_subarray.java",
        "file_path": "datasets/java_source-code/Multiple-E3/type2_prefix_sum_clone_1_max_subarray.java",
    },

    # ==========================================
    # Multiple-E 4: Substring Search (Control Flow Obfuscation) Java
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "filename": "original_1_substring_search.java",
        "file_path": "datasets/java_source-code/Multiple-E4/original_1_substring_search.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "filename": "type1_formatting_1_substring_search.java",
        "file_path": "datasets/java_source-code/Multiple-E4/type1_formatting_1_substring_search.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "filename": "type2_renamed_1_substring_search.java",
        "file_path": "datasets/java_source-code/Multiple-E4/type2_renamed_1_substring_search.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "filename": "type3_boolflag_1_substring_search.java",
        "file_path": "datasets/java_source-code/Multiple-E4/type3_boolflag_1_substring_search.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "filename": "type3_while_1_substring_search.java",
        "file_path": "datasets/java_source-code/Multiple-E4/type3_while_1_substring_search.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "filename": "type3_composite_1_substring_search.java",
        "file_path": "datasets/java_source-code/Multiple-E4/type3_composite_1_substring_search.java",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "filename": "organic_slicing_1_substring_search.java",
        "file_path": "datasets/java_source-code/Multiple-E4/organic_slicing_1_substring_search.java",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "filename": "type1_slicing_clone_1_substring_search.java",
        "file_path": "datasets/java_source-code/Multiple-E4/type1_slicing_clone_1_substring_search.java",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "filename": "organic_kmp_1_substring_search.java",
        "file_path": "datasets/java_source-code/Multiple-E4/organic_kmp_1_substring_search.java",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation) Java",
        "filename": "type2_kmp_clone_1_substring_search.java",
        "file_path": "datasets/java_source-code/Multiple-E4/type2_kmp_clone_1_substring_search.java",
    },
    # ==========================================
    # Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_01_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_01_merge_sort.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_02_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_02_merge_sort.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_03_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_03_merge_sort.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_04_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_04_merge_sort.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_05_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_05_merge_sort.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_06_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_06_merge_sort.java",
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_07_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_07_merge_sort.java",
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_08_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_08_merge_sort.java",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_09_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_09_merge_sort.java",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_10_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_10_merge_sort.java",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_11_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_11_merge_sort.java",
    },
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_12_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_12_merge_sort.java",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_13_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_13_merge_sort.java",
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_14_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_14_merge_sort.java",
    },
    {
        "student_username": "Chris",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_15_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_15_merge_sort.java",
    },
    {
        "student_username": "Jake",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_16_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_16_merge_sort.java",
    },
    {
        "student_username": "Kyle",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_17_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_17_merge_sort.java",
    },
    {
        "student_username": "Cyrus",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_18_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_18_merge_sort.java",
    },
    {
        "student_username": "Jr",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_19_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_19_merge_sort.java",
    },
    {
        "student_username": "Andrei",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_20_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_20_merge_sort.java",
    },
    {
        "student_username": "Tricia",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_21_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_21_merge_sort.java",
    },
    {
        "student_username": "Tatin",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_22_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_22_merge_sort.java",
    },
    {
        "student_username": "Pauline",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_23_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_23_merge_sort.java",
    },
    {
        "student_username": "Che",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "organic_24_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/organic_24_merge_sort.java",
    },
    {
        "student_username": "Kiko",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "type1_exact_25_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/type1_exact_25_merge_sort.java",
    },
    {
        "student_username": "Darrel",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "type1_exact_26_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/type1_exact_26_merge_sort.java",
    },
    {
        "student_username": "Edrian",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "type1_exact_27_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/type1_exact_27_merge_sort.java",
    },
    {
        "student_username": "Sean",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "type2_renamed_28_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/type2_renamed_28_merge_sort.java",
    },
    {
        "student_username": "Hannah",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "type2_renamed_29_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/type2_renamed_29_merge_sort.java",
    },
    {
        "student_username": "Stark",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "type2_renamed_30_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/type2_renamed_30_merge_sort.java",
    },
    {
        "student_username": "Juan",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "type3_structural_31_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/type3_structural_31_merge_sort.java",
    },
    {
        "student_username": "Jose",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "type3_structural_32_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/type3_structural_32_merge_sort.java",
    },
    {
        "student_username": "Angelo",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "type3_structural_33_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/type3_structural_33_merge_sort.java",
    },
    {
        "student_username": "Joshua",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "type3_structural_34_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/type3_structural_34_merge_sort.java",
    },
    {
        "student_username": "Bea",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "mixed_attack_35_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/mixed_attack_35_merge_sort.java",
    },
    {
        "student_username": "Danica",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions) Java",
        "filename": "mixed_attack_36_merge_sort.java",
        "file_path": "datasets/java_source-code/Multiple-F1/mixed_attack_36_merge_sort.java",
    },

    # ==========================================
    # Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_01_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_01_bst.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_02_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_02_bst.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_03_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_03_bst.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_04_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_04_bst.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_05_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_05_bst.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_06_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_06_bst.java",
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_07_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_07_bst.java",
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_08_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_08_bst.java",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_09_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_09_bst.java",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_10_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_10_bst.java",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_11_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_11_bst.java",
    },
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_12_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_12_bst.java",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_13_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_13_bst.java",
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_14_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_14_bst.java",
    },
    {
        "student_username": "Chris",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_15_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_15_bst.java",
    },
    {
        "student_username": "Jake",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_16_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_16_bst.java",
    },
    {
        "student_username": "Kyle",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_17_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_17_bst.java",
    },
    {
        "student_username": "Cyrus",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_18_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_18_bst.java",
    },
    {
        "student_username": "Jr",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_19_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_19_bst.java",
    },
    {
        "student_username": "Andrei",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_20_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_20_bst.java",
    },
    {
        "student_username": "Tricia",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_21_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_21_bst.java",
    },
    {
        "student_username": "Tatin",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_22_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_22_bst.java",
    },
    {
        "student_username": "Pauline",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_23_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_23_bst.java",
    },
    {
        "student_username": "Che",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_24_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_24_bst.java",
    },
    {
        "student_username": "Kiko",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_25_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_25_bst.java",
    },
    {
        "student_username": "Darrel",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_26_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_26_bst.java",
    },
    {
        "student_username": "Edrian",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_27_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_27_bst.java",
    },
    {
        "student_username": "Sean",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "organic_28_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/organic_28_bst.java",
    },
    {
        "student_username": "Hannah",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type1_exact_29_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type1_exact_29_bst.java",
    },
    {
        "student_username": "Stark",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type1_exact_30_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type1_exact_30_bst.java",
    },
    {
        "student_username": "Juan",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type1_exact_31_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type1_exact_31_bst.java",
    },
    {
        "student_username": "Jose",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type1_exact_32_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type1_exact_32_bst.java",
    },
    {
        "student_username": "Angelo",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type2_renamed_33_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type2_renamed_33_bst.java",
    },
    {
        "student_username": "Joshua",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type2_renamed_34_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type2_renamed_34_bst.java",
    },
    {
        "student_username": "Bea",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type2_renamed_35_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type2_renamed_35_bst.java",
    },
    {
        "student_username": "Danica",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type2_renamed_36_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type2_renamed_36_bst.java",
    },
    {
        "student_username": "Erika",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type3_structural_37_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type3_structural_37_bst.java",
    },
    {
        "student_username": "Francine",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type3_structural_38_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type3_structural_38_bst.java",
    },
    {
        "student_username": "Gabriel",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type3_structural_39_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type3_structural_39_bst.java",
    },
    {
        "student_username": "Justine",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "type3_structural_40_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/type3_structural_40_bst.java",
    },
    {
        "student_username": "Liezel",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "mixed_attack_41_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/mixed_attack_41_bst.java",
    },
    {
        "student_username": "Miguel",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions) Java",
        "filename": "mixed_attack_42_bst.java",
        "file_path": "datasets/java_source-code/Multiple-F2/mixed_attack_42_bst.java",
    },

    # ==========================================
    # DSA Clone Benchmarks (Java - 4CSC)
    # ==========================================
    # BST: Clone Benchmark (Java)
    {
        "student_username": "Mary",
        "assignment_title": "BST: Clone Benchmark (Java)",
        "filename": "original.java",
        "file_path": "datasets/java_source-code/binary_search_tree/original.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "BST: Clone Benchmark (Java)",
        "filename": "type_1_exact.java",
        "file_path": "datasets/java_source-code/binary_search_tree/type_1_exact.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "BST: Clone Benchmark (Java)",
        "filename": "type_2_renamed.java",
        "file_path": "datasets/java_source-code/binary_search_tree/type_2_renamed.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "BST: Clone Benchmark (Java)",
        "filename": "type_2_renamed2.java",
        "file_path": "datasets/java_source-code/binary_search_tree/type_2_renamed2.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "BST: Clone Benchmark (Java)",
        "filename": "type_3_structural.java",
        "file_path": "datasets/java_source-code/binary_search_tree/type_3_structural.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "BST: Clone Benchmark (Java)",
        "filename": "type_3_structural2.java",
        "file_path": "datasets/java_source-code/binary_search_tree/type_3_structural2.java",
    },
    # Binary Tree: Clone Benchmark (Java)
    {
        "student_username": "Mary",
        "assignment_title": "Binary Tree: Clone Benchmark (Java)",
        "filename": "original.java",
        "file_path": "datasets/java_source-code/binary_tree/original.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Binary Tree: Clone Benchmark (Java)",
        "filename": "type_2_renamed.java",
        "file_path": "datasets/java_source-code/binary_tree/type_2_renamed.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Binary Tree: Clone Benchmark (Java)",
        "filename": "type_2_renamed2.java",
        "file_path": "datasets/java_source-code/binary_tree/type_2_renamed2.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Binary Tree: Clone Benchmark (Java)",
        "filename": "type_3_structural.java",
        "file_path": "datasets/java_source-code/binary_tree/type_3_structural.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Binary Tree: Clone Benchmark (Java)",
        "filename": "type_3_structural2.java",
        "file_path": "datasets/java_source-code/binary_tree/type_3_structural2.java",
    },
    # Linked List: Clone Benchmark (Java)
    {
        "student_username": "Mary",
        "assignment_title": "Linked List: Clone Benchmark (Java)",
        "filename": "original.java",
        "file_path": "datasets/java_source-code/linked_list/original.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Linked List: Clone Benchmark (Java)",
        "filename": "type_1_exact.java",
        "file_path": "datasets/java_source-code/linked_list/type_1_exact.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Linked List: Clone Benchmark (Java)",
        "filename": "type_2_renamed.java",
        "file_path": "datasets/java_source-code/linked_list/type_2_renamed.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Linked List: Clone Benchmark (Java)",
        "filename": "type_2_renamed2.java",
        "file_path": "datasets/java_source-code/linked_list/type_2_renamed2.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Linked List: Clone Benchmark (Java)",
        "filename": "type_3_structural.java",
        "file_path": "datasets/java_source-code/linked_list/type_3_structural.java",
    },
    # Merge Sort: Clone Benchmark (Java)
    {
        "student_username": "Mary",
        "assignment_title": "Merge Sort: Clone Benchmark (Java)",
        "filename": "original.java",
        "file_path": "datasets/java_source-code/merge_sort/original.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Merge Sort: Clone Benchmark (Java)",
        "filename": "type_1_exact.java",
        "file_path": "datasets/java_source-code/merge_sort/type_1_exact.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Merge Sort: Clone Benchmark (Java)",
        "filename": "type_2_renamed.java",
        "file_path": "datasets/java_source-code/merge_sort/type_2_renamed.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Merge Sort: Clone Benchmark (Java)",
        "filename": "type_2_renamed2.java",
        "file_path": "datasets/java_source-code/merge_sort/type_2_renamed2.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Merge Sort: Clone Benchmark (Java)",
        "filename": "type_3_structural.java",
        "file_path": "datasets/java_source-code/merge_sort/type_3_structural.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Merge Sort: Clone Benchmark (Java)",
        "filename": "type_3_structural2.java",
        "file_path": "datasets/java_source-code/merge_sort/type_3_structural2.java",
    },
    # Quick Sort: Clone Benchmark (Java)
    {
        "student_username": "Mary",
        "assignment_title": "Quick Sort: Clone Benchmark (Java)",
        "filename": "original.java",
        "file_path": "datasets/java_source-code/quick_sort/original.java",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Quick Sort: Clone Benchmark (Java)",
        "filename": "type_1_exact_of_copy.java",
        "file_path": "datasets/java_source-code/quick_sort/type_1_exact_of_copy.java",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Quick Sort: Clone Benchmark (Java)",
        "filename": "type_2_renamed.java",
        "file_path": "datasets/java_source-code/quick_sort/type_2_renamed.java",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Quick Sort: Clone Benchmark (Java)",
        "filename": "type_2_renamed2.java",
        "file_path": "datasets/java_source-code/quick_sort/type_2_renamed2.java",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Quick Sort: Clone Benchmark (Java)",
        "filename": "type_3_structural.java",
        "file_path": "datasets/java_source-code/quick_sort/type_3_structural.java",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Quick Sort: Clone Benchmark (Java)",
        "filename": "type_3_structural2.java",
        "file_path": "datasets/java_source-code/quick_sort/type_3_structural2.java",
    },
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