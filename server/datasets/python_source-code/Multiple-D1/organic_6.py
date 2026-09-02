# Organic Student Submission 6: Independent Algorithm Paradigm
def functional_quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    less = [x for x in arr if x < pivot]
    equal = [x for x in arr if x == pivot]
    greater = [x for x in arr if x > pivot]
    return functional_quicksort(less) + equal + functional_quicksort(greater)
