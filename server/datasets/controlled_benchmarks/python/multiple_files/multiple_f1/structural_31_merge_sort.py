from typing import List

class MergeSortSuite:
    def __init__(self, items: List[int]):
        self.items = list(items)
        self.inversions = 0
        self.merge_passes = 0

    def _merge(self, left: List[int], right: List[int]) -> List[int]:
        res = []
        p1 = p2 = 0
        self.merge_passes += 1
        while p1 < len(left) and p2 < len(right):
            if left[p1] <= right[p2]:
                res.append(left[p1])
                p1 += 1
            else:
                res.append(right[p2])
                self.inversions += (len(left) - p1)
                p2 += 1
        while p1 < len(left):
            res.append(left[p1])
            p1 += 1
        while p2 < len(right):
            res.append(right[p2])
            p2 += 1
        return res

    def _sort_recursive(self, array: List[int]) -> List[int]:
        if len(array) <= 1:
            return array
        mid = len(array) // 2
        l_part = self._sort_recursive(array[:mid])
        r_part = self._sort_recursive(array[mid:])
        return self._merge(l_part, r_part)

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
