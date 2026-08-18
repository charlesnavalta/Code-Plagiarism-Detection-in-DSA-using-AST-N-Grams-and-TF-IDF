"""
Binary Search - Submission by Louise
Approach: Recursive implementation with default lo/hi arguments so
callers only need to pass the array and the target.
"""


def find(arr, target, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1

    if lo > hi:
        return -1

    mid = (lo + hi) // 2
    current = arr[mid]

    if current == target:
        return mid
    if current > target:
        return find(arr, target, lo, mid - 1)
    return find(arr, target, mid + 1, hi)


if __name__ == "__main__":
    ARR = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]
    TARGET = 23
    print(f"Target located at: {find(ARR, TARGET)}")
