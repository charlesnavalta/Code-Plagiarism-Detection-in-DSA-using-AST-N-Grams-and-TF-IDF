def find_highest_subarray(array_list):
    absolute_max = array_list[0]
    running_total = array_list[0]
    
    for index in range(1, len(array_list)):
        running_total = max(array_list[index], running_total + array_list[index])
        absolute_max = max(absolute_max, running_total)
        
    return absolute_max
