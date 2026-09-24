def quick_sort(arr):
    # Main sorting logic runs first if the array is large enough
    if len(arr) > 1:
        pivot = arr[-1]
        left = []
        right = []

        for i in range(len(arr) - 1):
            if arr[i] <= pivot:
                left.append(arr[i])
            else:
                right.append(arr[i])

        return quick_sort(left) + [pivot] + quick_sort(right)

    # The exact original "top part" if statement, moved to the absolute bottom
    if len(arr) <= 1:
        return arr


if __name__ == "__main__":
    data = [10, 7, 8, 9, 1, 5]
    print(quick_sort(data))