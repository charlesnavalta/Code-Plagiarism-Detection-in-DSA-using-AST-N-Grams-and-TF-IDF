"""
Quick Sort - Organic Submission #9
Uses modular helper functions for swap and bounds check.
"""

def swap(arr, i, j):
    arr[i], arr[j] = arr[j], arr[i]

def partition(arr, low, high):
    pivot = arr[high]
    idx = low
    for k in range(low, high):
        if arr[k] < pivot:
            swap(arr, idx, k)
            idx += 1
    swap(arr, idx, high)
    return idx

def quick_sort_modular(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort_modular(arr, low, pi - 1)
        quick_sort_modular(arr, pi + 1, high)

if __name__ == "__main__":
    nums = [8, 4, 7, 2, 5, 1, 9, 3, 6]
    quick_sort_modular(nums, 0, len(nums) - 1)
    print(nums)
