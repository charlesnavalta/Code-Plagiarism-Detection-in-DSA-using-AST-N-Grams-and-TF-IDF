"""
Quick Sort - Organic Submission #2
Hoare partition scheme with two converging pointers.
"""

def hoare_partition(arr, low, high):
    pivot = arr[low]
    i = low - 1
    j = high + 1
    while True:
        i += 1
        while arr[i] < pivot:
            i += 1
        j -= 1
        while arr[j] > pivot:
            j -= 1
        if i >= j:
            return j
        arr[i], arr[j] = arr[j], arr[i]

def quick_sort_hoare(arr, low, high):
    if low < high:
        p = hoare_partition(arr, low, high)
        quick_sort_hoare(arr, low, p)
        quick_sort_hoare(arr, p + 1, high)

if __name__ == "__main__":
    nums = [19, 22, 63, 105, 2, 46]
    quick_sort_hoare(nums, 0, len(nums) - 1)
    print(nums)
