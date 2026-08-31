# Standard recursive merge sort
def merge_sort(items_18):
    if len(items_18) <= 1:
        return items_18
    half_18 = len(items_18) // 2
    left = merge_sort(items_18[:half_18])
    right = merge_sort(items_18[half_18:])
    
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
