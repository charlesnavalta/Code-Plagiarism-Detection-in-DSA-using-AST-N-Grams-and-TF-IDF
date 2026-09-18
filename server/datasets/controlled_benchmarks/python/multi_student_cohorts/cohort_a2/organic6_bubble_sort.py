"""
Bubble Sort - organic6
Approach: Entirely index-driven using nested while loops instead of
for loops.
"""


def bubble_sort(arr):
    n = len(arr)
    i = 0
    while i < n - 1:
        j = 0
        while j < n - 1 - i:
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
            j += 1
        i += 1
    return arr


if __name__ == "__main__":
    ARR = [64, 34, 25, 12, 22, 11, 90, 5, 77, 1]
    print("Sorted:", bubble_sort(ARR))
