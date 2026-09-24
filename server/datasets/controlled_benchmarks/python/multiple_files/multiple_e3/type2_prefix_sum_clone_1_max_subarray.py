def largest_subarray(array_vals):
    best_total = float('-inf')
    running_prefix = 0
    lowest_prefix = 0
    
    for value in array_vals:
        running_prefix += value
        if running_prefix - lowest_prefix > best_total:
            best_total = running_prefix - lowest_prefix
        if running_prefix < lowest_prefix:
            lowest_prefix = running_prefix
            
    return best_total
