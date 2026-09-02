"""
MergeSort Suite: Modular Top-Down MergeSort with Inversion Counting and Validation
Author: Mary (organic_01_merge_sort.py)
"""
from typing import List, Tuple

class MergeSortSuite:
    def __init__(self, items: List[int]):
        self.items = list(items)
        self.inversions = 0
        self.merge_passes = 0

    def _merge(self, left: List[int], right: List[int]) -> List[int]:
        result = []
        i = j = 0
        self.merge_passes += 1
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                self.inversions += (len(left) - i)
                j += 1
                
        result.extend(left[i:])
        result.extend(right[j:])
        return result

    def _sort_recursive(self, array: List[int]) -> List[int]:
        if len(array) <= 1:
            return array
        mid = len(array) // 2
        left_sorted = self._sort_recursive(array[:mid])
        right_sorted = self._sort_recursive(array[mid:])
        return self._merge(left_sorted, right_sorted)

    def execute_sort(self) -> List[int]:
        if not self.items:
            return []
        self.items = self._sort_recursive(self.items)
        return self.items

    def verify_order(self) -> bool:
        for idx in range(len(self.items) - 1):
            if self.items[idx] > self.items[idx + 1]:
                return False
        return True
