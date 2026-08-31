"""
Quick Sort - Organic Submission #6
Three-way partitioning for arrays with high duplicates.
"""

def three_way_partition(arr, low, high):
    pivot = arr[low]
    lt = low
    gt = high
    i = low + 1
    while i <= gt:
        if arr[i] < pivot:
            arr[lt], arr[i] = arr[i], arr[lt]
            lt += 1
            i += 1
        elif arr[i] > pivot:
            arr[gt], arr[i] = arr[i], arr[gt]
            gt -= 1
        else:
            i += 1
    return lt, gt

def quick_sort_3way(arr, low, high):
    if low < high:
        lt, gt = three_way_partition(arr, low, high)
        quick_sort_3way(arr, low, lt - 1)
        quick_sort_3way(arr, gt + 1, high)

if __name__ == "__main__":
    nums = [4, 2, 4, 4, 1, 3, 2, 4, 1]
    quick_sort_3way(nums, 0, len(nums) - 1)
    print(nums)
