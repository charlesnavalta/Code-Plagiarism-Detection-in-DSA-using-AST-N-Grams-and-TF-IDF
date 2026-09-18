# Organic Student Submission 2: Independent Algorithm Paradigm
def hoare_partition(arr, low, high):
    pivot = arr[low]
    i = low - 1
    j = high + 1
    while True:
        i += 1
        while arr[i] < pivot: i += 1
        j -= 1
        while arr[j] > pivot: j -= 1
        if i >= j: return j
        arr[i], arr[j] = arr[j], arr[i]

def hoare_quicksort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        p = hoare_partition(arr, low, high)
        hoare_quicksort(arr, low, p)
        hoare_quicksort(arr, p + 1, high)
    return arr
