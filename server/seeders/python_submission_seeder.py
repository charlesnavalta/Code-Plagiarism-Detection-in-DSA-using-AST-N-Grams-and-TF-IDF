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

    # ==========================================
        # ==========================================
    # Multiple-D 1: Quick Sort (Large Cohort)
    # 24 organic · 1 exact copy · 2 renamed · 2 structural · 1 mixed (30 students)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_1.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_1.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_2.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_2.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_3.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_3.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_4.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_4.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_5.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_5.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_6.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_6.py",
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_7.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_7.py",
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_8.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_8.py",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_9.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_9.py",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_10.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_10.py",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_11.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_11.py",
    },
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_12.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_12.py",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_13.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_13.py",
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_14.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_14.py",
    },
    {
        "student_username": "Chris",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_15.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_15.py",
    },
    {
        "student_username": "Jake",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_16.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_16.py",
    },
    {
        "student_username": "Kyle",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_17.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_17.py",
    },
    {
        "student_username": "Cyrus",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_18.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_18.py",
    },
    {
        "student_username": "Jr",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_19.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_19.py",
    },
    {
        "student_username": "Andrei",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_20.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_20.py",
    },
    {
        "student_username": "Tricia",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_21.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_21.py",
    },
    {
        "student_username": "Tatin",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_22.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_22.py",
    },
    {
        "student_username": "Pauline",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_23.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_23.py",
    },
    {
        "student_username": "Che",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "organic_24.py",
        "file_path": "datasets/python_source-code/Multiple-D1/organic_24.py",
    },
    {
        "student_username": "Kiko",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "exact_copy_1.py",
        "file_path": "datasets/python_source-code/Multiple-D1/exact_copy_1.py",
    },
    {
        "student_username": "Darrel",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "renamed_1.py",
        "file_path": "datasets/python_source-code/Multiple-D1/renamed_1.py",
    },
    {
        "student_username": "Edrian",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "renamed_2.py",
        "file_path": "datasets/python_source-code/Multiple-D1/renamed_2.py",
    },
    {
        "student_username": "Sean",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "structural_1.py",
        "file_path": "datasets/python_source-code/Multiple-D1/structural_1.py",
    },
    {
        "student_username": "Hannah",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "structural_2.py",
        "file_path": "datasets/python_source-code/Multiple-D1/structural_2.py",
    },
    {
        "student_username": "Stark",
        "assignment_title": "Multiple-D 1: Quick Sort (Large Cohort)",
        "filename": "mixed_attack_1.py",
        "file_path": "datasets/python_source-code/Multiple-D1/mixed_attack_1.py",
    },
    # ==========================================
    # Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "filename": "original_1_grid_dfs.py",
        "file_path": "datasets/python_source-code/Multiple-E1/original_1_grid_dfs.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "filename": "type1_formatting_1_grid_dfs.py",
        "file_path": "datasets/python_source-code/Multiple-E1/type1_formatting_1_grid_dfs.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "filename": "type2_renamed_1_grid_dfs.py",
        "file_path": "datasets/python_source-code/Multiple-E1/type2_renamed_1_grid_dfs.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "filename": "type3_unrolled_1_grid_dfs.py",
        "file_path": "datasets/python_source-code/Multiple-E1/type3_unrolled_1_grid_dfs.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "filename": "type3_stack_1_grid_dfs.py",
        "file_path": "datasets/python_source-code/Multiple-E1/type3_stack_1_grid_dfs.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "filename": "type3_composite_1_grid_dfs.py",
        "file_path": "datasets/python_source-code/Multiple-E1/type3_composite_1_grid_dfs.py",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "filename": "organic_bfs_1_grid_dfs.py",
        "file_path": "datasets/python_source-code/Multiple-E1/organic_bfs_1_grid_dfs.py",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "filename": "type1_bfs_clone_1_grid_dfs.py",
        "file_path": "datasets/python_source-code/Multiple-E1/type1_bfs_clone_1_grid_dfs.py",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "filename": "organic_set_1_grid_dfs.py",
        "file_path": "datasets/python_source-code/Multiple-E1/organic_set_1_grid_dfs.py",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-E 1: Grid DFS (Recursive vs. Stack Traversal)",
        "filename": "type2_set_clone_1_grid_dfs.py",
        "file_path": "datasets/python_source-code/Multiple-E1/type2_set_clone_1_grid_dfs.py",
    },

    # ==========================================
    # Multiple-E 2: Frequency Counter (Data Structure Substitution)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "filename": "original_1_valid_parentheses.py",
        "file_path": "datasets/python_source-code/Multiple-E2/original_1_valid_parentheses.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "filename": "type1_formatting_1_valid_parentheses.py",
        "file_path": "datasets/python_source-code/Multiple-E2/type1_formatting_1_valid_parentheses.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "filename": "type2_renamed_1_valid_parentheses.py",
        "file_path": "datasets/python_source-code/Multiple-E2/type2_renamed_1_valid_parentheses.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "filename": "type3_arraysim_1_valid_parentheses.py",
        "file_path": "datasets/python_source-code/Multiple-E2/type3_arraysim_1_valid_parentheses.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "filename": "type3_if_elif_1_valid_parentheses.py",
        "file_path": "datasets/python_source-code/Multiple-E2/type3_if_elif_1_valid_parentheses.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "filename": "type3_composite_1_valid_parentheses.py",
        "file_path": "datasets/python_source-code/Multiple-E2/type3_composite_1_valid_parentheses.py",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "filename": "organic_replace_1_valid_parentheses.py",
        "file_path": "datasets/python_source-code/Multiple-E2/organic_replace_1_valid_parentheses.py",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "filename": "type1_replace_clone_1_valid_parentheses.py",
        "file_path": "datasets/python_source-code/Multiple-E2/type1_replace_clone_1_valid_parentheses.py",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "filename": "organic_string_1_valid_parentheses.py",
        "file_path": "datasets/python_source-code/Multiple-E2/organic_string_1_valid_parentheses.py",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-E 2: Frequency Counter (Data Structure Substitution)",
        "filename": "type2_string_clone_1_valid_parentheses.py",
        "file_path": "datasets/python_source-code/Multiple-E2/type2_string_clone_1_valid_parentheses.py",
    },

    # ==========================================
    # Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "filename": "original_1_max_subarray.py",
        "file_path": "datasets/python_source-code/Multiple-E3/original_1_max_subarray.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "filename": "type1_formatting_1_max_subarray.py",
        "file_path": "datasets/python_source-code/Multiple-E3/type1_formatting_1_max_subarray.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "filename": "type2_renamed_1_max_subarray.py",
        "file_path": "datasets/python_source-code/Multiple-E3/type2_renamed_1_max_subarray.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "filename": "type3_reverse_1_max_subarray.py",
        "file_path": "datasets/python_source-code/Multiple-E3/type3_reverse_1_max_subarray.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "filename": "type3_if_else_1_max_subarray.py",
        "file_path": "datasets/python_source-code/Multiple-E3/type3_if_else_1_max_subarray.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "filename": "type3_composite_1_max_subarray.py",
        "file_path": "datasets/python_source-code/Multiple-E3/type3_composite_1_max_subarray.py",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "filename": "organic_divide_conquer_1_max_subarray.py",
        "file_path": "datasets/python_source-code/Multiple-E3/organic_divide_conquer_1_max_subarray.py",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "filename": "type1_divide_conquer_clone_1_max_subarray.py",
        "file_path": "datasets/python_source-code/Multiple-E3/type1_divide_conquer_clone_1_max_subarray.py",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "filename": "organic_prefix_sum_1_max_subarray.py",
        "file_path": "datasets/python_source-code/Multiple-E3/organic_prefix_sum_1_max_subarray.py",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-E 3: Range Accumulator (Directional Reversal & Function Stripping)",
        "filename": "type2_prefix_sum_clone_1_max_subarray.py",
        "file_path": "datasets/python_source-code/Multiple-E3/type2_prefix_sum_clone_1_max_subarray.py",
    },

    # ==========================================
    # Multiple-E 4: Substring Search (Control Flow Obfuscation)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "filename": "original_1_substring_search.py",
        "file_path": "datasets/python_source-code/Multiple-E4/original_1_substring_search.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "filename": "type1_formatting_1_substring_search.py",
        "file_path": "datasets/python_source-code/Multiple-E4/type1_formatting_1_substring_search.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "filename": "type2_renamed_1_substring_search.py",
        "file_path": "datasets/python_source-code/Multiple-E4/type2_renamed_1_substring_search.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "filename": "type3_boolflag_1_substring_search.py",
        "file_path": "datasets/python_source-code/Multiple-E4/type3_boolflag_1_substring_search.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "filename": "type3_while_1_substring_search.py",
        "file_path": "datasets/python_source-code/Multiple-E4/type3_while_1_substring_search.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "filename": "type3_composite_1_substring_search.py",
        "file_path": "datasets/python_source-code/Multiple-E4/type3_composite_1_substring_search.py",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "filename": "organic_slicing_1_substring_search.py",
        "file_path": "datasets/python_source-code/Multiple-E4/organic_slicing_1_substring_search.py",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "filename": "type1_slicing_clone_1_substring_search.py",
        "file_path": "datasets/python_source-code/Multiple-E4/type1_slicing_clone_1_substring_search.py",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "filename": "organic_kmp_1_substring_search.py",
        "file_path": "datasets/python_source-code/Multiple-E4/organic_kmp_1_substring_search.py",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-E 4: Substring Search (Control Flow Obfuscation)",
        "filename": "type2_kmp_clone_1_substring_search.py",
        "file_path": "datasets/python_source-code/Multiple-E4/type2_kmp_clone_1_substring_search.py",
    },
    # ==========================================
    # Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_01_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_01_merge_sort.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_02_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_02_merge_sort.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_03_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_03_merge_sort.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_04_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_04_merge_sort.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_05_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_05_merge_sort.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_06_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_06_merge_sort.py",
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_07_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_07_merge_sort.py",
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_08_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_08_merge_sort.py",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_09_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_09_merge_sort.py",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_10_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_10_merge_sort.py",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_11_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_11_merge_sort.py",
    },
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_12_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_12_merge_sort.py",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_13_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_13_merge_sort.py",
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_14_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_14_merge_sort.py",
    },
    {
        "student_username": "Chris",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_15_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_15_merge_sort.py",
    },
    {
        "student_username": "Jake",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_16_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_16_merge_sort.py",
    },
    {
        "student_username": "Kyle",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_17_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_17_merge_sort.py",
    },
    {
        "student_username": "Cyrus",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_18_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_18_merge_sort.py",
    },
    {
        "student_username": "Jr",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_19_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_19_merge_sort.py",
    },
    {
        "student_username": "Andrei",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_20_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_20_merge_sort.py",
    },
    {
        "student_username": "Tricia",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_21_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_21_merge_sort.py",
    },
    {
        "student_username": "Tatin",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_22_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_22_merge_sort.py",
    },
    {
        "student_username": "Pauline",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_23_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_23_merge_sort.py",
    },
    {
        "student_username": "Che",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "organic_24_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/organic_24_merge_sort.py",
    },
    {
        "student_username": "Kiko",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "type1_exact_25_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/type1_exact_25_merge_sort.py",
    },
    {
        "student_username": "Darrel",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "type1_exact_26_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/type1_exact_26_merge_sort.py",
    },
    {
        "student_username": "Edrian",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "type1_exact_27_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/type1_exact_27_merge_sort.py",
    },
    {
        "student_username": "Sean",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "type2_renamed_28_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/type2_renamed_28_merge_sort.py",
    },
    {
        "student_username": "Hannah",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "type2_renamed_29_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/type2_renamed_29_merge_sort.py",
    },
    {
        "student_username": "Stark",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "type2_renamed_30_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/type2_renamed_30_merge_sort.py",
    },
    {
        "student_username": "Juan",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "type3_structural_31_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/type3_structural_31_merge_sort.py",
    },
    {
        "student_username": "Jose",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "type3_structural_32_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/type3_structural_32_merge_sort.py",
    },
    {
        "student_username": "Angelo",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "type3_structural_33_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/type3_structural_33_merge_sort.py",
    },
    {
        "student_username": "Joshua",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "type3_structural_34_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/type3_structural_34_merge_sort.py",
    },
    {
        "student_username": "Bea",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "mixed_attack_35_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/mixed_attack_35_merge_sort.py",
    },
    {
        "student_username": "Danica",
        "assignment_title": "Multiple-F 1: Merge Sort (Large Cohort - 36 Submissions)",
        "filename": "mixed_attack_36_merge_sort.py",
        "file_path": "datasets/python_source-code/Multiple-F1/mixed_attack_36_merge_sort.py",
    },

    # ==========================================
    # Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)
    # ==========================================
    {
        "student_username": "Mary",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_01_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_01_bst.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_02_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_02_bst.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_03_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_03_bst.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_04_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_04_bst.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_05_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_05_bst.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_06_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_06_bst.py",
    },
    {
        "student_username": "Jm",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_07_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_07_bst.py",
    },
    {
        "student_username": "Patrick",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_08_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_08_bst.py",
    },
    {
        "student_username": "Rachel",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_09_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_09_bst.py",
    },
    {
        "student_username": "Karo",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_10_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_10_bst.py",
    },
    {
        "student_username": "Sol",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_11_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_11_bst.py",
    },
    {
        "student_username": "Ramil",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_12_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_12_bst.py",
    },
    {
        "student_username": "Alex",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_13_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_13_bst.py",
    },
    {
        "student_username": "Sam",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_14_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_14_bst.py",
    },
    {
        "student_username": "Chris",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_15_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_15_bst.py",
    },
    {
        "student_username": "Jake",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_16_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_16_bst.py",
    },
    {
        "student_username": "Kyle",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_17_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_17_bst.py",
    },
    {
        "student_username": "Cyrus",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_18_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_18_bst.py",
    },
    {
        "student_username": "Jr",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_19_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_19_bst.py",
    },
    {
        "student_username": "Andrei",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_20_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_20_bst.py",
    },
    {
        "student_username": "Tricia",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_21_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_21_bst.py",
    },
    {
        "student_username": "Tatin",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_22_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_22_bst.py",
    },
    {
        "student_username": "Pauline",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_23_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_23_bst.py",
    },
    {
        "student_username": "Che",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_24_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_24_bst.py",
    },
    {
        "student_username": "Kiko",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_25_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_25_bst.py",
    },
    {
        "student_username": "Darrel",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_26_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_26_bst.py",
    },
    {
        "student_username": "Edrian",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_27_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_27_bst.py",
    },
    {
        "student_username": "Sean",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "organic_28_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/organic_28_bst.py",
    },
    {
        "student_username": "Hannah",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type1_exact_29_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type1_exact_29_bst.py",
    },
    {
        "student_username": "Stark",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type1_exact_30_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type1_exact_30_bst.py",
    },
    {
        "student_username": "Juan",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type1_exact_31_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type1_exact_31_bst.py",
    },
    {
        "student_username": "Jose",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type1_exact_32_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type1_exact_32_bst.py",
    },
    {
        "student_username": "Angelo",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type2_renamed_33_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type2_renamed_33_bst.py",
    },
    {
        "student_username": "Joshua",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type2_renamed_34_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type2_renamed_34_bst.py",
    },
    {
        "student_username": "Bea",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type2_renamed_35_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type2_renamed_35_bst.py",
    },
    {
        "student_username": "Danica",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type2_renamed_36_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type2_renamed_36_bst.py",
    },
    {
        "student_username": "Erika",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type3_structural_37_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type3_structural_37_bst.py",
    },
    {
        "student_username": "Francine",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type3_structural_38_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type3_structural_38_bst.py",
    },
    {
        "student_username": "Gabriel",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type3_structural_39_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type3_structural_39_bst.py",
    },
    {
        "student_username": "Justine",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "type3_structural_40_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/type3_structural_40_bst.py",
    },
    {
        "student_username": "Liezel",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "mixed_attack_41_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/mixed_attack_41_bst.py",
    },
    {
        "student_username": "Miguel",
        "assignment_title": "Multiple-F 2: Binary Search Tree (Large Cohort - 42 Submissions)",
        "filename": "mixed_attack_42_bst.py",
        "file_path": "datasets/python_source-code/Multiple-F2/mixed_attack_42_bst.py",
    },

    # ==========================================
    # DSA Clone Benchmarks (Python - 3CSD)
    # ==========================================
    # BST: Clone Benchmark (Python)
    {
        "student_username": "Mary",
        "assignment_title": "BST: Clone Benchmark (Python)",
        "filename": "original.py",
        "file_path": "datasets/python_source-code/binary_search_tree/original.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "BST: Clone Benchmark (Python)",
        "filename": "type_1_exact.py",
        "file_path": "datasets/python_source-code/binary_search_tree/type_1_exact.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "BST: Clone Benchmark (Python)",
        "filename": "type_2_renamed.py",
        "file_path": "datasets/python_source-code/binary_search_tree/type_2_renamed.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "BST: Clone Benchmark (Python)",
        "filename": "type_2_renamed2.py",
        "file_path": "datasets/python_source-code/binary_search_tree/type_2_renamed2.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "BST: Clone Benchmark (Python)",
        "filename": "type_3_structural.py",
        "file_path": "datasets/python_source-code/binary_search_tree/type_3_structural.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "BST: Clone Benchmark (Python)",
        "filename": "type_3_structural2.py",
        "file_path": "datasets/python_source-code/binary_search_tree/type_3_structural2.py",
    },
    # Binary Tree: Clone Benchmark (Python)
    {
        "student_username": "Mary",
        "assignment_title": "Binary Tree: Clone Benchmark (Python)",
        "filename": "original.py",
        "file_path": "datasets/python_source-code/binary_tree/original.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Binary Tree: Clone Benchmark (Python)",
        "filename": "type_2_renamed.py",
        "file_path": "datasets/python_source-code/binary_tree/type_2_renamed.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Binary Tree: Clone Benchmark (Python)",
        "filename": "type_2_renamed2.py",
        "file_path": "datasets/python_source-code/binary_tree/type_2_renamed2.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Binary Tree: Clone Benchmark (Python)",
        "filename": "type_3_structural.py",
        "file_path": "datasets/python_source-code/binary_tree/type_3_structural.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Binary Tree: Clone Benchmark (Python)",
        "filename": "type_3_structural2.py",
        "file_path": "datasets/python_source-code/binary_tree/type_3_structural2.py",
    },
    # Linked List: Clone Benchmark (Python)
    {
        "student_username": "Mary",
        "assignment_title": "Linked List: Clone Benchmark (Python)",
        "filename": "original.py",
        "file_path": "datasets/python_source-code/linked_list/original.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Linked List: Clone Benchmark (Python)",
        "filename": "type_1_exact.py",
        "file_path": "datasets/python_source-code/linked_list/type_1_exact.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Linked List: Clone Benchmark (Python)",
        "filename": "type_2_renamed.py",
        "file_path": "datasets/python_source-code/linked_list/type_2_renamed.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Linked List: Clone Benchmark (Python)",
        "filename": "type_2_renamed2.py",
        "file_path": "datasets/python_source-code/linked_list/type_2_renamed2.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Linked List: Clone Benchmark (Python)",
        "filename": "type_3_structural.py",
        "file_path": "datasets/python_source-code/linked_list/type_3_structural.py",
    },
    # Merge Sort: Clone Benchmark (Python)
    {
        "student_username": "Mary",
        "assignment_title": "Merge Sort: Clone Benchmark (Python)",
        "filename": "original.py",
        "file_path": "datasets/python_source-code/merge_sort/original.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Merge Sort: Clone Benchmark (Python)",
        "filename": "type_1_exact.py",
        "file_path": "datasets/python_source-code/merge_sort/type_1_exact.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Merge Sort: Clone Benchmark (Python)",
        "filename": "type_2_renamed.py",
        "file_path": "datasets/python_source-code/merge_sort/type_2_renamed.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Merge Sort: Clone Benchmark (Python)",
        "filename": "type_2_renamed2.py",
        "file_path": "datasets/python_source-code/merge_sort/type_2_renamed2.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Merge Sort: Clone Benchmark (Python)",
        "filename": "type_3_structural.py",
        "file_path": "datasets/python_source-code/merge_sort/type_3_structural.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Merge Sort: Clone Benchmark (Python)",
        "filename": "type_3_structural2.py",
        "file_path": "datasets/python_source-code/merge_sort/type_3_structural2.py",
    },
    # Quick Sort: Clone Benchmark (Python)
    {
        "student_username": "Mary",
        "assignment_title": "Quick Sort: Clone Benchmark (Python)",
        "filename": "original.py",
        "file_path": "datasets/python_source-code/quick_sort/original.py",
    },
    {
        "student_username": "Charles",
        "assignment_title": "Quick Sort: Clone Benchmark (Python)",
        "filename": "type_1_exact_copy.py",
        "file_path": "datasets/python_source-code/quick_sort/type_1_exact_copy.py",
    },
    {
        "student_username": "Nicolo",
        "assignment_title": "Quick Sort: Clone Benchmark (Python)",
        "filename": "type_2_renamed.py",
        "file_path": "datasets/python_source-code/quick_sort/type_2_renamed.py",
    },
    {
        "student_username": "Dan",
        "assignment_title": "Quick Sort: Clone Benchmark (Python)",
        "filename": "type_2_renamed2.py",
        "file_path": "datasets/python_source-code/quick_sort/type_2_renamed2.py",
    },
    {
        "student_username": "Ramon",
        "assignment_title": "Quick Sort: Clone Benchmark (Python)",
        "filename": "type_3_structural.py",
        "file_path": "datasets/python_source-code/quick_sort/type_3_structural.py",
    },
    {
        "student_username": "Jude",
        "assignment_title": "Quick Sort: Clone Benchmark (Python)",
        "filename": "type_3_structural2.py",
        "file_path": "datasets/python_source-code/quick_sort/type_3_structural2.py",
    },
]

def seed_python_submissions(db):
    print("FALSICODE: Seeding Python Submissions...")
    # Pre-cache users, assignments, and existing submissions in bulk (3 queries total)
    user_map = {u.username.lower(): u for u in User.query.all()}
    assignment_map = {a.title: a for a in Assignment.query.all()}
    existing_subs = {(s.student_id, s.assignment_id) for s in Submission.query.all()}

    for sub_data in python_submissions:
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