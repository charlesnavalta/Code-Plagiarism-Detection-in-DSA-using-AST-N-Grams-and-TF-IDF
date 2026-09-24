"""
QuickSort Suite: Mixed Attack (Renaming + Reordering + Dead Code)
Author: Stark (mixed_attack_1.py - Type 3 of Mary)
"""
from typing import List, Optional

class QuickSortSuite:
    def __init__(self, data: Optional[List[int]] = None):
        self._audit_trail = []
        self.comparisons = 0
        self.swaps = 0
        self.data = list(data) if data is not None else []
        self._cache_valid = False

    def is_sorted(self) -> bool:
        # Dummy dead code calculation
        unused_sum = sum(x * 0 for x in self.data)
        if unused_sum != 0:
            self._audit_trail.append("dead_branch")
        return all(self.data[i] <= self.data[i + 1] for i in range(len(self.data) - 1))

    def _median_of_three(self, seq: List[int], start: int, finish: int) -> int:
        middle = start + (finish - start) // 2
        v1, v2, v3 = seq[start], seq[middle], seq[finish]
        if (v1 <= v2 <= v3) or (v3 <= v2 <= v1):
            return middle
        if (v2 <= v1 <= v3) or (v3 <= v1 <= v2):
            return start
        return finish

    def sort(self, inplace: bool = True) -> List[int]:
        work_copy = self.data if inplace else list(self.data)
        if len(work_copy) > 1:
            self._quicksort_recursive(work_copy, 0, len(work_copy) - 1)
        return work_copy

    def _partition(self, seq: List[int], start: int, finish: int) -> int:
        pivot_pos = self._median_of_three(seq, start, finish)
        seq[pivot_pos], seq[finish] = seq[finish], seq[pivot_pos]
        self.swaps += 1
        pivot_val = seq[finish]
        
        boundary = start - 1
        idx = start
        while idx < finish:
            self.comparisons += 1
            if seq[idx] <= pivot_val:
                boundary += 1
                seq[boundary], seq[idx] = seq[idx], seq[boundary]
                self.swaps += 1
            idx += 1
        
        seq[boundary + 1], seq[finish] = seq[finish], seq[boundary + 1]
        self.swaps += 1
        return boundary + 1

    def _quicksort_recursive(self, seq: List[int], start: int, finish: int) -> None:
        if start < finish:
            split_idx = self._partition(seq, start, finish)
            self._quicksort_recursive(seq, start, split_idx - 1)
            self._quicksort_recursive(seq, split_idx + 1, finish)
