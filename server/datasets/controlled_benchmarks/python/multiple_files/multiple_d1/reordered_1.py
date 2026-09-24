"""
QuickSort Suite: Method Reordering and Control Flow Swapping
Author: Sean (reordered_1.py - Type 3 of Mary)
"""
from typing import List, Optional

class QuickSortSuite:
    def __init__(self, data: Optional[List[int]] = None):
        self.comparisons = 0
        self.swaps = 0
        self.data = list(data) if data is not None else []

    def is_sorted(self) -> bool:
        k = 0
        while k < len(self.data) - 1:
            if self.data[k] > self.data[k + 1]:
                return False
            k += 1
        return True

    def sort(self, inplace: bool = True) -> List[int]:
        target = self.data if inplace else list(self.data)
        if len(target) > 1:
            self._quicksort_recursive(target, 0, len(target) - 1)
        return target

    def _quicksort_recursive(self, arr: List[int], low: int, high: int) -> None:
        if low >= high:
            return
        pi = self._partition(arr, low, high)
        self._quicksort_recursive(arr, pi + 1, high)
        self._quicksort_recursive(arr, low, pi - 1)

    def _median_of_three(self, arr: List[int], low: int, high: int) -> int:
        mid = (low + high) // 2
        a, b, c = arr[low], arr[mid], arr[high]
        if (b >= a and b <= c) or (b >= c and b <= a):
            return mid
        if (a >= b and a <= c) or (a >= c and a <= b):
            return low
        return high

    def _partition(self, arr: List[int], low: int, high: int) -> int:
        pivot_idx = self._median_of_three(arr, low, high)
        arr[pivot_idx], arr[high] = arr[high], arr[pivot_idx]
        self.swaps += 1
        pivot = arr[high]
        
        i = low - 1
        j = low
        while j < high:
            self.comparisons += 1
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                self.swaps += 1
            j += 1
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        self.swaps += 1
        return i + 1
