"""
Quick Sort - Organic Submission #12
Tail-call optimized Quick Sort (recurse on smaller half, loop on larger).
"""

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort_tail(arr, low, high):
    while low < high:
        pi = partition(arr, low, high)
        if pi - low < high - pi:
            quick_sort_tail(arr, low, pi - 1)
            low = pi + 1
        else:
            quick_sort_tail(arr, pi + 1, high)
            high = pi - 1

if __name__ == "__main__":
    nums = [10, 7, 8, 9, 1, 5]
    quick_sort_tail(nums, 0, len(nums) - 1)
    print(nums)
