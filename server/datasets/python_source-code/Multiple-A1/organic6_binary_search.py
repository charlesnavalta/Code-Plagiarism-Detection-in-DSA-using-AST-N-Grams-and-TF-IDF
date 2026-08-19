"""
Binary Search - Submission by Patricia
Approach: Delegates the heavy lifting to Python's built-in bisect
module (bisect_left) instead of hand-rolling the loop.
"""

import bisect


def find_index(arr, target):
    pos = bisect.bisect_left(arr, target)
    if pos < len(arr) and arr[pos] == target:
        return pos
    return -1


if __name__ == "__main__":
    ARR = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]
    TARGET = 23
    print("bisect result ->", find_index(ARR, TARGET))
