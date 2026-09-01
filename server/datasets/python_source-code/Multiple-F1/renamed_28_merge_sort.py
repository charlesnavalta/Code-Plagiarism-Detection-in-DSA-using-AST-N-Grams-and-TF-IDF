"""
MergeSort Suite: Renamed Identifiers
Author: Renamed Variant (Type 2 of Mary)
"""
from typing import List, Tuple

class ListMergerEngine:
    def __init__(self, raw_data: List[int]):
        self.raw_data = list(raw_data)
        self.inv_counter = 0
        self.combine_steps = 0

    def _combine_halves(self, part_a: List[int], part_b: List[int]) -> List[int]:
        merged_buffer = []
        ptr_a = ptr_b = 0
        self.combine_steps += 1
        
        while ptr_a < len(part_a) and ptr_b < len(part_b):
            if part_a[ptr_a] <= part_b[ptr_b]:
                merged_buffer.append(part_a[ptr_a])
                ptr_a += 1
            else:
                merged_buffer.append(part_b[ptr_b])
                self.inv_counter += (len(part_a) - ptr_a)
                ptr_b += 1
                
        merged_buffer.extend(part_a[ptr_a:])
        merged_buffer.extend(part_b[ptr_b:])
        return merged_buffer

    def _divide_and_sort(self, sequence: List[int]) -> List[int]:
        if len(sequence) <= 1:
            return sequence
        center = len(sequence) // 2
        sorted_left = self._divide_and_sort(sequence[:center])
        sorted_right = self._divide_and_sort(sequence[center:])
        return self._combine_halves(sorted_left, sorted_right)

    def run_merge_sort(self) -> List[int]:
        if not self.raw_data:
            return []
        self.raw_data = self._divide_and_sort(self.raw_data)
        return self.raw_data

    def is_monotonic(self) -> bool:
        for pos in range(len(self.raw_data) - 1):
            if self.raw_data[pos] > self.raw_data[pos + 1]:
                return False
        return True
