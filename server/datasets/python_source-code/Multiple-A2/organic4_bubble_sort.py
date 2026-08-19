"""
Bubble Sort - organic4
Approach: Recursive implementation - each call performs one pass
over the unsorted portion and recurses on a smaller problem size.
"""


def bubble_sort(arr, n=None):
    if n is None:
        n = len(arr)

    if n <= 1:
        return arr

    for i in range(n - 1):
        if arr[i] > arr[i + 1]:
            arr[i], arr[i + 1] = arr[i + 1], arr[i]

    return bubble_sort(arr, n - 1)


if __name__ == "__main__":
    ARR = [64, 34, 25, 12, 22, 11, 90, 5, 77, 1]
    print("Recursive result:", bubble_sort(ARR))
