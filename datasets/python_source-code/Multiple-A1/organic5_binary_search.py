"""
Binary Search - Submission by Nathan
Approach: Half-open interval [lo, hi) instead of inclusive bounds -
hi starts at len(arr) and the loop condition is lo < hi.
"""


def locate(arr, target):
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


if __name__ == "__main__":
    ARR = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]
    TARGET = 23
    outcome = locate(ARR, TARGET)
    print("Search outcome:", outcome)
