# Standard recursive merge sort
def merge_sort(items_15):
    if len(items_15) <= 1:
        return items_15
    half_15 = len(items_15) // 2
    left = merge_sort(items_15[:half_15])
    right = merge_sort(items_15[half_15:])
    
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
