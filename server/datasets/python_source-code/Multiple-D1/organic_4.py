# Organic Student Submission 4: Independent Algorithm Paradigm
def dutch_flag_quicksort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low >= high: return arr
    pivot = arr[low]
    lt = low
    gt = high
    i = low + 1
    while i <= gt:
        if arr[i] < pivot:
            arr[lt], arr[i] = arr[i], arr[lt]
            lt += 1; i += 1
        elif arr[i] > pivot:
            arr[i], arr[gt] = arr[gt], arr[i]
            gt -= 1
        else:
            i += 1
    dutch_flag_quicksort(arr, low, lt - 1)
    dutch_flag_quicksort(arr, gt + 1, high)
    return arr
