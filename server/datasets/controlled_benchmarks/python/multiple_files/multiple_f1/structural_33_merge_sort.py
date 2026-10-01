from typing import List

class MergeSortSuite:
    def __init__(self, items: List[int]):
        self.items = list(items)
        self.inversions = 0
        self.merge_passes = 0

    def _merge(self, left: List[int], right: List[int]) -> List[int]:
        self.merge_passes += 1
        out = []
        i = j = 0
        while i < len(left) and j < len(right):
            if right[j] < left[i]:
                out.append(right[j])
                self.inversions += (len(left) - i)
                j += 1
            else:
                out.append(left[i])
                i += 1
        if i < len(left):
            out.extend(left[i:])
        if j < len(right):
            out.extend(right[j:])
        return out

    def _sort_recursive(self, array: List[int]) -> List[int]:
        if len(array) <= 1:
            return array
        split_pt = len(array) // 2
        left_sub = self._sort_recursive(array[:split_pt])
        right_sub = self._sort_recursive(array[split_pt:])
        return self._merge(left_sub, right_sub)

    def execute_sort(self) -> List[int]:
        if len(self.items) == 0:
            return []
        self.items = self._sort_recursive(self.items)
        return self.items

    def verify_order(self) -> bool:
        idx = 0
        while idx < len(self.items) - 1:
            if self.items[idx] > self.items[idx + 1]:
                return False
            idx += 1
        return True
