# Standard recursive merge sort
def merge_sort(items_3):
    if len(items_3) <= 1:
        return items_3
    half_3 = len(items_3) // 2
    left = merge_sort(items_3[:half_3])
    right = merge_sort(items_3[half_3:])
    
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
