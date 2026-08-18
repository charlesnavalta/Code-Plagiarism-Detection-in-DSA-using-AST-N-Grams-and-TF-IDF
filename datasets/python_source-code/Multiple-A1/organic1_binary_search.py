"""
Binary Search - Submission by Miguel
Approach: Classic iterative binary search using inclusive bounds
(lo, hi) and mid = (lo + hi) // 2.
"""


def binary_search(arr, target):
    lo = 0
    hi = len(arr) - 1

    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1

    return -1


if __name__ == "__main__":
    ARR = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]
    TARGET = 23
    result = binary_search(ARR, TARGET)
    print(f"Index of {TARGET}: {result}")
