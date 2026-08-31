# Standard recursive merge sort
def merge_sort(items_9):
    if len(items_9) <= 1:
        return items_9
    half_9 = len(items_9) // 2
    left = merge_sort(items_9[:half_9])
    right = merge_sort(items_9[half_9:])
    
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
