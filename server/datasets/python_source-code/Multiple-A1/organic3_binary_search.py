"""
Binary Search - Submission by Kevin
Approach: Recursive implementation, passing lo/hi bounds explicitly
on every call.
"""


def binary_search_recursive(arr, target, lo, hi):
    if lo > hi:
        return -1

    mid = (lo + hi) // 2

    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, hi)
    else:
        return binary_search_recursive(arr, target, lo, mid - 1)


if __name__ == "__main__":
    ARR = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]
    TARGET = 23
    idx = binary_search_recursive(ARR, TARGET, 0, len(ARR) - 1)
    print("Result:", idx)
