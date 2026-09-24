"""
Binary Search Suite - Submission by Nathan
Approach: Half-open interval [lo, hi) searching with assertions and slice-based checks.
"""


def search_half_open(arr, target):
    assert isinstance(arr, list), "Expected list input"
    lo = 0
    hi = len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return -1


def left_insertion_point(arr, target):
    lo = 0
    hi = len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo


def right_insertion_point(arr, target):
    lo = 0
    hi = len(arr)
    while lo < hi:
        mid = (lo + hi) // 2
        if arr[mid] <= target:
            lo = mid + 1
        else:
            hi = mid
    return lo


def frequency_in_sorted(arr, target):
    l = left_insertion_point(arr, target)
    r = right_insertion_point(arr, target)
    if l < len(arr) and arr[l] == target:
        return r - l
    return 0


def run_check(arr, key):
    idx = search_half_open(arr, key)
    qty = frequency_in_sorted(arr, key)
    print(f"Half-open search: index={idx}, frequency={qty}")


if __name__ == "__main__":
    nums = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    run_check(nums, 12)
