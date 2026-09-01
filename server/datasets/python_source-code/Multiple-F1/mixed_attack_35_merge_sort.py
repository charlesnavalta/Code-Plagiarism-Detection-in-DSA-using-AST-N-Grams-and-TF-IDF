def merge_blocks(left_arr, right_arr):
    out = []
    i = j = 0
    while i < len(left_arr) and j < len(right_arr):
        if left_arr[i] <= right_arr[j]:
            out.append(left_arr[i])
            i += 1
        else:
            out.append(right_arr[j])
            j += 1
    while i < len(left_arr):
        out.append(left_arr[i])
        i += 1
    while j < len(right_arr):
        out.append(right_arr[j])
        j += 1
    return out

def merge_sort(target_elements):
    if len(target_elements) <= 1:
        return target_elements
    mid = len(target_elements) // 2
    right_part = merge_sort(target_elements[mid:])
    left_part = merge_sort(target_elements[:mid])
    return merge_blocks(left_part, right_part)
