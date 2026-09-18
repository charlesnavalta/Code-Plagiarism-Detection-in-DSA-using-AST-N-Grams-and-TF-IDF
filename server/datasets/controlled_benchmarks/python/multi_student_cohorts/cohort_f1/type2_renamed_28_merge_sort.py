# Standard recursive merge sort
def merge_sort(dataset_collection):
    if len(dataset_collection) <= 1:
        return dataset_collection
    split_point = len(dataset_collection) // 2
    first_partition = merge_sort(dataset_collection[:split_point])
    second_partition = merge_sort(dataset_collection[split_point:])
    
    result = []
    ptr_a = ptr_b = 0
    while ptr_a < len(first_partition) and ptr_b < len(second_partition):
        if first_partition[ptr_a] <= second_partition[ptr_b]:
            result.append(first_partition[ptr_a])
            ptr_a += 1
        else:
            result.append(second_partition[ptr_b])
            ptr_b += 1
    result.extend(first_partition[ptr_a:])
    result.extend(second_partition[ptr_b:])
    return result
