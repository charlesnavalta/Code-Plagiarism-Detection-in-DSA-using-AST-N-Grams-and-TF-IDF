"""
QuickSort Suite: Renamed Identifiers
Author: Darrel (renamed_1.py - Type 2 of Mary)
"""
from typing import List, Optional

class ArraySorter:
    def __init__(self, elements: Optional[List[int]] = None):
        self.elements = list(elements) if elements is not None else []
        self.cmp_count = 0
        self.swap_count = 0

    def _find_pivot_index(self, items: List[int], start_pos: int, end_pos: int) -> int:
        center_pos = (start_pos + end_pos) // 2
        val_start, val_center, val_end = items[start_pos], items[center_pos], items[end_pos]
        if (val_start <= val_center <= val_end) or (val_end <= val_center <= val_start):
            return center_pos
        if (val_center <= val_start <= val_end) or (val_end <= val_start <= val_center):
            return start_pos
        return end_pos

    def _divide_array(self, items: List[int], start_pos: int, end_pos: int) -> int:
        p_index = self._find_pivot_index(items, start_pos, end_pos)
        items[p_index], items[end_pos] = items[end_pos], items[p_index]
        self.swap_count += 1
        pivot_val = items[end_pos]
        
        left_bound = start_pos - 1
        for right_cursor in range(start_pos, end_pos):
            self.cmp_count += 1
            if items[right_cursor] <= pivot_val:
                left_bound += 1
                items[left_bound], items[right_cursor] = items[right_cursor], items[left_bound]
                self.swap_count += 1
        
        items[left_bound + 1], items[end_pos] = items[end_pos], items[left_bound + 1]
        self.swap_count += 1
        return left_bound + 1

    def _execute_subsort(self, items: List[int], start_pos: int, end_pos: int) -> None:
        if start_pos < end_pos:
            boundary = self._divide_array(items, start_pos, end_pos)
            self._execute_subsort(items, start_pos, boundary - 1)
            self._execute_subsort(items, boundary + 1, end_pos)

    def execute_sort(self, mutate_direct: bool = True) -> List[int]:
        work_list = self.elements if mutate_direct else list(self.elements)
        if len(work_list) > 1:
            self._execute_subsort(work_list, 0, len(work_list) - 1)
        return work_list

    def check_order_valid(self) -> bool:
        for idx in range(len(self.elements) - 1):
            if self.elements[idx] > self.elements[idx + 1]:
                return False
        return True
