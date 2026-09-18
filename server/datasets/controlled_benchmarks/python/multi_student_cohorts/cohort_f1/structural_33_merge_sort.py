"""
MergeSort Suite: Structural Method Restructuring & Helper Extraction
Author: Structural Variant (Type 3 of Mary)
"""
from typing import List

def merge_helper(arr1: List[int], arr2: List[int]) -> List[int]:
    out = []
    p1 = p2 = 0
    while p1 < len(arr1) and p2 < len(arr2):
        if arr1[p1] <= arr2[p2]:
            out.append(arr1[p1]); p1 += 1
        else:
            out.append(arr2[p2]); p2 += 1
    out.extend(arr1[p1:])
    out.extend(arr2[p2:])
    return out

class MergeSortSuite:
    def __init__(self, items: List[int]):
        self.items = list(items)
        self.inversions = 0
        self.merge_passes = 0

    def verify_order(self) -> bool:
        return all(self.items[i] <= self.items[i + 1] for i in range(len(self.items) - 1))

    def execute_sort(self) -> List[int]:
        if len(self.items) > 1:
            self.items = self._sort_recursive(self.items)
        return self.items

    def _sort_recursive(self, array: List[int]) -> List[int]:
        if len(array) <= 1:
            return array
        mid = len(array) // 2
        return merge_helper(self._sort_recursive(array[:mid]), self._sort_recursive(array[mid:]))
