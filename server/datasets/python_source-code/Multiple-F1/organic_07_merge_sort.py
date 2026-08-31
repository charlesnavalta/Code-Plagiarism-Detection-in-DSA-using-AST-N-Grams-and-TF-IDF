# Standard recursive merge sort
def merge_sort(items_6):
    if len(items_6) <= 1:
        return items_6
    half_6 = len(items_6) // 2
    left = merge_sort(items_6[:half_6])
    right = merge_sort(items_6[half_6:])
    
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
