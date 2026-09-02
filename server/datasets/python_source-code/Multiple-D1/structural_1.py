"""
QuickSort Suite: Method Extraction & Helper Restructuring
Author: Hannah (structural_1.py - Type 3 of Mary)
"""
from typing import List, Optional

def perform_swap(arr: List[int], i: int, j: int) -> None:
    temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp

def evaluate_bounds(a: int, b: int, c: int) -> bool:
    return (a <= b <= c) or (c <= b <= a)

class QuickSortSuite:
    def __init__(self, data: Optional[List[int]] = None):
        self.data = list(data) if data is not None else []
        self.comparisons = 0
        self.swaps = 0

    def _pick_pivot(self, arr: List[int], low: int, high: int) -> int:
        mid = (low + high) // 2
        if evaluate_bounds(arr[low], arr[mid], arr[high]):
            return mid
        if evaluate_bounds(arr[mid], arr[low], arr[high]):
            return low
        return high

    def _partition(self, arr: List[int], low: int, high: int) -> int:
        p_idx = self._pick_pivot(arr, low, high)
        perform_swap(arr, p_idx, high)
        self.swaps += 1
        pivot = arr[high]
        
        i = low - 1
        for j in range(low, high):
            self.comparisons += 1
            if arr[j] <= pivot:
                i += 1
                perform_swap(arr, i, j)
                self.swaps += 1
        
        perform_swap(arr, i + 1, high)
        self.swaps += 1
        return i + 1

    def _quicksort_recursive(self, arr: List[int], low: int, high: int) -> None:
        if low < high:
            pi = self._partition(arr, low, high)
            self._quicksort_recursive(arr, low, pi - 1)
            self._quicksort_recursive(arr, pi + 1, high)

    def sort(self, inplace: bool = True) -> List[int]:
        target = self.data if inplace else list(self.data)
        if len(target) > 1:
            self._quicksort_recursive(target, 0, len(target) - 1)
        return target

    def is_sorted(self) -> bool:
        return all(self.data[k] <= self.data[k + 1] for k in range(len(self.data) - 1))
