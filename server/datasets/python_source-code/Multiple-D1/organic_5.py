"""
Quick Sort - Organic Submission #5
Median-of-three pivot selection.
"""

def median_of_three(arr, low, high):
    mid = (low + high) // 2
    if arr[low] > arr[mid]:
        arr[low], arr[mid] = arr[mid], arr[low]
    if arr[low] > arr[high]:
        arr[low], arr[high] = arr[high], arr[low]
    if arr[mid] > arr[high]:
        arr[mid], arr[high] = arr[high], arr[mid]
    arr[mid], arr[high - 1] = arr[high - 1], arr[mid]
    return arr[high - 1]

def partition_median(arr, low, high):
    pivot = median_of_three(arr, low, high)
    i = low
    j = high - 1
    while True:
        i += 1
        while arr[i] < pivot:
            i += 1
        j -= 1
        while arr[j] > pivot:
            j -= 1
        if i >= j:
            break
        arr[i], arr[j] = arr[j], arr[i]
    arr[i], arr[high - 1] = arr[high - 1], arr[i]
    return i

def quick_sort_median(arr, low, high):
    if low + 10 <= high:
        p = partition_median(arr, low, high)
        quick_sort_median(arr, low, p - 1)
        quick_sort_median(arr, p + 1, high)
    else:
        # fallback simple insertion
        for i in range(low + 1, high + 1):
            key = arr[i]
            j = i - 1
            while j >= low and arr[j] > key:
                arr[j + 1] = arr[j]
                j -= 1
            arr[j + 1] = key

if __name__ == "__main__":
    vals = [24, 2, 45, 20, 56, 75, 2, 56, 99, 53, 12]
    quick_sort_median(vals, 0, len(vals) - 1)
    print(vals)
