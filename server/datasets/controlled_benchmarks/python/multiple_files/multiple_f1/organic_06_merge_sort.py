# Organic MergeSort Student Submission 06
def functional_merge(left, right, key=lambda x: x):
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if key(left[i]) <= key(right[j]):
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    return res + left[i:] + right[j:]

def key_mergesort(arr, key=lambda x: x):
    if len(arr) <= 1: return arr
    m = len(arr) // 2
    return functional_merge(key_mergesort(arr[:m], key), key_mergesort(arr[m:], key), key)
