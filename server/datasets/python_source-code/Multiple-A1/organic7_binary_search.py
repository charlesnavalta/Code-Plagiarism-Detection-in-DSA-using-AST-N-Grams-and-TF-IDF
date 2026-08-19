"""
Binary Search - Submission by Ramon
Approach: Object-oriented design - a Searcher class wraps the sorted
data and exposes a find() method.
"""


class Searcher:
    def __init__(self, data):
        self.data = data

    def find(self, target):
        lo, hi = 0, len(self.data) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            value = self.data[mid]
            if value == target:
                return mid
            elif value < target:
                lo = mid + 1
            else:
                hi = mid - 1
        return -1


if __name__ == "__main__":
    ARR = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]
    TARGET = 23
    searcher = Searcher(ARR)
    print("Class-based result:", searcher.find(TARGET))
