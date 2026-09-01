# Standard recursive merge sort
def merge_sort(items_21):
    if len(items_21) <= 1:
        return items_21
    half_21 = len(items_21) // 2
    left = merge_sort(items_21[:half_21])
    right = merge_sort(items_21[half_21:])
    
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
