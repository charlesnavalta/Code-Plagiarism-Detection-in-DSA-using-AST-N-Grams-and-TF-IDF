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

def merge_sort(numbers_list):
    if len(numbers_list) <= 1:
        return numbers_list
    mid = len(numbers_list) // 2
    right_part = merge_sort(numbers_list[mid:])
    left_part = merge_sort(numbers_list[:mid])
    return merge_blocks(left_part, right_part)
