"""
Bubble Sort - organic7
Approach: Cocktail shaker sort - a bidirectional variant of bubble
sort that alternates passing left-to-right and right-to-left.
"""


def cocktail_sort(arr):
    n = len(arr)
    start = 0
    end = n - 1
    swapped = True

    while swapped:
        swapped = False

        for i in range(start, end):
            if arr[i] > arr[i + 1]:
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
                swapped = True

        if not swapped:
            break

        end -= 1
        swapped = False

        for i in range(end - 1, start - 1, -1):
            if arr[i] > arr[i + 1]:
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
                swapped = True

        start += 1

    return arr


if __name__ == "__main__":
    ARR = [64, 34, 25, 12, 22, 11, 90, 5, 77, 1]
    print("Cocktail sorted:", cocktail_sort(ARR))
