"""
Binary Search Suite - Submission by Kevin
Approach: Pure recursive binary search methods with explicit bound parameters
and recursive range search.
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


def find_first_recursive(arr, target, lo, hi, current_best=-1):
    if lo > hi:
        return current_best
    mid = (lo + hi) // 2
    if arr[mid] == target:
        return find_first_recursive(arr, target, lo, mid - 1, mid)
    elif arr[mid] < target:
        return find_first_recursive(arr, target, mid + 1, hi, current_best)
    else:
        return find_first_recursive(arr, target, lo, mid - 1, current_best)


def find_last_recursive(arr, target, lo, hi, current_best=-1):
    if lo > hi:
        return current_best
    mid = (lo + hi) // 2
    if arr[mid] == target:
        return find_last_recursive(arr, target, mid + 1, hi, mid)
    elif arr[mid] < target:
        return find_last_recursive(arr, target, mid + 1, hi, current_best)
    else:
        return find_last_recursive(arr, target, lo, mid - 1, current_best)


def get_count(arr, target):
    f = find_first_recursive(arr, target, 0, len(arr) - 1)
    if f == -1:
        return 0
    l = find_last_recursive(arr, target, 0, len(arr) - 1)
    return l - f + 1


if __name__ == "__main__":
    nums = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    n = len(nums)
    idx = binary_search_recursive(nums, 12, 0, n - 1)
    cnt = get_count(nums, 12)
    print("Found index:", idx, "Total count:", cnt)
