"""
Quick Sort - Organic Submission #11
Dual-pivot Quick Sort algorithm.
"""

def dual_pivot_quick_sort(arr, low, high):
    if low < high:
        if arr[low] > arr[high]:
            arr[low], arr[high] = arr[high], arr[low]
        p = arr[low]
        q = arr[high]
        l = low + 1
        g = high - 1
        k = low + 1
        while k <= g:
            if arr[k] < p:
                arr[k], arr[l] = arr[l], arr[k]
                l += 1
            elif arr[k] >= q:
                while arr[g] > q and k < g:
                    g -= 1
                arr[k], arr[g] = arr[g], arr[k]
                g -= 1
                if arr[k] < p:
                    arr[k], arr[l] = arr[l], arr[k]
                    l += 1
            k += 1
        l -= 1
        g += 1
        arr[low], arr[l] = arr[l], arr[low]
        arr[high], arr[g] = arr[g], arr[high]

        dual_pivot_quick_sort(arr, low, l - 1)
        dual_pivot_quick_sort(arr, l + 1, g - 1)
        dual_pivot_quick_sort(arr, g + 1, high)

if __name__ == "__main__":
    nums = [24, 8, 42, 75, 29, 77, 38, 57]
    dual_pivot_quick_sort(nums, 0, len(nums) - 1)
    print(nums)
