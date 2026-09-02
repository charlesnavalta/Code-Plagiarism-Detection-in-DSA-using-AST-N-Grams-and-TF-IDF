# Organic Student Submission 11: Independent Algorithm Paradigm
def tail_recursive_quicksort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    while low < high:
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        pi = i + 1
        if pi - low < high - pi:
            tail_recursive_quicksort(arr, low, pi - 1)
            low = pi + 1
        else:
            tail_recursive_quicksort(arr, pi + 1, high)
            high = pi - 1
    return arr
