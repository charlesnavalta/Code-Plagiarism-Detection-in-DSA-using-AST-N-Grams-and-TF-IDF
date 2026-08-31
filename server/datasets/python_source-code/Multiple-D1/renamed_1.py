"""
Quick Sort - Renamed Submission #1
Derived from organic_2: variables and function names renamed.
"""

def split_hoare(data_list, start_idx, end_idx):
    pivot_val = data_list[start_idx]
    left_cursor = start_idx - 1
    right_cursor = end_idx + 1
    while True:
        left_cursor += 1
        while data_list[left_cursor] < pivot_val:
            left_cursor += 1
        right_cursor -= 1
        while data_list[right_cursor] > pivot_val:
            right_cursor -= 1
        if left_cursor >= right_cursor:
            return right_cursor
        data_list[left_cursor], data_list[right_cursor] = data_list[right_cursor], data_list[left_cursor]

def execute_sort(data_list, start_idx, end_idx):
    if start_idx < end_idx:
        split_point = split_hoare(data_list, start_idx, end_idx)
        execute_sort(data_list, start_idx, split_point)
        execute_sort(data_list, split_point + 1, end_idx)

if __name__ == "__main__":
    items = [19, 22, 63, 105, 2, 46]
    execute_sort(items, 0, len(items) - 1)
    print(items)
