"""
Binary Search - Submission by Sophia
Approach: Uses an infinite while True loop with explicit break/return
statements instead of a boolean loop condition.
"""


def binary_search_loop(arr, target):
    lo = 0
    hi = len(arr) - 1

    while True:
        if lo > hi:
            return -1

        mid = (lo + hi) // 2

        if arr[mid] == target:
            return mid

        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1


if __name__ == "__main__":
    ARR = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]
    TARGET = 23
    found_index = binary_search_loop(ARR, TARGET)
    print("found_index =", found_index)
