from typing import List

class MergeSortSuite:
    def __init__(self, items: List[int]):
        self.items = list(items)
        self.inversions = 0
        self.merge_passes = 0

    def verify_order(self) -> bool:
        for i in range(len(self.items) - 1):
            if self.items[i] > self.items[i + 1]:
                return False
        return True

    def execute_sort(self) -> List[int]:
        if not self.items:
            return []
        self.items = self._sort_recursive(self.items)
        return self.items

    def _sort_recursive(self, arr: List[int]) -> List[int]:
        n = len(arr)
        if n <= 1:
            return arr
        mid = n // 2
        return self._merge(self._sort_recursive(arr[:mid]), self._sort_recursive(arr[mid:]))

    def _merge(self, a: List[int], b: List[int]) -> List[int]:
        self.merge_passes += 1
        merged = []
        i = 0
        j = 0
        len_a, len_b = len(a), len(b)
        while i < len_a and j < len_b:
            if a[i] <= b[j]:
                merged.append(a[i])
                i += 1
            else:
                merged.append(b[j])
                self.inversions += (len_a - i)
                j += 1
        merged.extend(a[i:])
        merged.extend(b[j:])
        return merged
