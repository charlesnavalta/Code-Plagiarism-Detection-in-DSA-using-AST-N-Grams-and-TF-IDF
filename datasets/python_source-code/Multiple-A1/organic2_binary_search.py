"""
Binary Search - Submission by Andrea
Approach: Iterative search using left/right naming and the
overflow-safe mid formula (left + (right - left) // 2).
"""


def search(values, key):
    left = 0
    right = len(values) - 1

    while left <= right:
        middle = left + (right - left) // 2

        if values[middle] == key:
            return middle

        if values[middle] < key:
            left = middle + 1
        else:
            right = middle - 1

    return -1


if __name__ == "__main__":
    ARR = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91]
    TARGET = 23
    print("Found at index:", search(ARR, TARGET))
