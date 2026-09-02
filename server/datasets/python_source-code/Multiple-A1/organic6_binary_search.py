"""
Binary Search Suite - Submission by Patricia
Approach: Standard library bisect wrappers with custom validation and range counting.
"""

import bisect


class BisectSearcher:
    def __init__(self, data_list):
        self.data = list(data_list)
        self.size = len(self.data)

    def find_index(self, target):
        idx = bisect.bisect_left(self.data, target)
        if idx < self.size and self.data[idx] == target:
            return idx
        return -1

    def find_span(self, target):
        start = bisect.bisect_left(self.data, target)
        if start >= self.size or self.data[start] != target:
            return (None, None, 0)
        end = bisect.bisect_right(self.data, target) - 1
        count = (end - start) + 1
        return (start, end, count)

    def contains(self, target):
        return self.find_index(target) != -1


if __name__ == "__main__":
    sample = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    searcher = BisectSearcher(sample)
    print("Found 12 at:", searcher.find_index(12))
    print("Span of 12:", searcher.find_span(12))
