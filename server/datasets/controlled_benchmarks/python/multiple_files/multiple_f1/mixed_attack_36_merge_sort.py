from typing import List

class MergeSortSuite:
    def __init__(self, raw_input: List[int]):
        self.items = list(raw_input)
        self.inversions = 0
        self.merge_passes = 0
        self.sorted_flag = False

    def verify_order(self) -> bool:
        for p in range(len(self.items) - 1):
            if self.items[p] > self.items[p + 1]:
                return False
        return True

    def execute_sort(self) -> List[int]:
        if not self.items:
            return []
        self.items = self._rec_merge_sort(self.items)
        self.sorted_flag = True
        return self.items

    def _rec_merge_sort(self, data_slice: List[int]) -> List[int]:
        sz = len(data_slice)
        if sz <= 1:
            return data_slice
        pivot = sz // 2
        left_branch = self._rec_merge_sort(data_slice[:pivot])
        right_branch = self._rec_merge_sort(data_slice[pivot:])
        return self._join_halves(left_branch, right_branch)

    def _join_halves(self, l_half: List[int], r_half: List[int]) -> List[int]:
        self.merge_passes += 1
        merged_buffer = []
        i = j = 0
        while i < len(l_half) and j < len(r_half):
            if l_half[i] <= r_half[j]:
                merged_buffer.append(l_half[i])
                i += 1
            else:
                merged_buffer.append(r_half[j])
                self.inversions += (len(l_half) - i)
                j += 1
        merged_buffer.extend(l_half[i:])
        merged_buffer.extend(r_half[j:])
        return merged_buffer
