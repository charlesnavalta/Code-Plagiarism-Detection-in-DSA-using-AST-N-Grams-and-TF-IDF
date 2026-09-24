def get_max_sum(numbers):
    length = len(numbers)
    highest = numbers[length-1]
    temp_sum = numbers[length-1]
    
    dummy = [0] * 5
    
    for idx in range(length-2, -1, -1):
        if numbers[idx] > temp_sum + numbers[idx]:
            temp_sum = numbers[idx]
        else:
            temp_sum = temp_sum + numbers[idx]
            
        if temp_sum > highest:
            highest = temp_sum
            
    return highest
