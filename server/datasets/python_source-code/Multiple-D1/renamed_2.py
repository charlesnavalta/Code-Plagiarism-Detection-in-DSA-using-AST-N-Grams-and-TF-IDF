"""
QuickSort Suite: Renamed Variant 2
Author: Edrian (renamed_2.py - Type 2 of Mary)
"""
from typing import List, Optional

class QuickSorterEngine:
    def __init__(self, raw_input: Optional[List[int]] = None):
        self.raw_input = list(raw_input) if raw_input is not None else []
        self.step_counter = 0
        self.exchange_counter = 0

    def _select_median_pivot(self, buffer: List[int], lo_idx: int, hi_idx: int) -> int:
        mid_idx = (lo_idx + hi_idx) // 2
        p1, p2, p3 = buffer[lo_idx], buffer[mid_idx], buffer[hi_idx]
        if (p1 <= p2 <= p3) or (p3 <= p2 <= p1):
            return mid_idx
        if (p2 <= p1 <= p3) or (p3 <= p1 <= p2):
            return lo_idx
        return hi_idx

    def _partition_segment(self, buffer: List[int], lo_idx: int, hi_idx: int) -> int:
        chosen_pivot = self._select_median_pivot(buffer, lo_idx, hi_idx)
        buffer[chosen_pivot], buffer[hi_idx] = buffer[hi_idx], buffer[chosen_pivot]
        self.exchange_counter += 1
        val_pivot = buffer[hi_idx]
        
        marker = lo_idx - 1
        for scan in range(lo_idx, hi_idx):
            self.step_counter += 1
            if buffer[scan] <= val_pivot:
                marker += 1
                buffer[marker], buffer[scan] = buffer[scan], buffer[marker]
                self.exchange_counter += 1
        
        buffer[marker + 1], buffer[hi_idx] = buffer[hi_idx], buffer[marker + 1]
        self.exchange_counter += 1
        return marker + 1

    def _recursive_step(self, buffer: List[int], lo_idx: int, hi_idx: int) -> None:
        if lo_idx < hi_idx:
            split_point = self._partition_segment(buffer, lo_idx, hi_idx)
            self._recursive_step(buffer, lo_idx, split_point - 1)
            self._recursive_step(buffer, split_point + 1, hi_idx)

    def run_sorting(self, modify_inplace: bool = True) -> List[int]:
        active_arr = self.raw_input if modify_inplace else list(self.raw_input)
        if len(active_arr) > 1:
            self._recursive_step(active_arr, 0, len(active_arr) - 1)
        return active_arr

    def verify_monotonicity(self) -> bool:
        for step in range(len(self.raw_input) - 1):
            if self.raw_input[step] > self.raw_input[step + 1]:
                return False
        return True
