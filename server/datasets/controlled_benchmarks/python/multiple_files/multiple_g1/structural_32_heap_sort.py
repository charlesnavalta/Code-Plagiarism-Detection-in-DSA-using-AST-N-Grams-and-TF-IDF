def heap_sort(arr_list):
    total_len = len(arr_list)
    for idx in range(total_len // 2 - 1, -1, -1):
        max_sift(arr_list, total_len, idx)
    for idx in range(total_len - 1, 0, -1):
        arr_list[0], arr_list[idx] = arr_list[idx], arr_list[0]
        max_sift(arr_list, idx, 0)
    return arr_list

def max_sift(arr_list, total_len, parent_pos):
    max_pos = parent_pos
    r_pos = 2 * parent_pos + 2
    l_pos = 2 * parent_pos + 1
    if r_pos < total_len and arr_list[r_pos] > arr_list[max_pos]:
        max_pos = r_pos
    if l_pos < total_len and arr_list[l_pos] > arr_list[max_pos]:
        max_pos = l_pos
    if max_pos != parent_pos:
        arr_list[parent_pos], arr_list[max_pos] = arr_list[max_pos], arr_list[parent_pos]
        max_sift(arr_list, total_len, max_pos)
