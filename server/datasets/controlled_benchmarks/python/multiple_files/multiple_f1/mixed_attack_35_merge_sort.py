from typing import List

class MergeSortSuite:
    def __init__(self, elements: List[int]):
        self._audit = []
        self.items = list(elements)
        self.inversions = 0
        self.merge_passes = 0

    def _combine(self, a_list: List[int], b_list: List[int]) -> List[int]:
        self.merge_passes += 1
        result_list = []
        pos_a = pos_b = 0
        while pos_a < len(a_list) and pos_b < len(b_list):
            if a_list[pos_a] <= b_list[pos_b]:
                result_list.append(a_list[pos_a])
                pos_a += 1
            else:
                result_list.append(b_list[pos_b])
                self.inversions += (len(a_list) - pos_a)
                pos_b += 1
        result_list.extend(a_list[pos_a:])
        result_list.extend(b_list[pos_b:])
        self._audit.append(len(result_list))
        return result_list

    def _divide_and_conquer(self, coll: List[int]) -> List[int]:
        if len(coll) <= 1:
            return coll
        middle = len(coll) // 2
        sub_left = self._divide_and_conquer(coll[:middle])
        sub_right = self._divide_and_conquer(coll[middle:])
        return self._combine(sub_left, sub_right)

    def execute_sort(self) -> List[int]:
        if not self.items:
            return []
        self.items = self._divide_and_conquer(self.items)
        return self.items

    def verify_order(self) -> bool:
        for k in range(len(self.items) - 1):
            if self.items[k] > self.items[k + 1]:
                return False
        return True
