# The extracted helper method!
def find_minimum_index(arr, start_idx, n):
    min_idx = start_idx
    for j in range(start_idx + 1, n):
        if arr[j] < arr[min_idx]:
            min_idx = j
    return min_idx

def monolithic_sort(arr):
    n = len(arr)
    for i in range(n):
        # The monolithic block is replaced by a single function call
        min_idx = find_minimum_index(arr, i, n) 
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr