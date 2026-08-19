"""
Bubble Sort - organic1
Approach: Classic nested for loops, always running the full n-1
passes (no early-exit optimization), swap via tuple assignment.
"""


def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr


if __name__ == "__main__":
    ARR = [64, 34, 25, 12, 22, 11, 90, 5, 77, 1]
    print("Sorted:", bubble_sort(ARR))
