"""
Bubble Sort - organic3
Approach: Uses a `swapped` flag to exit early once a full pass makes
no swaps, wrapped in a while loop instead of a fixed range of passes.
"""


def bubble_sort(arr):
    n = len(arr)
    swapped = True
    while swapped:
        swapped = False
        for i in range(n - 1):
            if arr[i] > arr[i + 1]:
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
                swapped = True
        n -= 1
    return arr


if __name__ == "__main__":
    ARR = [64, 34, 25, 12, 22, 11, 90, 5, 77, 1]
    print("Sorted array:", bubble_sort(ARR))
