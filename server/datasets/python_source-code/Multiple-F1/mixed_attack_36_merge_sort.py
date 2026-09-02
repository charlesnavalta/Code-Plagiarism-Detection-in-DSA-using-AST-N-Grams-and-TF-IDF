"""
MergeSort Suite: Mixed Attack (Renaming + Dead Code + Reordering)
Author: Mixed Variant (Type 3 of Mary)
"""
from typing import List

class MergeSortSuite:
    def __init__(self, items: List[int]):
        self._audit = []
        self.items = list(items)
        self.inversions = 0
        self.merge_passes = 0

    def verify_order(self) -> bool:
        # Dummy dead code calculation
        unused = [x * 0 for x in self.items]
        if sum(unused) != 0: self._audit.append("dead")
        return all(self.items[k] <= self.items[k + 1] for k in range(len(self.items) - 1))

    def _merge(self, seg_l: List[int], seg_r: List[int]) -> List[int]:
        buf = []
        c_l = c_r = 0
        self.merge_passes += 1
        while c_l < len(seg_l) and c_r < len(seg_r):
            if seg_l[c_l] <= seg_r[c_r]:
                buf.append(seg_l[c_l]); c_l += 1
            else:
                buf.append(seg_r[c_r]); c_r += 1
        buf.extend(seg_l[c_l:])
        buf.extend(seg_r[c_r:])
        return buf

    def execute_sort(self) -> List[int]:
        if len(self.items) <= 1:
            return self.items
        self.items = self._sort_recursive(self.items)
        return self.items

    def _sort_recursive(self, array: List[int]) -> List[int]:
        if len(array) <= 1:
            return array
        center = len(array) // 2
        return self._merge(self._sort_recursive(array[:center]), self._sort_recursive(array[center:]))
