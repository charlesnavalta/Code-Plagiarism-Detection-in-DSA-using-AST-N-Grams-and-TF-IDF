# Student 1 Merge Sort
def merge_partitions(array, left_idx, mid_idx, right_idx):
    left_part = array[left_idx:mid_idx + 1]
    right_part = array[mid_idx + 1:right_idx + 1]
    i = 0
    j = 0
    k = left_idx
    while i < len(left_part) and j < len(right_part):
        if left_part[i] <= right_part[j]:
            array[k] = left_part[i]
            i += 1
        else:
            array[k] = right_part[j]
            j += 1
        k += 1
    while i < len(left_part):
        array[k] = left_part[i]
        i += 1
        k += 1
    while j < len(right_part):
        array[k] = right_part[j]
        j += 1
        k += 1

def merge_sort_algorithm(array, left_idx, right_idx):
    if left_idx < right_idx:
        mid_idx = (left_idx + right_idx) // 2
        merge_sort_algorithm(array, left_idx, mid_idx)
        merge_sort_algorithm(array, mid_idx + 1, right_idx)
        merge_partitions(array, left_idx, mid_idx, right_idx)

# End of script 1
