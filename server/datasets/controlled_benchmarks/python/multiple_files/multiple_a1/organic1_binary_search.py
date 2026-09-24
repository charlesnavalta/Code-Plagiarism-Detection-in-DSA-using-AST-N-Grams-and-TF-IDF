"""
Binary Search Suite - Submission by Miguel
Approach: Procedural, iterative search routines with separate lower/upper bound functions
and simple print logging.
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


def lower_bound(arr, target):
    lo = 0
    hi = len(arr) - 1
    result = -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            result = mid
            hi = mid - 1
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return result


def upper_bound(arr, target):
    lo = 0
    hi = len(arr) - 1
    result = -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            result = mid
            lo = mid + 1
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return result


def occurrence_range(arr, target):
    first = lower_bound(arr, target)
    if first == -1:
        return (0, -1, -1)
    last = upper_bound(arr, target)
    count = (last - first) + 1
    return (count, first, last)


def display_results(arr, key):
    idx = binary_search(arr, key)
    cnt, start, end = occurrence_range(arr, key)
    print("Search index:", idx)
    print("Total occurrences:", cnt, "from", start, "to", end)


if __name__ == "__main__":
    data = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    display_results(data, 12)
