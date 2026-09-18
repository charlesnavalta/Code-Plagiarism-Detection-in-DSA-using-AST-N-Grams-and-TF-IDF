# Organic Student Submission 21: Independent Algorithm Paradigm
def streaming_partition(collection, pivot_val):
    left_items = []
    mid_items = []
    right_items = []
    for item in collection:
        if item < pivot_val:
            left_items.append(item)
        elif item == pivot_val:
            mid_items.append(item)
        else:
            right_items.append(item)
    return left_items, mid_items, right_items

def stream_quicksort(data_list):
    if len(data_list) <= 1:
        return data_list
    mid_idx = len(data_list) // 2
    l, m, r = streaming_partition(data_list, data_list[mid_idx])
    return stream_quicksort(l) + m + stream_quicksort(r)
