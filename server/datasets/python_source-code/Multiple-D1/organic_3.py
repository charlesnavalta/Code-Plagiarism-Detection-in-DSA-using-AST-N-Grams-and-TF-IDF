"""
Quick Sort - Organic Submission #3
Lomuto variant using the first element as pivot.
"""

def partition_first(arr, low, high):
    pivot = arr[low]
    swap_index = low
    for i in range(low + 1, high + 1):
        if arr[i] < pivot:
            swap_index += 1
            arr[swap_index], arr[i] = arr[i], arr[swap_index]
    arr[low], arr[swap_index] = arr[swap_index], arr[low]
    return swap_index

def quick_sort_first(arr, low, high):
    if low < high:
        p = partition_first(arr, low, high)
        quick_sort_first(arr, low, p - 1)
        quick_sort_first(arr, p + 1, high)

if __name__ == "__main__":
    nums = [38, 27, 43, 3, 9, 82, 10]
    quick_sort_first(nums, 0, len(nums) - 1)
    print(nums)
