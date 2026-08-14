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
    },
    # ==========================================
    # Multiple Files (Python)
    # ==========================================

    # ==========================================
    # Multiple-A 1: Binary Search (Control Group)
    # 8 organic · 1 unique · 1 exact copy
    # ==========================================

    # --- Organic (independently written) ---
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group)",
        "filename": "organic1_binary_search.py",
        "file_path": "datasets/python_source-code/Multiple-A1/organic1_binary_search.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group)",
        "filename": "organic2_binary_search.py",
        "file_path": "datasets/python_source-code/Multiple-A1/organic2_binary_search.py"
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group)",
        "filename": "organic3_binary_search.py",
        "file_path": "datasets/python_source-code/Multiple-A1/organic3_binary_search.py"
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group)",
        "filename": "organic4_binary_search.py",
        "file_path": "datasets/python_source-code/Multiple-A1/organic4_binary_search.py"
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group)",
        "filename": "organic5_binary_search.py",
        "file_path": "datasets/python_source-code/Multiple-A1/organic5_binary_search.py"
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group)",
        "filename": "organic6_binary_search.py",
        "file_path": "datasets/python_source-code/Multiple-A1/organic6_binary_search.py"
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group)",
        "filename": "organic7_binary_search.py",
        "file_path": "datasets/python_source-code/Multiple-A1/organic7_binary_search.py"
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group)",
        "filename": "organic8_binary_search.py",
        "file_path": "datasets/python_source-code/Multiple-A1/organic8_binary_search.py"
    },

    # --- Unique baseline ---
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group)",
        "filename": "unique1_binary_search.py",
        "file_path": "datasets/python_source-code/Multiple-A1/unique1_binary_search.py"
    },

    # --- Exact copy of Rachel's unique1 ---
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-A 1: Binary Search (Control Group)",
        "filename": "exact_copy1_binary_search.py",
        "file_path": "datasets/python_source-code/Multiple-A1/exact_copy1_binary_search.py"
    },

    # ==========================================
    # Multiple-A 2: Bubble Sort (Renamed & Reformatted)
    # 8 organic · 1 unique · 1 exact copy · 1 renamed · 1 reformatted
    # ==========================================

    # --- Organic (independently written) ---
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "organic1_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/organic1_bubble_sort.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "organic2_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/organic2_bubble_sort.py"
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "organic3_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/organic3_bubble_sort.py"
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "organic4_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/organic4_bubble_sort.py"
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "organic5_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/organic5_bubble_sort.py"
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "organic6_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/organic6_bubble_sort.py"
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "organic7_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/organic7_bubble_sort.py"
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "organic8_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/organic8_bubble_sort.py"
    },

    # --- Unique baseline ---
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "unique1_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/unique1_bubble_sort.py"
    },

    # --- Exact copy of Rachel's unique1 ---
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "exact_copy1_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/exact_copy1_bubble_sort.py"
    },

    # --- Renamed variant of Rachel's unique1 ---
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "renamed1_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/renamed1_bubble_sort.py"
    },

    # --- Reformatted variant of Rachel's unique1 ---   
    {
        "student_username": "Jake",
        "assignment_title": "Multiple-A 2: Bubble Sort (Renamed & Reformatted)",
        "filename": "reformatted1_bubble_sort.py",
        "file_path": "datasets/python_source-code/Multiple-A2/reformatted1_bubble_sort.py"
    },

    # ==========================================
    # Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)
    # 10 organic · 2 unique · 2 exact copy · 1 renamed
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "organic_1.py",
        "file_path": "datasets/python_source-code/Multiple-A3/organic_1.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "organic_2.py",
        "file_path": "datasets/python_source-code/Multiple-A3/organic_2.py"
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "organic_3.py",
        "file_path": "datasets/python_source-code/Multiple-A3/organic_3.py"
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "organic_4.py",
        "file_path": "datasets/python_source-code/Multiple-A3/organic_4.py"
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "organic_5.py",
        "file_path": "datasets/python_source-code/Multiple-A3/organic_5.py"
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "organic_6.py",
        "file_path": "datasets/python_source-code/Multiple-A3/organic_6.py"
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "organic_7.py",
        "file_path": "datasets/python_source-code/Multiple-A3/organic_7.py"
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "organic_8.py",
        "file_path": "datasets/python_source-code/Multiple-A3/organic_8.py"
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "organic_9.py",
        "file_path": "datasets/python_source-code/Multiple-A3/organic_9.py"
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "organic_10.py",
        "file_path": "datasets/python_source-code/Multiple-A3/organic_10.py"
    },
 
    # ---------- 1 unique (should NOT match anything) ----------
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "unique_1.py",
        "file_path": "datasets/python_source-code/Multiple-A3/unique_1.py"
    },
 
    # ---------- 3 disguised copies (all derived from organic_1 / Mary) ----------
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "reordered_1.py",
        "file_path": "datasets/python_source-code/Multiple-A3/reordered_1.py"
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "method_extracted_1.py",
        "file_path": "datasets/python_source-code/Multiple-A3/method_extracted_1.py"
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-A 3: 0/1 Knapsack (High-Diversity Control Group)",
        "filename": "control_flow_swapped_1.py",
        "file_path": "datasets/python_source-code/Multiple-A3/control_flow_swapped_1.py"
    },
    # ==========================================
    # Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)
    # 10 organic · 2 unique · 2 exact copy · 1 renamed
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "organic_1.py",
        "file_path": "datasets/python_source-code/Multiple-B1/organic_1.py"
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "organic_2.py",
        "file_path": "datasets/python_source-code/Multiple-B1/organic_2.py"
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "organic_3.py",
        "file_path": "datasets/python_source-code/Multiple-B1/organic_3.py"
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "organic_4.py",
        "file_path": "datasets/python_source-code/Multiple-B1/organic_4.py"
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "organic_5.py",
        "file_path": "datasets/python_source-code/Multiple-B1/organic_5.py"
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "organic_6.py",
        "file_path": "datasets/python_source-code/Multiple-B1/organic_6.py"
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "organic_7.py",
        "file_path": "datasets/python_source-code/Multiple-B1/organic_7.py"
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "organic_8.py",
        "file_path": "datasets/python_source-code/Multiple-B1/organic_8.py"
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "organic_9.py",
        "file_path": "datasets/python_source-code/Multiple-B1/organic_9.py"
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "organic_10.py",
        "file_path": "datasets/python_source-code/Multiple-B1/organic_10.py"
    },
 
    # ---------- 2 unique sources (recursive + iterative families) ----------
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "unique_recursive_1.py",
        "file_path": "datasets/python_source-code/Multiple-B1/unique_recursive_1.py"
    },
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "unique_iterative_1.py",
        "file_path": "datasets/python_source-code/Multiple-B1/unique_iterative_1.py"
    },
 
    # ---------- 2 exact copies ----------
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "exact_copy_recursive_1.py",
        "file_path": "datasets/python_source-code/Multiple-B1/exact_copy_recursive_1.py"
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "exact_copy_iterative_1.py",
        "file_path": "datasets/python_source-code/Multiple-B1/exact_copy_iterative_1.py"
    },
 
    # ---------- 1 renamed+reordered combo ----------
    {
        "student_username": "Chris",
        "assignment_title": "Multiple-B 1: Linked List Reversal (Reordering & Method Extraction)",
        "filename": "renamed_reordered_combo_1.py",
        "file_path": "datasets/python_source-code/Multiple-B1/renamed_reordered_combo_1.py"
    },
    # ==========================================
    # Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)
    # 9 organic · 1 unique · 1 exact copy · 1 dead-code injected
    # ==========================================

    # ---------- 9 organic (independent) ----------
        {
            "student_username": "Mary",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "organic_1.py",
            "file_path": "datasets/python_source-code/Multiple-B2/organic_1.py"
        },
        {
            "student_username": "Charles",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "organic_2.py",
            "file_path": "datasets/python_source-code/Multiple-B2/organic_2.py"
        },
        {
            "student_username": "Nicolo",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "organic_3.py",
            "file_path": "datasets/python_source-code/Multiple-B2/organic_3.py"
        },
        {
            "student_username": "Dan",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "organic_4.py",
            "file_path": "datasets/python_source-code/Multiple-B2/organic_4.py"
        },
        {
            "student_username": "Ramon",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "organic_5.py",
            "file_path": "datasets/python_source-code/Multiple-B2/organic_5.py"
        },
        {
            "student_username": "Jude",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "organic_6.py",
            "file_path": "datasets/python_source-code/Multiple-B2/organic_6.py"
        },
        {
            "student_username": "Jm",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "organic_7.py",
            "file_path": "datasets/python_source-code/Multiple-B2/organic_7.py"
        },
        {
            "student_username": "Patrick",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "organic_8.py",
            "file_path": "datasets/python_source-code/Multiple-B2/organic_8.py"
        },
        {
            "student_username": "Rachel",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "organic_9.py",
            "file_path": "datasets/python_source-code/Multiple-B2/organic_9.py"
        },
    
        # ---------- 1 unique source ----------
        {
            "student_username": "Karo",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "unique_1.py",
            "file_path": "datasets/python_source-code/Multiple-B2/unique_1.py"
        },
    
        # ---------- 1 exact copy ----------
        {
            "student_username": "Sol",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "exact_copy_1.py",
            "file_path": "datasets/python_source-code/Multiple-B2/exact_copy_1.py"
        },
    
        # ---------- 1 dead-code injected ----------
        {
            "student_username": "Ramil",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "dead_code_injected_1.py",
            "file_path": "datasets/python_source-code/Multiple-B2/dead_code_injected_1.py"
        },
    
        # ---------- 1 logic-substituted ----------
        {
            "student_username": "Alex",
            "assignment_title": "Multiple-B 2: Binary Tree Traversal (Multi-Family Structural Changes)",
            "filename": "logic_substituted_1.py",
            "file_path": "datasets/python_source-code/Multiple-B2/logic_substituted_1.py"
        },

        # ==========================================


        {
        "student_username": "Mary",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "organic_1.py",
        "file_path": "datasets/python_source-code/Multiple-C1/organic_1.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "organic_2.py",
        "file_path": "datasets/python_source-code/Multiple-C1/organic_2.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "organic_3.py",
        "file_path": "datasets/python_source-code/Multiple-C1/organic_3.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "organic_4.py",
        "file_path": "datasets/python_source-code/Multiple-C1/organic_4.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "organic_5.py",
        "file_path": "datasets/python_source-code/Multiple-C1/organic_5.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "organic_6.py",
        "file_path": "datasets/python_source-code/Multiple-C1/organic_6.py",
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "organic_7.py",
        "file_path": "datasets/python_source-code/Multiple-C1/organic_7.py",
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "organic_8.py",
        "file_path": "datasets/python_source-code/Multiple-C1/organic_8.py",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "organic_9.py",
        "file_path": "datasets/python_source-code/Multiple-C1/organic_9.py",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "organic_10.py",
        "file_path": "datasets/python_source-code/Multiple-C1/organic_10.py",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "unique_1.py",
        "file_path": "datasets/python_source-code/Multiple-C1/unique_1.py",
    },
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "exact_copy_1.py",
        "file_path": "datasets/python_source-code/Multiple-C1/exact_copy_1.py",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "renamed_1.py",
        "file_path": "datasets/python_source-code/Multiple-C1/renamed_1.py",
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "structural_recursion_1.py",
        "file_path": "datasets/python_source-code/Multiple-C1/structural_recursion_1.py",
    },
    {
        "student_username": "Chris",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "mixed_attack_1.py",
        "file_path": "datasets/python_source-code/Multiple-C1/mixed_attack_1.py",
    },
    {
        "student_username": "Jake",
        "assignment_title": "Multiple-C 1: Two Sum (Dead Code & Logic Substitution)",
        "filename": "triple_combo_1.py",
        "file_path": "datasets/python_source-code/Multiple-C1/triple_combo_1.py",
    },
    # ==========================================

    {
        "student_username": "Mary",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "organic_1.py",
        "file_path": "datasets/python_source-code/Multiple-C2/organic_1.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "organic_2.py",
        "file_path": "datasets/python_source-code/Multiple-C2/organic_2.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "organic_3.py",
        "file_path": "datasets/python_source-code/Multiple-C2/organic_3.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "organic_4.py",
        "file_path": "datasets/python_source-code/Multiple-C2/organic_4.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "organic_5.py",
        "file_path": "datasets/python_source-code/Multiple-C2/organic_5.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "organic_6.py",
        "file_path": "datasets/python_source-code/Multiple-C2/organic_6.py",
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "organic_7.py",
        "file_path": "datasets/python_source-code/Multiple-C2/organic_7.py",
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "organic_8.py",
        "file_path": "datasets/python_source-code/Multiple-C2/organic_8.py",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "organic_9.py",
        "file_path": "datasets/python_source-code/Multiple-C2/organic_9.py",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "unique_1.py",
        "file_path": "datasets/python_source-code/Multiple-C2/unique_1.py",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-C 2: Graph BFS (Full Taxonomy Stress Test)",
        "filename": "exact_copy_1.py",
        "file_path": "datasets/python_source-code/Multiple-C2/exact_copy_1.py",
    },

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