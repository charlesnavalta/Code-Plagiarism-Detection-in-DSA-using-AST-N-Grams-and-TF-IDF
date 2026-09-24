# Organic Student Submission 20: Independent Algorithm Paradigm
def dual_pivot_quicksort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        if arr[low] > arr[high]:
            arr[low], arr[high] = arr[high], arr[low]
        p = arr[low]
        q = arr[high]
        l = low + 1
        g = high - 1
        k = l
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
        dual_pivot_quicksort(arr, low, l - 1)
        dual_pivot_quicksort(arr, l + 1, g - 1)
        dual_pivot_quicksort(arr, g + 1, high)
    return arr
