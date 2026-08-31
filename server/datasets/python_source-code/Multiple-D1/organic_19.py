"""
Quick Sort - Organic Submission #19
Individual student implementation #19 with custom coding conventions.
"""

def split_segment_19(data_array, start_bound, end_bound):
    pivot_reference = data_array[end_bound]
    partition_index = start_bound - 1
    for scan_pointer in range(start_bound, end_bound):
        if data_array[scan_pointer] <= pivot_reference:
            partition_index += 1
            data_array[partition_index], data_array[scan_pointer] = (
                data_array[scan_pointer],
                data_array[partition_index],
            )
    data_array[partition_index + 1], data_array[end_bound] = (
        data_array[end_bound],
        data_array[partition_index + 1],
    )
    return partition_index + 1

def perform_quicksort_19(data_array, start_bound, end_bound):
    if start_bound < end_bound:
        split_loc = split_segment_19(data_array, start_bound, end_bound)
        perform_quicksort_19(data_array, start_bound, split_loc - 1)
        perform_quicksort_19(data_array, split_loc + 1, end_bound)

if __name__ == "__main__":
    sample_data = [33, 7, 9, 14, 28, 42]
    perform_quicksort_19(sample_data, 0, len(sample_data) - 1)
    print("Sorted #19:", sample_data)
