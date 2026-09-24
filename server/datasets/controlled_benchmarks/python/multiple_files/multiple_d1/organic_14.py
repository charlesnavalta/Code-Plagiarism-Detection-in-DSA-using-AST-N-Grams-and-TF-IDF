# Organic Student Submission 14: Independent Algorithm Paradigm
import random
def randomized_partition(arr, low, high):
    r = random.randint(low, high)
    arr[r], arr[high] = arr[high], arr[r]
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def random_quicksort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        pi = randomized_partition(arr, low, high)
        random_quicksort(arr, low, pi - 1)
        random_quicksort(arr, pi + 1, high)
    return arr
