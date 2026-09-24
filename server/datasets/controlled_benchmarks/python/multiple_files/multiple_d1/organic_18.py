# Organic Student Submission 18: Independent Algorithm Paradigm
def insertion_sort_slice(arr, low, high):
    for i in range(low + 1, high + 1):
        key = arr[i]
        j = i - 1
        while j >= low and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

def hybrid_quicksort(arr, low=0, high=None, threshold=10):
    if high is None: high = len(arr) - 1
    if high - low + 1 <= threshold:
        insertion_sort_slice(arr, low, high)
        return arr
    if low < high:
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        pi = i + 1
        hybrid_quicksort(arr, low, pi - 1, threshold)
        hybrid_quicksort(arr, pi + 1, high, threshold)
    return arr
