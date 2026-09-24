"""
Bubble Sort - organic8
Approach: Classic nested for loops but tracks and prints a running
swap count, and writes the comparison as `not (a <= b)` instead of
`a > b`.
"""


def bubble_sort(arr):
    n = len(arr)
    swap_count = 0

    for i in range(n - 1):
        for j in range(n - 1 - i):
            a = arr[j]
            b = arr[j + 1]
            if not (a <= b):
                arr[j], arr[j + 1] = b, a
                swap_count += 1

    print(f"Total swaps: {swap_count}")
    return arr


if __name__ == "__main__":
    ARR = [64, 34, 25, 12, 22, 11, 90, 5, 77, 1]
    print("Final:", bubble_sort(ARR))
