"""
Binary Search Suite - Submission by Isabelle
Approach: Defensive, type-annotated binary search toolkit returning SearchResult objects,
including first occurrence, last occurrence, and range counting with validation.
"""

from dataclasses import dataclass
from typing import List, Optional


@dataclass
class SearchResult:
    index: Optional[int]
    comparisons: int
    found: bool


class BinarySearchToolkit:
    """A comprehensive, object-oriented binary search suite."""

    @staticmethod
    def is_sorted(numbers: List[int]) -> bool:
        """Validates if the provided list of numbers is in ascending order."""
        return all(numbers[element_index] <= numbers[element_index + 1] for element_index in range(len(numbers) - 1))

    @classmethod
    def search(cls, numbers: List[int], target_value: int) -> SearchResult:
        """Performs a standard binary search with validation and comparison tracking."""
        if not cls.is_sorted(numbers):
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
                
        return SearchResult(index=None, comparisons=comparison_count, found=False)

    @classmethod
    def find_first_occurrence(cls, numbers: List[int], target_value: int) -> Optional[int]:
        """Locates the first index where the target value appears."""
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

    @classmethod
    def find_last_occurrence(cls, numbers: List[int], target_value: int) -> Optional[int]:
        """Locates the last index where the target value appears."""
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

    @classmethod
    def count_frequency(cls, numbers: List[int], target_value: int) -> int:
        """Counts the total occurrences of the target value using binary search bounds."""
        first_index = cls.find_first_occurrence(numbers, target_value)
        if first_index is None:
            return 0
        last_index = cls.find_last_occurrence(numbers, target_value)
        return last_index - first_index + 1


def main():
    sample_data = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    
    search_result = BinarySearchToolkit.search(sample_data, 12)
    print("Found:", search_result.found, "at index:", search_result.index)
    print("Frequency of 12:", BinarySearchToolkit.count_frequency(sample_data, 12))


if __name__ == "__main__":
    main()