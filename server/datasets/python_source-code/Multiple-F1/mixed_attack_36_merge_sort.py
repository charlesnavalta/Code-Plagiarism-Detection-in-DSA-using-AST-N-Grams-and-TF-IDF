def merge_sort(values_arr):
    if len(values_arr) <= 1:
        return values_arr
    mid = len(values_arr) // 2
    left = merge_sort(values_arr[:mid])
    right = merge_sort(values_arr[mid:])
    
    i = j = k = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            values_arr[k] = left[i]
            i += 1
        else:
            values_arr[k] = right[j]
            j += 1
        k += 1
    for p in range(i, len(left)):
        values_arr[k] = left[p]
        k += 1
    for q in range(j, len(right)):
        values_arr[k] = right[q]
        k += 1
    return values_arr
