"""
Bubble Sort - organic5
Approach: Pythonic style pairing adjacent elements with
enumerate(zip(...)) inside a while True / break loop.
"""


def bubble_sort(arr):
    while True:
        swapped = False
        for i, (a, b) in enumerate(zip(arr, arr[1:])):
            if a > b:
                arr[i], arr[i + 1] = b, a
                swapped = True
        if not swapped:
            break
    return arr


if __name__ == "__main__":
    ARR = [64, 34, 25, 12, 22, 11, 90, 5, 77, 1]
    print("Output:", bubble_sort(ARR))
