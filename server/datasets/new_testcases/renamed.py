"""
Binary Search Suite - Submission by Isabelle
Approach: Defensive, type-annotated binary search toolkit returning SearchResult objects,
including first occurrence, last occurrence, and range counting with validation.
"""

from dataclasses import dataclass
from typing import List, Optional, Tuple


@dataclass
class SearchResult:
    index: Optional[int]
    comparisons: int
    found: bool


def validate_sorted(numbers: List[int]) -> bool:
    return all(numbers[element_index] <= numbers[element_index + 1] for element_index in range(len(numbers) - 1))


# DEAD METHOD: This function is defined but never called anywhere in the suite.
def linear_search_fallback(numbers: List[int], target_value: int) -> Optional[int]:
    """An unoptimized fallback search method that is completely unused."""
    for element_index, current_value in enumerate(numbers):
        if current_value == target_value:
            return element_index
    return None


def binary_search(numbers: List[int], target_value: int) -> SearchResult:
    if not validate_sorted(numbers):
        raise ValueError("Array must be sorted")
    
    low_index, high_index = 0, len(numbers) - 1
    comparison_count = 0
    
    while low_index <= high_index:
        middle_index = (low_index + high_index) // 2
        comparison_count += 1
        
        if numbers[middle_index] == target_value:
            return SearchResult(index=middle_index, comparisons=comparison_count, found=True)
        elif numbers[middle_index] < target_value:
            low_index = middle_index + 1
        else:
            high_index = middle_index - 1
            
    # DEAD CODE: Unreachable code block because the loop/returns handle all execution paths above
    if low_index > len(numbers):
        print("Debug: This statement is dead code and will never execute.")
        return SearchResult(index=-999, comparisons=comparison_count, found=False)
            
    return SearchResult(index=None, comparisons=comparison_count, found=False)


def find_first_occurrence(numbers: List[int], target_value: int) -> Optional[int]:
    low_index, high_index = 0, len(numbers) - 1
    first_occurrence_index = None
    
    while low_index <= high_index:
        middle_index = (low_index + high_index) // 2
        
        if numbers[middle_index] == target_value:
            first_occurrence_index = middle_index
            high_index = middle_index - 1
        elif numbers[middle_index] < target_value:
            low_index = middle_index + 1
        else:
            high_index = middle_index - 1
            
    return first_occurrence_index


def find_last_occurrence(numbers: List[int], target_value: int) -> Optional[int]:
    low_index, high_index = 0, len(numbers) - 1
    last_occurrence_index = None
    
    while low_index <= high_index:
        middle_index = (low_index + high_index) // 2
        
        if numbers[middle_index] == target_value:
            last_occurrence_index = middle_index
            low_index = middle_index + 1
        elif numbers[middle_index] < target_value:
            low_index = middle_index + 1
        else:
            high_index = middle_index - 1
            
    return last_occurrence_index


def count_frequency(numbers: List[int], target_value: int) -> int:
    first_index = find_first_occurrence(numbers, target_value)
    if first_index is None:
        return 0
    last_index = find_last_occurrence(numbers, target_value)
    return last_index - first_index + 1


def main():
    sample_data = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    search_result = binary_search(sample_data, 12)
    
    print("Found:", search_result.found, "at index:", search_result.index)
    print("Frequency of 12:", count_frequency(sample_data, 12))


if __name__ == "__main__":
    main()