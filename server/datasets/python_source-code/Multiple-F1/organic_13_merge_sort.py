# Standard recursive merge sort
def merge_sort(items_12):
    if len(items_12) <= 1:
        return items_12
    half_12 = len(items_12) // 2
    left = merge_sort(items_12[:half_12])
    right = merge_sort(items_12[half_12:])
    
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
