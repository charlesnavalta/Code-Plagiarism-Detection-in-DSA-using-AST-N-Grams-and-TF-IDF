"""
Binary Search Suite - Submission by Louise
Approach: Recursive functions using default parameter values and early-exit branching.
"""


def locate_element(arr, target, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo > hi:
        return None
    mid = (lo + hi) // 2
    if arr[mid] == target:
        return mid
    if arr[mid] > target:
        return locate_element(arr, target, lo, mid - 1)
    return locate_element(arr, target, mid + 1, hi)


def locate_bounds(arr, target, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    pos = locate_element(arr, target, lo, hi)
    if pos is None:
        return (None, None, 0)
    left_bound = pos
    while left_bound > 0 and arr[left_bound - 1] == target:
        left_bound -= 1
    right_bound = pos
    while right_bound < len(arr) - 1 and arr[right_bound + 1] == target:
        right_bound += 1
    freq = right_bound - left_bound + 1
    return (left_bound, right_bound, freq)


def execute_suite(collection, query):
    first, last, total = locate_bounds(collection, query)
    print(f"Query {query} -> Start: {first}, End: {last}, Count: {total}")


if __name__ == "__main__":
    elements = [2, 5, 8, 12, 12, 12, 23, 38, 45, 56, 72, 91]
    execute_suite(elements, 12)
