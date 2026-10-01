from typing import List

class MergeSortSuite:
    def __init__(self, data: List[int]):
        self.items = list(data)
        self.inversions = 0
        self.merge_passes = 0

    def _merge_blocks(self, l_arr: List[int], r_arr: List[int]) -> List[int]:
        self.merge_passes += 1
        combined = []
        idx1 = idx2 = 0
        len1, len2 = len(l_arr), len(r_arr)
        while idx1 < len1 and idx2 < len2:
            if l_arr[idx1] <= r_arr[idx2]:
                combined.append(l_arr[idx1])
                idx1 += 1
            else:
                combined.append(r_arr[idx2])
                self.inversions += (len1 - idx1)
                idx2 += 1
        combined += l_arr[idx1:]
        combined += r_arr[idx2:]
        return combined

    def _split_and_sort(self, seq: List[int]) -> List[int]:
        if len(seq) <= 1:
            return seq
        center = len(seq) // 2
        l_res = self._split_and_sort(seq[:center])
        r_res = self._split_and_sort(seq[center:])
        return self._merge_blocks(l_res, r_res)

    def execute_sort(self) -> List[int]:
        if not self.items:
            return []
        self.items = self._split_and_sort(self.items)
        return self.items

    def verify_order(self) -> bool:
        return all(self.items[i] <= self.items[i + 1] for i in range(len(self.items) - 1))
