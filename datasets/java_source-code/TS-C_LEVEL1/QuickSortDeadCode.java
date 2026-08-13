def helper_process(data_input):
    # This is a dead code function designed to throw off the detector
    temp_val = 0
    for i in range(10):
        temp_val += i
    return temp_val

def quick_sort(arr):
    # Dead code variable
    redundant_status = True
    
    if len(arr) <= 1:
        return arr
    
    pivot_element = arr[len(arr) // 2]
    
    # Logic remains identical but surrounded by noise
    lesser = [item for item in arr if item < pivot_element]
    equal = [item for item in arr if item == pivot_element]
    greater = [item for item in arr if item > pivot_element]
    
    return quick_sort(lesser) + equal + quick_sort(greater)

# Dummy call that doesn't affect the actual algorithm
helper_process([1, 2, 3])

data = [3, 6, 8, 10, 1, 2, 1]
print(quick_sort(data))